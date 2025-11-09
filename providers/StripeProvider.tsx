import { StripeProvider as StripeProviderNative } from '@stripe/stripe-react-native';
import React from 'react';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

interface StripeProviderProps {
  children: React.ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
  // Check if Stripe key is configured
  if (!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY.includes('YOUR_STRIPE')) {
    console.warn(
      '⚠️ Stripe publishable key not configured.',
      'Add EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env file',
      'Using simulation mode for payments.'
    );
    // Return children without Stripe provider in dev mode
    return <>{children}</>;
  }

  console.log('✅ Stripe initialized with key:', STRIPE_PUBLISHABLE_KEY.substring(0, 20) + '...');

  return (
    <StripeProviderNative
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.woocommerceapp" // For Apple Pay (optional)
    >
      {children as React.ReactElement<any>}
    </StripeProviderNative>
  );
}

