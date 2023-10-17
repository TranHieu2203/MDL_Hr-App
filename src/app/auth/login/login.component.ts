import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginInterface } from "./login.interface";
import { AuthService } from "../../common/auth.service";
import { Notification } from "../../common/notification";
import { Globals } from "../../common/globals";
import { ConfigService } from "src/app/_services/config.service";
import { NavigationService } from "src/app/_services/navigation.service";
import { TranslateService } from "@ngx-translate/core";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import { lang } from "moment";
import { SpinnerService } from "src/app/_services/spinne.service";

interface Language {
  id: string;
  name: string;
  image: string;
}

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showRePassword = false;
  showPassword: boolean = false;
  passwordInputType: string = 'password';
  processing: boolean = false;
  model: LoginInterface = new LoginInterface();
  languages:any; 
  languagesList: Language[] = [
    {id: 'vi', name: 'Tiếng Việt', image: '../../../assets/images/auth/vi.png'},
    {id: 'en', name: 'English', image: '../../../assets/images/auth/en.png'},
  ];

  public fields: FieldSettingsModel = { value: "id", text: "name" };

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private navigationService: NavigationService,
    private _notification: Notification,
    private _configService: ConfigService,
    private router: Router,
    private globals: Globals,
    public  translate: TranslateService,
    private spinnerService: SpinnerService  ) {

    
    this._configService._configSubject.next("false");
    this.loginForm = this._formBuilder.group({
      username: ["", [Validators.required, Validators.maxLength(50)]],
      password: ["", [Validators.required, Validators.maxLength(50)]],
      remember: [""],
      lang:["vi"]
    });
    this.spinnerService.hideAll();
    window.localStorage.clear();
    translate.addLangs(['vi', 'en']);
    translate.setDefaultLang('vi');
    this.model.lang="vi"
    window.localStorage.setItem('lang',this.model.lang)
    this.languages = this.globals.currentLang;
    translate.use(this.languages);
  }

  switchLang(e:any) {
    
    window.localStorage.setItem('lang',e.itemData.id)
    this.translate.use(e.itemData.id);
  }

  ngOnInit(): void {
   }
  
  ngAfterViewInit(): void {
    const isAuthen = this._authService.isAuthenticate();
    if (isAuthen) {
      if (this.globals.storeCode === "admin") {
        this.router.navigate(["/sys/sdashboard"]);
      } else {
        //this.router.navigate(["/hrms/dashboard"]);
        window.location.href = window.location.origin + "/hrms/dashboard";
      }
    }
  }

  signIn = async (): Promise<void> => {
    this.processing=true;
    await new Promise(f => setTimeout(f, 500));
    this.model = this.loginForm.value;
    if (this.loginForm.valid) {
      this._authService
        .signin(this.model.username, this.model.password, this.model.lang)
        .subscribe(async (res: any) => {
  
            if (res.statusCode == "400") {
              if (res.message == "ERROR_PASSWORD_INCORRECT") {
                this._notification.warning("Mật khẩu không đúng!");
              }
              else if (res.message == "ERROR_USERNAME_INCORRECT") {
                this._notification.warning("Tài khoản không đúng!");
              } else if (res.message == "ERROR_LOCKED") {
                this._notification.warning("Tài khoản đã bị khóa!");
              } else if (res.message == "NOT_PERMISSION_IN_WEBAPP") {
                this._notification.warning("Bạn không có quyền truy cập!");
              } else if (res.message == "ERROR_TENANT_DATE_EXPIRE") {
                this._notification.warning("Doanh nghiệp đã hết hạn sử dụng!");
              }
              else {
                this._notification.warning(res.message);
              }
              this.processing=false;    

            } else {
              // Xóa những parent Id node không có trong treeView
              if (res.data.orgIds && res.data.orgIds.length > 0) {
                var ids = res.data.orgIds.map((item: any) => item.ID);
                res.data.orgIds.forEach((element: any) => {
                  if (!ids.includes(element.PARENT_ID)) {
                    delete element.PARENT_ID;
                  }
                });
              }
              // Lưu token
              this._authService.saveToken(
                res.data.token,
                this.model.username,
                res.data.orgIds,
                res.data.permissionParams,
                res.data.isAdmin,
                res.data.avatar,
                res.data.navigation
              );
              // Hiển thị notice Đăng nhập thành công
              this._notification.success("Đăng nhập thành công!");
              window.location.href =
                window.location.origin + "/hrms/dashboard";
              //this.router.navigate(["/hrms/dashboard"]);
              await new Promise(f => setTimeout(f, 200));
              // this.processing=false;
              return;
            }
          },
          async (error: any) => {
            await new Promise(f => setTimeout(f, 200));
            this.processing=false;    
            this._notification.error(error, '', "Network Error!");
          }
        );
        // await new Promise(f => setTimeout(f, 200));
        // this.processing=false;
    } else {
      this.processing=false;
      this.loginForm.markAllAsTouched();
    }
  };

  // enter signin
  enterSignIn = (e: any): void => {
    setTimeout(() => {
      if (
        e.keyCode === 13 &&
        this.model.username.length > 0 &&
        this.model.password.length > 0
      ) {
        this.signIn();
      }
    }, 0);
  };
  clearForm() {
    this.model.username = "";
    this.model.password = "";
    this.loginForm.markAsUntouched();
  }

  onSubmit() {
    this.signIn();
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
    this.passwordInputType = this.showPassword ? 'text' : 'password';
  }
}
