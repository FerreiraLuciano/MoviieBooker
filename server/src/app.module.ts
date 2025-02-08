import * as process from "node:process";

require('dotenv').config();
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ReservationModule } from './reservations/reservation.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    AuthModule,
    ReservationModule,
    MoviesModule,
    UserModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017',
      {
        dbName: 'MoviieBroker',
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
