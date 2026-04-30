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
        return this._authService.getProfile()
            .pipe(
                map((user) => {
                    if (user) {
                        this._authService.updateIsAuthenticatedSignal(true);
                        
                        return true;
                    }
                    
                    this._authService.updateIsAuthenticatedSignal(false);
                    
                    return this._router.parseUrl('/auth/login');
                }),
                catchError(() => {
                    return of(this._router.parseUrl('/auth/login'));
                }),
            );
    }
}
