import {
  HttpException,
  HttpStatus,
  Injectable,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
// import { MailService } from '../mail/mail.service';
import { uid, suid } from 'rand-token';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    // private mailService: MailService,
  ) {}

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        `The user with such ${userDto.email} email is already exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const activationLink = uuid.v4();
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userDto.password, salt);
    const user = await this.userService.create({
      ...userDto,
      password: hashPassword,
    });
    // await this.mailService.sendUserConfirmation(
    //   user,
    //   `$http://localhost:5000/api/activate/${activationLink}`,
    // );
    const tokens = await this.generateToken(user);
    return { ...tokens, user };
  }

  async login(userDto) {
    const user = await this.validateUser(userDto);
    const currentUser = await this.userService.create(user);
    const tokens = await this.generateToken(currentUser);
    return { ...tokens, user: currentUser };
  }

  async logout(userDto) {
    console.log('logout user');
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const userData = await this.validateRefreshToken(refreshToken);
    // const isTokenInDB = await tokenService.findToken(refreshToken);
    // if (!isTokenInDB || !userData) {
    //   throw ApiError.UnauthorizedError();
    // }
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
    expirydate.setDate(expirydate.getDate() + 6);
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
    if (user ) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'User with such mail not found',
    });
  }

  async validateAccessToken(token) {
    try {
      const userData = this.jwtService.verify(token, );
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


  // async uploadAvatar(req, res) {
  //   try {
  //     console.log(req.file);
  //     if(req.file){
  //       res.json({path:req.file.filename})
  //     }
  //
  //   } catch (err) {
  //     sendErrorResponse(res, err)
  //
  //   }
  // }

  async updateUser(userData) {
    try {
      let hashPassword;
      let update;
      if(userData.password){
        hashPassword = await bcrypt.hash(userData.password, 10);
      }
       update = {id:userData.id,name:userData.name, email: userData.email};

      if(hashPassword){
        update={...update,password: hashPassword}
      }
      const user = await this.userService.getUserByIdAndUpdate(update);
      if (!user) {
        throw new HttpException("Not Found",404)
      }

      const userDto = await this.userService.create(user);
      const tokens = await this.generateToken(user);
      return {...tokens, user: userDto};
     // console.log(`Update user with ${id},name:${name},email: ${email} and password:${password}`);
    }
    catch (e) {
      throw new HttpException("Not Found",404)
    }
  }
}
