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
import { CreateCategoryRequestDto } from './dto/create-category-request.dto'
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth-guard'
import { CategoriesService } from './categories.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { CategoryResponseDto } from './dto/category-response.dto'
import { UpdateCategoryRequestDto } from './dto/update-category-request.dto'
import { FilterCategoryRequestDto } from './dto/filter-category-request.dto'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader } from '@nestjs/swagger'

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        image: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  /**
   * @documentation
   */
  @Post('create')
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  createCategory(
    @Body() createCategoryDto: CreateCategoryRequestDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.createCategory(createCategoryDto, file)
  }

  @Get()
  getCategories(
    @Query(ValidationPipe) filterCategoryRequestDto: FilterCategoryRequestDto
  ): Promise<CategoryResponseDto[]> {
    return this.categoriesService.getCategories(filterCategoryRequestDto)
  }

  @Get(':id')
  getCategory(
    @Param('id', ParseIntPipe) id: number
  ): Promise<CategoryResponseDto> {
    return this.categoriesService.getCategory(id)
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        image: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  /**
   * @documentation
   */
  @Patch(':id/update')
  @UseGuards(AdminJwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
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

  /**
   */
  @ApiBearerAuth()
  /**
   */
  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id)
  }
}
