import {
  Component,
  OnInit,
  ViewEncapsulation,
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
import { Shift } from "src/app/_models/app/cms/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "app-shift-edit",
  templateUrl: "./shift-edit.component.html",
  styleUrls: ["./shift-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ShiftEditComponent implements OnInit {

  toolItems$ = new BehaviorSubject<any[]>([

  ])

  // Varriable Language
  flagState$ = new BehaviorSubject<string>('')
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: Shift = new Shift();
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  public watermark: string = "Chọn thời gian";
  // sets the format property to display the time value in 24 hours format.
  public formatString: string = "HH:mm";
  public interval: number = 60;
  lstTimeTypeId: unknown;
  lstShift: any = [];
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
      shiftOut: [null, []],
      shiftIn: [null, []],
      hoursStart: ["", [Validators.required]],
      hoursStop: ["", [Validators.required]],
      breaksFrom: [""],
      breaksTo: [""],
      isBreak: ["", [Validators.required]],
      isSkip: ["", [Validators.required]],
      timeTypeId: ["", [Validators.required]],
      isNoon: ["", [Validators.required]],
      note: [""],
      coefficient: [""],
      timeStandard: [""],
      orders: [""],
      monId: ["", []],
      tueId: ["", []],
      wedId: ["", []],
      thuId: ["", []],
      friId: ["", []],
      satId: ["", []],
      sunId: ["", []]
    });

    // Set the private defauYYYY-MM-DD HH:mm:ss
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
    this.flagState$.subscribe(x => {
      let toolbarList: any[] = [];
      if (x === "view") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
        this.editForm.disable();
      } else {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }

      this.toolItems$.next(toolbarList)

      if (x === "edit") {
        this.editForm.get("code")!.disable();
      }
    })
    

    this.model.coefficient = 1;
    this.mode = "CheckBox";
  }
  loadData() {
    Promise.all([this.getById(), this.getTimeType(), this.getShift()]).then((res: any) => {
      let lstTimeTemp = [];
      lstTimeTemp = _.cloneDeep(res[1]);
      this.lstTimeTypeId   = lstTimeTemp.map((item: any) => ({
          id: item.id,
          name: item.code + " - " + item.name,
        }));
        this.lstShift = res[2]
      if (this.paramId) {
        this.model = res[0];
      }
    });
  }
  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/shift/get?id=" + this.paramId)
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

  getShift() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/shift/getlist").subscribe((res: any) => {
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
          this.router.navigate(["hrms/attendance/list/shift"]);
        }
        break;     
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState$.next("edit");
        this.flagePopup = true;
        this.editForm.enable();
        this.editForm.get("code")!.disable();
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
    else{
      this.model.breaksFrom = null;
      this.model.breaksTo = null;
    }    
    let param = this.convertModel(this.model);
    if (param) {
      if (this.flagState$.value === "new") {
        this._coreService.Post("hr/shift/add", param).subscribe(
          (res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this._coreService.Post("payroll/element/ShiftToElement", param).subscribe();
              this.notification.addSuccess();
              this.router.navigate(["/hrms/attendance/list/shift"]);
            }
          },
          (error: any) => {
            this.notification.addError();
          }
        );
      } else {
        this._coreService.Post("hr/shift/Update", param).subscribe(
          (res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.editSuccess();
              this.router.navigate(["/hrms/attendance/list/shift"]);
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
      ? moment(param.hoursStart).format()
      
      : null;
    model.hoursStop = param.hoursStop
      ? moment(param.hoursStop).format()
      : null;
    model.breaksFrom = param.breaksFrom
      ? moment(param.breaksFrom).format()
      : null;
    model.breaksTo = param.breaksTo
      ? moment(param.breaksTo).format()
      : null;
    // check giờ nghỉ trừa đến nhỏ hơn giờ nghỉ chưa từ
    
      let checkBreaks = this.CompareTime(model.breaksFrom,model.breaksTo);
      let checkHour = this.CompareTime(model.hoursStart,model.hoursStop);
      let checkBreaksFrom = this.CompareBetweenTime(model.hoursStart,model.hoursStop,model.breaksFrom);
      let checkBreaksTo = this.CompareBetweenTime(model.hoursStart,model.hoursStop,model.breaksTo);
      if(!model.isNoon && this.model.isBreak)
      {
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
      }
    return model;
  }
  CompareTime = (from: any, to: any) => {
    let f = moment(from, "HH:mma");
    let t = moment(to, "HH:mma");
    return moment(t).isSameOrAfter(f);
  };
  CompareBetweenTime = (from: any, to: any, time: any) => {
    let timex = moment(time, "HH:mma");
    let f = moment(from, "HH:mma");
    let t = moment(to, "HH:mma");
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

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/attendance/list/shift"]);
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
