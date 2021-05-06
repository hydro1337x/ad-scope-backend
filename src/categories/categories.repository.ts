import { EntityRepository, Repository } from 'typeorm'
import { Category } from './entities/category.entity'
import { CreateCategoryDto } from './dto/create-category.dto'
import { Image } from '../files/entities/image.entity'

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  createCategory(createCategoryDto: CreateCategoryDto, image: Image): Category {
    const { title, description } = createCategoryDto
    const category = new Category()
    category.title = title
    category.description = description
    category.media = image

    return category
  }
}
