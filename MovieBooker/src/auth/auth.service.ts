import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { sign } from 'jsonwebtoken';
import { Payload } from '../types/payload.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signPayload(payload: Payload) {
    return sign(payload, 'secret', { expiresIn: '1d' });
  }

  async validatePayload(payload: Payload) {
    return await this.userService.findByPayload(payload);
  }
}

