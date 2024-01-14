import { IsOptional, IsString } from 'class-validator';

export class CreateBookmarkDTO {
  @IsString()
  link: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
