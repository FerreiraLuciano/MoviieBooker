import {
  Body,
  Controller,
  Delete, Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './dto/reservation.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity
} from "@nestjs/swagger";

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @ApiOperation({ summary: 'Fetches all reservations for logged in user' })
  @ApiSecurity('jwt', ['jsonwebtoken'])
  @ApiResponse({ status: 201, description: 'List of reservations' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('')
  @UseGuards(AuthGuard)
  async getReservations(@Req() req: any) {
    return await this.reservationService.findAllForUser(req.user._id);
  }

  @ApiOperation({ summary: 'Creates a reservation' })
  @ApiSecurity('jwt', ['jsonwebtoken'])
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        movieId: { type: 'number', example: '939243' },
        start: { type: 'ISO date string', example: '2025-02-07T13:20:12Z' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Created reservation id' })
  @ApiResponse({ status: 400, description: 'Reservation cannot be created for provided time' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Post('')
  @UseGuards(AuthGuard)
  async create(@Body() reservationDto: ReservationDto, @Req() req: any) {
    const created_id = await this.reservationService.create(
      reservationDto,
      req,
    );
    return { message: 'Reservation created', reservation_id: created_id };
  }

  @ApiOperation({ summary: 'Deletes a reservation' })
  @ApiSecurity('jwt', ['jsonwebtoken'])
  @ApiResponse({ status: 201, description: 'Deleted reservation confirmation' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Unauthorized' })
  @ApiParam({ name: 'id', description: 'id of the reservation' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteReservation(@Param('id') id: string, @Req() req: any) {
    const deleted = await this.reservationService.deleteOne(id, req);
    return { message: 'Reservation deleted', reservation: deleted };
  }
}
