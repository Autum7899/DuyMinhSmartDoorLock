// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const toNum = (v: any) =>
    v && typeof v === "object" && "toNumber" in v ? Number(v as Prisma.Decimal) : Number(v ?? 0);

function parseId(idStr: string) {
    const n = Number(idStr);
    return Number.isFinite(n) ? n : null;
}

function parseBodyNumber(input: any, fallback = 0) {
    const n = Number(input);
    return Number.isFinite(n) ? n : fallback;
}

// GET /api/products/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseId(params.id);
        if (id == null) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

        const r = await prisma.products.findUnique({ where: { id } });
        if (!r) return NextResponse.json({ message: "Not found" }, { status: 404 });

        return NextResponse.json({
            ...r,
            price_agency: toNum(r.price_agency),
            price_retail: toNum(r.price_retail),
            price_retail_with_install: toNum(r.price_retail_with_install),
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Không thể tải sản phẩm" }, { status: 500 });
    }
}

// PUT /api/products/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseId(params.id);
        if (id == null) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

        const body = await req.json();
        const name = String(body?.name ?? "").trim();
        const image_url = String(body?.image_url ?? "").trim();
        const description = body?.description ? String(body.description) : null;

        if (!name) {
            return NextResponse.json({ message: "Tên sản phẩm là bắt buộc" }, { status: 400 });
        }

        const price_agency = parseBodyNumber(body?.price_agency, 0);
        const price_retail = parseBodyNumber(body?.price_retail, 0);
        const price_retail_with_install = parseBodyNumber(body?.price_retail_with_install, 0);
        const quantity = Math.max(0, parseInt(body?.quantity ?? 0, 10) || 0);
        const category_id = body?.category_id != null ? Number(body.category_id) : null;

        const updated = await prisma.products.update({
            where: { id },
            data: {
                name,
                image_url,
                description,
                price_agency,
                price_retail,
                price_retail_with_install,
                quantity,
                category_id,
            },
        });

        return NextResponse.json({
            ...updated,
            price_agency: toNum(updated.price_agency),
            price_retail: toNum(updated.price_retail),
            price_retail_with_install: toNum(updated.price_retail_with_install),
        });
    } catch (e: any) {
        if (e?.code === "P2025") {
            return NextResponse.json({ message: "Sản phẩm không tồn tại" }, { status: 404 });
        }
        console.error(e);
        return NextResponse.json({ message: "Cập nhật thất bại" }, { status: 500 });
    }
}

// DELETE /api/products/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        const id = parseId(params.id);
        if (id == null) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

        await prisma.products.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (e: any) {
        if (e?.code === "P2025") {
            return NextResponse.json({ message: "Sản phẩm không tồn tại" }, { status: 404 });
        }
        console.error(e);
        return NextResponse.json({ message: "Xoá thất bại" }, { status: 500 });
    }
}
