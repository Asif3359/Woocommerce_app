import { ProductDetails } from '@/app/(authorized)/products/[id]';
import { Cart } from '@/models/Cart';
import { useQuery, useRealm } from '@realm/react';
import { useCallback } from 'react';

export const useCart = (userEmail: string = 'user@example.com') => {
    const realm = useRealm();

    // Get all cart items for the current user
    const cartItems = useQuery(Cart, (collection) => {
        return collection.filtered('userEmail == $0', userEmail);
    });

    // Add item to cart
    const addToCart = useCallback((product: ProductDetails, quantity: number = 1) => {
        try {
            realm.write(() => {
                // Check if product already exists in cart
                const existingCartItem = realm.objects(Cart).filtered(
                    `productId == $0 AND userEmail == $1`,
                    product.id,
                    userEmail
                )[0];

                if (existingCartItem) {
                    // Update quantity if item already exists
                    existingCartItem.quantity = existingCartItem.quantity + quantity;
                    existingCartItem.updatedAt = new Date();
                } else {
                    // Add new item to cart
                    realm.create('Cart', Cart.generate(product, userEmail, quantity));
                }
            });

            console.log("Product added to cart successfully!");
            return true;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return false;
        }
    }, [realm, userEmail]);

    // Remove item from cart
    const removeFromCart = useCallback((productId: string) => {
        try {
            realm.write(() => {
                const cartItem = realm.objects(Cart).filtered(
                    `productId == $0 AND userEmail == $1`,
                    productId,
                    userEmail
                )[0];

                if (cartItem) {
                    realm.delete(cartItem);
                }
            });

            console.log("Product removed from cart successfully!");
            return true;
        } catch (error) {
            console.error("Error removing from cart:", error);
            return false;
        }
    }, [realm, userEmail]);

    // Update item quantity
    const updateQuantity = useCallback((productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        try {
            realm.write(() => {
                const cartItem = realm.objects(Cart).filtered(
                    `productId == $0 AND userEmail == $1`,
                    productId,
                    userEmail
                )[0];

                if (cartItem) {
                    cartItem.quantity = newQuantity;
                    cartItem.updatedAt = new Date();
                }
            });

            return true;
        } catch (error) {
            console.error("Error updating quantity:", error);
            return false;
        }
    }, [realm, userEmail, removeFromCart]);

    // Clear entire cart
    const clearCart = useCallback(() => {
        try {
            realm.write(() => {
                const userCartItems = realm.objects(Cart).filtered('userEmail == $0', userEmail);
                realm.delete(userCartItems);
            });

            console.log("Cart cleared successfully!");
            return true;
        } catch (error) {
            console.error("Error clearing cart:", error);
            return false;
        }
    }, [realm, userEmail]);

    // Get total items count
    const getTotalItems = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    // Get total price
    const getTotalPrice = useCallback(() => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace('$', '')) || 0;
            return total + (price * item.quantity);
        }, 0);
    }, [cartItems]);

    // Check if product is in cart
    const isInCart = useCallback((productId: string) => {
        return cartItems.some(item => item.productId === productId);
    }, [cartItems]);

    // Get quantity for a specific product
    const getProductQuantity = useCallback((productId: string) => {
        const cartItem = cartItems.find(item => item.productId === productId);
        return cartItem ? cartItem.quantity : 0;
    }, [cartItems]);

    return {
        cartItems: Array.from(cartItems), // Convert Realm results to array
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getProductQuantity,
    };
};