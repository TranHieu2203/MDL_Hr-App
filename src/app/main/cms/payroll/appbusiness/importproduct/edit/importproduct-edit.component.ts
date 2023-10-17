import {
  Component,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";
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
import { Advance } from "src/app/_models/app/cms";
setCulture("en");

@Component({
  selector: "cms-importproduct-edit",
  templateUrl: "./importproduct-edit.component.html",
  styleUrls: ["./importproduct-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ImportProductEditComponent implements OnInit {
  // Varriable Language
  flagState = "";
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: Advance = new Advance();
  modelTemp: Advance = new Advance();
  modelTemp1: Advance = new Advance();
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

  lstPeriod: any = [];
  lstStatusId: any = [];
  lstWorkingId: any = [];
  disable: any;

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
          this.flagState = paramUrl.type;
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState = "new";
      }
    });
    this.loadData();
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      code: ["", [Validators.required]], //mã nhân viên
      fullname: [{ value: "", disable: this.disable }, []],
      //unit: [""], //Đơn vị
      positionId: [{ value: "", disable: this.disable }, []], //chức danh
      orgId: ["", []],
      orgParentName: ["", []],
      
      period: ["",Validators.required],
      money: ["",Validators.required],
      advanceDate: ["",Validators.required],
      yearId: [""],

      signer: ["", [Validators.required]], //Người ký
      signerPosition: ["", []], //Chức danh ký
      signDate: ["", [Validators.required]], //Ngày ký
      note: ["", []],
      status: ["", [Validators.required]],
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
      this.editForm.get("code")!.disable();
    }
    if(this.flagState == 'new'){
      this.model.year = moment(new Date).year();
      this.getListShiftPeriod( this.model.year).then((res: any) => {
        this.lstPeriod = res;
      });
    }

    this.mode = "CheckBox";
    this.disable = true;
  }
  ngAfterViewInit(): void {
  
  }
  loadData() {
    Promise.all([
      new Promise((resolve) => {
        if (this.paramId) {
          this._coreService
            .Get("advance/get?id=" + this.paramId)
            .subscribe((res: any) => {
              resolve(res.data);
            });
        } else {
          resolve(false);
        }
      })
      , //1
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/STATUSAPPROVE").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //2
    ]).then((res: any) => {
      this.lstStatusId = res[1];
      if (this.paramId) {
        let modelInit = _.cloneDeep(res[0]);
        this.getListShiftPeriod(modelInit.year).then((res1: any) => {
          this.lstPeriod = res1;
          this.model = _.cloneDeep(res[0]);
        });
      }
    });
  }
  choiseEmp() {
    if (this.flagState == "view") {
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
      this.model.orgName = res.orgName;
      this.model.orgParentName = res.orgParentName;
      x.unsubscribe();
    });
  }
  choiseSigner() {
    if (this.flagState == "view") {
      return;
    }
    let param = {
      selected: this.model.signId,
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.signerPosition = res.positionName;
      this.model.signerName = res.employeeName;
      this.model.signId = res.employeeId;
      x.unsubscribe();
    });
  }
  changeYear(e: any) {
    if (e.isInteracted) {
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriod = res;
      });
    }
  }
  getListShiftPeriod(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/SalaryPeriod/getlist?Id=" + id)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  // Build Toolbar
  buildToolbar = () => {
    setTimeout(() => {
      let toolbarList: any[] = [];
      if (this.flagState === "view") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
      }
      if (this.flagState === "new") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      if (this.flagState === "edit") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      this.toolbar = this.globals.buildToolbar("importproduct", toolbarList!);
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
          this.router.navigate(["cms/payroll/business/advance"]);
        }
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        if(this.model.statusId == 2)
        {
          this.notification.warning("notify.APPROVED");
          return;
        }
        this.flagState = "edit";
        this.flagePopup = true;
        this.editForm.enable();
        this.editForm.get("code")!.disable();
        this.buildToolbar();
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
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }
   
    if (this.flagState === "new") {
      this._coreService.Post("advance/add", this.model).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/cms/payroll/business/advance"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("advance/Update",  this.model).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/cms/payroll/business/advance"]);
          }
        },
        (error: any) => {
          this.notification.editError();
        }
      );
    }
  };
  // change date
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
          this.router.navigate(["/cms/payroll/business/advance"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/cms/payroll/business/advance"]);
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
