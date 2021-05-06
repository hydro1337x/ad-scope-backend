import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './global/filters/http-exception-filter'
import { TransformInterceptor } from './global/interceptors/transform-interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor())

  await app.listen(3000)
}

bootstrap()
