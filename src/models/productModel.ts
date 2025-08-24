import { Schema, model, Document } from 'mongoose';
import { IProduct } from '../types'; // Import interface đã được sửa

// Interface này kết hợp các trường của bạn (IProduct) và các trường của Mongoose (Document)
// Bây giờ sẽ không còn lỗi vì không có thuộc tính nào bị trùng lặp.
export interface IProductDocument extends IProduct, Document {}

const productSchema = new Schema<IProductDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            agency: { type: Number, default: 0 },
            retail: { type: Number, default: 0 },
            retailWithInstall: {
                type: Number,
                required: true,
            },
        },
        category: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        description: {
            type: String,
        },
    },
    {
        // Tùy chọn này sẽ tự động thêm createdAt và updatedAt
        timestamps: true,
    }
);

const Product = model<IProductDocument>('Product', productSchema);

export default Product;