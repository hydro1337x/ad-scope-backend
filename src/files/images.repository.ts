import { EntityRepository, Repository } from 'typeorm'
import { Image } from './entities/image.entity'
import { CreateImageDto } from './dto/create-image.dto'

@EntityRepository(Image)
export class ImagesRepository extends Repository<Image> {
  createImage(createImageDto: CreateImageDto): Image {
    const { name, url } = createImageDto
    const image = new Image()
    image.name = name
    image.url = url

    return image
  }
}
