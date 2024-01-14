import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDTO } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch()
  @HttpCode(201)
  editUser(@GetUser() user: User, @Body() dto: EditUserDTO) {
    return this.service.editUser(user.id, dto);
  }
}
