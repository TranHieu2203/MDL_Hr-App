import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DirectiveModule } from "./directives/directive.module";
import { HttpClient, HttpClientModule as HttpModule } from "@angular/common/http"; 
import { Router, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminGuard, StoreGuard } from "./common/auth.guard";
import { AppRoutes } from "./app.routing";
import { Globals } from "./common/globals";
import { Configs } from "./common/configs";
import { AuthService } from "./common/auth.service";
import { Notification } from "./common/notification";
import { ToastyModule } from "ng2-toasty";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./common/token.interceptor";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Error404Module } from "./main/errors/404/error-404.module";
import { AppLayoutModule } from "./layout/applayout/applayout.module";

// left slidebar
import {SidebarModule} from "./layout/components/sidebar/sidebar.module";

import { ConfigTreeGrids } from "./common/configs_treegrid";

import { LibrariesModule } from "./libraries/libraries.module"

import { AppComponent } from "./app.component";
import { ModulesComponent } from "./components/modules/modules.component";
import { WaittingScreenComponent } from "./components/waitting-screen/waitting-screen.component";
import { HeaderComponent } from './components/header/header.component';
import { RightchatComponent } from './components/rightchat/rightchat.component';
import { FooterComponent } from './components/footer/footer.component';
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    LibrariesModule,
    ModalModule,
    DirectiveModule,
    RouterModule.forRoot(AppRoutes),
    TranslateModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    HttpModule,
    // Common Module
    Error404Module,
    AppLayoutModule,
    SidebarModule,
  ],
  declarations: [
    AppComponent,
    ModulesComponent,
    WaittingScreenComponent,
    HeaderComponent,
    RightchatComponent,
    FooterComponent,
  ],
  providers: [
    AuthService,
    AdminGuard,
    StoreGuard,
    Globals,
    Configs,
    ConfigTreeGrids,
    BsModalService,
    Notification,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor(router: Router) {
  }

}
