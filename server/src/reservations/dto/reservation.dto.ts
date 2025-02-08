import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReservationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  movieId: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty()
  start: Date;
}
