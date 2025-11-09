export interface OrderItem {
  product: string;
  name: string;
  image: string;
  unit: string;
  amount: number;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  email?: string;  // For order updates and guest tracking
  phone?: string;  // For delivery contact
}

export interface Order {
  _id: string;
  user: string;  // Firebase UID or "guest_default"
  userEmail: string;  // Required for all orders
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'stripe' | 'cash_on_delivery';
  paymentStatus: 'unpaid' | 'paid';
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

