import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';

import {Movie} from '../movie.model';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {MovieService} from '../movie.service';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
    selector: 'app-movie-list',
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class MovieListComponent implements OnInit, OnDestroy {
    private movies: Movie[];
    private sort: MatSort;
    private paginator: MatPaginator;
    dataSource: MatTableDataSource<Movie>;
    paginatorDisplaySize: number[] = [5, 10, 20];
    columnsToDisplay: string[] = ['code', 'title', 'year', 'genre', 'rating'];
    expandedMovie: Movie | null;
    isLoading = false;

    private moviesSubscription: Subscription;
    private moviesUpdateRequestSubscription: Subscription;

    @ViewChild(MatSort, {static: false}) set matSort(ms: MatSort) {
        this.sort = ms;
    }

    @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        if (this.dataSource) {
            this.setupTableFunctionality();
        }
    }

    constructor(private movieService: MovieService) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.movieService.getAllMovies();
        this.listenToMoviesUpdate();
        this.requestMoviesUpdateAfterInterval();
    }

    private listenToMoviesUpdate() {
        this.moviesSubscription = this.movieService.getMoviesUpdateListener()
            .subscribe(response => {
                this.movies = response.movies;
                this.isLoading = false;
                this.dataSource = new MatTableDataSource(this.movies);
            });
    }

    /**
     * Sets an interval for requesting an update to the movie list after specified time.
     */
    private requestMoviesUpdateAfterInterval() {
        const updateInterval = 5 * 60 * 1000;
        this.moviesUpdateRequestSubscription = interval(updateInterval)
            .subscribe(() => {
                this.movieService.getAllMovies();
            });
    }

    private setupTableFunctionality() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    /**
     * Filter the table according to value.
     * @param filterValue - input value
     */
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /**
     * Expand and collapse the movie information list row on click.
     * @param expandedMovie - the state of expanded/collapsed row
     * @param movie - the selected movie from list
     */
    onClick(expandedMovie: Movie, movie: any) {
        this.expandedMovie = expandedMovie === movie ? null : movie;
    }

    ngOnDestroy(): void {
        this.moviesSubscription.unsubscribe();
        this.moviesUpdateRequestSubscription.unsubscribe();
    }
}
