import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEventType, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

        return next.handle(request).pipe(
            catchError((response: HttpErrorResponse) => {
                if (response.status === 401) {
                    this.authService.forceLogout();
                    return of({ type: HttpEventType.Sent });
                }

                return throwError(response);
            }));
    }
}
