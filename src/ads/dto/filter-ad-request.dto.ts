import { AdOrderType } from '../enum/ad-order-type.enum'
import { IsIn, IsInt, IsNotEmpty, IsOptional } from 'class-validator'
import { ParseIntPipe, UsePipes } from '@nestjs/common'
import { Transform } from 'class-transformer'

export class FilterAdRequestDto {
  @IsOptional()
  @IsIn([
    AdOrderType.DATE_ASC,
    AdOrderType.DATE_DESC,
    AdOrderType.PRICE_LOW_HIGH,
    AdOrderType.PRICE_HIGH_LOW
  ])
  order: AdOrderType

  @IsOptional()
  @IsNotEmpty()
  search: string

  @IsOptional()
  @IsInt()
  @Transform((value) => Number.parseInt(value.value))
  categoryId: number

  @IsOptional()
  @IsInt()
  @Transform((value) => Number.parseInt(value.value))
  userId: number
}
