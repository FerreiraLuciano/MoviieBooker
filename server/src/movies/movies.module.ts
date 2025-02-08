import { forwardRef, Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [MoviesController],
  providers: [MoviesService, JwtService],
  exports: [MoviesService],
})
export class MoviesModule {}
