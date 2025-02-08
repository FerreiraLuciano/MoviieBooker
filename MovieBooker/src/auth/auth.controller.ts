import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { signInDto, signUpDto } from './dto/auth.dto';
import { UserService } from '../users/user.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@gmail.com' },
        name: { type: 'string', example: 'john' },
        password: {
          type: 'string',
          example: 'Password1&',
          description:
            'Password must be at least 8 characters long, contain a special character, a capital letter & a number',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({
    status: 400,
    description: 'User already exists, invalid email or password too weak',
  })
  @Post('signup')
  async signUp(@Body() signUpDto: signUpDto) {
    const user = await this.userService.create(signUpDto);
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };
    const token = await this.authService.signPayload(payload);
    return { description: 'User created successfully', token: token };
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'john@gmail.com' },
        password: { type: 'string', example: 'Password1&' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User logged in successfully' })
  @ApiResponse({ status: 403, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('signin')
  async signIn(@Body() signInDto: signInDto) {
    const user = await this.userService.findByLogin(signInDto);
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };
    const token = await this.authService.signPayload(payload);
    return { token };
  }
}
