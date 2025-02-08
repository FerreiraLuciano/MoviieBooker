import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor() {}

  @ApiOperation({ summary: "Returns logged in user's profile based on jwt" })
  @ApiSecurity('jwt', ['jsonwebtoken'])
  @ApiResponse({ status: 201, description: "User's profile details" })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('/me')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: any) {
    return req.user;
  }
}
