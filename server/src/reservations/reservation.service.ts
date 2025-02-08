import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from '../types/reservation';
import { ReservationDto } from './dto/reservation.dto';
import * as moment from 'moment';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel('Reservation')
    private reservationModel: Model<Reservation>,
  ) {}

  async findAllForUser(id: string) {
    return this.reservationModel.find({ userId: id });
  }

  async create(reservationDto: ReservationDto, req: any) {
    const is_reserv = await this.findOneByDate(reservationDto.start, req);

    if (is_reserv) {
      throw new HttpException(
        "Current time selected isn't available, either delete the other reservation or book your reservation after it is finished.",
        HttpStatus.BAD_REQUEST,
      );
    }

    const created = await this.reservationModel.create({
      userId: req.user._id,
      movieId: reservationDto.movieId,
      date_start: moment(reservationDto.start).toISOString(),
      date_end: moment(reservationDto.start).add(2, 'hours').toISOString(),
    });

    return created._id;
  }

  async findOneByDate(date: Date, req) {
    return this.reservationModel.findOne({
      userId: req.user._id,
      $or: [
        {
          date_start: { $lte: moment(date).toISOString() },
          date_end: { $gte: moment(date).toISOString() },
        },
        {
          date_start: { $lte: moment(date).add(2, 'hours').toISOString() },
          date_end: { $gte: moment(date).add(2, 'hours').toISOString() },
        },
      ],
    });
  }

  async deleteOne(reservationId: string, req: any) {
    const deleted = await this.reservationModel.deleteOne({
      userId: req.user._id,
      _id: reservationId,
    });

    if (deleted.deletedCount === 0) {
      throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND);
    }

    return deleted;
  }
}
