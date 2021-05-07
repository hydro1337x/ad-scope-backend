import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CategoryRequestDto } from './dto/category-request.dto'
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth-guard'
import { Category } from './entities/category.entity'
import { CategoriesService } from './categories.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { CategoryResponseDto } from './dto/category-response.dto'

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  createCategory(
    @Body() createCategoryDto: CategoryRequestDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.createCategory(createCategoryDto, file)
  }

  @Get()
  getCategories(): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getCategories()
  }

  @Get(':id')
  getCategory(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.getCategory(id)
  }
}
