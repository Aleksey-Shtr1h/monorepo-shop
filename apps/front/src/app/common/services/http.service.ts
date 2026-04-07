import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class HttpService {
    private _url = 'http://localhost:3000/api/';

    public constructor(
        private _http: HttpClient,
    ) {
    }

    public get<T>(additionalUrl: string): Observable<any[]> {
        const url = this.getFullUrl(additionalUrl);

        return this._http.get<T[]>(url).pipe();
    }

    public create<T>(body: T, additionalUrl: string): Observable<T> {
        const url = this.getFullUrl(additionalUrl);

        return this._http.post<T>(url, body);
    }

    protected getFullUrl(additionalUrl: string): string {
        return this._url + additionalUrl;
    }
}
