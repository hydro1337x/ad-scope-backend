import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException
} from '@nestjs/common'
import * as AWS from 'aws-sdk'
import { S3 } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { ImageMimeType } from './enums/image-type.enum'
import { CreateImageRequestDto } from './dto/create-image-request.dto'
import { Image } from './entities/image.entity'
import { ImagesRepository } from './images.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { plainToClass } from 'class-transformer'
import { AuthResponseDto } from '../auth/dto/auth-response.dto'
import { CreateImageResponseDto } from './dto/create-image-response.dto'

@Injectable()
export class FilesService {
  private s3: S3

  constructor(
    @InjectRepository(ImagesRepository)
    private imagesRepository: ImagesRepository,
    private configService: ConfigService
  ) {
    this.s3 = new AWS.S3()
    AWS.config.update({
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')
    })
  }

  async uploadImage(file: Express.Multer.File): Promise<Image> {
    if (!Object.values<string>(ImageMimeType).includes(file.mimetype)) {
      throw new UnsupportedMediaTypeException()
    }

    const params = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Body: file.buffer,
      Key: `${uuid()}-${file.originalname}`,
      ACL: 'public-read'
    }

    const uploadResult = await this.s3.upload(params).promise()

    if (!uploadResult) {
      throw new ConflictException('File upload failed')
    }

    const createImageDto = new CreateImageRequestDto()
    createImageDto.url = uploadResult.Location
    createImageDto.name = uploadResult.Key

    return this.imagesRepository.createImage(createImageDto)
  }

  async deleteRemoteImage(name: string) {
    const deletionParams = {
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: name
    }

    await this.s3.deleteObject(deletionParams).promise()
  }

  async removeLocalImage(image: Image) {
    await this.imagesRepository.remove(image)
  }
}
