import { EntityRepository, Repository } from 'typeorm'
import { Category } from './entities/category.entity'
import { CategoryRequestDto } from './dto/category-request.dto'
import { Image } from '../files/entities/image.entity'

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  createCategory(
    createCategoryDto: CategoryRequestDto,
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
