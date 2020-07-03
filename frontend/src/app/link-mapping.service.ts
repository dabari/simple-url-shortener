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

  linkMapping: ILinkMapping[] = [];

  constructor(private http: HttpClient) {}

  getAll(): Observable<ILinkMapping[]> {
    return this.http.get(`${this.BASE_URL}mapping`).pipe(
      map((res) => {
        this.linkMapping = res as ILinkMapping[];
        return this.linkMapping;
      }),
      catchError(this.handleError)
    );
  }

  store(
    linkMapping: ILinkMapping
  ): Observable<ILinkMapping[]> {
    return this.http.post(`${this.BASE_URL}mapping`, linkMapping).pipe(
      map((res) => {
        this.linkMapping = res as ILinkMapping[];
        return this.linkMapping;
      }),
      catchError(this.handleError)
    );
  }

  update(
    linkMapping: ILinkMapping
  ): Observable<ILinkMapping[]> {

    return this.http.put(`${this.BASE_URL}mapping`, linkMapping).pipe(
      map((res) => {
        this.linkMapping = res as ILinkMapping[];
        return this.linkMapping;
      }),
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<ILinkMapping[]> {
    const params = new HttpParams().set("id", `${id}`);

    return this.http.delete(`${this.BASE_URL}mapping`, { params }).pipe(
      map((res) => {
        this.linkMapping = res as ILinkMapping[];
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
