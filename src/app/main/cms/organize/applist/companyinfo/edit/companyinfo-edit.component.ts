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
import { CompanyInfo } from "src/app/_models/app/cms/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const async = require("async");
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "app-companyinfo-edit",
  templateUrl: "./companyinfo-edit.component.html",
  styleUrls: ["./companyinfo-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyInfoEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: CompanyInfo = new CompanyInfo();
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
  lstProvinceId: any = [];
  lstDistrictId: any = [];
  lstWardId: any = [];
  lstBankId: any = [];
  lstRegionId: any = [];
  lstInsUnitId: any = [];

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
      orgId: ["", [Validators.required]],
      orgCode: ["", []], //Mã công ty
      nameVN: [
        "",
        [Validators.required, this.globals.noWhitespaceValidator],
      ],
      nameEN: ["",[]],
      gpkdAddress: [
        "",
        [Validators.required],
      ],
      phoneNumber: ["", []], 
      workAddress: ["", []], 
      provinceId: ["", []],
      districtId: ["", []],
      wardId: ["", []],
      insUnit: ["", [Validators.required]],
      regionId: ["", [Validators.required]],
      pitCode: ["", []], 
      pitCodeChange: ["", []], 
      representativeId: ["", []],
      pitCodeDate: [""],
      representativePosition: ["", []], 
      signPosition: ["", []], 
      signId: ["", []],
      pitCodePlace: ["", []], 
      gpkdNo: ["", []], 
      gpkdDate: ["", []], 
      website: ["", []], 
      fax: ["", []], 
      note: ["", []], 
      signNation: ["", []], 
      representativeNation: ["", []], 
      bankAccount: ["", []], 
      bankBranch: ["", []], 
      bankId: ["", []],
    });
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.loadData();

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
      }
      this.toolItems$.next(toolbarList)

    })

    this.mode = "CheckBox";
    
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
          this.router.navigate(["cms/organize/list/companyinfo"]);
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
    let param = this.convertModel(this.model);

    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/companyinfo/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/organize/list/companyinfo"]);
            return;
          } else {
            if (res.message && res.message.length > 0) {
              this.notification.warning("Thêm không thành công");
            } else {
              this.notification.addError();
            }
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/companyinfo/update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/organize/list/companyinfo"]);
          } else if (res.statusCode == 400) {
            this.notification.warning("Sửa không thành công");
          }
        },
        (error: any) => {
          this.notification.editError();
        }
      );
    }
  };
  
  choiseRepresentative() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.representativeId,
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.representativeName = res.employeeName;
      this.model.representativeId = res.employeeId;
      this.model.representativeNation = res.nationalityName;
      this.model.representativePosition = res.positionName;
      x.unsubscribe();
    });
  }
  
  choiseSigner() {
    if (this.flagState$.value === "view") {
      return;
    }
    let param = {
      selected: this.model.signId,
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.signName = res.employeeName;
      this.model.signId = res.employeeId;
      this.model.signNation = res.nationalityName;
      this.model.signPosition = res.positionName;
      x.unsubscribe();
    });
  }
  getRegion() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/INSREGION").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getInsUnit() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/INSUNIT").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getWard(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/province/getListWard?districtid=" + id)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  changeDistrict(e: any) {
    if (e.e) {
      this.model.wardId = undefined;
      this.lstWardId = [];
      this.getWard(e.itemData.id).then((res: any) => {
        this.lstWardId = res;
      });
    }
  }

  getDistrict(id: number) {
    return new Promise((resolve) => {
      if (id) {
        this._coreService
          .Get("hr/province/getListDistrict?provinceId=" + id)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
  }
  changeProvince(e: any) {
    if (e.e) {
      this.model.districtId = undefined;
      this.lstDistrictId = [];
      this.model.wardId = undefined;
      this.lstWardId = [];
      this.getDistrict(e.itemData.id).then((res: any) => {
        this.lstDistrictId = res;
      });
    }
  }
  getProvince() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/province/getListProvince").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getlstBankId() {
    //hình thức đào tạo
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/bank/GetList")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }

  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/CompanyInfo/Get?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
  }

  loadData() {
    Promise.all([
      this.getById(),
      this.getProvince(),
      this.getlstBankId(),
      this.getInsUnit(),
      this.getRegion(),
    ]).then((res: any) => {
      this.lstProvinceId = res[1];
      this.lstBankId = res[2];
      this.lstInsUnitId = res[3];
      this.lstRegionId = res[4];
      
      if (this.paramId) {
        this.model = _.cloneDeep(res[0]);
        this.loadDatalazy(res[0]);
      }
    });
  }

  loadDatalazy(obj: CompanyInfo) {
    if (obj && obj.provinceId) {            
      this.getDistrict(obj.provinceId)
        .then((res: any) => {
          this.lstDistrictId = res;
        })
        .then((x) => {
          this.model.districtId = 0;
          this.model.districtId = obj.districtId;
        });       
      this.getWard(obj.districtId)
        .then((res: any) => {
          this.lstWardId = res;
        })
        .then((x) => {
          this.model.wardId = 0;
          this.model.wardId = obj.wardId;
        });
    }
  }
  
  choiseOrg() {
    if (this.flagState$.value === "view") {
      return;
    }
    let param = {
      selected: this.model.orgId, //select employee on grid
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      this.model.orgId = res.ID;
      this.model.orgName = res.NAME;
      this.model.orgCode = res.CODE;
      x.unsubscribe();
    });
  }

  convertModel(param: any) {
    let model = _.cloneDeep(param);
    // model.gpkdDate = param.gpkdDate
    //   ? moment(param.gpkdDate).format("MM/DD/YYYY")
    //   : null;
    // model.pitCodeDate = param.pitCodeDate
    //   ? moment(param.pitCodeDate).format("MM/DD/YYYY")
    //   : null;
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
          this.router.navigate(["/hrms/organize/list/companyinfo"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/organize/list/companyinfo"]);
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
