import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  metadata: any;
}

export class PaymentProcessor {
  static async createStripePayment(data: PaymentData) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || 'usd',
        description: data.description,
        metadata: data.metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async createRazorpayOrder(data: PaymentData) {
    try {
      const order = await razorpay.orders.create({
        amount: Math.round(data.amount * 100), // Convert to paise
        currency: data.currency || 'INR',
        notes: data.metadata,
      });

      return {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  static async releasePayment(paymentId: string, method: 'stripe' | 'razorpay') {
    try {
      if (method === 'stripe') {
        await stripe.paymentIntents.confirm(paymentId);
        return { success: true, message: 'Payment released successfully' };
      } else if (method === 'razorpay') {
        // Razorpay doesn't have a release mechanism, payments are auto-captured
        return { success: true, message: 'Payment processed successfully' };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
