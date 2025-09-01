// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
// ĐỔI import nếu prisma ở nơi khác:
// import { prisma } from "@/lib/prisma";
import { prisma } from "@/lib/db/prisma";
import { $Enums, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

function parseId(s: string) {
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

function parseStatusEnum(input: unknown): $Enums.order_status | undefined {
    if (typeof input !== "string" || !input.trim()) return undefined;
    const candidates = Object.values($Enums.order_status) as string[];
    const match = candidates.find((c) => c.toLowerCase() === input.trim().toLowerCase());
    return match as $Enums.order_status | undefined;
}

// GET /api/orders/:id -> alias order_items -> items cho client
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const id = parseId(params.id);
        if (id == null) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

        const order = await prisma.orders.findUnique({
            where: { id },
            select: {
                id: true,
                customer_name: true,
                phone_number: true,
                address: true,
                status: true,
                total_amount: true,
                created_at: true,
                order_items: { select: { id: true, product_id: true, quantity: true }, orderBy: { id: "asc" } },
            },
        });
        if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });

        const { order_items, ...rest } = order;
        return NextResponse.json({ ...rest, items: order_items });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: "Không thể tải đơn hàng" }, { status: 500 });
    }
}

// PUT /api/orders/:id
// Body: { customer_name?: string, phone_number?: string, address?: string, status?: string, items?: [{ product_id, quantity }] }
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const id = parseId(params.id);
        if (id == null) return NextResponse.json({ message: "Invalid id" }, { status: 400 });

        const body = await req.json();
        const { customer_name, phone_number, address, status, items } = body ?? {};

        const data: Prisma.ordersUpdateInput = {};
        if (typeof customer_name === "string") data.customer_name = customer_name;
        if (typeof phone_number === "string") data.phone_number = phone_number;
        if (typeof address === "string") data.address = address;

        if (typeof status === "string") {
            const statusEnum = parseStatusEnum(status);
            if (!statusEnum) {
                const allowed = (Object.values($Enums.order_status) as string[]).join(", ");
                return NextResponse.json(
                    { message: `Trạng thái không hợp lệ. Giá trị hợp lệ: ${allowed}` },
                    { status: 400 }
                );
            }
            data.status = statusEnum;
        }

        if (Array.isArray(items)) {
            // Lấy giá GIẢM để tính lại tổng & price_at_purchase
            const productIds = items.map((it: { product_id: number }) => Number(it.product_id)).filter(Boolean);
            const products = await prisma.products.findMany({
                where: { id: { in: productIds } },
                select: { id: true, price_retail_with_install: true },
            });
            const priceMap = new Map(products.map(p => [p.id, Number(p.price_retail_with_install ?? 0)]));

            let total_amount = 0;
            const creates = items.map((it: { product_id: number; quantity: number }) => {
                const product_id = Number(it.product_id);
                const quantity = Math.max(1, Number(it.quantity ?? 1));
                const unit = priceMap.get(product_id) ?? 0;
                total_amount += unit * quantity;
                return { product_id, quantity, price_at_purchase: unit };
                // (checked): { quantity, price_at_purchase: unit, products: { connect: { id: product_id } } }
            });

            data.total_amount = total_amount;
            data.order_items = { deleteMany: {}, create: creates };
        }

        const updated = await prisma.orders.update({
            where: { id },
            data,
            select: { id: true, customer_name: true, status: true, total_amount: true, created_at: true },
        });

        return NextResponse.json(updated);
    } catch (e: unknown) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                return NextResponse.json({ message: "Đơn hàng không tồn tại" }, { status: 404 });
            }
        }
        console.error(e);
        return NextResponse.json({ message: "Cập nhật đơn hàng thất bại" }, { status: 500 });
    }
}

// DELETE /api/orders/:id
export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const id = parseId(params.id);
        if (id == null) return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        await prisma.orders.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (e: unknown) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2025") {
                return NextResponse.json({ message: "Đơn hàng không tồn tại" }, { status: 404 });
            }
        }
        console.error(e);
        return NextResponse.json({ message: "Xoá đơn hàng thất bại" }, { status: 500 });
    }
}
