import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schemas';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  private users = [];

  async getAll() {
    return this.userModel.find().exec();
  }

  async getById(id: string) {
    return await this.users.find((p) => p.id === id);
  }

  async create(userDto: CreateUserDto) {
    const newUser = await this.userModel.create(userDto);
    return await newUser.save();
  }
  async saveorupdateRefreshToke(id, refreshToken: string, refreshtokenexpires) {
    await this.userModel.updateOne(id, {
      refreshtoken: refreshToken,
      refreshtokenexpires,
    });
  }
  async getUserByEmail(email) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async getUserByLink(link: string) {
    const user = await this.userModel.findOne({ link });
    return user;
  }
  async getUserByIdAndUpdate(userDto) {
    const option = { new: true };
    const user = await this.userModel.findOneAndUpdate(userDto, option).exec();
    return user;
  }

}
