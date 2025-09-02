// src/app/lien-he/page.tsx
"use client";

import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                    Liên hệ với chúng tôi
                </h1>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Địa chỉ */}
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                        <p className="text-gray-700 text-sm md:text-base">
                            số 10 ngõ 192 phố Thái Thịnh, Hanoi, Vietnam
                        </p>
                    </div>

                    {/* Điện thoại */}
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <a
                            href="tel:0982216069"
                            className="text-gray-700 text-sm md:text-base hover:text-blue-600"
                        >
                            098 221 60 69
                        </a>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <a
                            href="mailto:jwsmartlock@gmail.com"
                            className="text-gray-700 text-sm md:text-base hover:text-blue-600"
                        >
                            jwsmartlock@gmail.com
                        </a>
                    </div>
                </div>

                {/* Google Maps Embed */}
                <div className="mt-8">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.474692077457!2d105.81579099999999!3d21.013684200000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab62e0183ad1%3A0xa8c77288df4bb7fc!2zMTAgTmcuIDE5MiBQLiBUaMOhaSBUaOG7i25oLCBMw6FuZyBI4bqhLCDEkOG7kW5nIMSQYSwgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1756784150147!5m2!1svi!2s"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                    ></iframe>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!4v1756823373220!6m8!1m7!1su_FkHWpzoxKrTEF1E5Yy0w!2m2!1d21.01386254038748!2d105.8159519656209!3f132.70732932957645!4f-4.959679933011955!5f0.7820865974627469"
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
