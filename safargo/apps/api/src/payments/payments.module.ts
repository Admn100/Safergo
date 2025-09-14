import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { StripeService } from './stripe.service'
import { WebhookService } from './webhook.service'
import { CommonModule } from '../common/common.module'

@Module({
  imports: [CommonModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService, WebhookService],
  exports: [PaymentsService],
})
export class PaymentsModule {}