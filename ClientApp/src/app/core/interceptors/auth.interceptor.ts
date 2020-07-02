import {
    HttpEvent,
    HttpEventType,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {
    catchError,
    filter,
    finalize, skipWhile,
    switchMap,
    take
} from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private isRefreshing = false;
    private isRefreshTokenReadySubject: BehaviorSubject<
        boolean
    > = new BehaviorSubject<boolean>(false);

    constructor(private authService: AuthService, private router: Router) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(this.addHeaders(request)).pipe(
            skipWhile(
                (event: HttpEvent<any>) => event && event.type === HttpEventType.Sent
            ),
            catchError((response) => {
                if (response.status === 401) {
                    if (this.isRefreshing) {
                        return this.isRefreshTokenReadySubject.pipe(
                            filter((result) => result !== false),
                            take(1),
                            switchMap(() => next.handle(this.addHeaders(request)))
                        );
                    } else {
                        this.isRefreshing = true;
                        this.isRefreshTokenReadySubject.next(false);
                        return this.authService.refreshToken().pipe(
                            catchError((error) => {
                                this.authService.forceLogout();
                                return throwError(error);
                            }),
                            switchMap(() => {
                                this.isRefreshTokenReadySubject.next(true);
                                return next.handle(this.addHeaders(request));
                            }),
                            finalize(() => (this.isRefreshing = false)),
                            catchError((error) => {
                                this.authService.forceLogout();
                                return throwError(error);
                            })
                        );
                    }
                }
                return throwError(response);
            })
        );
    }

    addHeaders(request: HttpRequest<any>): HttpRequest<any> {
        const tokens = this.authService.getTokens();
        return tokens
            ? request.clone({
                headers: request.headers.set(
                    'Authorization',
                    `Bearer ${tokens.accessToken}`
                ),
            })
            : request;
    }
}
