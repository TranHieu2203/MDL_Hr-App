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
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
const _ = require("lodash");
const $ = require("jquery");
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ModalService } from "src/app/_services/modal.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Query, Predicate } from "@syncfusion/ej2-data";
import * as moment from "moment";
import { TimeSheet, TimeSheetRoot } from "src/app/_models";
import { TimeSheetService } from "src/app/_services/timesheet.service";

setCulture("en");

@Component({
  selector: "cms-app-modalstimesheetroot",
  templateUrl: "./modalstimesheetroot.component.html",
  styleUrls: ["./modalstimesheetroot.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ModalsTimeSheetRootComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  @Input() id!: string;

  @ViewChild("overviewgrid", { static: true })
  public gridInstance!: GridComponent;
  model: any = new TimeSheetRoot();
  modelGetList: TimeSheet = new TimeSheet();
  public formatString: string = "HH:mm";
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
  public query = new Query();
  lstTimeTypeId: any;
  public fields: any = { value: "id", text: "name" };
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
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
    private _formBuilder: FormBuilder,
    private _timesheet: TimeSheetService,
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
      employeeName: ["", [Validators.required]],
      employeeCode: ["", [Validators.required]],
      workingDay: [""],
      timeEdit: [""],
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
  }

  // open modal
  open(param?: any): void {
    if (param) {
      if(param.TYPE_EDIT == "IN")
      param.TIME_EDIT = param.TIME_POINT1 ? moment(param.TIME_POINT1,"HH:mm:ss").format("HH:mm") || null : null
      if(param.TYPE_EDIT == "OUT")
      param.TIME_EDIT = param.TIME_POINT4 ? moment(param.TIME_POINT4,"HH:mm:ss").format("HH:mm") || null : null;
      this.model = param;
      this.modelGetList.orgId = param.ORG_ID;
      this.modelGetList.periodId = param.PERIOD_ID;
    }
    this.editForm.get("workingDay")!.disable();
    this.element.style.display = "block";
    document.body.classList.add("v2hrm-modal-open");
  }

  // close modal
  close(): void {
    this.editForm.reset();
    this.element.style.display = "none";
    document.body.classList.remove("v2hrm-modal-open");
    this.modalService.modalStatus.next("close");
  }
  maximize() {
  }
  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }
  save() {
    if (!this.editForm.valid) {
      this.notification.formInvalid();
      this.editForm.markAllAsTouched();
      return;
    }
    let model = _.cloneDeep(this.model);
    model.TIME_EDIT = model.TIME_EDIT ? moment(model.TIME_EDIT,"HH:mm:ss").format("HH:mm") || null : null;
    this._coreService
      .Post("hr/TimeSheetMonthly/UpdateTimeSheetMachine", model)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.notification.editSuccess();
          this._timesheet.timesheetroot.next(this.modelGetList);
          this.modalService.close("cms-app-modalstimesheetroot");
        } else {
          this.notification.warning("Thất bại");
        }
      });
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

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
  }
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
