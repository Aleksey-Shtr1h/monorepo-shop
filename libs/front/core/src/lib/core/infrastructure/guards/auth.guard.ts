import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    private _authService = inject(AuthService);
    private _router = inject(Router);

    public canActivate() {
        return this._authService.isAuthenticatedSubject$.pipe(
            map((isAuth) => {
                if (!isAuth) {
                    this._router.navigate(['auth/sign-in']).then();
                }

                return isAuth;
            }),
        );
    }
}
