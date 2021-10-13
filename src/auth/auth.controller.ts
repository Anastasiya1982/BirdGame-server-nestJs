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
const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    // @Body() userDto: CreateUserDto,
    @Req()  request:Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      console.log("request login" ,request.body)
      const userData = await this.authService.login(request.body);
      response.cookie('refreshToken', userData.refreshToken);
      return userData;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  @Post('/registration')
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
      console.log(refreshToken);
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
  async updateUser(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ){
    try{
      const { refreshToken } = request.cookies;
      console.log(request.body);
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
