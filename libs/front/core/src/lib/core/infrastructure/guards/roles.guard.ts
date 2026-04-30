import { inject, Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
} from '@angular/router';
import { AuthService } from '../services';
import {
    map,
    of,
} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class RolesGuard implements CanActivate {
    private _authService = inject(AuthService);
    private _router = inject(Router);
    
    public canActivate() {
        return this._authService.hasAdmin()
            .pipe(
                map((hasAdmin) => {
                    if (hasAdmin) {
                        return true;
                    }
                    
                    return this._router.parseUrl('/');
                }),
                catchError(() => {
                    return of(this._router.parseUrl('/'));
                }),
            );
    }
}
