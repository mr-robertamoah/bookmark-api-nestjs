import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private service: BookmarkService) {}

  @Get('/:id')
  async getBookmark(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return await this.service.getBookmark(user.id, bookmarkId);
  }

  @Get()
  async getBookmarks(@GetUser() user: User) {
    return await this.service.getBookmarks(user.id);
  }

  @Post()
  async createBookmark(@GetUser() user: User, @Body() dto: CreateBookmarkDTO) {
    return await this.service.createBookmark(user.id, dto);
  }

  @HttpCode(201)
  @Patch('/:id')
  async editBookmark(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @Body() dto: EditBookmarkDTO,
  ) {
    return await this.service.editBookmark(
      { userId: user.id, bookmarkId },
      dto,
    );
  }

  @HttpCode(204)
  @Delete('/:id')
  async deleteBookmark(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) bookmarkId: number,
  ) {
    return await this.service.deleteBookmark(user.id, bookmarkId);
  }
}
