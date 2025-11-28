// API Configuration
// Uses environment variable or fallback to Render URL
export const API_BASE_URL = 
  process.env.EXPO_PUBLIC_API_URL || 
  'https://woocommerce-1dee.onrender.com';

export const API_ENDPOINTS = {
  products: '/api/products',
  categories: '/api/products/category',
  orders: '/api/orders',
  payment: '/api/payment',
};

