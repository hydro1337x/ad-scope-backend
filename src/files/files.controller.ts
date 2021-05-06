import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FilesService } from './files.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('upload')
export class FilesController {
  constructor(private readonly uploadService: FilesService) {}
  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // public upload(@UploadedFile() file: Express.Multer.File): Promise<string> {
  //   return this.uploadService.uploadImage(file)
  // }
}
