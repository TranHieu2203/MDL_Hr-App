import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  AfterViewInit,
  ElementRef,
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
import { ToolbarItem, ToolbarInterface, TenantPackage } from "src/app/_models";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
const async = require("async");
const $ = require("jquery");
import { time } from "console";
import * as moment from "moment";
setCulture("en");

@Component({
  selector: "app-tenantcontract-edit",
  templateUrl: "./tenantcontract-edit.component.html",
  styleUrls: ["./tenantcontract-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class TenantContractEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  flagRenew = false;
  flagStatus = "";
  paramId = "";
  timeId: any;
  tenantName = "";
  dateExprixe = "";
  packageName = "";
  modelRenew: TenantPackage = new TenantPackage();
  model: TenantPackage = new TenantPackage();
  modelTemp: TenantPackage = new TenantPackage();
  languages: any;
  selectedLanguage: any;

  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };
  public fieldConnectionString: FieldSettingsModel = {
    value: "code",
    text: "name",
  };
  // list data 
  public lstTenant: any[] = [];
  public lstApplication: any[] = [];
  public lstPackage: any[] = [];
  public lstTime = [
    {
      id: 1,
      name: "1 Tháng"
    },
    {
      id: 2,
      name: "3 Tháng"
    },
    {
      id: 3,
      name: "6 Tháng"
    },
    {
      id: 4,
      name: "1 Năm"
    }
  ]



  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstConnectionString: any;

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
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private el: ElementRef
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
          this.flagStatus = paramUrl.flag;
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState$.next("new");
      }
    });

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      code: [
        // địa chỉ truy cập
        "",
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[-+\/.,_a-zA-Z0-9]+$/),
        ],
      ],
      tenant: ["", Validators.required],
      application: ["", Validators.required],
      package: ["", Validators.required],
      packagePrice: [""],
      dateBegin: ["", Validators.required],
      dateExpire: ["", Validators.required],
      isPayment: [""],
      discount: [""],
      totalPrice: [""],
      time: ["", Validators.required]
    });

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
        this.editForm.disable();
        if (this.flagRenew)
          toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
        else
          toolbarList = [ToolbarItem.BACK];
      }
      if (x === "new") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
        this.editForm.get("packagePrice")!.disable();
        this.editForm.get("dateExpire")!.disable();
        this.model.discount = 0;
      }
      if (x === "edit") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
        this.editForm.get("packagePrice")!.disable();
        this.editForm.get("dateExpire")!.disable();
        this.editForm.get("code")!.disable();
      }
      this.toolItems$.next(toolbarList)
    })

    this.editForm.get("totalPrice")!.disable();

    async.waterfall(
      [
        (cb: any) => {
          if (this.paramId) {
            this._coreService
              .Get("tenant/package/GetById?id=" + this.paramId)
              .subscribe((res: any) => {
                this.modelTemp = res.data;
                cb();
              });
          } else {
            cb();
          }
        },
        (cb: any) => {
          async.parallel([
            (cb1: any) => {
              this._coreService
                .Get("tenant/GetListTenant")
                .subscribe((res: any) => {
                  this.lstTenant = res.data;
                  cb1();
                });
            },
            (cb1: any) => {
              this._coreService
                .Get("package/otherlist/getApplication")
                .subscribe((res: any) => {
                  this.lstApplication = res.data;
                  cb1();
                });
            },
            (cb1: any) => {
              this._coreService
                .Get("package/package/getlist")
                .subscribe((res: any) => {
                  this.lstPackage = res.data;
                  cb1();
                });
            }
          ], (err1: any, result1: any) => {
            return cb();
          })
        },

      ],
      (err: any, ok: any) => {
        if (this.paramId) {
          this.model = _.cloneDeep(this.modelTemp);
          //delete this.modelTemp;
          if (this.model.status) {
            this.editForm.disable();
          }

          if (this.flagStatus == "renew") {
            this.model.status = 1
            this.flagRenew = true;
          }
          else {
            this.model.status = 2;
            this.modelRenew = _.cloneDeep(this.model);
          }
        }

      }
    );
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
          this.router.navigate(["sys/config/tenantcontract"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState$.next("edit");
        this.editForm.enable();
        this.editForm.get("code")!.disable();
        this.editForm.get("password")!.disable();
        this.editForm.get("passwordConfirm")!.disable();
        this.editForm.get("packageId")!.disable();
        this.editForm.get("userName")!.disable();

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
      for (const key of Object.keys(this.editForm.controls)) {
        if (this.editForm.controls[key].invalid) {

          const invalidControl = this.el.nativeElement.querySelector(
            '[formcontrolname="' + key + '"]'
          );
          if (invalidControl) {
            if (invalidControl.querySelector("input")) {
              invalidControl.querySelector("input").focus();
            } else {
              invalidControl.focus();
            }
            break;
          }
        }
      }
      this.notification.warning("Lưu không thành công!");
      this.editForm.markAllAsTouched();
      return;
    }

    if (this.flagState$.value === "new") {
      this._coreService.Post("tenant/package/Create", this.model).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.addSuccess();
            this.router.navigate(["/sys/config/tenantcontract"]);
          } else if (res.error == "DATA_EXIST") {
            this.notification.warning("Tài khoản đã tồn tại!");
          } else {
            if (res.message && res.message.length > 0) {
              this.notification.warning(res.message[0].description);
            }
            else if (res.statusCode == "409" && res.data) {
              this.modelRenew = res.data;
              this.dateExprixe = moment(res.data.dateExpire).format("DD/MM/YYYY");
              let findtenant = this.lstTenant.find(x => x.id == res.data.tenantId);
              let findPackage = this.lstPackage.find(x => x.id == res.data.packageId);
              if (findtenant)
                this.tenantName = findtenant.name;
              if (findPackage)
                this.packageName = findPackage.name;

              this.modalService.open("confirm-renew-modal");
            }

            else {
              this.notification.addError();
            }


          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("tenant/package/update", this.model).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.editSuccess();
            this.router.navigate(["/sys/config/tenantcontract"]);
          } else {
            this.notification.addError();
          }
        },
        (error: any) => {
          this.notification.editSuccess();
        }
      );
    }
  };
  ChangePackage = () => {
    let findItem = this.lstPackage.find(x => x.id == this.model.packageId);
    if (findItem) {
      this.model.price = findItem.price
    }
  }
  ChangeTime = () => {
    if (this.model.dateBegin && this.model.timeId) {
      switch (this.model.timeId) {
        case 1:
          let a = moment(this.model.dateBegin).add(1, 'months') as any;
          this.model.dateExpire = a._d;
          break;
        case 2:
          let b = moment(this.model.dateBegin).add(3, 'months') as any;
          this.model.dateExpire = b._d;
          break;
        case 3:
          let c = moment(this.model.dateBegin).add(6, 'months') as any;
          this.model.dateExpire = c._d;
          break;
        case 4:
          let d = moment(this.model.dateBegin).add(12, 'months') as any;
          this.model.dateExpire = d._d;
          break;
      }
    }
  }
  CaculatePrice = () => {
    if (this.model.price && this.model.timeId) {
      this.model.discount = this.model.discount == undefined ? 0 : this.model.discount;
      switch (this.model.timeId) {
        case 1:
          this.model.totalPrice = this.model.price - (this.model.price * (this.model.discount / 100))
          break;
        case 2:
          this.model.totalPrice = this.model.price * 3 - (this.model.price * 3 * (this.model.discount / 100))
          break;
        case 3:
          this.model.totalPrice = this.model.price * 6 - (this.model.price * 6 * (this.model.discount / 100))
          break;
        case 4:
          this.model.totalPrice = this.model.price * 12 - (this.model.price * 12 * (this.model.discount / 100))
          break;
      }
    }
    if (this.model.status == 2 && this.model.packageId != this.modelRenew.packageId) {

      // số tiền hợp đồng trước đã tiêu 
      let money = 0;
      let monthBeginB = moment(this.modelRenew.dateBegin).month();
      let monthBeginA = moment(this.model.dateBegin).month();
      if (monthBeginB != monthBeginA) {
        money = (monthBeginA - monthBeginB) * this.modelRenew.price!;
      }
      if (!this.modelRenew.isPayment) {
        this.model.totalPrice! += money;
      }
      else
        this.model.totalPrice! -= money;

    } else {
      //this.notification.warning("Vui lòng chọn gói khác!")
    }

  }
  changeDate = (model: any) => {
    setTimeout(() => {
      const idDate = "#" + model + "_input";
      const value = $(idDate).val();
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      if (value.length === 0) {
        this.editForm.get(model)!.setErrors({ required: true });
        return;
      } else if (value.length > 0 && patt.test(value.toLowerCase()) === true) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      } else if (value.length > 10) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      } else {
        this.editForm.get(model)!.clearValidators();
      }
      if (
        value &&
        ((value.length === 8 && value.indexOf("/") === -1) ||
          (value.length === 6 && value.indexOf("/") === -1) ||
          (value.length === 10 && value.indexOf("/") > -1))
      ) {
        if (value.indexOf("-") === -1) {
          const returnDate = this.globals.replaceDate(value);
          // (this.model as any)[model] = returnDate;
          if (returnDate && returnDate.length > 0) {
            $(idDate).val(returnDate);
            const dateParts: any = returnDate.split("/");
            (this.model as any)[model] = new Date(
              +dateParts[2],
              dateParts[1] - 1,
              +dateParts[0]
            );
            this.editForm.get(model)!.clearValidators();
          }
        }
      }
    }, 200);
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
          this.router.navigate(["/sys/config/tenanttenantcontract"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/sys/config/tenanttenantcontract"]);
    }
  };
  // confirm Renew
  confirmRenew = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-renew-modal");
    } else {
      this.flagRenew = true;
      let a = moment(this.modelRenew.dateExpire).add(1, 'days') as any;
      this.model.dateBegin = a._d;
      this.modalService.close("confirm-renew-modal");
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
