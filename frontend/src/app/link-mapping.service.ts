import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root",
})
export class LinkMappingService {
  private BASE_URL = environment.serverApiUrl;
  //baseUrl = "http://php.local/short/api/";

  linkMapping: ILinkMapping<string> = {};

  constructor(private http: HttpClient) {}

  getAll(): Observable<ILinkMapping<string>> {
    return this.http.get(`${this.BASE_URL}mapping`).pipe(
      map((res) => {
        this.linkMapping = res as ILinkMapping<string>;
        return this.linkMapping;
      }),
      catchError(this.handleError)
    );
  }

  store(
    shortLink: string,
    targetUrl: string
  ): Observable<ILinkMapping<string>> {
    const data = { shortLink, targetUrl };
    return this.http.post(`${this.BASE_URL}mapping`, data).pipe(
      map((res) => {
        this.linkMapping = res as ILinkMapping<string>;
        return this.linkMapping;
      }),
      catchError(this.handleError)
    );
  }

  update(
    shortLink: string,
    targetUrl: string
  ): Observable<ILinkMapping<string>> {
    const data = { shortLink, targetUrl };
    return this.http.put(`${this.BASE_URL}mapping`, data).pipe(
      map((res) => {
        this.linkMapping = res as ILinkMapping<string>;
        return this.linkMapping;
      }),
      catchError(this.handleError)
    );
  }

  delete(shortLink: string): Observable<ILinkMapping<string>> {
    const params = new HttpParams().set("shortLink", shortLink);

    return this.http.delete(`${this.BASE_URL}mapping`, { params }).pipe(
      map((res) => {
        this.linkMapping = res as ILinkMapping<string>;
        return this.linkMapping;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    switch (error.status) {
      case 401:
        return throwError("Unauthorized API Access");
      default:
        return throwError(error.message);
    }



  }
}
