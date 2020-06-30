import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class AccountService {
  private BASE_URL = environment.serverApiUrl;

  constructor(private http: HttpClient) {}

  logIn(credentials: ICredentials): Observable<IUser> {
    return this.http.post(`${this.BASE_URL}authenticate`, credentials).pipe(
      map(() => {
        return {
          username: credentials.username,
          password: credentials.password,
        };
      }),
      catchError((error: HttpErrorResponse) =>
        throwError("Unauthorized Access")
      )
    );
  }
}
