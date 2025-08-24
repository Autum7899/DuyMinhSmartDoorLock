"use client";
import React from "react";
import Image from "next/image";
import { Roboto } from "next/font/google";
import { motion } from "framer-motion";

const roboto = Roboto({
    subsets: ["latin", "vietnamese"],
    weight: ["300", "400", "500", "700", "900"],
});
const BLUR = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2zSukAAAAASUVORK5CYII=";

export default function HeroSection() {
    return (
        <section className={`relative isolate overflow-hidden bg-white ${roboto.className}`}>
            {/* Soft gradient background + blurred blobs */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-white to-indigo-50" />
            <div className="absolute -top-24 -right-24 -z-10 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute bottom-[-6rem] left-0 -z-10 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />

            {/* RIGHT HALF COVER (desktop) */}
            <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-y-0 right-0 hidden w-1/2 lg:block"
            >
                <div className="relative h-full w-full">
                    <Image
                        src="/images/hero.png"
                        alt="Các mẫu khóa cửa thông minh"
                        fill
                        className="object-cover object-center"
                        priority
                        placeholder={BLUR}
                        sizes="(min-width:1024px) 50vw, 100vw"
                    />
                    {/* Optional subtle gradient overlay for readability */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-white/0 via-white/0 to-white/30" />
                </div>
            </motion.div>

            {/* TOP COVER (mobile/tablet) */}
            <div className="relative h-56 w-full sm:h-80 lg:hidden">
                <Image
                    src="/images/hero.png"
                    alt="Các mẫu khóa cửa thông minh"
                    fill
                    className="object-cover object-center"
                    priority
                    placeholder={BLUR}
                    sizes="100vw"
                />
            </div>

            {/* CONTENT */}
            <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-2xl lg:max-w-xl"
                >
                    <p className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm backdrop-blur">
                        ★ Bảo mật – Tiện lợi – Phong cách
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
                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/40"
                        >
                            Khám phá ngay
                        </a>
                        <a
                            href="#catalog"
                            className="inline-flex items-center justify-center rounded-xl bg-red-50 px-6 py-3 text-base font-semibold text-red-700 ring-1 ring-inset ring-red-200 transition hover:bg-red-100"
                        >
                            Xem các sản phẩm
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
                </motion.div>
            </div>
        </section>
    );
}
