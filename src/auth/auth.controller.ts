import {
  Body,
  Controller,
  Get,
  Post, Put,
  Req,
  Res,
  UnauthorizedException, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { User } from '../users/schemas/user.schemas';
import { LoginUserDto } from '../users/dto/login-user-dto';
const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;


@ApiTags("auth")
@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiResponse({
    status:200,
    description:"user login successfully"
  })
  @ApiBody({type:LoginUserDto})
  async login(
    @Req()  request:Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const userData = await this.authService.login(request.body);
      response.cookie('refreshToken', userData.refreshToken);
      return userData;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  @Post('/registration')
  @ApiResponse({
    status:200,
    description:"new user is registered"
  })
  @ApiBody({type:CreateUserDto})
  async registration(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const userData = await this.authService.registration(userDto);
      response.cookie('refreshToken', userData.refreshToken);
      return userData;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
  @Post('/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { refreshToken } = request.cookies;
      const token = await this.authService.logout(refreshToken);
      response.clearCookie('refreshToken');
      return refreshToken;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  @Get('/refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { refreshToken } = request.cookies;
      const userData = await this.authService.refresh(refreshToken);
      response.cookie('refreshToken', userData.refreshToken, {
        maxAge: MONTH_IN_MS,
        httpOnly: true,
      });
      return userData;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Put('/update')
  @ApiResponse({
    status:200,
    description:"user update",
    type:User
  })
  @ApiBody({type:UpdateUserDto})
  async updateUser(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ){
    try{
      const { refreshToken } = request.cookies;
      const userData = await this.authService.updateUser(request.body);
      response.cookie('refreshToken', userData.refreshToken,
        {maxAge: MONTH_IN_MS, httpOnly: true});
      return userData
    }
    catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor("photo",{
      dest:"./uploads",
    })
  )
  uploadSingle(@UploadedFile() file){
    console.log(file)
  }

}
