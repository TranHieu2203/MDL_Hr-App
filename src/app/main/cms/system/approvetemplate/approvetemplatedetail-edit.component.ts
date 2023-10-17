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
import { TranslationLoaderService } from "src/app/common/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { locale as english } from "src/app/i18n/en";
import { locale as vietnam } from "src/app/i18n/vi";
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
import { ApproveTemplateDetail } from "src/app/_models/app/list/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
const async = require("async");
setCulture("en");

@Component({
  selector: "app-approvetemplatedetail-edit",
  templateUrl: "./approvetemplatedetail-edit.component.html",
  styleUrls: ["./approvetemplatedetail-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ApproveTemplateDetailEditComponent implements OnInit {
  // Varriable Language
  flagState = "";
  // flag show popup toolbar Back
  flagePopup = true;
  paramTemplateId = "";
  paramTemplateDetailId = "";

  model: ApproveTemplateDetail = new ApproveTemplateDetail();
  modelTemp: ApproveTemplateDetail = new ApproveTemplateDetail();
  languages: any;
  selectedLanguage: any;

  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstTypeProcess: any;
  lstTitleId: any;
  lstMailTemplateId: any;

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
      this.paramTemplateId = params["templateId"];
      const paramTemplateDetailId = params["templateDetailId"];
      if (paramTemplateDetailId !== "new") {
        if (paramTemplateDetailId) {
          this.paramTemplateDetailId = paramTemplateDetailId;
          this.flagState = "edit";
        }
        else {
          this.router.navigate(["/errors/404"]);
        }
      }
      else {
        this.flagState = "new";
      }
    });

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      seProcessTemplateId: ["",[]],
      stepName:["",[Validators.required]],
      stepNumber: ["",[Validators.required]],
      approveId: ["",[]],
      approveAssignId: ["",[]],
      typeProcessId:["",[]],
      dmLevel: ["",[]],
      isNextstepNull: ["",[]],
      isNextstepDuplicate: ["",[]],
      emailTemplate: ["",[]],
      isSendmail: ["",[]],
      employeeCode: ["", []],
      employeeName: ["", []],
      positionId: ["", []],
      positionName: ["", []],
      mailTemplateId: ["",[]]
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
      
    }
    async.waterfall(
      [
        (cb: any) => {
          if (this.paramTemplateDetailId) {
            this._coreService
              .Get("tenant/approvetemplate/getapprovetemplatedetailbyid?id=" + this.paramTemplateDetailId)
              .subscribe((res: any) => {
                this.modelTemp = res.data;
                cb();
              });
          } else {
            cb();
          }
        },
        (cb: any) => {
          this._coreService.Get("tenant/approvetemplate/GetListPosition").subscribe((res: any) => {
            this.lstTitleId = res.data;
            cb();
          });
        },
        (cb: any) => {
          this._coreService.Get("hr/mailsetting/GetList").subscribe((res: any) => {
            this.lstMailTemplateId = res.data;
            cb();
          });
        }
      ],
      (err: any, ok: any) => {
        this.model = _.cloneDeep(this.modelTemp);
        //delete this.modelTemp;
      }
    );
    this.lstTypeProcess = [
      {id:0, name:"Quản lý trực tiếp"},
      {id:1, name:"Quản lý cấp trên"},
      {id:2, name:"HR"},
      {id:3, name:"Vị trí công việc"},
      {id:4, name:"Chọn người"}
   ];
  }

  // Build Toolbar
  buildToolbar = () => {
    setTimeout(() => {
      let toolbarList: any[] = [ToolbarItem.BACK, ToolbarItem.SAVE];
      this.toolbar = this.globals.buildToolbar("sys_approvetemplatedetail", toolbarList!);
      if (this.flagState === "view") {
        this.toolbar[1].isDisable = true;
      }
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
          const objParamAdd = { templateId: this.paramTemplateId };
          const paramAdd = window.btoa(JSON.stringify(objParamAdd));
          this.router.navigate(["/hrms/system/approvetemplate/detail/", paramAdd]);
        }
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      default:
        break;
    }
  };
  // lưu data open popup
  saveData = () => {

    if (!this.editForm.valid) {
      this.notification.formInvalid();
      this.editForm.markAllAsTouched();
    } else {
      this.model.seProcessTemplateId = +this.paramTemplateId;
      if (this.flagState === "new") {
        this._coreService.Post("tenant/approvetemplate/createapprovetemplatedetail", this.model).subscribe(
          (res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.addSuccess();
              const objParamAdd = { templateId: this.paramTemplateId };
              const paramAdd = window.btoa(JSON.stringify(objParamAdd));
              this.router.navigate(["/hrms/system/approvetemplate/detail/", paramAdd]);
            }
          },
          (error: any) => {
            this.notification.addError();
          }
        );
      } else {
        this._coreService.Post("tenant/approvetemplate/updateapprovetemplatedetail", this.model).subscribe(
          (res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.editSuccess();
              const objParamAdd = { templateId: this.paramTemplateId };
              const paramAdd = window.btoa(JSON.stringify(objParamAdd));
              this.router.navigate(["/hrms/system/approvetemplate/detail/", paramAdd]);
            }
          },
          (error: any) => {
            this.notification.editError();
          }
        );
      }
    }
  };

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      const objParamAdd = { templateId: this.paramTemplateId };
      const paramAdd = window.btoa(JSON.stringify(objParamAdd));
      this.router.navigate(["/hrms/system/approvetemplate/detail/", paramAdd]);
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
  
  //search employee
  choiseEmp() {
    let param = {
      selected: -1,//this.model.employeeId, //select employee on grid
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.employeeCode = res.employeeCode;
      this.model.employeeName = res.employeeName;
      this.model.approveId = res.employeeId;
      x.unsubscribe();
    });
  }

  changeAppType(e: any) {
    if (e.e) {
      this.model.approveId = undefined;
      this.model.employeeCode = undefined;
      this.model.employeeName = undefined;
      this.editForm.controls["employeeCode"].clearValidators();
      this.editForm.controls["employeeCode"].updateValueAndValidity();
      this.model.positionId = undefined;
      this.editForm.controls["positionId"].clearValidators();
      this.editForm.controls["positionId"].updateValueAndValidity();
    }
    if (e.itemData) {
      if (e.itemData.id == 4) {
        this.editForm.controls["employeeCode"].setValidators([Validators.required]);
        this.editForm.controls["employeeCode"].updateValueAndValidity();
      }
      else if (e.itemData.id == 3) {
        this.editForm.controls["positionId"].setValidators([Validators.required]);
        this.editForm.controls["positionId"].updateValueAndValidity();
      }
      if (e.itemData.id == 3) {
        this.editForm.controls['positionId'].enable();
      }
      else {
        this.editForm.controls['positionId'].disable();
      }
    }
  }

  changeTitleId(e: any) {
    if (e.e) {
      this.model.approveId = undefined;
      if (e.itemData) {
        this.model.approveId = e.itemData.id;
      }
    }
  }
}
