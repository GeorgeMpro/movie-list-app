import {RouterModule, Routes} from '@angular/router';

import {MovieInfoComponent} from './movies/movie-info/movie-info.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
    {path: 'title/:movieTitle', component: MovieInfoComponent},
    {path: 'genre/:movieGenre', component: MovieInfoComponent}
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ChildRoutingModule {
}
