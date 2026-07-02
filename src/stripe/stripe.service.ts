import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {
  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<{ clientSecret: string }> {
    console.log(`[STRIPE STUB] createPaymentIntent for ${amount} ${currency}`);
    // TODO Phase 2: Call Stripe SDK
    throw new Error(
      'Stripe integration not yet enabled. Enable PHASES.STRIPE_PAYMENTS in the frontend and configure Stripe keys.',
    );
  }
}
