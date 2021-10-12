import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id) {
    return this.userService.getById(id);
  }

  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.userService.create(CreateUserDto);
  }
  @Delete(':id')
  remove(@Param('id') id) {
    return 'remove ' + id;
  }
  @Put()
  update(@Body() updateUserDto: UpdateUserDto, @Param('id') id): string {
    return `updated User with id: ${id}`;
  }
}
