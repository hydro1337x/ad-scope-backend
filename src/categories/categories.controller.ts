import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth-guard'
import { Category } from './entities/category.entity'
import { CategoriesService } from './categories.service'

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(ValidationPipe)
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto)
  }

  @Get()
  getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories()
  }

  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoriesService.getCategory(id)
  }
}
