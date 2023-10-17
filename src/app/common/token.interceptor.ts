import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { AuthService } from "./auth.service";
import { BehaviorSubject, Observable } from "rxjs";

import { throwError } from "rxjs";
import { catchError, filter, map, switchMap, take } from "rxjs/operators";
import { SpinnerService } from "../_services/spinne.service";
import { Notification } from "src/app/common/notification";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public auth: AuthService, private spinnerService: SpinnerService, private notification: Notification,
  ) {

  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.spinnerService.show();
    const token: string = localStorage.getItem("token")!;
    request = this.addTokenHeader(request, token);
    return next.handle(request)

      .pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinnerService.hide();
          }
          return event;
        }),
        catchError((err: HttpErrorResponse) => {
          if (err && !request.url.includes('authen/applogin') && err.status === 401) {
            this.spinnerService.count--;
            return this.handle401Error(request, next);
          }
          //status: 403, statusText: 'Forbidden'
          if (err && err.status === 403 && err.statusText === 'Forbidden') {
            this.notification.warning("Not permision to access this action!")
          }
          if (err && err.status === 500) {

            //window.location.assign("/auth/login")
            // this.notification.warning("Cannot access to server, please try again!")
          }
          this.spinnerService.hide();
          return throwError(err);
        })
      );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    if (token && !request.headers.has("skipTokenInterceptor")) {
      request = request.clone({
        withCredentials: true,
        headers: request.headers.set("Authorization", "Bearer " + token).delete("skipTokenInterceptor"),
      });
    }
    return request = request.clone({
      withCredentials: true,
      headers: request.headers.set("Accept", "application/json"),
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = localStorage.getItem("token")!;
      if (token) {
        return this.auth.refreshToken(token).pipe(
          switchMap((res: any) => {
            this.isRefreshing = false;
            localStorage.setItem("token", res.data.token);
            // this.tokenService.saveToken(token.accessToken);
            this.refreshTokenSubject.next(res.data.token);
            this.spinnerService.hide();
            return next.handle(this.addTokenHeader(request, res.data.token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.spinnerService.hideAll();
            this.auth.logout();
            return throwError(err);
          })
        );

      }
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );

  }
}
