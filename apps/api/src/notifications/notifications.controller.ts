import { 
  Controller, 
  Get, 
  Patch, 
  Param, 
  UseGuards 
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { NotificationsService } from './notifications.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { User } from '@prisma/client'

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les notifications de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des notifications' })
  async getUserNotifications(@CurrentUser() user: User) {
    return this.notificationsService.getUserNotifications(user.id)
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  @ApiResponse({ status: 200, description: 'Notification marquée comme lue' })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    return this.notificationsService.markAsRead(id, user.id)
  }
}