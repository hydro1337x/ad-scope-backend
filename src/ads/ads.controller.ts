import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { FilterAdRequestDto } from './dto/filter-ad-request.dto'
import { UpdateAdRequestDto } from './dto/update-ad-request.dto'
import { GetUser } from '../auth/decorators/get-user.decorator'
import { User } from '../users/entities/user.entity'

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UseGuards(UserJwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  createAd(
    @Body(ValidationPipe) createAdRequestDto: CreateAdRequestDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user
  ): Promise<AdResponseDto> {
    return this.adsService.createAd(createAdRequestDto, file, user)
  }

  @Get()
  getAds(
    @Query(ValidationPipe) filterAdRequestDto: FilterAdRequestDto
  ): Promise<AdResponseDto[]> {
    return this.adsService.getAds(filterAdRequestDto)
  }

  @Get(':id')
  getAd(@Param('id', ParseIntPipe) id: number): Promise<AdResponseDto> {
    return this.adsService.getAd(id)
  }

  @Patch(':id')
  @UseGuards(UserJwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor('image'))
  updateAd(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdRequestDto: UpdateAdRequestDto,
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User
  ) {
    return this.adsService.updateAd(id, updateAdRequestDto, file, user)
  }

  @Delete(':id')
  @UseGuards(UserJwtAuthGuard)
  deleteAd(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.adsService.deleteAd(id, user)
  }
}
