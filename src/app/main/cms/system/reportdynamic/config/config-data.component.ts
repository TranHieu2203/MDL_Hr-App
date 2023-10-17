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
import { ReportDynamic, ReportDynamicDtl } from "src/app/_models/app/list/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
const async = require("async");
setCulture("en");

@Component({
  selector: "reportdynamic-config-data",
  templateUrl: "./config-data.component.html",
  styleUrls: ["./config-data.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ReportDynamicConfigDataComponent implements OnInit {

  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.BACK, ToolbarItem.EDIT, ToolbarItem.SAVE  ])


  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: ReportDynamic = new ReportDynamic();
  modelTemp: ReportDynamic = new ReportDynamic();
  languages: any;
  selectedLanguage: any;
  lstModule:any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstApplication: any;
  public lstReportDynamicDtlTemp = new Array<ReportDynamicDtl>(); // dữ liệu map
  public lstReportDynamicDtl = new Array<ReportDynamicDtl>(); // dữ liệu lưu chi tiết
  public lstReportDynamicLst = new Array<ReportDynamicDtl>(); // dữ liệu gốc load từ table(GetDynamiDtlDefault)

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
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[-+\/.,_a-zA-Z0-9]+$/),
        ],
      ],
      nameVn: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(300),
        ],
      ],
      storedProcedureName: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(300),
        ],
      ],
      moduleId: [
        [
          Validators.required
        ],
      ],
      orders: []
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
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
        this.editForm.get("code")!.disable();
      }
      this.toolItems$.next(toolbarList)
    })
    // Build toolbar
 
    async.waterfall(
      [

        // get list lstReportDynamicLst
        (cb: any) => {
          if (this.paramId) {
            this._coreService
              .Get("package/reportdynamicdtl/GetDynamiDtlDefault?id=" + this.paramId)
              .subscribe((res: any) => {
                this.lstReportDynamicLst = res;
        
                cb();
              });
          } else {
            cb();
          }
        },
        // // get list lstReportDynamicDtl

        // (cb: any) => {
        //   if (this.paramId) {
        //     this._coreService
        //       .Get("package/reportdynamicdtl/GetAll?id=" + this.paramId)
        //       .subscribe((res: any) => {

        //         this.lstReportDynamicDtl = res;
        //   
        //         cb();
        //       });
        //   } else {
        //     cb();
        //   }
        // },
      ],
      (err: any, ok: any) => {

        // thực hiện map với nhau vào lstReportDynamicTemp
        this.lstReportDynamicDtlTemp = _.cloneDeep(this.lstReportDynamicLst);
      }
    );
  }

  // Get Module
  
  // getModule = () =>{
  //   this._coreService.Get("package/module/GetAll").subscribe((res: any) => {
  //     this.lstModule = res.data;
  //   })};

  // Build Toolbar
  buildToolbar = () => {
    setTimeout(() => {
      let toolbarList: any[] = [ToolbarItem.BACK, ToolbarItem.SAVE];

      this.toolbar = this.globals.buildToolbar("sys_reportdynamic", toolbarList!);
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
          this.router.navigate(["hrms/system/reportdynamic"]);
        }
        break;
      case ToolbarItem.ADD:
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


    this._coreService.Post("package/reportdynamicdtl/add", this.lstReportDynamicDtlTemp).subscribe(
      (res: any) => {
        //check error
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.addSuccess();
          this.router.navigate(["/hrms/system/reportdynamic"]);
        }
      },
      (error: any) => {
        this.notification.addError();
      }
    );
    return;


    if (!this.editForm.valid) {
      this.notification.formInvalid();
      this.editForm.markAllAsTouched();
    } else {
      if (this.flagState$.value === "new") {    
        this._coreService.Post("package/reportdynamic/add", this.model).subscribe(
          (res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.addSuccess();
              this.router.navigate(["/hrms/system/reportdynamic"]);
            }
          },
          (error: any) => {
            this.notification.addError();
          }
        );
      } else {
        this._coreService.Post("package/reportdynamic/update", this.model).subscribe(
          (res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.editSuccess();
              this.router.navigate(["/hrms/system/reportdynamic"]);
            }
          },
          (error: any) => {
            this.notification.editSuccess();
          }
        );
      }
    }
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
          this.router.navigate(["/hrms/system/reportdynamic"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/system/reportdynamic"]);
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
