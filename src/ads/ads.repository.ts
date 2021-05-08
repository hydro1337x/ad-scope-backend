import { EntityRepository, Repository } from 'typeorm'
import { Ad } from './entities/ad.entity'
import { Image } from '../files/entities/image.entity'
import { Category } from '../categories/entities/category.entity'
import { CreateAdRequestDto } from './dto/create-ad-request.dto'

@EntityRepository(Ad)
export class AdsRepository extends Repository<Ad> {
  createAd(
    createAdRequestDto: CreateAdRequestDto,
    category: Category,
    image: Image
  ): Ad {
    const { title, description, price } = createAdRequestDto
    const ad = new Ad()
    ad.title = title
    ad.description = description
    ad.price = price
    ad.category = category
    ad.media = image

    return ad
  }
}
