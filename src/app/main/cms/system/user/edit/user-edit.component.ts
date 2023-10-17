import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  AfterViewInit,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";

// Service Translate
import { TranslationLoaderService } from "src/app/common/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
// Import the locale files

import { locale as english } from "src/app/i18n/en";
import { locale as vietnam } from "src/app/i18n/vi";
// Globals File
import { Globals } from "src/app/common/globals";
import { Configs } from "src/app/common/configs";
import { Notification } from "src/app/common/notification";
const _ = require("lodash");
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { User } from "src/app/_models/app/list/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
const async = require("async");
setCulture("en");

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class UserEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    
  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: User = new User();
  modelTemp: User = new User();
  languages: any;
  selectedLanguage: any;

  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstApplication: any;
  lstGroupUser: any;
  lstGroupId: unknown;

  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private modalService: ModalService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // Get Route Param
    this.activatedRoute.params.subscribe((params: Params) => {
      const paramId = params["id"];
      // Nếu trạng thái chỉnh sửa thì Get dữ liệu
      if (paramId !== "new") {
        const objParam = window.atob(paramId);
        const paramUrl = JSON.parse(objParam);
        if (paramUrl && paramUrl.id) {
          this.paramId = paramUrl.id;
          this.flagState$.next(paramUrl.type);
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState$.next("new");
      }
      this.loadData();
    });

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    if(this.flagState$.value == "new")
    { 
    this.editForm = this._formBuilder.group({
      userName: [
        "",
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[-+\/.,_a-zA-Z0-9]+$/),
        ],
      ],
      fullname: ["", [Validators.required]],
      employeeCode: ["", [Validators.required]],
      groupId: ["", [Validators.required]],
      password: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(300),
        ],
      ],
      rePassword: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(300),
        ],
      ],
      // email: [
      //   "",
      //   [
      //     Validators.required,
      //     this.globals.noWhitespaceValidator,
      //     Validators.maxLength(300),
      //     Validators.email,
      //   ],
      // ],
      isWebapp: ["", []],
      isPortal: ["", []],
      fmcToken: ["",[]],
    });
  }
  else{
    this.editForm = this._formBuilder.group({
      userName: [
        "",
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[-+\/.,_a-zA-Z0-9]+$/),
        ],
      ],
      fullname: ["", [Validators.required]],
      employeeCode: ["", [Validators.required]],
      groupId: ["", [Validators.required]],
      password: [ "", []],
      rePassword: [ "",[]],
      isWebapp: ["", []],
      isPortal: ["", []],
      fmcToken: ["",[]],
    });
  }

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.languages);

    this.flagState$.subscribe(x => {
      let toolbarList: any[] = [];
      if (x === "view") {
        toolbarList = [
          ToolbarItem.BACK,
          ToolbarItem.EDIT,
        ];
        this.editForm.disable();
      }
      if (x === "new") {
        toolbarList = [
          ToolbarItem.BACK,
          ToolbarItem.SAVE,
        ];
      }
      if (x === "edit") {
        toolbarList = [
          ToolbarItem.BACK,
          ToolbarItem.SAVE,
        ];
        this.editForm.get("userName")!.disable();
      }
      this.toolItems$.next(toolbarList)
    })

  }

  loadData() {
    Promise.all([this.getById(), this.getListGroup()]).then((res: any) => {
      if (this.paramId) {
        this.model = res[0];
      }
      this.lstGroupId = res[1];
    });
  }
  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("tenant/getuserId?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
  }
  choiseEmp() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      multiselect: false,
      selected: this.model.employeeId, //select employee on grid
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.employeeId = res.employeeId;
      this.model.employeeCode = res.employeeCode;
      this.model.employeeName = res.employeeName;
      this.model.avatar = res.avatar;
      //this.model.positionName = res.positionName;
      // this.model.orgName = res.orgName;
      // this.model.orgParentName = res.orgParentName;
      // this.model.startDate = res.dateStart;
      x.unsubscribe();
    });
  }

  ClearEquitment(){
    let param = {
      id: this.model.id, //select employee on grid
    };
    this._coreService
        .Post("tenant/ClearEquitment", param)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.success("Xóa thiết bị thành công!");
            this.model.fmcToken= "";
          }
        });
  }
   // update avtar
  uploadAvatar(files: FileList | null) {
    setTimeout(() => {
      if (files!.length > 0) {
        let data = new FormData();
        for (let i = 0; i < files!.length; i++) {
          data.append("files", files![i]);
        }
        this._coreService.uploadFile(data, "user").subscribe((res: any) => {
          if (res.status == 200) {
            this.model.avatar = res.data[0].url;
            let x: any = document.getElementById("avatar");
            x.value = null;
          }
        });
      }
    }, 200);
  }

  getListGroup() {
    return new Promise((resolve) => {
      this._coreService.Get("tenant/group/GetListGroup").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.BACK:
        if (this.editForm.dirty && this.editForm.touched) {
          this.flagePopup = false;
        }
        if (
          (this.editForm.dirty && this.editForm.touched) ||
          this.flagePopup === false
        ) {
          this.modalService.open("confirm-back-modal");
        }
        if (this.flagePopup === true) {
          this.router.navigate(["hrms/system/user"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState$.next("edit");
        this.flagePopup = true;
        this.editForm.enable();
        this.editForm.get("userName")!.disable();
        this.editForm.get("employeeCode")!.disable();
        this.editForm.get("fullname")!.disable();
        break;
      case ToolbarItem.DELETE:
        break;
      case ToolbarItem.COPY:
        break;
      default:
        break;
    }
  };
  // lưu data open popup
  saveData = () => {
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }
    //
    
    if (this.flagState$.value === "new") {
      if (this.model.password !== this.model.rePassword) {
        this.notification.warning("Sai mật khẩu");
        this.model.password = "";
        this.model.rePassword = "";
        return;
      }
      if(this.model.employeeId==null ){
        this.notification.warning("Chọn lại nhân viên!");
        return;
      }
      this._coreService
        .Post("tenant/create", this.model)
        .subscribe((res: any) => {
          //check error
          if (res.statusCode == 400) {
            if(res.message =="EMPLOYEE_HAVE_ACCOUNT"){
              this.notification.warning("Nhân viên đã có tài khoản!");
            }else if(res.message =="EMPLOYEE_NOT_NULL"){
              this.notification.warning("Chọn lại nhân viên!");
            }
            else{
              this.notification.checkErrorMessage(res.message);
            }
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/system/user"]);
          }
        });
    } else {
      if(this.model.rePassword!= null || this.model.rePassword!="")
      {
        if (this.model.password !== this.model.rePassword) {
          this.notification.warning("Sai mật khẩu");
          this.model.password = "";
          this.model.rePassword = "";
          return;
        }
      }
      this._coreService
        .Post("tenant/update", this.model)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/system/user"]);
          }
        });
    }
  };

  // confirm delete
  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      this._coreService
        .Delete("app-item/delete-many?ids=" + this.model.id, {
          ip_address: "123456",
          channel_code: "W",
        })
        .subscribe((success: any) => {
          this.notification.deleteSuccess();
          this.modalService.close("confirm-delete-modal");
          this.router.navigate(["/hrms/system/user"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/system/user"]);
    }
  };
  // filter type

  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
