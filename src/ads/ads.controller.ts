import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateAdRequestDto } from './dto/create-ad-request.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { AdsService } from './ads.service'
import { UserJwtAuthGuard } from '../auth/guards/user-jwt-auth-guard'
import { AdResponseDto } from './dto/ad-response.dto'

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UseGuards(UserJwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  createAd(
    @Body() createAdRequestDto: CreateAdRequestDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<AdResponseDto> {
    return this.adsService.createAd(createAdRequestDto, file)
  }
}
