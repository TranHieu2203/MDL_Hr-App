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

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const $ = require("jquery");
import { SalaryStructure } from "src/app/_models/app/cms";
setCulture("en");

@Component({
  selector: "cms-payroll-salarystructure-edit",
  templateUrl: "./salarystructure-edit.component.html",
  styleUrls: ["./salarystructure-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SalaryStructureEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    
  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: SalaryStructure = new SalaryStructure();
  modelTemp: SalaryStructure = new SalaryStructure();
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

  lstGroupId: any = [];
  lstElementId: any = [];
  lstSalaryTypeId: any = [];

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
      salaryTypeId: ["", [Validators.required]],
      groupId: ["", [Validators.required]],
      elementId: ["", [Validators.required]],

      isVisible: [""],
      isCalculate: [""],
      isImport: [""],
      isChange:[""],
      isSum: [""],
      orders: [""],
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
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
        this.editForm.disable();
      }
      if (x === "new") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      if (x === "edit") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.ADD, ToolbarItem.SAVE];
      }
      this.toolItems$.next(toolbarList)
    })

    this.mode = "CheckBox";
  }
  loadData() {
    Promise.all([
      this.getById(),
      this.getGroupElement(),
      this.getSalaryType(),
    ]).then((res: any[]) => {
      this.lstGroupId = res[1];
      this.lstSalaryTypeId = res[2];
      if (this.paramId) {
        let model = res[0];
        this.model = _.cloneDeep(_.omit(model, ["elementId"]));
        this.getElement(model.groupId)
          .then((res: any) => {
            this.lstElementId = res;
          })
          .then((r) => {
            this.model.elementId = model.elementId;
          });
      } else {
        this.model.orders = 1;
      }
    });
  }
  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("payroll/structure/get?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
  }
  getGroupElement() {
    return new Promise((resolve) => {
      this._coreService.Get("payroll/element/getlistgroup").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getElement(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("payroll/element/getlist?groupid=" + id)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getSalaryType() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Salarytype/getlist").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  changeGroup(e: any) {
    if (e.e) {
      this.getElement(e.itemData.id).then((res: any) => {
        this.lstElementId = res;
      });
    }
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
          this.router.navigate(["cms/payroll/list/salarystructure"]);
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
  // lưu data open popup
  saveData = () => {
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    } else {
    }

    let param = this.convertModel(this.model);

    if (this.flagState$.value === "new") {
      this._coreService.Post("payroll/structure/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/payroll/list/salarystructure"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("payroll/structure/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/payroll/list/salarystructure"]);
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
    model.changeMonth = param.changeMonth
      ? moment(param.changeMonth).format("MM/DD/YYYY")
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
      this.router.navigate(["/hrms/payroll/list/salarystructure"]);
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
