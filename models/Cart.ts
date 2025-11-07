import { ProductDetails } from '@/app/(authorized)/products/[id]';
import { Realm } from '@realm/react';

export class Cart extends Realm.Object<Cart> {
    _id!: Realm.BSON.ObjectId;
    productId!: string;
    name!: string;
    price!: string;
    originalPrice?: string;
    image!: string;
    description?: string;
    category?: string;
    quantityUnit?: string;
    quantityAmount!: number;
    quantity!: number;
    userEmail!: string;
    createdAt!: Date;
    updatedAt!: Date;

    static generate(product: ProductDetails, userEmail: string, quantity: number = 1) {
        return {
            _id: new Realm.BSON.ObjectId(),
            productId: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            description: product.description,
            category: product.category,
            quantity: quantity,
            quantityAmount: product.quantity.amount,
            quantityUnit: product.quantity.unit,
            userEmail: userEmail,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    static schema = {
        name: 'Cart',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            productId: 'string',
            name: 'string',
            price: 'string',
            originalPrice: 'string?',
            image: 'string',
            description: 'string?',
            category: 'string?',
            quantity: 'int',
            quantityAmount: 'int',
            quantityUnit: 'string?',
            userEmail: 'string',
            createdAt: 'date',
            updatedAt: 'date',
        },
    };
}