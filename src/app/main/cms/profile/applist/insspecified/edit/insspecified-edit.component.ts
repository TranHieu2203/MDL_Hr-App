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
import { SalaryRank } from "src/app/_models/app/cms/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const async = require("async");
const $ = require("jquery");
import { InsSpecified } from "src/app/_models/app/cms/profile/applist/insspecified";
setCulture("en");

@Component({
  selector: "app-insspecified-edit",
  templateUrl: "./insspecified-edit.component.html",
  styleUrls: ["./insspecified-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class InsSpecifiedEditComponent implements OnInit {
  // Varriable Language
  // flagState = "";
  // flag show popup toolbar Back
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  flagePopup = true;
  paramId = "";

  model: InsSpecified = new InsSpecified();
  modelTemp: InsSpecified = new InsSpecified();
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
  lstSalaryScaleId: any;
  lstInsRegionId: any = [];

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

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      locationId: ["", [Validators.required]],
      locationName: ["", []],
      effectiveDate: ["", [Validators.required]],
      si: ["", []],
      hi: ["", [Validators.required]],
      ui: ["", [Validators.required]],
      oi: ["", [Validators.required]],
      siCom: ["", [Validators.required]],
      siEmp: ["", [Validators.required]],
      hiCom: ["", [Validators.required]],
      hiEmp: ["", [Validators.required]],
      uiCom: ["", [Validators.required]],
      uiEmp: ["", [Validators.required]],
      oiCom: ["", [Validators.required]],
      oiEmp: ["", [Validators.required]],
      salaryMin: ["", [Validators.required]],
      salaryBasic: ["", [Validators.required]],
      maternity: ["", []],
      sick: ["", []],
      offInHouse: ["", []],
      offTogether: ["", []],
      retireMale: ["", [Validators.required]],
      retireFemale: ["", [Validators.required]],

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
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
        this.editForm.get("code")!.disable();
      }
      this.toolItems$.next(toolbarList)
    })
    async.waterfall(
      [
        (cb: any) => {
          if (this.paramId) {
            this._coreService
              .Get("hr/insspecified/get?id=" + this.paramId)
              .subscribe((res: any) => {
                this.modelTemp = res.data;
                cb();
              });
          } else {
            cb();
          }
        },
        (cb: any) => {

          this._coreService.Get("hr/otherlist/INSREGION").subscribe((res: any) => {
            this.lstInsRegionId = res.data;
            cb();
          });
        },

      ],
      (err: any, ok: any) => {
        this.model = _.cloneDeep(this.modelTemp);
        //delete this.modelTemp;
      }
    );
    this.mode = "CheckBox";
  }

  // Build Toolbar


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
          this.router.navigate(["hrms/profile/list/insspecified"]);
        }
        this.router.navigate(["hrms/profile/list/insspecified"]);
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
    }
    if (this.model.hi != undefined && this.model.hiCom != undefined && this.model.hiEmp != undefined && this.model.si != undefined && this.model.siCom != undefined && this.model.siEmp != undefined
      && this.model.oi != undefined && this.model.oiCom != undefined && this.model.oiEmp != undefined && this.model.ui != undefined && this.model.uiCom != undefined && this.model.uiEmp != undefined
      && this.model.salaryMin != undefined && this.model.salaryBasic != undefined) {

      if (this.model.hi < 0 || this.model.hiCom < 0 || this.model.hiEmp < 0 || this.model.si < 0 || this.model.siCom < 0 || this.model.siEmp < 0
        || this.model.oi < 0 || this.model.oiCom < 0 || this.model.oiEmp < 0 || this.model.ui < 0 || this.model.uiCom < 0 || this.model.uiEmp < 0 
         || this.model.salaryMin < 0 && this.model.salaryBasic < 0) {

        this.notification.warning("Tồn tại số tiền < 0");
        return;


      }

    }


    let param = this.convertModel(this.model);
    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/insspecified/Add", param).subscribe(
        (res: any) => {
          //check error

          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/list/insspecified"]);
          }
        },
        (error: any) => {
          this.notification.editError();
        }
      );
    }
    else {
      this._coreService.Post("hr/insspecified/update", param).subscribe(
        (res: any) => {
          //check error

          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/list/insspecified"]);
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
    return model;
  }

  // filter type
  // change date
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/list/insspecified"]);
    }
  };
}
