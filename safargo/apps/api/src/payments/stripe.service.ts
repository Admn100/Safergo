import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'

@Injectable()
export class StripeService {
  private stripe: Stripe

  constructor(private config: ConfigService) {
    this.stripe = new Stripe(this.config.get('PAYMENT_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    })
  }

  async createPaymentIntent(params: {
    amount: number
    currency: string
    customerId?: string
    metadata?: Record<string, string>
    description?: string
  }) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency.toLowerCase(),
      customer: params.customerId,
      capture_method: 'manual', // Important for escrow!
      metadata: params.metadata,
      description: params.description,
      statement_descriptor: 'SAFARGO TRAJET',
    })
  }

  async capturePaymentIntent(paymentIntentId: string) {
    return this.stripe.paymentIntents.capture(paymentIntentId)
  }

  async cancelPaymentIntent(paymentIntentId: string) {
    return this.stripe.paymentIntents.cancel(paymentIntentId, {
      cancellation_reason: 'requested_by_customer',
    })
  }

  async createRefund(paymentIntentId: string, amount: number, metadata?: Record<string, any>) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100),
      reason: 'requested_by_customer',
      metadata,
    })
  }

  async createCustomer(params: {
    email: string
    name: string
    phone?: string
    metadata?: Record<string, string>
  }) {
    return this.stripe.customers.create(params)
  }

  async retrievePaymentIntent(paymentIntentId: string) {
    return this.stripe.paymentIntents.retrieve(paymentIntentId)
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.config.get('PAYMENT_WEBHOOK_SECRET')
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  }
}