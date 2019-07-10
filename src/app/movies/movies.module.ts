import {NgModule} from '@angular/core';

import {AngularMaterialModule} from '../angular-material.module';
import {MovieListComponent} from './movie-list/movie-list.component';
import {MovieInfoComponent} from './movie-info/movie-info.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ChildRoutingModule} from '../child-routing.module';

@NgModule({
    declarations: [
        MovieInfoComponent
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        RouterModule,
        ChildRoutingModule
    ]
})
export class MoviesModule {
}
