import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
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
    private movies: Movie[] = [];
    private displayMode: string;
    private title = '';
    private genre = '';
    displayedColumns = ['code', 'genre', 'duration'];
    dataSource: MatTableDataSource<Movie>;
    isLoading = true;
    private urlUpdatesSubscription: Subscription;
    private moviesInfoUpdateSubscription: Subscription;


    constructor(private route: ActivatedRoute, private movieService: MovieService) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.urlUpdatesSubscription = this.route.url
            .subscribe(this.getUrlUpdates());

        this.moviesInfoUpdateSubscription = this.movieService.getMoviesInfoUpdateListener()
            .subscribe(this.getMovieListUpdates());
    }

    private getUrlUpdates() {
        return (data: Params) => {
            this.setModeAndParam(data);
            if (this.displayMode === 'title') {
                this.movieService.getMovieInfo(this.title);
            } else if (this.displayMode === 'genre') {
                this.movieService.getGenreMovies(this.genre);
            }

        };
    }

    private getMovieListUpdates() {
        return response => {
            this.movies = response.moviesInfo;
            this.dataSource = new MatTableDataSource(this.movies);
            this.isLoading = false;
        };
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
