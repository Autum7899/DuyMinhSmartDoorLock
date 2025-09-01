// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
// ĐỔI import nếu prisma ở nơi khác:
// import { prisma } from "@/lib/prisma";
import { prisma } from "@/lib/db/prisma";
import { $Enums } from "@prisma/client";

export const dynamic = "force-dynamic";

// Helper: parse status -> enum (case-insensitive)
function parseStatusEnum(input: unknown): $Enums.order_status | undefined {
    if (typeof input !== "string" || !input.trim()) return undefined;
    const candidates = Object.values($Enums.order_status) as string[];
    const match = candidates.find((c) => c.toLowerCase() === input.trim().toLowerCase());
    return match as $Enums.order_status | undefined;
}

// GET /api/orders -> id, customer_name, status, total_amount, created_at
export async function GET() {
    try {
        const rows = await prisma.orders.findMany({
            select: { id: true, customer_name: true, status: true, total_amount: true, created_at: true },
            orderBy: { created_at: "desc" },
        });
        return NextResponse.json(rows);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Không thể tải danh sách đơn hàng" }, { status: 500 });
    }
}

// POST /api/orders
// Body: { customer_name: string, phone_number: string, address: string, items: [{ product_id, quantity }], status?: string }
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customer_name, phone_number, address, items, status } = body ?? {};

        if (!customer_name || !phone_number || !address || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { message: "Thiếu customer_name, phone_number, address hoặc items" },
                { status: 400 }
            );
        }

        // Map status string -> enum (nếu có)
        const statusEnum = parseStatusEnum(status);
        if (typeof status === "string" && !statusEnum) {
            const allowed = (Object.values($Enums.order_status) as string[]).join(", ");
            return NextResponse.json(
                { message: `Trạng thái không hợp lệ. Giá trị hợp lệ: ${allowed}` },
                { status: 400 }
            );
        }

        // Lấy đơn giá GIÁ GIẢM hiện tại
        const productIds = items.map((it: { product_id: number }) => Number(it.product_id)).filter(Boolean);
        const products = await prisma.products.findMany({
            where: { id: { in: productIds } },
            select: { id: true, price_retail_with_install: true },
        });
        const priceMap = new Map(products.map(p => [p.id, Number(p.price_retail_with_install ?? 0)]));

        // Tính total_amount & chuẩn bị order_items (có price_at_purchase)
        let total_amount = 0;
        const orderItemsCreate = items.map((it: { product_id: number; quantity: number }) => {
            const product_id = Number(it.product_id);
            const quantity = Math.max(1, Number(it.quantity ?? 1));
            const unit = priceMap.get(product_id) ?? 0;
            total_amount += unit * quantity;
            return { product_id, quantity, price_at_purchase: unit };
            // (checked): { quantity, price_at_purchase: unit, products: { connect: { id: product_id } } }
        });

        const created = await prisma.orders.create({
            data: {
                customer_name,
                phone_number,     // bắt buộc theo schema
                address,          // bắt buộc theo schema
                total_amount,
                ...(statusEnum ? { status: statusEnum } : {}),
                order_items: { create: orderItemsCreate },
            },
            select: { id: true, customer_name: true, status: true, total_amount: true, created_at: true },
        });

        return NextResponse.json(created, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Tạo đơn hàng thất bại" }, { status: 500 });
    }
}
