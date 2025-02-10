import { Controller, Get, UseGuards, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiBasicAuth,
  ApiBearerAuth
} from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movie')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @ApiOperation({
    summary: 'Fetches playing movies or precise movie based on title',
  })
  @ApiSecurity('jwt', ['jsonwebtoken'])
  @ApiResponse({ status: 201, description: 'List of movies' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiQuery({ name: 'page', description: 'Page to fetch', required: false })
  @ApiQuery({ name: 'search', description: 'Name of movie', required: false })
  @ApiBearerAuth()
  @Get('')
  @UseGuards(AuthGuard)
  async getPlaying(
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<any> {
    if (search) {
      return await this.moviesService.getMovieByTitle(search, page);
    } else {
      return await this.moviesService.getPlayingMovies(page);
    }
  }

  @ApiOperation({ summary: 'Fetches movie details' })
  @ApiSecurity('jwt', ['jsonwebtoken'])
  @ApiResponse({ status: 201, description: 'Movie details' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiParam({ name: 'id', description: 'id of the movie' })
  @ApiBearerAuth()
  @Get('details/:id')
  @UseGuards(AuthGuard)
  async getDetails(@Param('id') id: number) {
    return await this.moviesService.getMovieDetails(id);
  }

  @ApiOperation({ summary: 'Fetches movie genres' })
  @ApiSecurity('jwt', ['jsonwebtoken'])
  @ApiResponse({ status: 201, description: 'Movie genres' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @ApiBearerAuth()
  @Get('genres')
  @UseGuards(AuthGuard)
  async getGenres() {
    return await this.moviesService.getMovieGenres();
  }
}
