import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  Input,
  ViewChildren,
} from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
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
import { L10n, setCulture } from "@syncfusion/ej2-base";
//import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
const DataStateChangeEventArgs = require("@syncfusion/ej2-grids").DataStateChangeEventArgs;
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
//const _ = require("lodash");
const _ = require("lodash");
//const $ = require("jquery");
const $ = require("jquery");
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ModalService } from "src/app/_services/modal.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import * as moment from "moment";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";

setCulture("en");

@Component({
  selector: "cms-app-modalsovertime",
  templateUrl: "./modalsovertime.component.html",
  styleUrls: ["./modalsovertime.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ModalsOvertimeComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  @Input() id!: string;

  @ViewChild("overviewgrid", { static: true })
  public gridInstance!: GridComponent;
  model: OvertimeDetail | any = new OvertimeDetail();
  public fields = { value: "id", text: "name" };
  public watermark: string = "Chọn thời gian";
  // sets the format property to display the time value in 24 hours format.
  public formatString: string = "HH:mm";
  public interval: number = 60;
  mode: any;
  // Khai báo data
  public data!: any[];
  editForm!: FormGroup;
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  element: any;
  localData = [];
  showMask = false;
  query!: Query;
  lstEmployee: any;
  lsttimetypeId: any;

  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private modalService: ModalService,
    private el: ElementRef,
    private _formBuilder: FormBuilder
  ) {
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.element = el.nativeElement;
    this.editForm = this._formBuilder.group({
      employeeId: ["", [Validators.required]],
      timeStart: ["", [Validators.required]],
      timeEnd: ["", [Validators.required]],
      workingDay: ["", [Validators.required]],
      note: [""]
    });
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
    // Load List Data
    this.modalService.add(this);
    this.mode = "CheckBox";
  }

  // open modal
  open(param?: any): void {
    this.element.style.display = "block";
    document.body.classList.add("v2hrm-modal-open");
    Promise.all([this.getEmployee()]).then((res: any) => {
      this.lstEmployee = res[0];
      this.model = new OvertimeDetail(param);
    });
  }
  getEmployee() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/employee/getlist").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  // close modal
  close(): void {
    this.element.style.display = "none";
    document.body.classList.remove("v2hrm-modal-open");
    this.editForm.reset();
    this.modalService.modalStatus.next("close");
  }
  maximize() {
  }
  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }
  choise() {
    if (!this.editForm.valid) {
      this.notification.warning("Giá trị không hợp lệ");
      this.editForm.markAllAsTouched();
      return;
    }
    var model = _.cloneDeep(this.model);
    let y = moment(model.timeStart).isSameOrBefore(model.timeEnd);
    if (!y) {
      this.notification.warning("Giờ bắt đầu phải nhỏ hơn giờ kết thúc");
      return;
    }
    model.timeStart = moment(model.timeStart).format() || null;
    model.timeEnd = moment(model.timeEnd).format() || null;
    model.workingDay = moment(model.workingDay).format("YYYY-MM-DD") || null;

    if (model.isAdd) {
      this._coreService.Post("hr/overtime/create", model).subscribe((res: any) => {
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.addSuccess();
          this.modalService.overtime.next(model);
          this.modalService.close("cms-app-modalsovertime");
        }
      });
    } else {
      this._coreService.Post("hr/overtime/update", model).subscribe((res: any) => {
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.editSuccess();
          this.modalService.overtime.next(model);
          this.modalService.close("cms-app-modalsovertime");
        }
      });
    }
  }

  changeDate = (model: string) => {
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

  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
export class OvertimeDetail {
  id: number = 0;
  employeeId?: number;
  EmpIds?: Array<number>;
  employeeCode?: string;
  employeeName?: string;
  positionName?: string;
  timeStart?: any;
  timeEnd?: any;
  workingDay?: any;
  isAdd?: any;
  note?:string;
  constructor(model?: OvertimeDetail) {
    if (!!model) {
      this.id = model!.id;
      this.employeeCode = model!.employeeCode || null || undefined;
      this.employeeId = model!.employeeId || null || undefined;
      this.employeeName = model!.employeeName || null || undefined;
      this.positionName = model!.positionName || null || undefined;
      this.timeStart = model!.timeStart || null;
      this.timeEnd = model!.timeEnd || null;
      this.workingDay = model!.workingDay || null;
      this.isAdd = model!.isAdd || null;
    }
  }
}
