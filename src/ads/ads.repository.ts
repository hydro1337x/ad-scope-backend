import { EntityRepository, Repository } from 'typeorm'
import { Ad } from './entities/ad.entity'
import { Image } from '../files/entities/image.entity'
import { Category } from '../categories/entities/category.entity'
import { CreateAdRequestDto } from './dto/create-ad-request.dto'
import { FilterAdRequestDto } from './dto/filter-ad-request.dto'
import { AdOrderType } from './enum/ad-order-type.enum'
import { User } from '../users/entities/user.entity'

@EntityRepository(Ad)
export class AdsRepository extends Repository<Ad> {
  createAd(
    createAdRequestDto: CreateAdRequestDto,
    category: Category,
    user: User,
    image: Image
  ): Ad {
    const { title, description, price } = createAdRequestDto
    const ad = new Ad()
    ad.title = title
    ad.description = description
    ad.price = price
    ad.category = category
    ad.user = user
    ad.media = image

    return ad
  }

  async getAds(filterAdRequestDto: FilterAdRequestDto): Promise<Ad[]> {
    const { search, order, categoryId, userId } = filterAdRequestDto

    const query = this.createQueryBuilder('ad')

    if (categoryId) {
      query.where('ad.categoryId = :categoryId', { categoryId: categoryId })
    }

    if (userId) {
      query.where('ad.userId = :userId', { userId: userId })
    }

    if (search) {
      query.andWhere('(ad.title LIKE :search OR ad.description LIKE :search)', {
        search: `%${search}%`
      })
    }

    if (order) {
      switch (order) {
        case AdOrderType.DATE_ASC:
          query.orderBy('ad.createdAt', 'ASC')
          break
        case AdOrderType.DATE_DESC:
          query.orderBy('ad.createdAt', 'DESC')
          break
        case AdOrderType.PRICE_LOW_HIGH:
          query.orderBy('ad.price', 'ASC')
          break
        case AdOrderType.PRICE_HIGH_LOW:
          query.orderBy('ad.price', 'DESC')
          break
      }
    }

    const ads = await query
      .leftJoinAndSelect('ad.media', 'image')
      .leftJoinAndSelect('ad.category', 'category')
      .leftJoinAndSelect('ad.user', 'user')
      .getMany()

    return ads
  }
}
