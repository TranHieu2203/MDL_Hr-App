import {
  Component,
  OnInit,
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
import {
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const $ = require("jquery");
import { Decision, ParamGenCode } from "src/app/_models/app/cms";
import { Consts } from "src/app/common/const";
setCulture("en");
// interface PositionLM {
//   id: number;
//   direcManagerTitleName: string;
//   direcManagerName: string;
// }
@Component({
  selector: "cms-profile-decision-edit",
  templateUrl: "./decision-edit.component.html",
  styleUrls: ["./decision-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class DecisionEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('')
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: Decision = new Decision();
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

  lstGroupTitleId: any = [];
  lstTitleId: any = [];
  lstPositionId: any = [];
  lstObjectId: any = [];
  lstDecisionTypeId: any = [];
  lstsalaryTypeId: any = [];
  lstsalaryScaleId: any = [];
  lstsalaryRankId: any = [];
  lstsalaryLevelId: any = [];
  lstStatusId: any = [];
  lstStaffRank: any = [];

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
      employeeCode: [{ value: "", disabled: true }, [Validators.required]],
      employeeName: [""],
      orgId: ["", [Validators.required]],
      orgParentName: ["",[]],      
      positionId: ["", [Validators.required]], //Chức danh
      typeId: ["", [Validators.required]], //Loại quyết định
      decisionNo: ["", [Validators.required]], //Sô quyết định
      effectDate: ["", [Validators.required]], //Ngày hiệu lực
      salaryTypeId: ["", [Validators.required]], //bảng lưởng      
      salaryScaleId: [""],
      salaryRankId: [""],
      salaryLevelId: [""],
      salPercent: ["", [Validators.required]], // hưởng lương
      coefficient: ["", []],
      salBasic: ["", [Validators.required]],
      salTotal: ["", [Validators.required]], //Tổng lương
      salaryP2: [""], // Thưởng HQCV(P2)
      salaryP3: [""], // Thưởng SP-DV(P3)
      salaryKpi: [""], // Lương KPI
      salaryIns: [""], // lương đóng BH
      statusId: ["", [Validators.required]],
      signId: ["", []], //Người ký
      signerPosition: ["", []], //Chức danh ký
      signDate: ["", [Validators.required]], //Ngày ký
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
      new Promise<void>((resolve) => {
        if (this.paramId) {
          if (this.flagState$.value != "new") {
          this._coreService
            .Get("hr/working/get?id=" + this.paramId)
            .subscribe((res: any) => {
              resolve(res.data);
            });
          }
          else{
            // chuyển từ dashboar sang
            this._coreService
              .Get("hr/employee/GetInforContract?Id=" + this.paramId)
              .subscribe((res: any) => {
                resolve(res.data);
              });
          }
        } else {
          resolve();
        }
      }), //0
      new Promise((resolve) => {
        this._coreService.Get("hr/position/GetList").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //1
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/TYPEDECISION").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //2
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/STATUSAPPROVE").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //3
      new Promise((resolve) => {
        this._coreService.Get("hr/salaryScale/getList").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //4
      new Promise((resolve) => {
        this._coreService.Get("hr/Salarytype/getList").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //5

      12,
    ]).then((res: any) => {
      this.lstPositionId = res[1];
      this.lstDecisionTypeId = res[2];
      this.lstStatusId = res[3];
      this.lstsalaryScaleId = res[4];
      this.lstsalaryTypeId = res[5];
      
      if (this.paramId) {
        this.model.orgParentName = res[0].orgParentName
        this.model.decisionNo = res[0].decisionNo
        this.model = _.cloneDeep(
          _.omit(res[0], ["salaryRankId", "salaryLevelId","positionId"])
        );

        this.loadDataLazy(res[0]);
      }      
    });
  }
  // tính tổng lương
  calculateSum() {
    const salBasic = this.model.salBasic || 0;
    const salaryP2 = this.model.salaryP2 || 0;
    const salaryP3 = this.model.salaryP3 || 0;
    const salaryKpi = this.model.salaryKpi || 0;
    this.model.salTotal = salBasic + salaryP2 + salaryP3 + salaryKpi;
    this.model.salaryIns = salBasic + salaryP2 + salaryP3 + salaryKpi;
  }
  ngAfterContentInit  (): void {
   
  }
  loadDataLazy(model: Decision) {
    if (model.salaryScaleId) {
      // get List salary rank by salaryScaleId
      this.getSalaryRank(model.salaryScaleId)
        .then((res: any) => {
          this.lstsalaryRankId = res;
        })
        .then((x) => {
          this.model.salaryRankId = model.salaryRankId;
        });
      this.getSalaryLevel(model.salaryRankId!)
        .then((res: any) => {
          this.lstsalaryLevelId = res;
        })
        .then((x) => {
          this.model.salaryLevelId = model.salaryLevelId;
        });
    }
    if (model && model.orgId) {
      this.getPosition(model.orgId,model.id!)
        .then((res: any) => {
          this.lstPositionId = res;
        })
        .then((x) => {
          this.model.positionId = model.positionId;
        });
    }
    if(model.statusId==1){
      if(this.flagState$.value==Consts.edit){
        this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.SAVE])
      }
      if(this.flagState$.value==Consts.view){
        this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.EDIT])
      }

    }else{
      this.toolItems$.next([ToolbarItem.BACK])
    }
  }
  getPosition(orgId? : number, empId? :number) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Position/positions/"+orgId+"/"+(empId == undefined?0:empId)).subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getDirectManager(positionId: number) {
    return new Promise((resolve) => {
      if (positionId) {
        this._coreService
          .Get("hr/Position/direct-manager/" + positionId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
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
      if (res.lastWorkingId) {
        this.loadLastDecision(res.lastWorkingId);
      }
      if (res.employeeId) {
        if(this.model.orgId != null){
          this.getPosition(this.model.orgId,this.model.id!)
          .then((res1: any) => {
            this.lstPositionId = res1;
          })
          .then((x) => {
            this.model.positionId = res.positionId;
          });
        }
        this.loadDecisionNo();
      }
      x.unsubscribe();
    });
  }

  loadLastDecision(id: number) {
    const x = this._coreService
      .Get("hr/working/GetLastWorking?id=" + id)
      .subscribe((res: any) => {
        let model = res.data;
        this.model.salBasic = model.salBasic;
        this.model.salTotal = model.salTotal;
        this.model.salPercent = model.salPercent;
        this.model.salaryScaleId = model.salaryScaleId;
        this.model.salaryTypeId = model.salaryTypeId;
        this.loadDataLazy(model);
        x.unsubscribe();
      });
  }
  changeDecisionType(e: any) {
    
    if (e.e) {
      
        this.model.typeId = e.itemData.id;
      
      this.loadDecisionNo();
    }
  }
  
  // loadDecisionNo(id: number) {
  //   const x = this._coreService
  //     .Get("hr/working/GetDecisionNo?id=" + id )
  //     .subscribe((res: any) => {
  //       this.model.decisionNo = res.message;
  //       x.unsubscribe();
  //     });
  // }
  loadDecisionNo() {
 
    if (this.model.employeeId != null && this.model.typeId != null && this.model.effectDate != null && this.flagState$.value == "new"){

      this.modelAutoGen.EmployeeId = this.model.employeeId;
      this.modelAutoGen.DecisionType = this.model.typeId;
      this.modelAutoGen.dEffectDate = this.model.effectDate ? moment(this.model.effectDate).format("YYYY-MM-DD").toString(): undefined;
      this.modelAutoGen.TypeId = 2;
      let param = this.modelAutoGen;
      const x = this._coreService
      .Post("hr/contract/AutoGenCode", param)
      .subscribe((res: any) => {

        this.model.decisionNo = res;
        x.unsubscribe();
      });
    }
   
  }
  
  choiseSigner() {
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
  choiseOrg() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.orgId, //select employee on grid
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      
      this.model.orgId = res.ID;
      this.model.orgName = res.NAME;
      this.model.orgParentName = res.PARENT_NAME;
      this.model.positionId = null;
      this.lstPositionId = [];
      if(this.model.orgId != null){
        this.getPosition(this.model.orgId, this.model.id!).then((res: any) => {
          this.lstPositionId = res;
        });
      }
      x.unsubscribe();
    });
  }
  changePosition(e: any) {
    if (e.e) {
      let item = _.find(this.lstPositionId, { id: Number(e.itemData.id) });

      this.model.positionName = item.name;
      // this.model.directManagerName = "";
      // this.model.directManagerTitleName = "";
      this.lstStaffRank = [];
      this.getDirectManager(item.id).then((res: any) => {
        //let lmObj = res as PositionLM;
        // this.model.directManagerName = lmObj.direcManagerName;
        // this.model.directManagerTitleName = lmObj.direcManagerTitleName;
      });
    }
  }
  changeSalaryScale(e: any) {
    if (e.e) {
      this.model.salaryRankId = null;
      this.model.salaryLevelId = null;
      this.lstsalaryLevelId = [];
      this.getSalaryRank(e.itemData.id).then((res: any) => {
        this.lstsalaryRankId = res;
      });
    }
  }
  getSalaryRank(id?: number) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/Salaryrank/GetList?scaleId=" + id)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  changeSalaryRank(e: any) {
    if (e.e) {
      this.model.salaryLevelId = null;
      this.getSalaryLevel(e.itemData.id).then((res: any) => {
        this.lstsalaryLevelId = res;
      });
    }
  }
  getSalaryLevel(id?: number) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/SalaryLevel/GetList?rankId=" + id)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  changeSalaryLevel(e: any) {
    if (e.e) {
      var item = _.find(this.lstsalaryLevelId, { id: e.itemData.id });
      this.model.salBasic = item.salBasic;
      this.model.salTotal = item.salTotal;
      this.model.salPercent = item.salPercent;
      this.model.coefficient = item.coefficient;
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
          this.router.navigate(["hrms/profile/business/decision"]);
        }
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
        this._coreService.Post("hr/working/add", param).subscribe(
          (res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.addSuccess();
              this.router.navigate(["/hrms/profile/business/decision"]);
            }
          },
          (error: any) => {
            this.notification.addError();
          }
        );
    } else {
      this._coreService.Post("hr/working/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/business/decision"]);
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
    var patt1 = new RegExp(
      /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.]/
    );
    // check nhập sai năm
    if(value && value.indexOf("/") != -1)
    {
      let valueArray = value.split("/");
      if(valueArray.length != 3)
      {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      }
      if(valueArray[0].length != 2 || valueArray[1].length != 2 || valueArray[2].length != 4)
      {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      }
    }
    if (value.length === 0) {
      this.editForm.get(model)!.setErrors({ required: true });
      return;
    } else if (value.length > 0 && (patt.test(value.toLowerCase()) === true || patt1.test(value.toLowerCase()) === true)) {
      this.editForm.get(model)!.setErrors({ incorrect: true });
      return;
    } else if (value.length > 10) {
      this.editForm.get(model)!.setErrors({ incorrect: true });
      return;
    } else {
      this.editForm.get(model)!.setErrors(null);
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
    this.loadDecisionNo()
  }, 200);
};

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/decision"]);
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
