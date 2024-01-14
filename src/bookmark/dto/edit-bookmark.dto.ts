import { IsOptional, IsString } from 'class-validator';

export class EditBookmarkDTO {
  @IsString()
  @IsOptional()
  link: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
