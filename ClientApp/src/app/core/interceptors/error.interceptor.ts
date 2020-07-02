import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, skipWhile } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {

        return next
            .handle(request)
            .pipe(
                skipWhile((event: HttpEvent<any>) => event && event.type === HttpEventType.Sent),
                catchError((response: HttpErrorResponse) => {
                    if (response.status === 401) {
                        this.authService.forceLogout();
                        return of({ type: HttpEventType.Sent });
                    }

                    return throwError(response);
                })
            );
    }
}
