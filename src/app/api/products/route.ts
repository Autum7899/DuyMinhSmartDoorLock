// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

// Decimal -> number để trả JSON
const toNum = (v: unknown) =>
    v && typeof v === "object" && "toNumber" in v ? Number(v as Prisma.Decimal) : Number(v ?? 0);

function parseBodyNumber(input: unknown, fallback = 0) {
    const n = Number(input);
    return Number.isFinite(n) ? n : fallback;
}

export const dynamic = "force-dynamic";

// GET /api/products -> list
export async function GET() {
    try {
        const rows = await prisma.products.findMany({
            select: {
                id: true,
                name: true,
                image_url: true,
                description: true,
                price_agency: true,              // Giá đại lý
                price_retail: true,              // Giá gốc
                price_retail_with_install: true, // Giá giảm
                quantity: true,
                category_id: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: { name: "asc" },
        });

        const data = rows.map((r) => ({
            ...r,
            price_agency: toNum(r.price_agency),
            price_retail: toNum(r.price_retail),
            price_retail_with_install: toNum(r.price_retail_with_install),
        }));

        return NextResponse.json(data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Không thể tải sản phẩm" }, { status: 500 });
    }
}

// POST /api/products -> create
export async function POST(req: Request) {
    try {
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

        const created = await prisma.products.create({
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

        return NextResponse.json(
            {
                ...created,
                price_agency: toNum(created.price_agency),
                price_retail: toNum(created.price_retail),
                price_retail_with_install: toNum(created.price_retail_with_install),
            },
            { status: 201 }
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Tạo sản phẩm thất bại" }, { status: 500 });
    }
}
