import React from 'react';
import Image from 'next/image';

const ContactBubble = () => {
    // THAY ĐỔI CÁC LINK DƯỚI ĐÂY
    const zaloLink = "https://zalo.me/0982216069"; // Thay YOUR_ZALO_PHONE_NUMBER bằng SĐT Zalo của bạn
    const messengerLink = "https://www.facebook.com/profile.php?id=61579515821610"; // Thay YOUR_FACEBOOK_PAGE_ID bằng ID trang Facebook của bạn

    return (
        <div className="fixed bottom-5 right-5 flex flex-col items-center gap-3 z-50">
            {/* Nút Messenger */}
            <a
                href={messengerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-transform hover:scale-110"
                aria-label="Chat on Messenger"
            >
                <Image
                    src="/icons/messenger.svg" // Đường dẫn tới icon Messenger của bạn
                    alt="Messenger"
                    width={32}
                    height={32}
                />
            </a>

            {/* Nút Zalo */}
            <a
                href={zaloLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-transform hover:scale-110"
                aria-label="Chat on Zalo"
            >
                <Image
                    src="/icons/zalo.svg" // Đường dẫn tới icon Zalo của bạn
                    alt="Zalo"
                    width={32}
                    height={32}
                />
            </a>
        </div>
    );
};

export default ContactBubble;