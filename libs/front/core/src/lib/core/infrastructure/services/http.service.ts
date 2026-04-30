import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from '../http-error';

export interface IOptionsForRootRestAPI {
    withCredentials?: boolean;
}

@Injectable()
export class HttpService {
    private _httpClient = inject(HttpClient);
    private _url = 'http://localhost:3000/api/';

    public get<Res = unknown>(additionalUrl: string, options?: IOptionsForRootRestAPI): Observable<Res> {
        const url = this.getFullUrl(additionalUrl);

        return this._httpClient.get<Res>(url, options)
            .pipe(
                catchError((err: HttpErrorResponse): Observable<never> => {
                    return throwError(() => new ApiError(err));
                })
            );
    }

    public post<Body, Res>(additionalUrl: string, body: Body, options?: IOptionsForRootRestAPI): Observable<Res> {
        const url = this.getFullUrl(additionalUrl);

        return this._httpClient.post<Res>(url, body, options)
            .pipe(
                catchError((err: HttpErrorResponse): Observable<never> => {
                    return throwError(() => new ApiError(err));
                })
            );
    }

    protected getFullUrl(additionalUrl: string): string {
        return this._url + additionalUrl;
    }
}
