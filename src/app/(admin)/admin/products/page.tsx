"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// —— Types —— //
type Product = {
    id: number;
    name: string;
    image_url: string | null;
    description: string | null;
    price_agency: number;              // Giá đại lý
    price_retail: number;              // Giá gốc
    price_retail_with_install: number; // Giá giảm
    quantity: number;
    category_id: number | null;
};

type Category = { id: number; name: string };

// —— input class dùng chung —— //
const inputCls =
    "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 " +
    "transition-colors";

function formatVND(value: number | string) {
    const n = Number(value ?? 0);
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(n);
}

// —— Modal xác nhận —— //
const Confirm = ({
                     message,
                     onConfirm,
                     onCancel,
                 }: {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <p className="text-center text-gray-700 mb-6">{message}</p>
            <div className="flex justify-center gap-3">
                <button onClick={onCancel} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
                    Hủy
                </button>
                <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
                    Xác nhận
                </button>
            </div>
        </div>
    </div>
);

type NumOrEmpty = number | "";

// —— Page —— //
export default function AdminProductsPage() {
    const [items, setItems] = useState<Product[]>([]);
    const [cats, setCats] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [form, setForm] = useState<{
        name: string;
        image_url: string;
        description: string;
        quantity: number;
        category_id: number | "" | null;
        price_agency: NumOrEmpty;
        price_retail: NumOrEmpty;
        price_retail_with_install: NumOrEmpty;
    }>({
        name: "",
        image_url: "",
        description: "",
        quantity: 0,
        category_id: "",
        price_agency: "",
        price_retail: "",
        price_retail_with_install: "",
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setErr(null);
            const res = await fetch("/api/products", { cache: "no-store" });
            if (!res.ok)
                throw new Error((await res.json().catch(() => ({}))).message || "Không thể tải sản phẩm");
            const data = (await res.json()) as Product[];
            setItems(data);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setErr(e.message);
            } else {
                setErr("Không thể tải sản phẩm");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories", { cache: "no-store" });
            if (!res.ok) return;
            const data = (await res.json()) as Category[];
            setCats(data);
        } catch {
            // optional
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const setField = <K extends keyof typeof form>(name: K, value: (typeof form)[K]) =>
        setForm((f) => ({ ...f, [name]: value }));

    const resetForm = () => {
        setEditing(null);
        setForm({
            name: "",
            image_url: "",
            description: "",
            quantity: 0,
            category_id: "",
            price_agency: "",
            price_retail: "",
            price_retail_with_install: "",
        });
    };

    const startEdit = (p: Product) => {
        setEditing(p);
        setForm({
            name: p.name ?? "",
            image_url: p.image_url ?? "",
            description: p.description ?? "",
            quantity: p.quantity ?? 0,
            category_id: p.category_id ?? "",
            price_agency: p.price_agency ?? "",
            price_retail: p.price_retail ?? "",
            price_retail_with_install: p.price_retail_with_install ?? "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!String(form.name).trim()) {
            alert("Tên sản phẩm là bắt buộc");
            return;
        }
        try {
            setSubmitting(true);
            const payload = {
                name: String(form.name).trim(),
                image_url: String(form.image_url ?? ""),
                description: String(form.description ?? ""),
                quantity: Number(form.quantity ?? 0),
                category_id: form.category_id === "" ? null : Number(form.category_id),
                price_agency: Number(form.price_agency ?? 0),
                price_retail: Number(form.price_retail ?? 0),
                price_retail_with_install: Number(form.price_retail_with_install ?? 0),
            };

            const url = editing ? `/api/products/${editing.id}` : "/api/products";
            const method = editing ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok)
                throw new Error((await res.json().catch(() => ({}))).message || "Thao tác thất bại");

            await fetchProducts();
            resetForm();
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert(e.message);
            } else {
                alert("Có lỗi xảy ra");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (deleteId == null) return;
        try {
            const res = await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
            if (!res.ok)
                throw new Error((await res.json().catch(() => ({}))).message || "Xoá thất bại");
            await fetchProducts();
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert(e.message);
            } else {
                alert("Có lỗi xảy ra khi xoá");
            }
        } finally {
            setDeleteId(null);
        }
    };

    if (loading) return <div className="py-10 text-center text-gray-500">Đang tải...</div>;
    if (err) {
        return (
            <div className="py-10 text-center text-red-500">
                {err}
                <div className="mt-4">
                    <button onClick={fetchProducts} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Quản lý sản phẩm</h1>

            {/* Form thêm / sửa */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-2xl font-semibold mb-6">
                    {editing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                            <input
                                className={inputCls}
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                placeholder="Ví dụ: Khóa vân tay X"
                                disabled={submitting}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ảnh (URL)</label>
                            <input
                                className={inputCls}
                                value={form.image_url}
                                onChange={(e) => setField("image_url", e.target.value)}
                                placeholder="https://..."
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea
                            className={inputCls}
                            rows={3}
                            value={form.description}
                            onChange={(e) => setField("description", e.target.value)}
                            disabled={submitting}
                        />
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                            <input
                                type="number"
                                className={inputCls}
                                value={form.quantity}
                                onChange={(e) => setField("quantity", Number(e.target.value))}
                                min={0}
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                            <select
                                className={inputCls}
                                value={form.category_id}
                                onChange={(e) =>
                                    setField("category_id", e.target.value === "" ? "" : Number(e.target.value))
                                }
                                disabled={submitting}
                            >
                                <option value="">— Không chọn —</option>
                                {cats.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Giá đại lý */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá đại lý</label>
                            <input
                                type="number"
                                className={inputCls}
                                value={form.price_agency}
                                onChange={(e) =>
                                    setField("price_agency", e.target.value === "" ? "" : Number(e.target.value))
                                }
                                min={0}
                                disabled={submitting}
                                placeholder="VD: 4200000"
                            />
                        </div>

                        {/* Giá gốc */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá gốc</label>
                            <input
                                type="number"
                                className={inputCls}
                                value={form.price_retail}
                                onChange={(e) =>
                                    setField("price_retail", e.target.value === "" ? "" : Number(e.target.value))
                                }
                                min={0}
                                disabled={submitting}
                                placeholder="VD: 5500000"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                        {/* Giá giảm */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá giảm</label>
                            <input
                                type="number"
                                className={inputCls}
                                value={form.price_retail_with_install}
                                onChange={(e) =>
                                    setField(
                                        "price_retail_with_install",
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                min={0}
                                disabled={submitting}
                                placeholder="VD: 4990000"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                        >
                            {editing ? "Cập nhật" : "Thêm mới"}
                        </button>
                        {editing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={submitting}
                                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 disabled:opacity-60"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Danh sách */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Danh sách sản phẩm</h2>
                {items.length === 0 ? (
                    <div className="text-gray-500">Chưa có sản phẩm.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hình ảnh
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tên
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá đại lý
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá gốc
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá giảm
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SL
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hành động
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((p) => {
                                const agency = Number(p.price_agency ?? 0);
                                const retail = Number(p.price_retail ?? 0);
                                const sale = Number(p.price_retail_with_install ?? 0);
                                const hasDiscount = sale > 0 && sale < retail;
                                const saving = hasDiscount ? retail - sale : 0;

                                return (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3">
                                            {p.image_url ? (
                                                <Image
                                                    src={p.image_url}
                                                    alt={p.name}
                                                    width={48}
                                                    height={48}
                                                    className="h-12 w-12 rounded-md object-cover shadow"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                                    No image
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 font-medium">{p.name}</td>

                                        {/* Giá đại lý */}
                                        <td className="px-6 py-3 font-semibold text-gray-800">
                                            {formatVND(agency)}
                                        </td>

                                        {/* Giá gốc */}
                                        <td className="px-6 py-3 text-gray-600">
                        <span className={hasDiscount ? "line-through text-gray-400" : "font-semibold"}>
                          {formatVND(retail)}
                        </span>
                                        </td>

                                        {/* Giá giảm + tiết kiệm */}
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">
                            {formatVND(hasDiscount ? sale : retail)}
                          </span>
                                                {hasDiscount && (
                                                    <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                              Tiết kiệm {formatVND(saving)}
                            </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-3 text-gray-600">{p.quantity}</td>

                                        <td className="px-6 py-3 text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => startEdit(p)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => setDeleteId(p.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
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

            {deleteId != null && (
                <Confirm
                    message="Bạn có chắc chắn muốn xoá sản phẩm này không?"
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteId(null)}
                />
            )}
        </>
    );
}
