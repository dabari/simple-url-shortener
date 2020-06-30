import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { AppStoreService } from "./app-store.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authorization: string | null;

  constructor(private appStoreService: AppStoreService) {
    this.appStoreService.userStoreObservable().subscribe((user) => {
      if (user !== null) {
        this.authorization = `Basic ${window.btoa(
          user.username + ":" + user.password
        )}`;
      } else {
        this.authorization = null;
      }
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !request ||
      !request.url ||
      (/^http/.test(request.url) &&
        !(
          environment.serverApiUrl &&
          request.url.startsWith(environment.serverApiUrl)
        ))
    ) {
      return next.handle(request);
    }

    if (this.authorization !== null) {
      request = request.clone({
        setHeaders: {
          Authorization: this.authorization,
        },
      });
    }

    return next.handle(request);
  }
}
