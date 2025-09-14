import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationStatus, NotificationChannel } from '@prisma/client'

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async sendNotification(
    userId: string,
    channel: NotificationChannel,
    template: string,
    payload: any
  ) {
    // Create notification record
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        channel,
        template,
        payload,
        status: NotificationStatus.PENDING,
      },
    })

    // TODO: Implement actual sending logic based on channel
    // - SMS via Twilio
    // - Email via SendGrid
    // - Push via FCM/APNs
    // - In-app notifications

    // Update status to sent
    return this.prisma.notification.update({
      where: { id: notification.id },
      data: { status: NotificationStatus.SENT },
    })
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { 
        id: notificationId,
        userId,
      },
      data: { status: NotificationStatus.DELIVERED },
    })
  }
}