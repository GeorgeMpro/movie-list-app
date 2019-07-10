import {RouterModule, Routes} from '@angular/router';
import {AboutComponent} from './about/about.component';
import {MovieListComponent} from './movies/movie-list/movie-list.component';

import {NgModule} from '@angular/core';

const routes: Routes = [
    {
        path: '', component: MovieListComponent, children: [
            {
                path: '', loadChildren: './movies/movies.module#MoviesModule'
            }
        ]
    },
    // todo add lazy loading when export
    {path: 'about', component: AboutComponent},
    // {path: '**', redirectTo: ''}
//    todo add error page and catching 404 with **
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
