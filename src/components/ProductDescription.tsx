// src/components/ProductDescription.tsx

import React from 'react';

interface ProductDescriptionProps {
  htmlContent: string | null | undefined;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ htmlContent }) => {
  // Không render component nếu không có nội dung
  if (!htmlContent) {
    return null;
  }

  // Trích xuất nội dung bên trong thẻ <body>
  const extractBodyContent = (html: string) => {
    const match = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return match ? match[1] : html;
  };

  const bodyContent = extractBodyContent(htmlContent);


  return (
    <div className="mt-6 border-t pt-5">
      <h2 className="text-lg font-bold text-gray-800 mb-2.5">Mô tả sản phẩm</h2>
      
      {/* - Class `prose` sẽ tự động định dạng các thẻ HTML bên trong.
        - `dangerouslySetInnerHTML` dùng để render chuỗi HTML.
      */}
      <div
        className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: bodyContent }}
      />
    </div>
  );
};

export default ProductDescription;