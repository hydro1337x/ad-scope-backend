import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateCategoryRequestDto } from './dto/create-category-request.dto'
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth-guard'
import { Category } from './entities/category.entity'
import { CategoriesService } from './categories.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { CreateCategoryResponseDto } from './dto/create-category-response.dto'
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  createCategory(
    @Body() createCategoryDto: CreateCategoryRequestDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<CreateCategoryResponseDto> {
    return this.categoriesService.createCategory(createCategoryDto, file)
  }

  @Get()
  getCategories(): Promise<CreateCategoryResponseDto[]> {
    return this.categoriesService.getCategories()
  }

  @Get(':id')
  getCategory(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CreateCategoryResponseDto> {
    return this.categoriesService.getCategory(id)
  }

  @Patch(':id')
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryRequestDto: UpdateCategoryRequestDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    return this.categoriesService.updateCategory(
      id,
      updateCategoryRequestDto,
      file
    )
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id)
  }
}
