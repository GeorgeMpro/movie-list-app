import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {HeaderComponent} from './header/header.component';
import {AboutComponent} from './about/about.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AngularMaterialModule} from './angular-material.module';
import {AppRoutingModule} from './app-routing.module';
import {MovieListComponent} from './movies/movie-list/movie-list.component';
import {ErrorComponent} from './error/error.component';
import {ErrorInterceptor} from './error/error-interceptor';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        AboutComponent,
        ErrorComponent,
        MovieListComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        AngularMaterialModule,
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
    ],
    bootstrap: [AppComponent],
    entryComponents: [ErrorComponent]
})
export class AppModule {
}
