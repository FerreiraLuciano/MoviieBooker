import { Injectable } from '@nestjs/common';
import instance from '../common/http/axios.config';

@Injectable()
export class MoviesService {
  async getPlayingMovies(page: number): Promise<any> {
    let url = '/movie/now_playing?language=en-US';
    if (page) url += `&page=${page}`;
    const resp = await instance.get(url);
    return resp.data;
  }

  async getMovieByTitle(title: string, page: number): Promise<any> {
    let url = `/search/movie?query=${title}&language=en-US`;
    if (page) url += `&page=${page}`;
    const resp = await instance.get(url);
    return resp.data;
  }

  async getMovieDetails(id: number): Promise<any> {
    const resp = await instance.get(`/movie/${id}?language=en-US`);
    return resp.data;
  }

  async getMovieGenres(): Promise<any> {
    const resp = await instance.get('/genre/movie/list?language=en-US');
    return resp.data;
  }
}
