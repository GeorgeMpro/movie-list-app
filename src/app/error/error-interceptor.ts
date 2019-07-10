import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {MatDialog} from '@angular/material';
import {ErrorComponent} from './error.component';

/**
 * An interceptor that goes with every outgoing request.
 * Handles Http Errors.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private dialog: MatDialog) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occurred!';
                const errorFromCatch = error.error.message;
                if (errorFromCatch) {
                    errorMessage = errorFromCatch;
                }
                this.dialog.open(
                    ErrorComponent,
                    {data: {message: errorMessage}}
                );
                return throwError(error);
            })
        );
    }


}
