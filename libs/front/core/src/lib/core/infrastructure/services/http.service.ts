import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IOptionsForRootRestAPI {
    withCredentials?: boolean;
}

@Injectable()
export class HttpService {
    private _httpClient = inject(HttpClient);
    private _url = 'http://localhost:3000/api/';

    public get<R>(additionalUrl: string, options?: IOptionsForRootRestAPI): Observable<R | R[]> {
        const url = this.getFullUrl(additionalUrl);

        return this._httpClient.get<R | R[]>(url, options);
    }

    public post<T, R>(additionalUrl: string, body: T, options?: IOptionsForRootRestAPI): Observable<R> {
        const url = this.getFullUrl(additionalUrl);

        return this._httpClient.post<R>(url, body, options);
    }

    protected getFullUrl(additionalUrl: string): string {
        return this._url + additionalUrl;
    }
}
