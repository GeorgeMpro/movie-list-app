import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {MovieService} from '../movie.service';
import {Movie} from '../movie.model';
import {MatTableDataSource} from '@angular/material';

@Component({
    selector: 'app-expand-movie-info',
    templateUrl: './movie-info.component.html',
    styleUrls: ['./movie-info.component.css']
})
export class MovieInfoComponent implements OnInit, OnDestroy {
    private displayMode: string;
    private title = '';
    private genre = '';
    private movies: Movie[] = [];
    private urlUpdatesSubscription: Subscription;
    private moviesInfoUpdateSubscription: Subscription;

    private displayedColumns = ['code', 'genre', 'duration'];
    private dataSource: MatTableDataSource<Movie>;

    private isLoading = true;

    constructor(private route: ActivatedRoute, private movieService: MovieService) {
    }

    ngOnInit() {
        this.isLoading = true;


        this.urlUpdatesSubscription = this.route.url.subscribe((data: Params) => {
            this.setModeAndParam(data);
            if (this.displayMode === 'title') {
                this.movieService.getMovieInfo(this.title);
            } else if (this.displayMode === 'genre') {
                this.movieService.getGenreMovies(this.genre);
            }

        });

        this.moviesInfoUpdateSubscription = this.movieService.getMoviesInfoUpdateListener()
            .subscribe(response => {
                this.movies = response.moviesInfo;
                this.dataSource = new MatTableDataSource(this.movies);
                this.isLoading = false;
            });

    }

    private setModeAndParam(data: Params) {
        this.displayMode = data[0].path;
        const isTitle = this.displayMode === 'title';
        const isGenre = this.displayMode === 'genre';
        if (isTitle) {
            this.title = data[1].path;
        } else if (isGenre) {
            this.genre = data[1].path;
        }
    }

    ngOnDestroy(): void {
        if (this.urlUpdatesSubscription) {
            this.urlUpdatesSubscription.unsubscribe();
        }
        if (this.moviesInfoUpdateSubscription) {
            this.moviesInfoUpdateSubscription.unsubscribe();
        }
    }
}
