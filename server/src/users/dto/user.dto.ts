import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";
import { EMAIL_FORMAT } from '../../common/constants/global';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Matches(EMAIL_FORMAT, { message: 'Invalid email' })
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string;
}
