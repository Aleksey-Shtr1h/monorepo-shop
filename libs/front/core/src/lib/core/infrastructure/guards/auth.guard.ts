import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services';
import {
    map,
    of,
} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
    private _authService = inject(AuthService);
    private _router = inject(Router);

    public canActivate() {
        return this._authService.getProfile().pipe(
            map(() => {
                const isAuthenticatedUser = this._authService.isAuthenticatedUser();

                if (isAuthenticatedUser) {
                    return isAuthenticatedUser;
                }

                return this._router.parseUrl('/auth/login');
            }),
            catchError(() => of(this._router.parseUrl('/auth/login')))
        );
    }
}
