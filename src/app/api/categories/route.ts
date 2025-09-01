// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

// GET /api/categories -> list
export async function GET() {
    try {
        const categories = await prisma.categories.findMany({
            orderBy: { id: 'desc' },
        });
        return NextResponse.json(categories);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
    }
}

// POST /api/categories -> create
export async function POST(req: Request) {
    try {
        const { name, description } = await req.json();

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ message: 'Tên danh mục là bắt buộc' }, { status: 400 });
        }

        const created = await prisma.categories.create({
            data: { name: name.trim(), description: (description ?? '').trim() || null },
        });

        return NextResponse.json(created, { status: 201 });
    } catch (e: any) {
        // bắt lỗi unique name
        if (e?.code === 'P2002') {
            return NextResponse.json({ message: 'Tên danh mục đã tồn tại' }, { status: 409 });
        }
        console.error(e);
        return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
    }
}
