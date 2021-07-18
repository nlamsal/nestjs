import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  //   @Type(() => Number) // This is not required when the transformerOptions enableImplicitConversion is set to true in main.ts file
  limit: number;

  @IsOptional()
  @IsPositive()
  //   @Type(() => Number) // This is not required when the transformerOptions enableImplicitConversion is set to true in main.ts file
  offset: number;
}
