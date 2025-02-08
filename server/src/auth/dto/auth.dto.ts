import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { EMAIL_FORMAT, PASSWORD_FORMAT } from 'src/common/constants/global';
import { ApiProperty } from '@nestjs/swagger';

export class signUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 127)
  @Matches(EMAIL_FORMAT, { message: 'Invalid email' })
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 40)
  @Matches(PASSWORD_FORMAT, { message: 'Password too weak' })
  public password: string;
}

export class signInDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(EMAIL_FORMAT, { message: 'Invalid email' })
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password: string;
}
