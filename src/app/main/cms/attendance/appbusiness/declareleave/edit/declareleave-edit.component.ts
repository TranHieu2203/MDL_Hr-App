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
  FormControl,
} from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import { DeclareLeave } from "src/app/_models/app/cms";
setCulture("en");

@Component({
  selector: "cms-attendent-declareleave-edit",
  templateUrl: "./declareleave-edit.component.html",
  styleUrls: ["./declareleave-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class DeclareleaveEditComponent implements OnInit {
  // Varriable Language
  flagState$ = new BehaviorSubject<string>("");
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: DeclareLeave = new DeclareLeave();
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "name", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;

  lstPeriodId: any[] = [];
  lstYear = [];
  

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
      this._coreService
        .Get("hr/SalaryPeriod/GetYear")
        .subscribe((res: any) => {
          this.lstYear = res.data;
        });

      if (paramId !== "new") {
        const objParam = window.atob(paramId);
        const paramUrl = JSON.parse(objParam);
        if (paramUrl && paramUrl.id) {
          this.paramId = paramUrl.id;
          this.flagState$.next(paramUrl.type);
          this.getById();
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
      employeeCode: ["", [Validators.required]], //mã nhân viên
      employeeName: [""],
      orgId: ["", [Validators.required]],
      orgParentName: [null, []],
      positionName: [null, []],
      year: ["", [Validators.required]], //Loại quyết định
      month: ["", [Validators.required]], //Sô quyết định
      numberChange: ["", [Validators.required]],
      note: ["", []],
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
      if (x === "view") {
        this.editForm.disable();
        this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.EDIT]);
      }
      if (x === "new" || x === "edit") {
        this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.SAVE]);
      }
  
    })

    this.mode = "CheckBox";
  }

  choiseEmp() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.employeeId, //select employee on grid
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.employeeId = res.employeeId;
      this.model.employeeCode = res.employeeCode;
      this.model.employeeName = res.employeeName;
      this.model.positionName = res.positionName;
      this.model.orgId = res.orgId;
      this.model.orgName = res.orgName;
      this.model.orgParentName = res.orgParentName;
      x.unsubscribe();
    });
  }

  getById() {
    if (this.paramId) {
      this._coreService
        .Get("hr/entitlement/get?id=" + this.paramId)
        .subscribe((res: any) => {
          this.model = res.data;
        });
    }
  }

  toolItems$ = new BehaviorSubject<any[]>([]);

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
          this.router.navigate(["cms/attendance/business/declareleave"]);
        }
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        // if(this.model.statusId == 2 && !this.globals.isAdmin)
        // {
        //   this.notification.warning("notify.APPROVED");
        //   return;
        // }
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
    }

    let param = this.convertModel(this.model);
    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/entitlement/Create", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/attendance/business/declareleave"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/entitlement/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/attendance/business/declareleave"]);
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

    // model.effectDate = param.effectDate
    //   ? moment(param.effectDate).format("MM/DD/YYYY")
    //   : null;
    // model.signDate = param.signDate
    //   ? moment(param.signDate).format("MM/DD/YYYY")
    //   : null;

    return model;
  }

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/attendance/business/declareleave"]);
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
