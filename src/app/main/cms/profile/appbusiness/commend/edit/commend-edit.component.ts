import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
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
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const $ = require("jquery");
import { Commend, ParamGenCode } from "src/app/_models/app/cms";
import { ListEmployeeComponent } from "src/app/components/listemployee/listemployee.component";
import { Consts } from "src/app/common/const";
setCulture("en");

@Component({
  selector: "cms-profile-commend-edit",
  templateUrl: "./commend-edit.component.html",
  styleUrls: ["./commend-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class CommendEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('')
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  @ViewChild("listemployee", { static: false })
  listEmployee!: ListEmployeeComponent;

  model: Commend = new Commend();
  modelTemp: Commend = new Commend();
  modelAutoGen : ParamGenCode = new ParamGenCode();
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

  lstStatusId = [];
  lstCommendObjId = [];
  lstSourceCostId = [];
  lstPeriodId: any[] = [];

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
      effectDate: ["", [Validators.required]],
      no: ["", [Validators.required]],
      signDate: ["", [Validators.required]], //Ngày ký
      signId: [{ value: "", disabled: true }, [Validators.required]],
      signerPosition: [""], //Chức danh
      //thông tin khen thưởng
      commendObjId: ["", [Validators.required]], //đối tư
      sourceCostId: ["", [Validators.required]], //Nguồn chi
      commendType: ["", [Validators.required]], //hình thức khen thưởng
      reason: ["", [Validators.required]], //lý do khen thưởng
      money: ["", [Validators.required]], //Số tiền, mưc thưởng
      isTax: [""], //tính thuế
      periodId: ["", []], //Kỳ lương tính thuế
      year: ["", [Validators.required]], //năm kỳ lương
      statusId: ["", [Validators.required]], //năm kỳ lương
      orgId: ["", []], //năm kỳ lương
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
      }
      this.toolItems$.next(toolbarList)
    })

    this.mode = "CheckBox";
  }

  loadData() {
    Promise.all([
      new Promise((resolve) => {
        if (this.paramId) {
          this._coreService
            .Get("hr/commend/get?id=" + this.paramId)
            .subscribe((res: any) => {
              resolve(res.data);
            });
        } else {
          resolve(null);
        }
      }),
      new Promise((resolve) => {
        this._coreService
          .Get("hr/otherlist/STATUSAPPROVE")
          .subscribe((res: any) => {
            resolve(res.data);
          });
      }), //1
      new Promise((resolve) => {
        this._coreService
          .Get("hr/otherlist/OBJECTCOMMEND")
          .subscribe((res: any) => {
            resolve(res.data);
          });
      }), //2
      new Promise((resolve) => {
        this._coreService
          .Get("hr/otherlist/SOURCECOST")
          .subscribe((res: any) => {
            resolve(res.data);
          });
      }), //3
    ]).then((res: any[]) => {
      this.lstStatusId = res[1];
      this.lstCommendObjId = res[2];
      this.lstSourceCostId = res[3];
      this.modelTemp = _.cloneDeep(_.omit(res[0], "employees"));
        if(this.modelTemp &&this.modelTemp.statusId==1){
        
          if(this.flagState$.value==Consts.edit){
            this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.SAVE])
          }
          if(this.flagState$.value==Consts.view){
            this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.EDIT])
          }
    
        }else{
          this.toolItems$.next([ToolbarItem.BACK,ToolbarItem.SAVE])
        }
      
      if (this.paramId) {
        const x = setInterval(() => {
          if (this.listEmployee) {
            
            var arrEmps = res[0].employees;
            this.listEmployee.pushData(arrEmps);
            clearInterval(x);
          }
        }, 100);
        this.getListShiftPeriod(res[0].year).then((res: any) => {
          this.lstPeriodId = res;
        });
        setTimeout(()=>{
          this.model = _.cloneDeep(_.omit(res[0], "employees"));
        },200)
        
      }
    });
  }
  choiseSign() {
    if (this.flagState$.value == "view") {
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
  choiseEmp() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      multiselect: true,
      state :"commend"
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.orgId = res[0].orgId;
      this.model.employeeId = res[0].employeeId;
      this.listEmployee.pushData(res);
      if (res[0].employeeId) {
        this.loadComendNo(this.model.orgId);
      }
      x.unsubscribe();
    });
    this.model.orgId = undefined;
  }
  removeEmp() {
    this.listEmployee.remove();
  }
  changeObject(e: any) {
    if (e.e) {
      this.model.commendObjCode = e.itemData.code;
      if (this.model.commendObjCode == "OBJECT_ORG") {
        this.model.emps = [];
      } else if (this.model.commendObjCode == "OBJECT_EMP") {
        this.model.orgId = undefined;
        this.model.orgName = undefined;
      }
    }
  }
  choiseOrg() {
    let param = {
      selected: this.model.orgId, //select employee on grid
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      this.model.orgId = res.ID;
      this.model.orgName = res.NAME;
      if (res.ID) {
        this.loadComendNo(this.model.orgId);
      }
      x.unsubscribe();
    });
    this.model.employeeId = undefined;
  }
  loadComendNo(dtype:any) {

    if (this.model.effectDate != null && this.flagState$.value == "new"){

      this.modelAutoGen.EmployeeId = this.model.employeeId;
      this.modelAutoGen.DecisionType = dtype;
      this.modelAutoGen.dEffectDate = this.model.effectDate ? moment(this.model.effectDate).format("YYYY-MM-DD").toString(): undefined;
      this.modelAutoGen.TypeId = 3;
      let param = this.modelAutoGen;
      const x = this._coreService
      .Post("hr/contract/AutoGenCode", param)
      .subscribe((res: any) => {

        this.model.no = res;
        x.unsubscribe();
      });
    }
   
  }
  changeYear(e: any) {
    if (e.isInteracted) {
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriodId = res;
      });
    }
  }
  getListShiftPeriod(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/SalaryPeriod/getlist?Id=" + id)
        .subscribe((res: any) => {
          this.lstPeriodId = res.data;
          resolve(res.data);
        });
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
          this.router.navigate(["hrms/profile/business/commend"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        if(this.model.statusId == 2 && !this.globals.isAdmin)
        {
          this.notification.warning("notify.APPROVED");
          return;
        }
        this.flagState$.next("edit");
        this.flagePopup = true;
        this.editForm.enable();
        this.editForm.get("code")!.disable();

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
    if (this.model.commendObjCode == "OBJECT_EMP") {
      let emp = this.listEmployee.getData();
      if (!emp.length) {
        return this.notification.warning("Chọn nhân viên");
      }
      this.model.emps = this.listEmployee.getData().map((i: any) => i.employeeId);

    } else if (this.model.commendObjCode == "OBJECT_ORG") {
      if (!this.model.orgId) {
        return this.notification.warning("Chọn phòng ban");
      }
    }

    let param = this.convertModel(this.model);

    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/commend/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/business/commend"]);
            return;
          } else if (res.error == "DATA_EXIST") {
            this.notification.warning("Phụ cấp đã tồn tại!");
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
      this._coreService.Post("hr/commend/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/business/commend"]);
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
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    model.effectDate = param.effectDate
      ? moment(param.effectDate).format("YYYY-MM-DD")
      : null;
    model.signDate = param.signDate
      ? moment(param.signDate).format("YYYY-MM-DD")
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
    this.loadComendNo(this.model.orgId);
  };

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/commend"]);
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

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
    
    }
  };
}
