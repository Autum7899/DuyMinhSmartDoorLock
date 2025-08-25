'use client';

import { Search } from 'lucide-react';

const SearchBar = () => {
    return (
        <form className="relative w-full max-w-lg">
            <input
                type="text"
                placeholder="Bạn muốn tìm sản phẩm nào?"
                className="w-full pl-4 pr-12 py-2.5 text-base text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
            <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 bg-red-600 hover:bg-red-700 text-white rounded-r-md
                           flex items-center justify-center transition-colors"
                aria-label="Tìm kiếm"
            >
                <Search className="h-5 w-5" />
            </button>
        </form>
    );
};

export default SearchBar;