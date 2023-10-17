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
import * as moment from "moment";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";

setCulture("en");

@Component({
  selector: "cms-app-modalsregisteroff",
  templateUrl: "./modalsregisteroff.component.html",
  styleUrls: ["./modalsregisteroff.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ModalsRegisterOffComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  @Input() id!: string;

  @ViewChild("overviewgrid", { static: true })
  public gridInstance!: GridComponent;
  model: RegisterOffDetail = new RegisterOffDetail();
  public fields = { value: "id", text: "name" };
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
  lsttype: any[] = [
    { id: 1, name: 'Buổi sáng' },
    { id: 2, name: 'Buổi chiều' }
  ];

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
      timetypeId: ["", [Validators.required]],
      employeeId: ["", [Validators.required]],
      dateStart: ["", [Validators.required]],
      dateEnd: ["", [Validators.required]],
      note: [""],
      isFullDay: ["",[]],
      afterOrBefore: ["",[]]
    });
    this.model.afterOrBefore = this.lsttype[0].id;
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
    this.element.style.display = "block";
    document.body.classList.add("v2hrm-modal-open");
    Promise.all([this.getEmployee(), this.getTimeType()]).then((res: any) => {
      this.lstEmployee = res[0];
      this.lsttimetypeId = res[1];
      this.model = new RegisterOffDetail(param);
    });
  }
  getEmployee() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/employee/getlist").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getTimeType() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/timetype/GetListSymbols").subscribe((res: any) => { //getlistoff
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
      this.notification.formInvalid();
      this.editForm.markAllAsTouched();
      return;
    }
    var model = _.cloneDeep(this.model);
    let y = moment(model.dateStart).isSameOrBefore(model.dateEnd);
    if (!y) {
      this.notification.warning("Ngày bắt đầu phải nhỏ hơn ngày kết thúc");
      return;
    }
    model.dateStart = moment(model.dateStart).format("YYYY-MM-DD");
    model.dateEnd = moment(model.dateEnd).format("YYYY-MM-DD");

    if (model.isAdd) {
      this._coreService
        .Post("hr/registeroff/create", model)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.modalService.registeroff.next(model);
            this.modalService.close("cms-app-modalsregisteroff");
          }
        });
    } else {
      this._coreService
        .Post("hr/registeroff/update", model)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.modalService.registeroff.next(model);
            this.modalService.close("cms-app-modalsregisteroff");
          }
        });
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
      if (value && (value.length === 6 || value.length === 8)) {
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
export class RegisterOffDetail {
  id!: number;
  employeeId?: number;
  employeeCode?: string;
  employeeName?: string;
  positionName?: string;
  dateStart?: any;
  dateEnd?: any;
  timetypeId?: number;
  timeTypeCode?: string;
  isAdd?: Boolean;
  note?: string;
  isFullDay?: boolean | false;
  afterOrBefore?: number;
  constructor(model?: RegisterOffDetail) {
    if (model) {
      this.id = model.id!;
      this.employeeCode = model.employeeCode!;
      this.employeeId = model.employeeId!;
      this.employeeName = model.employeeName!;
      this.positionName = model.positionName!;
      this.dateStart = model.dateStart!;
      this.dateEnd = model.dateEnd!;
      this.timetypeId = model.timetypeId!;
      this.isAdd = model.isAdd!;
      this.note = model.note!;
      this.isFullDay = model.isFullDay!;
      this.afterOrBefore = model.afterOrBefore!;
    }
  }
}
