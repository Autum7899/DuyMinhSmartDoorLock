"use client";
import React from "react";
import Image from "next/image";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin", "vietnamese"],
    weight: ["300", "400", "500", "700", "900"],
});

export default function HeroSection() {
    return (
        <section className={`relative isolate overflow-hidden bg-white ${roboto.className}`}>
            {/* Background with subtle gradient and blurred shapes for a modern look */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-red-50" />
            <div className="absolute -top-1/4 -right-1/4 -z-10 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-[-6rem] left-0 -z-10 h-72 w-72 rounded-full bg-red-400/10 blur-3xl animate-pulse-slow" />

            {/* Desktop Hero Image Section (hidden on mobile/tablet) */}
            <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
                <div className="relative h-full w-full">
                    <Image
                        src="/images/hero.png"
                        alt="Các mẫu khóa cửa thông minh"
                        fill
                        className="object-cover object-center"
                        priority
                        sizes="(min-width:1024px) 50vw, 100vw"
                    />
                    {/* The subtle gradient overlay (white fog) has been removed */}
                </div>
            </div>

            {/* Mobile/Tablet Hero Image Section (hidden on desktop) */}
            <div className="relative h-56 w-full sm:h-80 lg:hidden">
                <Image
                    src="/images/hero.png"
                    alt="Các mẫu khóa cửa thông minh"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="100vw"
                />
            </div>

            {/* Main Content Section */}
            <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
                <div className="max-w-2xl lg:max-w-xl">
                    <p className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm backdrop-blur">
                        ★ An toàn & Tiện nghi cho Ngôi nhà Việt
                    </p>

                    <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        Giải pháp <span className="text-blue-700">Khóa Cửa Thông Minh</span>
                    </h1>

                    <p className="mt-5 max-w-xl text-pretty text-gray-600 sm:text-lg">
                        Mở khóa tương lai với các sản phẩm khóa cửa thông minh hàng đầu. An
                        toàn, tiện lợi và đậm chất hiện đại cho ngôi nhà của bạn.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <a
                            href="#products"
                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/40"
                        >
                            Xem các sản phẩm
                        </a>
                        <a
                            href="/lien-he"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-red-700 ring-1 ring-inset ring-red-200 transition-all duration-300 hover:scale-105 hover:bg-red-50"
                        >
                            Liên hệ tư vấn
                        </a>
                    </div>

                    <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Vân tay
                            siêu nhạy
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Mở khóa
                            từ xa
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Cảnh báo
                            thông minh
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}