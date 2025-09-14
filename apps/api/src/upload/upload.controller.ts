import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  UploadedFiles,
  UseGuards,
  BadRequestException 
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger'
import { UploadService } from './upload.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Uploader un fichier' })
  @ApiResponse({ status: 201, description: 'Fichier uploadé avec succès' })
  @ApiConsumes('multipart/form-data')
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni')
    }
    
    const url = await this.uploadService.uploadFile(file)
    return { url }
  }

  @Post('multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Uploader plusieurs fichiers' })
  @ApiResponse({ status: 201, description: 'Fichiers uploadés avec succès' })
  @ApiConsumes('multipart/form-data')
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni')
    }
    
    const urls = await this.uploadService.uploadMultipleFiles(files)
    return { urls }
  }
}