'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { products } from '@prisma/client';

// Định nghĩa kiểu dữ liệu cho một sản phẩm trong giỏ hàng
export interface CartItem extends Pick<products, 'id' | 'name' | 'image_url'> {
    quantity: number;
    price: number; // Giá tại thời điểm thêm vào giỏ
}

// Định nghĩa kiểu dữ liệu cho Context
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    totalPrice: number;
}

// Tạo Context với giá trị mặc định
const CartContext = createContext<CartContextType | undefined>(undefined);

// Tạo Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Hook để load giỏ hàng từ localStorage khi component được mount
    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('shoppingCart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
        }
    }, []);

    // Hook để lưu giỏ hàng vào localStorage mỗi khi nó thay đổi
    useEffect(() => {
        localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hàm thêm sản phẩm vào giỏ
    const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            // Nếu sản phẩm chưa có, thêm mới vào giỏ
            return [...prevItems, { ...product, quantity }];
        });
    };

    // Hàm xóa sản phẩm khỏi giỏ
    const removeFromCart = (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Hàm cập nhật số lượng của một sản phẩm
    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                )
            );
        }
    };

    // Hàm xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
    };

    // Tính tổng số lượng sản phẩm trong giỏ
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    // Tính tổng giá trị giỏ hàng
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook để sử dụng CartContext dễ dàng hơn
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};