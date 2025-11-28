import auth from '@react-native-firebase/auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function getAuthToken(): Promise<string | null> {
  try {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.log('No authenticated user - will create guest order');
      return null;
    }
    // Force refresh token to ensure it's valid
    const token = await currentUser.getIdToken(true);
    console.log('Got auth token for user:', currentUser.email);
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  email?: string; // Optional email for guest orders
  phone?: string; // Optional phone number
}

export interface CreateOrderRequest {
  user: string;
  userEmail: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'stripe' | 'cash_on_delivery';
}

export interface OrderItemResponse {
  product: string;
  name: string;
  image: string;
  unit: string;
  amount: number;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItemResponse[];
  totalAmount: number;
  paymentMethod: 'stripe' | 'cash_on_delivery';
  paymentStatus: 'unpaid' | 'paid' | 'failed';
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PaymentVerificationResponse {
  paymentStatus: string;
  stripeStatus?: string;
}

// Order APIs
export const orderApi = {
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const token = await getAuthToken();

    // Build headers - auth is optional per API docs
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });

    console.log('Response status:', response.status);

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 500));
      throw new Error(`Server returned HTML instead of JSON. Check if backend is running at ${API_BASE_URL}`);
    }

    // Get the response body
    const responseData = await response.json();

    if (!response.ok) {
      console.error('Order creation failed:', responseData);
      throw new Error(responseData.message || `Failed to create order (Status: ${response.status})`);
    }

    console.log('Order created successfully:', responseData._id);
    return responseData;
  },

  getMyOrders: async (): Promise<Order[]> => {
    // Get current user (authenticated or from last order)
    const currentUser = auth().currentUser;

    if (!currentUser || !currentUser.email) {
      throw new Error('Please log in to view your orders');
    }

    const email = currentUser.email;
    console.log('Fetching orders for email:', email);

    const response = await fetch(`${API_BASE_URL}/api/orders/my-orders/${email}`, {
      method: 'GET',
    });

    console.log('My orders response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch orders:', errorText);
      throw new Error(`Failed to fetch orders (Status: ${response.status})`);
    }

    const orders = await response.json();
    console.log('Fetched orders count:', orders.length);
    return orders;
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    const token = await getAuthToken();

    // Auth is optional for getting order by ID (guest orders)
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch order' }));
      throw new Error(error.message || 'Failed to fetch order');
    }

    return await response.json();
  },
};

// Payment APIs
export const paymentApi = {
  createPaymentIntent: async (orderId: string): Promise<PaymentIntentResponse> => {
    const token = await getAuthToken();

    // Auth is optional for payment (guest orders)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('Creating payment intent for order:', orderId);

    const response = await fetch(`${API_BASE_URL}/api/payment/create-payment-intent`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ orderId }),
    });

    console.log('Payment intent response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create payment intent' }));
      console.error('Payment intent error:', error);

      // Handle specific Stripe errors
      if (error.message?.includes('amount_too_small') || error.message?.includes('50 cents')) {
        throw new Error('Order total must be at least ₹50 for card payments. Please use Cash on Delivery for smaller orders.');
      }

      throw new Error(error.message || 'Failed to create payment intent');
    }

    const result = await response.json();
    console.log('Payment intent created successfully');
    return result;
  },

  verifyPayment: async (orderId: string): Promise<PaymentVerificationResponse> => {
    const token = await getAuthToken();

    // Auth is optional for verification (guest orders)
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/payment/verify/${orderId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to verify payment' }));
      throw new Error(error.message || 'Failed to verify payment');
    }

    return await response.json();
  },
};

