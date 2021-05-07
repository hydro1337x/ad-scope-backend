import { EntityRepository, Repository } from 'typeorm'
import { Image } from './entities/image.entity'
import { ImageRequestDto } from './dto/image-request.dto'

@EntityRepository(Image)
export class ImagesRepository extends Repository<Image> {
  createImage(createImageDto: ImageRequestDto): Image {
    const { name, url } = createImageDto
    const image = new Image()
    image.name = name
    image.url = url

    return image
  }
}
