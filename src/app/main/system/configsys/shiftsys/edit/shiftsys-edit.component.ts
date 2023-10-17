import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  AfterViewInit,
} from "@angular/core";
import { Subject } from "rxjs";
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
import { ToolbarItem, ToolbarInterface } from "src/app/_models";
import { ShiftSys } from "src/app/_models/app/system";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const async = require("async");
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "app-shiftsys-edit",
  templateUrl: "./shiftsys-edit.component.html",
  styleUrls: ["./shiftsys-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ShiftSysEditComponent implements OnInit {
  // Varriable Language
  flagState = "";
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: ShiftSys = new ShiftSys();
  modelTemp: ShiftSys = new ShiftSys();
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };
  public lstArea: any[] = [];

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  public watermark: string = "Chọn thời gian";
  // sets the format property to display the time value in 24 hours format.
  public formatString: string = "HH:mm";
  public interval: number = 60;
  lstTimeTypeId: unknown;

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
          this.flagState = paramUrl.type;
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState = "new";
      }
    });
    this.loadData();
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(51),
          this.globals.checkEmpty,
        ],
      ],
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(31),
          this.globals.checkExistSpace,
        ],
      ],
      timeLate: [null, []],
      timeEarly: [null, []],
      hoursStart: ["", [Validators.required]],
      hoursStop: ["", [Validators.required]],
      breaksFrom: [""],
      breaksTo: [""],
      isBreak: ["", [Validators.required]],
      timeTypeId: ["", [Validators.required]],
      isNoon: ["", [Validators.required]],
      note: [""],
      areaId: ["",Validators.required]
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

    // Build toolbar
    this.buildToolbar();

    if (this.flagState === "view") {
      this.editForm.disable();
    }
    if (this.flagState === "edit") {
      this.editForm.get("code")!.disable();
    }
    this.mode = "CheckBox";
  }
  loadData() {
    Promise.all([this.getById(), this.getTimeType(),this.getListArea()]).then((res: any) => {
      this.lstTimeTypeId = res[1];
      if (this.paramId) {
        this.model = res[0];
      }
    });
  }
  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/shiftsys/get?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
  }

  getTimeType() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/timetype/getlist").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
 getListArea() {
    return new Promise((resolve) => {
      this._coreService
        .Get("package/otherlist/GetAreas")
        .subscribe((res: any) => {
          this.lstArea = res.data;
          resolve(res.data);
        });
    });
  }
  // Build Toolbar
  buildToolbar = () => {
    setTimeout(() => {
      let toolbarList: any[] = [];
      if (this.flagState !== "view")
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      else toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
      this.toolbar = this.globals.buildToolbar("shiftsys", toolbarList!);
    }, 200);
  };

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
          this.router.navigate(["sys/configsys/shiftsys"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState = "edit";
        this.flagePopup = true;
        this.editForm.enable();
        this.editForm.get("code")!.disable();
        this.buildToolbar();
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
    if (this.model.isBreak) {
      if (!this.model.breaksFrom || !this.model.breaksTo) {
        this.notification.warning("Nhập thời gian nghỉ");
        return;
      }
    }
    let param = this.convertModel(this.model);
    if (param) {
      if (this.flagState === "new") {
        this._coreService.Post("hr/shiftsys/add", param).subscribe(
          (res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.addSuccess();
              this.router.navigate(["/sys/configsys/shiftsys"]);
            }
          },
          (error: any) => {
            this.notification.addError();
          }
        );
      } else {
        this._coreService.Post("hr/shiftsys/Update", param).subscribe(
          (res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.editSuccess();
              this.router.navigate(["/sys/configsys/shiftsys"]);
            }
          },
          (error: any) => {
            this.notification.editError();
          }
        );
      }
    }
  };
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    model.hoursStart = param.hoursStart
      ? moment(param.hoursStart).format("LTS")
      : null;
    model.hoursStop = param.hoursStop
      ? moment(param.hoursStop).format("LTS")
      : null;
    model.breaksFrom = param.breaksFrom
      ? moment(param.breaksFrom).format("LTS")
      : null;
    model.breaksTo = param.breaksTo
      ? moment(param.breaksTo).format("LTS")
      : null;
    // check giờ nghỉ trừa đến nhỏ hơn giờ nghỉ chưa từ

      let checkBreaks = this.CompareTime(model.breaksFrom,model.breaksTo);
      let checkHour = this.CompareTime(model.hoursStart,model.hoursStop);
      let checkBreaksFrom = this.CompareBetweenTime(model.hoursStart,model.hoursStop,model.breaksFrom);
      let checkBreaksTo = this.CompareBetweenTime(model.hoursStart,model.hoursStop,model.breaksTo);
      if(!checkBreaks)
      {
        this.notification.warning("Thời gian bắt đầu nghỉ giữa ca phải nhỏ hơn thời gian kết thúc nghỉ giữa ca!");
        return null;
      }
      if (!checkHour) {
        this.notification.warning(
          "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc ca!"
        );
        return null;
      }
      if (!(checkBreaksFrom && checkBreaksTo)) {
        this.notification.warning(
          "Thời gian nghỉ giữa ca phải nằm trong ca làm việc!"
        );
        return null;
      }
    return model;
  }
  CompareTime = (from: any, to: any) => {
    let f = moment(from, "h:mma");
    let t = moment(to, "h:mma");
    return moment(t).isAfter(f);
  };
  CompareBetweenTime = (from: any, to: any, time: any) => {
    let timex = moment(time, "h:mma");
    let f = moment(from, "h:mma");
    let t = moment(to, "h:mma");
    return moment(timex).isBetween(f, t);
  };
  // change date
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
          this.router.navigate(["/sys/configsys/shiftsys"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/sys/configsys/shiftsys"]);
    }
  };
  // filter type
  // change date
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
