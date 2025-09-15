import { Injectable, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as AWS from 'aws-sdk'
import * as sharp from 'sharp'

@Injectable()
export class UploadService {
  private s3: AWS.S3

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('STORAGE_KEY'),
      secretAccessKey: this.configService.get('STORAGE_SECRET'),
      endpoint: this.configService.get('STORAGE_ENDPOINT'),
      region: this.configService.get('STORAGE_REGION'),
    })
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni')
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non autorisé')
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new BadRequestException('Fichier trop volumineux (max 5MB)')
    }

    // Process image with Sharp
    const processedImage = await sharp(file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const filename = `${folder}/${timestamp}-${randomString}.jpg`

    // Upload to S3
    const uploadParams = {
      Bucket: this.configService.get('STORAGE_BUCKET'),
      Key: filename,
      Body: processedImage,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    }

    try {
      const result = await this.s3.upload(uploadParams).promise()
      return result.Location
    } catch (error) {
      throw new BadRequestException('Erreur lors de l\'upload')
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads'
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni')
    }

    if (files.length > 10) {
      throw new BadRequestException('Trop de fichiers (max 10)')
    }

    const uploadPromises = files.map(file => this.uploadFile(file, folder))
    return Promise.all(uploadPromises)
  }

  async deleteFile(url: string): Promise<void> {
    try {
      const key = url.split('/').pop()
      if (!key) return

      await this.s3.deleteObject({
        Bucket: this.configService.get('STORAGE_BUCKET'),
        Key: key,
      }).promise()
    } catch (error) {
      // Log error but don't throw to avoid breaking the flow
      console.error('Error deleting file:', error)
    }
  }
}