import { inject, Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, tap } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    private _isRefreshing = false;
    private _refreshTokenSubject = new BehaviorSubject<string | null>(null);

    private _authService = inject(AuthService);
    private _router = inject(Router);

    public intercept(
        req: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        const authReq = req.clone({ withCredentials: true });

        return next.handle(authReq)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401 && !req.url.includes('api/auth/refresh')) {
                        return this.handle401Error(
                            req,
                            next,
                        );
                    }

                    return throwError(() => error);
                }),
            );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this._isRefreshing) {
            this._isRefreshing = true;
            this._refreshTokenSubject.next(null);

            return this._authService.refreshToken().pipe(
                switchMap(() => {
                    this._isRefreshing = false;
                    this._refreshTokenSubject.next('refreshed');
                    
                    return next.handle(
                        request.clone({ withCredentials: true }),
                    );
                }),
                catchError((err) => {
                    this._isRefreshing = false;
                    this._authService.logout()
                        .pipe(
                            tap(async () => {
                                this._authService.updateIsAuthenticatedSignal(
                                    false,
                                );
                                await this._router.navigate([ '/auth/login' ]);
                            }),
                        );
                    
                    return throwError(() => err);
                }),
            );
        } else {
            return this._refreshTokenSubject.pipe(
                filter((token) => token !== null),
                take(1),
                switchMap(() =>
                    next.handle(request.clone({ withCredentials: true })),
                ),
            );
        }
    }
}
