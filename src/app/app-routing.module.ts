import {RouterModule, Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {MovieListComponent} from './movies/movie-list/movie-list.component';

import {NgModule} from '@angular/core';

const routes: Routes = [
    {
        path: '', component: MovieListComponent, children: [
            {path: '', loadChildren: './movies/movies.module#MoviesModule'}
        ]
    },
    {path: 'about', component: AboutComponent},
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
