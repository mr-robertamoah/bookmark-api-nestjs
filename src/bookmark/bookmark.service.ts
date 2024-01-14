import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmark(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }

  async getBookmarks(userId: number) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  async createBookmark(userId: number, dto: CreateBookmarkDTO) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  async editBookmark(
    data: { userId: number; bookmarkId: number },
    dto: EditBookmarkDTO,
  ) {
    const bookmark = await this.prisma.bookmark.update({
      where: {
        userId: data.userId,
        id: data.bookmarkId,
      },
      data: {
        ...dto,
      },
    });

    return bookmark;
  }

  async deleteBookmark(userId: number, bookmarkId: number) {
    return await this.prisma.bookmark.deleteMany({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }
}
