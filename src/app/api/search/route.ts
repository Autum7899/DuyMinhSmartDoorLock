import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';

// Hàm helper để định dạng sản phẩm, tránh lặp code
const formatProduct = (product: any) => ({
    id: product.id,
    name: product.name,
    image: product.image_url,
    category: product.categories?.name || null,
    features: (product.features as Prisma.JsonArray)?.map(String) || [],
    price: {
        agency: product.price_agency?.toNumber() || 0,
        retail: product.price_retail?.toNumber() || 0,
        retailWithInstall: product.price_retail_with_install.toNumber(),
    },
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limit = 10; // Giới hạn tổng số kết quả trả về

    if (!q || q.trim().length < 1) {
        return NextResponse.json([]);
    }

    const searchQuery = q.trim();

    try {
        // --- LOGIC SẮP XẾP MỚI ---

        // 1. Ưu tiên 1: Tìm các sản phẩm có TÊN BẮT ĐẦU BẰNG searchQuery
        const nameStartsWithResults = await prisma.products.findMany({
            where: {
                name: {
                    startsWith: searchQuery,
                    mode: 'insensitive',
                },
            },
            take: limit,
            include: { categories: { select: { name: true } } },
        });

        const foundIds = new Set(nameStartsWithResults.map((p) => p.id));
        let combinedResults = [...nameStartsWithResults];

        // 2. Ưu tiên 2: Nếu chưa đủ, tìm các sản phẩm có TÊN CHỨA searchQuery
        if (combinedResults.length < limit) {
            const nameContainsResults = await prisma.products.findMany({
                where: {
                    name: {
                        contains: searchQuery,
                        mode: 'insensitive',
                    },
                    NOT: { // Bỏ qua những ID đã tìm thấy ở bước 1
                        id: { in: Array.from(foundIds) },
                    },
                },
                take: limit - combinedResults.length,
                include: { categories: { select: { name: true } } },
            });

            nameContainsResults.forEach(p => foundIds.add(p.id));
            combinedResults.push(...nameContainsResults);
        }

        // 3. Ưu tiên 3: Nếu vẫn chưa đủ, tìm trong MÔ TẢ và DANH MỤC
        if (combinedResults.length < limit) {
            const otherResults = await prisma.products.findMany({
                where: {
                    OR: [
                        { description: { contains: searchQuery, mode: 'insensitive' } },
                        { categories: { name: { contains: searchQuery, mode: 'insensitive' } } },
                    ],
                    NOT: { // Bỏ qua tất cả ID đã tìm thấy
                        id: { in: Array.from(foundIds) },
                    },
                },
                take: limit - combinedResults.length,
                include: { categories: { select: { name: true } } },
            });
            combinedResults.push(...otherResults);
        }

        // Định dạng lại toàn bộ kết quả cuối cùng
        const formattedProducts = combinedResults.map(formatProduct);

        return NextResponse.json(formattedProducts);

    } catch (error) {
        console.error("Search API error:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}