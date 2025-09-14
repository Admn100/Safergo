import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from 'nestjs-prisma'

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit

    const conversations = await this.prisma.conversationUser.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
            users: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    photo: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: offset,
      take: limit,
    })

    return {
      data: conversations.map((cu) => ({
        id: cu.conversation.id,
        lastMessage: cu.conversation.messages[0],
        participants: cu.conversation.users
          .filter((u) => u.userId !== userId)
          .map((u) => u.user),
        lastReadAt: cu.lastReadAt,
        unread: cu.conversation.messages.some(
          (m) => m.createdAt > (cu.lastReadAt || new Date(0)),
        ),
      })),
      meta: {
        page,
        limit,
      },
    }
  }

  async getOrCreateConversation(userId: string, otherUserId: string, bookingId?: string) {
    // Check if conversation already exists between these users
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        users: {
          every: {
            userId: { in: [userId, otherUserId] },
          },
        },
      },
      include: {
        users: true,
      },
    })

    if (existingConversation && existingConversation.users.length === 2) {
      return existingConversation
    }

    // Verify booking relationship if provided
    if (bookingId) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          trip: {
            include: { driver: true },
          },
        },
      })

      if (!booking) {
        throw new NotFoundException('Réservation non trouvée')
      }

      // Check if users are part of the booking
      const isPassenger = booking.userId === userId || booking.userId === otherUserId
      const isDriver = booking.trip.driver.userId === userId || booking.trip.driver.userId === otherUserId

      if (!isPassenger || !isDriver) {
        throw new ForbiddenException('Conversation non autorisée')
      }
    }

    // Create new conversation
    const conversation = await this.prisma.conversation.create({
      data: {
        users: {
          create: [
            { userId },
            { userId: otherUserId },
          ],
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                photo: true,
              },
            },
          },
        },
      },
    })

    return conversation
  }

  async getMessages(conversationId: string, userId: string, page: number = 1, limit: number = 50) {
    // Check if user is part of the conversation
    const conversationUser = await this.prisma.conversationUser.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    })

    if (!conversationUser) {
      throw new ForbiddenException('Accès non autorisé à cette conversation')
    }

    const offset = (page - 1) * limit

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              photo: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.message.count({
        where: { conversationId },
      }),
    ])

    // Update last read
    await this.prisma.conversationUser.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: {
        lastReadAt: new Date(),
      },
    })

    return {
      data: messages.reverse(), // Return in chronological order
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    }
  }

  async sendMessage(conversationId: string, userId: string, text: string) {
    // Check if user is part of the conversation
    const conversationUser = await this.prisma.conversationUser.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    })

    if (!conversationUser) {
      throw new ForbiddenException('Accès non autorisé à cette conversation')
    }

    // Check for sensitive information and flag if needed
    const flagged = this.checkForSensitiveInfo(text)

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: userId,
        text,
        flagged,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
      },
    })

    // Update conversation timestamp
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    // Send notification to other participants
    const otherUsers = await this.prisma.conversationUser.findMany({
      where: {
        conversationId,
        userId: { not: userId },
      },
    })

    for (const user of otherUsers) {
      await this.prisma.notification.create({
        data: {
          userId: user.userId,
          channel: 'PUSH',
          template: 'new_message',
          payload: {
            conversationId,
            senderName: message.sender.name,
            messagePreview: text.substring(0, 100),
          },
          status: 'PENDING',
        },
      })
    }

    return message
  }

  async flagMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        conversation: {
          include: {
            users: true,
          },
        },
      },
    })

    if (!message) {
      throw new NotFoundException('Message non trouvé')
    }

    // Check if user is part of the conversation
    const isParticipant = message.conversation.users.some((u) => u.userId === userId)
    if (!isParticipant) {
      throw new ForbiddenException('Accès non autorisé')
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: { flagged: true },
    })

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'message.flag',
        entity: 'Message',
        entityId: messageId,
        meta: {
          conversationId: message.conversationId,
          senderId: message.senderId,
        },
      },
    })

    // Notify admins
    await this.prisma.notification.create({
      data: {
        userId: 'admin',
        channel: 'EMAIL',
        template: 'message_flagged',
        payload: {
          messageId,
          reporterId: userId,
          messageText: message.text,
        },
        status: 'PENDING',
      },
    })

    return updatedMessage
  }

  private checkForSensitiveInfo(text: string): boolean {
    // Basic patterns for phone numbers and emails
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const urlPattern = /(https?:\/\/[^\s]+)/g

    // Check for patterns
    if (phonePattern.test(text) || emailPattern.test(text) || urlPattern.test(text)) {
      return true
    }

    // Check for keywords that might indicate bypassing the platform
    const suspiciousKeywords = [
      'whatsapp',
      'telegram',
      'viber',
      'cash',
      'espèces',
      'direct',
      'hors plateforme',
      'sans safargo',
    ]

    const textLower = text.toLowerCase()
    return suspiciousKeywords.some((keyword) => textLower.includes(keyword))
  }
}