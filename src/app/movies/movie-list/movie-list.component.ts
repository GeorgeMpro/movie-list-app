import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';

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
    private dataSource: MatTableDataSource<Movie>;
    private paginator: MatPaginator;
    private sort: MatSort;
    paginatorDisplaySize: number[] = [5, 10, 20];
    columnsToDisplay: string[] = ['code', 'title', 'year', 'genre', 'rating'];
    expandedMovie: Movie | null;
    private isLoading = false;
    private moviesSubscription: Subscription;
    private moviesUpdateRequestSubscription: Subscription;

    @ViewChild(MatSort, {static: false}) set matSort(ms: MatSort) {
        this.sort = ms;
    }

    @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
        this.paginator = mp;
        if (this.dataSource) {
            this.setupTable();
        }
    }


    constructor(
        private movieService: MovieService) {
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

    private requestMoviesUpdateAfterInterval() {
        const moviesUpdatePeriod = 5 * 60 * 1000;
        this.moviesUpdateRequestSubscription = interval(moviesUpdatePeriod)
            .subscribe(() => {
                this.movieService.getAllMovies();
            });
    }

    private setupTable() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnDestroy(): void {
        this.moviesSubscription.unsubscribe();
        this.moviesUpdateRequestSubscription.unsubscribe();
    }

    onClick(expandedMovie: Movie, movie: any) {
        this.expandedMovie = expandedMovie === movie ? null : movie;
    }
}
