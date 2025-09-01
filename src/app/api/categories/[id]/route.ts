// src/app/api/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

function parseId(param: string) {
    // Nếu id trong DB là Int
    const n = Number(param);
    if (Number.isNaN(n)) return null;
    return n;
}

// GET /api/categories/:id -> detail (tuỳ nhu cầu)
export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseId(params.id);
        if (id === null) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

        const category = await prisma.categories.findUnique({ where: { id } });
        if (!category) return NextResponse.json({ message: 'Not found' }, { status: 404 });

        return NextResponse.json(category);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Failed to get category' }, { status: 500 });
    }
}

// PUT /api/categories/:id -> update
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseId(params.id);
        if (id === null) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

        const { name, description } = await req.json();
        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ message: 'Tên danh mục là bắt buộc' }, { status: 400 });
        }

        const updated = await prisma.categories.update({
            where: { id },
            data: { name: name.trim(), description: (description ?? '').trim() || null },
        });

        return NextResponse.json(updated);
    } catch (e: any) {
        if (e?.code === 'P2002') {
            return NextResponse.json({ message: 'Tên danh mục đã tồn tại' }, { status: 409 });
        }
        if (e?.code === 'P2025') {
            return NextResponse.json({ message: 'Danh mục không tồn tại' }, { status: 404 });
        }
        console.error(e);
        return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
    }
}

// DELETE /api/categories/:id -> remove
export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseId(params.id);
        if (id === null) return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

        await prisma.categories.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        if (e?.code === 'P2025') {
            return NextResponse.json({ message: 'Danh mục không tồn tại' }, { status: 404 });
        }
        console.error(e);
        return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
    }
}
