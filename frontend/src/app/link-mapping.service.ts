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

  constructor(private http: HttpClient) {}

  getAll(): Observable<ILinkMapping[]> {
    return this.http.get(`${this.BASE_URL}mapping`).pipe(
      map((res) => {
        return res as ILinkMapping[];
      }),
      catchError(this.handleError)
    );
  }

  create(
    linkMapping: ILinkMapping
  ): Observable<ILinkMapping> {
    return this.http.post(`${this.BASE_URL}mapping`, linkMapping).pipe(
      map((res) => {
        return res as ILinkMapping;
      }),
      catchError(this.handleError)
    );
  }

  update(id: number,
    linkMapping: ILinkMapping
  ): Observable<ILinkMapping> {

    return this.http.put(`${this.BASE_URL}mapping/${id}`, linkMapping).pipe(
      map((res) => {
        return res as ILinkMapping;
      }),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<ILinkMapping[]> {
    return this.http.delete(`${this.BASE_URL}mapping/${id}`).pipe(
      map((res) => {
        return res as ILinkMapping[];
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 401:
        return throwError("Unauthorized API Access");
      default:
        return throwError(error.message);
    }
  }
}
