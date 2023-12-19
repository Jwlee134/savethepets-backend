import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { User } from 'src/decorators/user.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMyProfile(@User('id') userId: string) {
    return await this.usersService.getUserById(userId, { isMe: true });
  }

  @Put('me')
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @User('id') userId: string,
  ) {
    return await this.usersService.updateProfile(dto, userId);
  }

  @Patch('me')
  async updatePhoto() {
    return await this.usersService.updatePhoto();
  }

  @Public()
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }
}
