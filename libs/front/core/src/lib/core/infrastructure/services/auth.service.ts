import {
    inject,
    Injectable,
    signal,
} from '@angular/core';
import { HttpService } from './http.service';
import { IUserCore } from '../ts-types';
import {
    map,
    Observable,
} from 'rxjs';

@Injectable()
export class AuthService {
    private _isAuthenticatedUser = signal(false);
    public isAuthenticatedUser = this._isAuthenticatedUser.asReadonly();

    private _httpService = inject(HttpService);

    public register(user: IUserCore): Observable<IUserCore> {
        return this._httpService
            .post('auth/register', user);
    }

    public login(user: IUserCore): Observable<IUserCore> {
        return this._httpService
            .post<IUserCore, {
                message: string;
                user: IUserCore;
            }>('auth/login', user, { withCredentials: true })
            .pipe(map((response) => {
                return response?.user;
            }));
    }

    public logout(): Observable<any> {
        return this._httpService
            .post(`auth/logout`, {}, { withCredentials: true });
    }

    public getProfile(): Observable<IUserCore> {
        return this._httpService.get<IUserCore>(`auth/profile`, { withCredentials: true });
    }
    
    public hasAdmin() {
        return this._httpService.get<boolean>(`auth/hasAdmin`, { withCredentials: true });
    }

    public refreshToken(): Observable<any> {
        return this._httpService
            .post(`auth/refresh`, {}, { withCredentials: true });
    }

    public updateIsAuthenticatedSignal(value: boolean): void {
        this._isAuthenticatedUser.set(value);
    }
}
