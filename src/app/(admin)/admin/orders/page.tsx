// src/app/(admin)/orders/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

type Product = {
    id: number;
    name: string;
    price_retail_with_install: number; // Giá giảm
};

type OrderRow = {
    id: number;
    customer_name: string;
    status?: string | null;
    total_amount: number;
    created_at: string;
};

type OrderDetail = {
    id: number;
    customer_name: string;
    phone_number?: string | null;
    address?: string | null;
    status?: string | null;
    total_amount: number;
    created_at: string;
    items: { id: number; product_id: number; quantity: number }[]; // alias từ API
};

type DraftItem = { product_id: number | ""; quantity: number };

const currency = (v: number | string | undefined) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(v ?? 0));

const inputCls =
    "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition-colors";

const selectCls =
    "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition-colors";

const STATUS_OPTIONS = ["NEW", "CONFIRMED", "FINISHED", "CANCELLED"] as const;

export default function OrdersPage() {
    // Data
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<OrderRow[]>([]);

    // UX
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Edit/Delete
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Form
    const [form, setForm] = useState<{
        customer_name: string;
        phone_number: string;
        address: string;
        status: string; // luôn là 1 trong STATUS_OPTIONS
        items: DraftItem[];
    }>({
        customer_name: "",
        phone_number: "",
        address: "",
        status: "NEW", // mặc định tạo mới
        items: [],
    });

    // ===== Fetchers =====
    const fetchProducts = async () => {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) throw new Error("Không thể tải sản phẩm");
        const data = (await res.json()) as any[];
        setProducts(
            data.map((p) => ({
                id: Number(p.id),
                name: String(p.name ?? ""),
                price_retail_with_install: Number(p.price_retail_with_install ?? 0),
            }))
        );
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setErr(null);
            const res = await fetch("/api/orders", { cache: "no-store" });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message || "Không thể tải danh sách đơn hàng");
            }
            const data = (await res.json()) as any[];
            setOrders(
                (Array.isArray(data) ? data : []).map((o) => ({
                    id: Number(o.id),
                    customer_name: String(o.customer_name ?? ""),
                    status: o.status ?? null,
                    total_amount: Number(o.total_amount ?? 0),
                    created_at: String(o.created_at ?? ""),
                }))
            );
        } catch (e: any) {
            setErr(e?.message || "Không thể tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetail = async (id: number) => {
        const res = await fetch(`/api/orders/${id}`, { cache: "no-store" });
        if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j?.message || "Không thể tải đơn hàng");
        }
        const o = (await res.json()) as OrderDetail;
        setEditingId(Number(o.id));
        setForm({
            customer_name: String(o.customer_name ?? ""),
            phone_number: String(o.phone_number ?? ""),
            address: String(o.address ?? ""),
            status: STATUS_OPTIONS.includes(String(o.status ?? "").toUpperCase() as any)
                ? String(o.status ?? "").toUpperCase()
                : "NEW",
            items: (o.items || []).map((it) => ({
                product_id: Number(it.product_id),
                quantity: Number(it.quantity ?? 1),
            })),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        fetchProducts().catch(console.error);
        fetchOrders().catch(console.error);
    }, []);

    // ===== Helpers =====
    const setField = <K extends keyof typeof form>(name: K, value: (typeof form)[K]) =>
        setForm((f) => ({ ...f, [name]: value }));

    const addLine = () =>
        setForm((f) => ({ ...f, items: [...f.items, { product_id: "", quantity: 1 }] }));

    const removeLine = (idx: number) =>
        setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

    const setLine = (idx: number, patch: Partial<DraftItem>) =>
        setForm((f) => ({
            ...f,
            items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
        }));

    // Tổng tạm tính (preview client) = Σ qty * price_retail_with_install
    const previewTotal = useMemo(() => {
        let total = 0;
        form.items.forEach((it) => {
            const p = products.find((x) => x.id === Number(it.product_id));
            const unit = Number(p?.price_retail_with_install ?? 0);
            total += unit * (Number(it.quantity) || 0);
        });
        return total;
    }, [form.items, products]);

    const resetForm = () => {
        setEditingId(null);
        setForm({ customer_name: "", phone_number: "", address: "", status: "NEW", items: [] });
    };

    // ===== Submit/Delete =====
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        if (!form.customer_name.trim()) return alert("Tên khách hàng là bắt buộc");
        if (editingId == null) {
            if (!form.phone_number.trim()) return alert("Số điện thoại là bắt buộc");
            if (!form.address.trim()) return alert("Địa chỉ là bắt buộc");
        }
        if (form.items.length === 0) return alert("Đơn hàng cần ít nhất 1 dòng sản phẩm");

        try {
            setSubmitting(true);

            const payload: any = {
                customer_name: form.customer_name.trim(),
                status: form.status, // Gửi đúng enum string
                items: form.items.map((it) => ({
                    product_id: Number(it.product_id),
                    quantity: Math.max(1, Number(it.quantity || 1)),
                })),
            };

            if (editingId == null) {
                payload.phone_number = form.phone_number.trim();
                payload.address = form.address.trim();
            } else {
                if (form.phone_number.trim()) payload.phone_number = form.phone_number.trim();
                if (form.address.trim()) payload.address = form.address.trim();
            }

            const url = editingId ? `/api/orders/${editingId}` : "/api/orders";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message || "Thao tác thất bại");
            }

            await fetchOrders();
            resetForm();
        } catch (e: any) {
            alert(e?.message || "Có lỗi xảy ra");
        } finally {
            setSubmitting(false);
        }
    };

    const onDelete = async () => {
        if (deleteId == null) return;
        try {
            const res = await fetch(`/api/orders/${deleteId}`, { method: "DELETE" });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message || "Xoá thất bại");
            }
            await fetchOrders();
        } catch (e: any) {
            alert(e?.message || "Có lỗi xảy ra khi xoá");
        } finally {
            setDeleteId(null);
        }
    };

    // ===== UI =====
    if (loading) return <div className="py-10 text-center text-gray-500">Đang tải...</div>;
    if (err) {
        return (
            <div className="py-10 text-center text-red-500">
                {err}
                <div className="mt-4">
                    <button onClick={() => fetchOrders()} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Quản lý đơn hàng</h1>

            {/* Form tạo / sửa */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">{editingId ? "Chỉnh sửa đơn hàng" : "Tạo đơn hàng mới"}</h2>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200">
                            + Đơn mới
                        </button>
                    )}
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {/* Thông tin khách */}
                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Khách hàng *</label>
                            <input
                                className={inputCls}
                                value={form.customer_name}
                                onChange={(e) => setField("customer_name", e.target.value)}
                                placeholder="Tên khách"
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Số điện thoại {editingId == null && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                className={inputCls}
                                value={form.phone_number}
                                onChange={(e) => setField("phone_number", e.target.value)}
                                placeholder="098..."
                                disabled={submitting}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Địa chỉ {editingId == null && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                className={inputCls}
                                value={form.address}
                                onChange={(e) => setField("address", e.target.value)}
                                placeholder="Số nhà, đường..."
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Trạng thái - DROPDOWN CỐ ĐỊNH */}
                    <div className="md:w-1/3">
                        <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <select
                            className={selectCls}
                            value={form.status}
                            onChange={(e) => setField("status", e.target.value as (typeof STATUS_OPTIONS)[number])}
                            disabled={submitting}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dòng sản phẩm */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold">Sản phẩm (đơn giá = Giá giảm)</h3>
                            <button type="button" onClick={addLine} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
                                + Thêm sản phẩm
                            </button>
                        </div>

                        {form.items.length === 0 ? (
                            <div className="text-gray-500">Chưa có dòng sản phẩm nào.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SL</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Đơn giá (giá giảm)</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">-</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {form.items.map((it, idx) => {
                                        const p = products.find((x) => x.id === Number(it.product_id));
                                        const unit = Number(p?.price_retail_with_install ?? 0);
                                        const lineTotal = unit * (Number(it.quantity) || 0);

                                        return (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">
                                                    <select
                                                        className={selectCls}
                                                        value={it.product_id as any}
                                                        onChange={(e) =>
                                                            setLine(idx, { product_id: e.target.value === "" ? "" : Number(e.target.value) })
                                                        }
                                                        disabled={submitting}
                                                    >
                                                        <option value="">— Chọn sản phẩm —</option>
                                                        {products.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className={inputCls}
                                                        value={it.quantity}
                                                        min={1}
                                                        onChange={(e) => setLine(idx, { quantity: Math.max(1, Number(e.target.value || 1)) })}
                                                        disabled={submitting}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 font-medium">{currency(unit)}</td>
                                                <td className="px-4 py-2 font-semibold text-gray-800">{currency(lineTotal)}</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLine(idx)}
                                                        className="text-red-600 hover:text-red-800"
                                                        disabled={submitting}
                                                    >
                                                        Xoá
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Tổng (preview) */}
                    <div className="flex items-center justify-end gap-8">
                        <div>
                            <div className="text-sm text-gray-600">Tổng tạm tính</div>
                            <div className="text-2xl font-bold text-green-700">{currency(previewTotal)}</div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60">
                            {editingId ? "Cập nhật" : "Tạo đơn"}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} disabled={submitting} className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 disabled:opacity-60">
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Danh sách đơn */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Danh sách đơn hàng</h2>
                {orders.length === 0 ? (
                    <div className="text-gray-500">Chưa có đơn nào.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">#{o.id}</td>
                                    <td className="px-4 py-3">{o.customer_name}</td>
                                    <td className="px-4 py-3">{o.status ?? "-"}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-800">{currency(o.total_amount)}</td>
                                    <td className="px-4 py-3">{o.created_at && new Date(o.created_at).toLocaleString("vi-VN")}</td>
                                    <td className="px-4 py-3 space-x-3 text-sm">
                                        <button onClick={() => fetchOrderDetail(o.id)} className="text-blue-600 hover:text-blue-900">
                                            Sửa
                                        </button>
                                        <button onClick={() => setDeleteId(o.id)} className="text-red-600 hover:text-red-900">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Confirm delete */}
            {deleteId != null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                        <p className="text-center text-gray-700 mb-6">Bạn có chắc chắn muốn xoá đơn hàng này không?</p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
                                Hủy
                            </button>
                            <button onClick={onDelete} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
