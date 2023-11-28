import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from "@angular/router";

import { TranslationLoaderService } from "./common/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
// Navigation
import { NavigationService } from "./_services/navigation.service";
import { navigation } from "./navigation/navigation";
import { navigationSystem } from "./navigation/navigation_system";
import { locale as navigationEnglish } from "./navigation/i18n/en";
import { locale as navigationVietNam } from "./navigation/i18n/vi";
// Import AuthService
import { Globals } from "./common/globals";
import { Consts } from "./common/const";
import { environment } from "../environments/environment";
import { Subject } from "rxjs";
import { AuthService } from "./common/auth.service";
import { CoreService } from "./_services/core.service";
import { ModalService } from "./_services/modal.service";
import { SpinnerService } from "./_services/spinne.service";
import { debug } from "console";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  navigation: any;
  isCorrectDomain!: boolean;
  isloading: boolean = false;

  // Private
  private _unsubscribeAll!: Subject<any>;
  userActivity: any;

  userInactive: Subject<any> = new Subject();

  constructor(
    @Inject(DOCUMENT) private document: any,
    private _translationLoaderService: TranslationLoaderService,
    private _translateService: TranslateService,
    private _navigationService: NavigationService,
    private authService: AuthService,
    private _router: Router,
    private globals: Globals,
    public _modal: ModalService,
    private cdref: ChangeDetectorRef,
    public spinnerService: SpinnerService
  ) {
    try {
      this.authService.isAuthenticate();
      this.setTimeout();
      // this.userInactive.subscribe(() => this._router.navigateByUrl('/auth/login'));

      this._router.events.subscribe((event: any) => {
        switch (event) {
          case event instanceof NavigationStart: {
            let key = this.globals.isAdmin;
            if (this.globals.storeCode == "admin") {
              key = true;
            }
            this.globals.urlDefault.forEach((element: any) => {
              if (event.url == element) {
                key = true;
              }
            });
            this.globals.urlPermission.forEach((element: any) => {
              if (event.url.indexOf(element) > -1) {
                key = true;
              }
            });
            if (key) {
              this.isloading = true;
            } else {
              window.location.href = window.location.origin + "/hrms/dashboard";
            }
            break;
          }

          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.isloading = false;
            break;
          }
          default: {
            break;
          }
        }
      });

      // setTimeout(() => {
      //    this.isloading = false;
      // }, 2000);

      // Varriable skipCheck
      let skipCheck: Boolean = false;
      // Check host
      let hostUrl = window.location.host;
      hostUrl = hostUrl.replace(/^www\./, "").toLowerCase();
      const hostUrlArray = hostUrl.split(".");

      // Backend URL
      const backendURL_ENV = environment.production
        ? Consts.BACKEND_URL_PRODUCTION
        : Consts.BACKEND_URL_LOCAL;

      let backendURL_REAL: String = "";
      if (this.globals.isProduction) {
        for (let i = 1; i < hostUrlArray.length; i++) {
          if (i > 1) {
            backendURL_REAL += "." + hostUrlArray[i];
          } else {
            backendURL_REAL += hostUrlArray[i];
          }
        }
      } else {
        backendURL_REAL = hostUrlArray[1];
      }

      if (this.globals.pathName === "/errors/error-404") {
        // skip
        skipCheck = true;
      } else if (
        this.globals.storeCode === "admin" &&
        backendURL_REAL === backendURL_ENV
      ) {
        // skip
        skipCheck = true;
      } else if (backendURL_REAL !== backendURL_ENV) {
        //this.redirectNotFound();
      }


      this.navigation = JSON.parse(localStorage.getItem('navigation ')!);

      // Register the navigation to the service
      this._navigationService.register("main", this.navigation);

      // Set the main navigation as our current navigation
      this._navigationService.setCurrentNavigation("main");

      // Add languages
      this._translateService.addLangs(["vi", "en"]);

      // Set the default language
      this._translateService.setDefaultLang("vi");

      // Set the navigation translations
      this._translationLoaderService.loadTranslations(
        navigationVietNam,
        navigationEnglish
      );

      // Use a language
      this._translateService.use("vi");
    } catch (error) {
    }

    this._modal.loading.subscribe((res: any) => {
      this.isloading = res;
    });
  }

  /**
   * On init
   */
  ngOnInit(): void { }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  ngAfterContentChecked() {
    // this.cdref.detectChanges();
  }
  // Redirect 404
  redirectNotFound(): void {
    window.location.href =
      Consts.BACKEND_PROTOCOL + this.globals.backendURL + "/errors/error-404";
  }

  setTimeout() {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 180000);
  }
  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

}
