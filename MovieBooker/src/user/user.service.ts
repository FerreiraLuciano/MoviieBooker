import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../types/user';
import { UserDto } from './dto/user.dto';
import { signInDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Payload } from '../types/payload.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(userDto: UserDto) {
    const { email } = userDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    try {
      const createdUser = new this.userModel(userDto);
      await createdUser.save();
      return this.sanitzeUser(createdUser);
    } catch (err) {}
  }
  sanitzeUser(user: User) {
    try {
      const sanitized = user.toObject();

      delete sanitized['password'];
      return sanitized;
    } catch (err) {
      throw err;
    }
  }

  async findByLogin(signInDto: signInDto) {
    const { email, password } = signInDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (await bcrypt.compare(password, user.password)) {
      return this.sanitzeUser(user);
    } else {
      throw new ForbiddenException('Invalid credentials');
    }
  }
  async findByPayload(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }
}
