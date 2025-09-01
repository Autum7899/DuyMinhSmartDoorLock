"use client";

import React, { useEffect, useState } from "react";

// —— Modal xác nhận —— //
interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                 message,
                                                                 onConfirm,
                                                                 onCancel,
                                                             }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                <p className="text-center text-gray-700 mb-6">{message}</p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

// —— Types —— //
interface Category {
    id: number;
    name: string;
    description: string | null;
}

// —— input class dùng chung —— //
const inputCls =
    "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 " +
    "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 " +
    "transition-colors";

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Form State
    const [formState, setFormState] = useState({ name: "", description: "" });
    const [formErrors, setFormErrors] = useState({ name: false });
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            setErrorMsg(null);
            const res = await fetch("/api/categories", { cache: "no-store" });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message || "Không thể tải danh mục");
            }
            const data: Category[] = await res.json();
            setCategories(data);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg("Không thể tải danh mục");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormState({ name: "", description: "" });
        setEditingCategory(null);
        setFormErrors({ name: false });
    };

    const startEdit = (category: Category) => {
        setEditingCategory(category);
        setFormState({
            name: category.name ?? "",
            description: category.description ?? "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formState.name.trim()) {
            setFormErrors((prev) => ({ ...prev, name: true }));
            return;
        }
        setFormErrors((prev) => ({ ...prev, name: false }));

        try {
            setSubmitting(true);
            const method = editingCategory ? "PUT" : "POST";
            const url = editingCategory
                ? `/api/categories/${editingCategory.id}`
                : "/api/categories";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formState.name.trim(),
                    description: formState.description.trim(),
                }),
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message || "Thao tác thất bại");
            }
            await fetchCategories();
            resetForm();
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Có lỗi xảy ra");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                const res = await fetch(`/api/categories/${deleteId}`, {
                    method: "DELETE",
                });
                if (!res.ok) {
                    const j = await res.json().catch(() => ({}));
                    throw new Error(j?.message || "Xóa thất bại");
                }
                await fetchCategories();
            } catch (error: unknown) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert("Có lỗi xảy ra");
                }
            }
        }
        setShowConfirm(false);
        setDeleteId(null);
    };

    if (isLoading)
        return (
            <div className="text-center text-gray-500 py-10">Đang tải...</div>
        );
    if (errorMsg)
        return (
            <div className="text-center text-red-500 py-10">
                {errorMsg}
                <div className="mt-4">
                    <button
                        onClick={fetchCategories}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">
                Quản lý danh mục
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">
                    {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                </h2>

                <form onSubmit={onSubmit} className="space-y-4 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tên danh mục
                        </label>
                        <input
                            name="name"
                            value={formState.name}
                            onChange={handleInputChange}
                            className={inputCls}
                            placeholder="Ví dụ: Khóa vân tay"
                            disabled={submitting}
                        />
                        {formErrors.name && (
                            <span className="text-red-500 text-sm">Tên là bắt buộc</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Mô tả
                        </label>
                        <textarea
                            name="description"
                            value={formState.description}
                            onChange={handleInputChange}
                            rows={3}
                            className={inputCls}
                            placeholder="Mô tả ngắn"
                            disabled={submitting}
                        ></textarea>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                        >
                            {editingCategory ? "Cập nhật" : "Thêm mới"}
                        </button>

                        {editingCategory && (
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

                <h2 className="text-2xl font-semibold mb-6">Danh sách danh mục</h2>
                <ul className="space-y-4">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className="bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center transition-transform hover:scale-[1.01] duration-200"
                        >
                            <div>
                                <p className="font-bold text-lg">{category.name}</p>
                                <p className="text-gray-500 text-sm">
                                    {category.description || "—"}
                                </p>
                            </div>

                            <div className="space-x-2 mt-3 md:mt-0">
                                <button
                                    onClick={() => startEdit(category)}
                                    className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 transition-colors"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {showConfirm && (
                    <ConfirmationModal
                        message="Bạn có chắc chắn muốn xóa danh mục này không?"
                        onConfirm={confirmDelete}
                        onCancel={() => setShowConfirm(false)}
                    />
                )}
            </div>
        </>
    );
}
