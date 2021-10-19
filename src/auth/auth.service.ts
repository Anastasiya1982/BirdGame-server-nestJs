import {
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { suid } from 'rand-token';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserService } from '../users/user.service';

let NUM_OF_DAY=6;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        `The user with such ${userDto.email} email is already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userDto.password, salt);
    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });    
    const tokens = await this.generateToken(user);
    return { ...tokens, user };
  }

  async login(userDto) {
    const user = await this.validateUser(userDto);
    const currentUser = await this.userService.create({ ...user });
    const tokens = await this.generateToken(currentUser);
    return { ...tokens, user: currentUser };
  }

  async logout(userDto: CreateUserDto) {}

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const userData = await this.validateRefreshToken(refreshToken);
    const user = await this.userService.getById(userData.id);
    const userDto = await this.userService.create(user);
    const tokens = await this.generateToken(user);
    return { ...tokens, user: userDto };
  }

  private async generateToken(user) {
    const payload = { email: user.email, id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(user.id),
    };
  }

  async generateRefreshToken(user): Promise<string> {
    const refreshToken = suid(16);
    const expirydate = new Date();
    expirydate.setDate(expirydate.getDate()+ NUM_OF_DAY );
    await this.userService.saveorupdateRefreshToke(
      user.id,
      refreshToken,
      expirydate,
    );
    return refreshToken;
  }

  async activate(activationLink) {
    try {
      const user = await this.userService.getUserByLink(activationLink);
      if (!user) {
        throw new HttpException(
          'There is no user with such link',
          HttpStatus.BAD_REQUEST,
        );
      }
      user.isActivated = true;
      await user.save();
    } catch (e) {
      console.log(e);
    }
  }

  private async validateUser(userDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const isPasswordEqual = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'User with such mail not found',
    });
  }

  async validateAccessToken(token) {
    try {
      const userData = this.jwtService.verify(token);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async validateRefreshToken(token) {
    try {
      const userData = this.jwtService.verify(token);
      return userData;
    } catch (e) {
      return null;
    }
  }  

  async updateUser(userData) {
    try {
      let hashPassword;
      let update;
      if (userData.password) {
        hashPassword = await bcrypt.hash(userData.password, 10);
      }
      update = { id: userData.id, name: userData.name, email: userData.email };

      if (hashPassword) {
        update = { ...update, password: hashPassword };
      }
      const user = await this.userService.getUserByIdAndUpdate(update);
      if (!user) {
        throw new HttpException('Not Found', 404);
      }
      const tokens = await this.generateToken(user);
      return { ...tokens, user: user };    
    } catch (e) {
      throw new HttpException('Not Found', 404);
    }
  }
}
