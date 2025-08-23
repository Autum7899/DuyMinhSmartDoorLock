// src/components/SearchBar.tsx
'use client'; // Thêm dòng này vì component này có thể có tương tác từ người dùng

import { Search } from 'lucide-react';

const SearchBar = () => {
    return (
        <div className="relative w-full max-w-lg">
            <input
                type="text"
                placeholder="Bạn muốn tìm sản phẩm nào?"
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="absolute right-0 top-0 h-full px-5 bg-gray-200 hover:bg-gray-300 rounded-r-md flex items-center justify-center"
                aria-label="Tìm kiếm"
            >
                <Search className="h-5 w-5 text-gray-600" />
            </button>
        </div>
    );
};

export default SearchBar;