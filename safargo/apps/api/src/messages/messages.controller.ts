import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { MessagesService } from './messages.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Lister mes conversations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste des conversations' })
  async getConversations(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.getConversations(
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    )
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Créer ou récupérer une conversation' })
  @ApiResponse({ status: 201, description: 'Conversation créée ou récupérée' })
  async createConversation(
    @Request() req,
    @Body() body: { userId: string; bookingId?: string },
  ) {
    return this.messagesService.getOrCreateConversation(
      req.user.id,
      body.userId,
      body.bookingId,
    )
  }

  @Get('conversations/:conversationId')
  @ApiOperation({ summary: 'Obtenir les messages d\'une conversation' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Messages de la conversation' })
  async getMessages(
    @Param('conversationId') conversationId: string,
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.getMessages(
      conversationId,
      req.user.id,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    )
  }

  @Post('conversations/:conversationId')
  @ApiOperation({ summary: 'Envoyer un message' })
  @ApiResponse({ status: 201, description: 'Message envoyé' })
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Request() req,
    @Body() body: { text: string },
  ) {
    return this.messagesService.sendMessage(
      conversationId,
      req.user.id,
      body.text,
    )
  }

  @Post('messages/:messageId/flag')
  @ApiOperation({ summary: 'Signaler un message' })
  @ApiResponse({ status: 200, description: 'Message signalé' })
  async flagMessage(
    @Param('messageId') messageId: string,
    @Request() req,
  ) {
    return this.messagesService.flagMessage(messageId, req.user.id)
  }
}