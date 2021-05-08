import { EntityRepository, Repository } from 'typeorm'
import { Category } from './entities/category.entity'
import { CreateCategoryRequestDto } from './dto/create-category-request.dto'
import { Image } from '../files/entities/image.entity'
import { FilterCategoryRequestDto } from './dto/filter-category-request.dto'

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  async getCategories(
    filterCategoryRequestDto: FilterCategoryRequestDto
  ): Promise<Category[]> {
    const { search } = filterCategoryRequestDto
    const query = this.createQueryBuilder('category')
    if (search) {
      query.where(
        '(category.title LIKE :search OR category.description LIKE :search)',
        { search: `%${search}%` }
      )
    }
    const categories = await query
      .leftJoinAndSelect('category.media', 'image')
      .getMany()

    return categories
  }

  createCategory(
    createCategoryDto: CreateCategoryRequestDto,
    image: Image
  ): Category {
    const { title, description } = createCategoryDto
    const category = new Category()
    category.title = title
    category.description = description
    category.media = image

    return category
  }
}
