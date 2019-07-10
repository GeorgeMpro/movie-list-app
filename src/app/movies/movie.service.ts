import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Movie} from './movie.model';

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private movies: Movie[] = [];
    private movieInfo: Movie[] = [];
    private BACKEND_URL: string = environment.listApiUrl;
    private moviesUpdate = new Subject<{ movies: Movie[] }>();
    private moviesInfoUpdate = new Subject<{ moviesInfo: Movie[] }>();

    constructor(private http: HttpClient) {
    }

    getAllMovies() {
        const queryParams = '?limit=50';
        return this.http.get<{ data: { movie_count: number, limit: number, page_number: number, movies: any[] } }>(
            this.BACKEND_URL + queryParams
        )
            .pipe(
                map(response => {
                    return this.transformMovies(response);
                }))
            .subscribe(this.getMoviesList());
    }

    getMovieInfo(title: string) {
        const queryParams = `query_term=${title}`;
        this.http.get<{}>(this.BACKEND_URL + queryParams)
            .subscribe(this.getSingleMovieInfo());
    }

    private getSingleMovieInfo() {
        return (response: { data }) => {
            const movieToTransform = response.data.movies[0];
            this.movieInfo = [];
            this.movieInfo[0] = this.transformMovie(movieToTransform);
            this.moviesInfoUpdate.next({moviesInfo: [...this.movieInfo]}
            );
        };
    }

    getGenreMovies(genre: string) {
        const movieReturnLimit = 10;
        const queryParams = `genre=${genre}&limit=${movieReturnLimit}`;
        this.http.get <{}>(this.BACKEND_URL + queryParams)
            .subscribe(this.getMoviesInfoByGenere());
    }

    private getMoviesInfoByGenere() {
        return (response: { data }) => {
            this.movieInfo = this.transformMovies(response).transformedMovies;
            this.moviesInfoUpdate.next({moviesInfo: [...this.movieInfo]});
        };
    }

    private transformMovies(response) {
        return {
            transformedMovies: response.data.movies.map(movie => {
                return this.transformMovie(movie);
            })
        };
    }

    private getMoviesList() {
        return transformed => {
            this.movies = transformed.transformedMovies;
            this.moviesUpdate.next({
                movies: [...this.movies]
            });
        };
    }

    private transformMovie(movie) {
        return {
            title: movie.title,
            imdbID: movie.imdb_code,
            year: movie.year,
            imdbRating: movie.rating,
            genres: movie.genres,
            duration: movie.runtime,
            language: movie.language

        };
    }

    getMoviesUpdateListener() {
        return this.moviesUpdate.asObservable();
    }

    getMoviesInfoUpdateListener() {
        return this.moviesInfoUpdate.asObservable();
    }
}
