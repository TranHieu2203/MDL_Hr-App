import {
  Component,
  OnInit,
  ViewChild,
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
  GridComponent,
  VirtualScrollService,ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { SalaryPeriod } from "src/app/_models/app/cms/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import * as moment from "moment";
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "app-salaryperiod-edit",
  templateUrl: "./salaryperiod-edit.component.html",
  styleUrls: ["./salaryperiod-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SalaryPeriodEditComponent implements OnInit {

  toolItems$ = new BehaviorSubject<any[]>([])

  // Varriable Language
  flagState$ = new BehaviorSubject<string>('')
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";
  data: any;
  dataEmp: any;
  model: SalaryPeriod = new SalaryPeriod();
  languages: any;
  selectedLanguage: any;
  editForm!: FormGroup;
  public query = new Query();
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild("overviewgemp", { static: false })
  public gridInstanceEmp!: GridComponent;

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;


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
      name: ["", [Validators.required, Validators.maxLength(51)]],
      month: ["", [Validators.required]],
      year: ["", [Validators.required]],
      dateStart: ["", [Validators.required]],
      dateEnd: ["", [Validators.required]],
      standardWorking: ["", [Validators.required]],
      standardTime: ["", [Validators.required]],
      note: [""],
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

    // Build Toolbar
    this.flagState$.subscribe(x => {

      let toolbarList: any[] = [];
      if (x === "view") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT, ToolbarItem.SAVE];
      }
      if (x === "new") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      if (x === "edit") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }

      this.toolItems$.next(toolbarList)
    });


    if (this.flagState$.value === "view") {
      this.editForm.disable();
    }
  }
  loadData() {
    Promise.all([this.getById()]).then((res: any) => {
      if (this.paramId) {
        this.model = res[0];
      }
    });
  }
  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/salaryperiod/get?id=" + this.paramId)
          .subscribe((res: any) => {
            this.data = res.data.dtl;
            this.dataEmp = res.data.dtlEmp;
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
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
          this.router.navigate(["hrms/attendance/list/salaryperiod"]);
        }
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState$.next("edit");
        this.flagePopup = true;
        this.editForm.enable();
        break;
      default:
        break;
    }
  };

  changeWorking = (e: any, index: any) => {
    if (e.isInteracted) {
      this.data[index].workingStandard = e.value;
      // this.gridInstance.refresh();
    }
  }

  changeWorkingTime = (e: any, index: any) => {
    if (e.isInteracted) {
      this.data[index].standardTime = e.value;
      // this.gridInstance.refresh();
    }
  }
  changeWorkingEmp = (e: any, index: any) => {
    if (e.isInteracted) {
      this.dataEmp[index].workingStandard = e.value;
    }
  }
  changeWorkingTimeEmp = (e: any, index: any) => {
    if (e.isInteracted) {
      this.dataEmp[index].standardTime = e.value;
    }
  }
  // lưu data open popup
  saveData = () => {
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }

    let param = this.convertModel(this.model);
    if (moment(param.dateStart).isSameOrAfter(param.dateEnd)) {
      this.notification.warning("Ngày kết thúc phải lớn hơn ngày bắt đầu");
      return;
    }
    if (this.data != null) {
      param.dtl = this.data;
    }

    if (this.dataEmp != null) {
      param.dtlEmp = this.dataEmp;
    }
    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/salaryperiod/add", param).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/attendance/list/salaryperiod"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/salaryperiod/Update", param).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/attendance/list/salaryperiod"]);
          }
        },
        (error: any) => {
          this.notification.editError();
        }
      );
    }
  };
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    model.dateStart = param.dateStart
      ? moment(param.dateStart).format("YYYY-MM-DD")
      : null;
    model.dateEnd = param.dateEnd
      ? moment(param.dateEnd).format("YYYY-MM-DD")
      : null;
    return model;
  }
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


  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/attendance/list/salaryperiod"]);
    }
  };
  // filter type
  // change date
  // public onFiltering(e: any, a: any) {
  //   e.preventDefaultAction = true;
  //   const predicate = new Predicate("name", "contains", e.text, true, true);
  //   this.query = new Query();
  //   this.query = e.text !== "" ? this.query.where(predicate) : this.query;
  //   e.updateData(a, this.query);
  // }

  Remove(index: any) {
    this.data.splice(index, 1);
    this.gridInstance.refresh();
  }
  choiseOrg() {
    let param = {
      selected: 0, //select employee on grid
      showCheckBox: true
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      let orgId: any = localStorage.getItem("orgIds");
      let localData = JSON.parse(orgId);
      // let data = [];
      if (this.data === undefined) {
        this.data = [];
      }
      localData.forEach((element: any) => {
        res.forEach((subelement: any) => {
          if (element.ID == subelement) {
            var a = _.find(this.data, {
              orgId: element.ID,
            });
            if (a === undefined) {
              this.data.push({
                "orgId": element.ID,
                "name": element.NAME,
                "workingStandard": 0
              });
            }
          }
        });
      });
      this.gridInstance.refresh();
      x.unsubscribe();
    });
  }

  RemoveEmp(index: any) {
    this.dataEmp.splice(index, 1);
    this.gridInstanceEmp.refresh();
  }

  choiseEmp() {
    let param = {
      multiselect: true,
      state: "commend"
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      if (this.dataEmp === undefined) {
        this.dataEmp = [];
      }
      res.forEach((element: any) => {
        var a = _.find(this.dataEmp, {
          empId: element.employeeId,
        });
        if (a === undefined) {
          this.dataEmp.push({
            "empId": element.employeeId,
            "code": element.employeeCode,
            "name": element.employeeName,
            "orgName": element.orgName,
            "positionName": element.positionName,
            "workingStandard": 0
          });
        }
      });
      this.gridInstanceEmp.refresh();
      x.unsubscribe();
    });
  }
}
