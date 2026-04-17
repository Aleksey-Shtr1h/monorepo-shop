import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { IUserCore } from '../ts-types/global.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AuthService {
    private _isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticatedSubject$ = this._isAuthenticatedSubject.asObservable();

    private _httpService = inject(HttpService);

    public register(user: IUserCore): Observable<IUserCore> {
        return this._httpService
            .post('auth/register', user);
    }

    public login(user: IUserCore): Observable<IUserCore> {
        return this._httpService
            .post<IUserCore, IUserCore>('auth/login', user, { withCredentials: true });
    }

    public refreshToken(): Observable<any> {
        return this._httpService
            .post(`auth/refresh`, {}, { withCredentials: true });
    }

    public logout(): Observable<any> {
        return this._httpService
            .post(`auth/logout`, {}, { withCredentials: true });
    }

    public updateIsAuthenticatedSubject(value: boolean): void {
        this._isAuthenticatedSubject.next(value);
    }

    public getProfile(): Observable<any> {
        return this._httpService.get(`auth/profile`, { withCredentials: true });
    }
}
