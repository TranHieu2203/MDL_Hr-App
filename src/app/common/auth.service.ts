// GLOBAL IMPORT
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import {
  HttpClient as Http
} from "@angular/common/http";
import { Globals } from "./globals";
import { CoreService } from "../_services/core.service";
@Injectable()
export class AuthService {
  // for change the navbar state between online and offline
  private authenticate = new Subject<boolean>();
  authenticateState$ = this.authenticate.asObservable();

  constructor(
    @Inject(Http) private http: Http,
    @Inject(Router) private router: Router,
    @Inject(Globals) private globals: Globals,
    private _coreServices: CoreService
  ) {}

  // delete the token in localStorage and change the navbar state
  signinSys = (username: string, password: string): Observable<any> => {
    const url_request = this.globals.apiURL + "authen/SignInSys";
    const body_request = {
      username: username,
      password: password,
    };
    const options = this.globals.getCommonOptions(url_request, body_request);
    return this.http.post(url_request, body_request, options).pipe(
      map((res: any) => {
        let result = JSON.parse(res._body);
        return result;
      })
    );
  };

  signin = (username: string, password: string, lang:string): Observable<any> => {
    const url_request = this.globals.apiURL + "authen/AppLogin";
    const body_request = {
      username: username,
      password: password,
      lang:lang
    };
    const options = this.globals.getCommonOptions(url_request, body_request);
    return this.http.post(url_request, body_request, options)
    
  };

  logout = (): void => {
    localStorage.removeItem("fullname");
    localStorage.removeItem("avatar");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("permission");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userInfo");
    
    this.authenticate.next(false);
    this.router.navigate(["/"]);
    
    //window.location.href = window.location.origin +  "/auth/login"
  };
  refreshToken(token: string) {
    const url_request = this.globals.apiURL + "authen/refreshtoken";
    const body_request = {
      token: token,
    };
    const options = this.globals.getCommonOptions(url_request, body_request);
    return this.http.post(url_request, body_request, options)
  }

  // save the token in localStorage and change the navbar state
  saveToken = (
    token: string,
    username: string,
    orgIds?: any,
    permission?: any,
    isAdmin?: any,
    avatar?: any,
    navigation?:any
  ): void => {
    if (username !== null) {
      localStorage.setItem("username", username);
    }
    if (orgIds !== null) {
      localStorage.setItem("orgIds", JSON.stringify(orgIds));
    }

    localStorage.setItem("token", token);
    if (isAdmin) {
      localStorage.setItem("isAdmin", isAdmin.toString());
    }
    if (permission) {
      localStorage.setItem("permission", JSON.stringify(permission));
    }
    if (avatar) {
      localStorage.setItem("avatar", avatar);
    }
    if (navigation) {
      localStorage.setItem("navigation", JSON.stringify(navigation));
    }
    this.authenticate.next(true);
  };

  // return if the user is authenticate
  isAuthenticate = (): boolean => {
    let isAuth: boolean;
    if (localStorage.getItem("token")!) {
      isAuth = true;
      this.authenticate.next(isAuth);
      return isAuth;
    } else {
      this.logout();
      isAuth = false;
      this.authenticate.next(isAuth);
      return isAuth;
    }
  };

  getUserInfo = () => {};

  getToken = (): string => {
    return localStorage.getItem("token")!;
  };
}
