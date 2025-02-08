import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ReservationSchema } from '../models/reservations.schema';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Reservation', schema: ReservationSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, JwtService],
  exports: [ReservationService],
})
export class ReservationModule {}
