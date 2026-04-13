import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IPostOptionsForRootRestAPI {
    withCredentials?: boolean;
}

@Injectable()
export class HttpService {
    private _httpClient = inject(HttpClient);
    private _url = 'http://localhost:3000/api/';

    public get<R>(additionalUrl: string): Observable<R[]> {
        const url = this.getFullUrl(additionalUrl);

        return this._httpClient.get<R[]>(url);
    }

    public post<T, R>(
        additionalUrl: string,
        body: T,
        options?: IPostOptionsForRootRestAPI,
    ): Observable<R> {
        const url = this.getFullUrl(additionalUrl);

        return this._httpClient.post<R>(url, body);
    }

    protected getFullUrl(additionalUrl: string): string {
        return this._url + additionalUrl;
    }
}
