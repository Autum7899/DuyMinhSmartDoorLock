// src/app/admin/categories/page.tsx
"use client";
import React, { useState, useEffect } from 'react';

// Component Modal xác nhận tùy chỉnh
interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
                <p className="text-center text-gray-700 mb-6">{message}</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

interface Category {
    id: string | number;
    name: string;
    description: string;
}

export default function CategoryManagementPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);

    // Form State
    const [formState, setFormState] = useState({ name: '', description: '' });
    const [formErrors, setFormErrors] = useState({ name: false });
    
    // Bạn sẽ cần thay thế logic fetchCategories này bằng một API Route hoặc Server Action
    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/categories'); // Giả định có API Route
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formState.name) {
            setFormErrors(prev => ({ ...prev, name: true }));
            return;
        }
        setFormErrors(prev => ({ ...prev, name: false }));

        try {
            const method = editingCategory ? 'PUT' : 'POST';
            const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            if (res.ok) {
                fetchCategories();
                resetForm();
            }
        } catch (error) {
            console.error('Failed to submit category:', error);
        }
    };

    const startEdit = (category: Category) => {
        setEditingCategory(category);
        setFormState({ name: category.name, description: category.description });
    };
    
    const resetForm = () => {
        setFormState({ name: '', description: '' });
        setEditingCategory(null);
    };

    const handleDelete = (id: string | number) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                const res = await fetch(`/api/categories/${deleteId}`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    fetchCategories();
                }
            } catch (error) {
                console.error('Failed to delete category:', error);
            }
        }
        setShowConfirm(false);
        setDeleteId(null);
    };

    if (isLoading) return <div className="text-center text-gray-500 py-10">Đang tải...</div>;
    if (!categories) return <div className="text-center text-red-500 py-10">Không thể tải danh mục.</div>;

    return (
        <>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Quản lý danh mục</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">
                    {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h2>
                <form onSubmit={onSubmit} className="space-y-4 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên danh mục</label>
                        <input
                            name="name"
                            value={formState.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 transition-colors duration-200"
                        />
                        {formErrors.name && <span className="text-red-500 text-sm">Tên là bắt buộc</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea
                            name="description"
                            value={formState.description}
                            onChange={handleInputChange}
                            rows={3}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 transition-colors duration-200"
                        ></textarea>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                        >
                            {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                        {editingCategory && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors shadow-md"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>

                <h2 className="text-2xl font-semibold mb-6">Danh sách danh mục</h2>
                <ul className="space-y-4">
                    {categories?.map((category) => (
                        <li
                            key={category.id}
                            className="bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center transition-transform hover:scale-[1.01] duration-200"
                        >
                            <div>
                                <p className="font-bold text-lg">{category.name}</p>
                                <p className="text-gray-500 text-sm">{category.description}</p>
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

                {/* Confirmation Modal */}
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