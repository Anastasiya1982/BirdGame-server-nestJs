import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './schemas/user.schemas';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiResponse({
    status:200,
    description:"get all users  in dataBase",
    type:[User]
  })
  getAll() {
    return this.userService.getAll();
  }

  @Post()
  @ApiResponse({
    status:200,
    description:"create user"
  })
  @ApiBody({type:CreateUserDto})
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.userService.create(CreateUserDto);
  }
  @Delete(':id')
  @ApiResponse({
    status:200,
    description:"delete user by id"
  })
  @ApiResponse({
    status:404,
    description:"not found"
  })
  remove(@Param('id') id:string) {
    return 'remove ' + id;
  }

}
