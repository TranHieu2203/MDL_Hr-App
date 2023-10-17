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
  Validators,
  FormControl,
} from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const $ = require("jquery");
import { ConcurrentlyMng, ParamGenCode} from "src/app/_models/app/cms";
import { Consts } from "src/app/common/const";
setCulture("en");

@Component({
  selector: "cms-profile-concurrentlymng-edit",
  templateUrl: "./concurrentlymng-edit.component.html",
  styleUrls: ["./concurrentlymng-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ConcurrentlyMngEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('')
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: ConcurrentlyMng = new ConcurrentlyMng();
  modelAutoGen : ParamGenCode = new ParamGenCode();
  languages: any;
  selectedLanguage: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;

  lstStatusId: any = [];
  lstPositionId: any = [];
  disable: any;
  checked: number = 0;
  public isButtonDisabled = false;
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
          this.checked = 1;
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
      employeeName: [{ value: "", disable: this.disable }, []],
      //unit: [""], //Đơn vị
      positionId: ["", [Validators.required]], //Chức danh
      orgId: ["",  [Validators.required]],
      positionConId: ["",[Validators.required]],
      orgConId: ["", [Validators.required]],
      decisionNo: ["", [Validators.required]],
      effectDate: ["", [Validators.required]],
      expireDate: ["", []],
      startDateAllow:  ["", []],
      endDateAllow: ["", []],
      moneyAllow:  ["", []],
      isAllow: ["", []],
      isNewEmp: ["", []],
      signName: ["", [Validators.required]],
      signTitle: ["", []], //Chức danh ký
      signDate: ["", [Validators.required]], //Ngày ký
      note: ["", []],
      orgConParentName: ["", []],
      statusId: ["", [Validators.required]]
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
        this.editForm.get("employeeCode")!.disable();
        this.isButtonDisabled = true;
      }
      this.toolItems$.next(toolbarList)
    })

    this.disable = true;
  }

  loadData() {
    Promise.all([
     this.getById(),
     this.getStatus()
    ]).then((res: any) => {
      this.lstStatusId = res[1];
      if (this.paramId) {
        this.model = _.cloneDeep(_.omit(res[0],["positionConId"]));
        this.loadDatalazy(res[0]);
      }
    });
  }

  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/concurrentlymng/get?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
  }
  getStatus(){
    return   new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/STATUSAPPROVE")
      .subscribe((res: any) => {
        resolve(res.data);
      });
    })
  }

  loadDatalazy(model: ConcurrentlyMng){
    this.getPosition(model.orgConId,model.employeeId)
    .then((res: any) => {
      this.lstPositionId = res;
    })
    .then((x) => {
      this.model.positionConId = model.positionConId;
    });
    if(model.statusId==1){
      if(this.flagState$.value==Consts.edit){
        this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.SAVE])
      }
      if(this.flagState$.value==Consts.view){
        this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.EDIT])
        this.editForm.disable();
      }

    }else{
      this.toolItems$.next([ToolbarItem.BACK])
    }
  }

  choiseDecision() {
    if (this.flagState$.value == "view") {
      return;
    }
    if (this.model.employeeId) {
      let param = {
        employeeId: this.model.employeeId
      };
      
    } else {
      this.notification.warning("Chọn nhân viên");
    }
  }
  choiseEmp() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: -1,//this.model.employeeId, //select employee on grid
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      //
      this.model.employeeId = res.employeeId;
      this.model.employeeCode = res.employeeCode;
      this.model.employeeName = res.employeeName;
      this.model.positionName = res.positionName;
      this.model.orgName = res.orgName;
      this.model.orgId = res.orgId;
      this.model.positionId = res.positionId;
      if (res.employeeId) {
        this.loadConcurrentlyNo();
      }
      x.unsubscribe();
    });
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
      this.model.signTitle = res.positionName;
      this.model.signName = res.employeeName;
      this.model.signId = res.employeeId;
      x.unsubscribe();
    });
  }
  choiseOrg() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.orgConId, //select employee on grid
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      this.model.orgConId = res.ID;
      this.model.orgConName = res.NAME;
      this.model.orgConParentName = res.PARENT_NAME;
      this.model.positionConId = undefined;
      this.lstPositionId = [];
      if(this.model.orgConId != null){
        this.getPosition(this.model.orgConId, this.model.employeeId!).then((res: any) => {
          this.lstPositionId = res;
        });
      }
      x.unsubscribe();
    });
  }
  changePosition(e: any) {
    if (e.e) {
      let item = _.find(this.lstPositionId, { id: Number(e.itemData.id) });

      this.model.positionConName = item.name;
      // this.model.directManagerName = "";
      // this.model.directManagerTitleName = "";
      //this.lstStaffRank = [];
      //this.getDirectManager(item.id).then((res: any) => {
        //let lmObj = res as PositionLM;
        // this.model.directManagerName = lmObj.direcManagerName;
        // this.model.directManagerTitleName = lmObj.direcManagerTitleName;
      //});
    }
  }
  getPosition(orgId? : number, empId? :number) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Position/positions/"+orgId+"/"+(empId == undefined?0:empId)).subscribe((res: any) => {
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
          this.router.navigate(["hrms/profile/business/concurrentlymng"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        if (this.model.statusId == 2 && !this.globals.isAdmin) {
          this.notification.warning("notify.APPROVED");
          return;
        }
        this.flagState$.next("edit");
        this.flagePopup = true;
        this.editForm.enable();
        this.editForm.get("employeeCode")!.disable();
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
    this.model.moneyAllow = this.model.moneyAllow;
    let param = this.convertModel(this.model);
    if (param.expireDate != null) {
      let y = moment(param.effectDate).isSameOrBefore(param.expireDate);
      if (!y) {
        this.notification.warning("Ngày hiệu lực phải nhỏ hơn ngày hết hiệu lực");
        return;
      }
    }

    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/concurrentlymng/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/business/concurrentlymng"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/concurrentlymng/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/business/concurrentlymng"]);
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
    model.expireDate = param.expireDate
      ? moment(param.expireDate).format("YYYY-MM-DD")
      : null;
    model.signDate = param.signDate
      ? moment(param.signDate).format("YYYY-MM-DD")
      : null;
    return model;
  }
  
  loadConcurrentlyNo() {

    if (this.model.employeeId != null && this.model.effectDate != null && this.flagState$.value =="new"){

      this.modelAutoGen.EmployeeId = this.model.employeeId;
      this.modelAutoGen.DecisionType = 5;
      this.modelAutoGen.dEffectDate = this.model.effectDate ? moment(this.model.effectDate).format("YYYY-MM-DD").toString(): undefined;
      this.modelAutoGen.TypeId = 5;
      let param = this.modelAutoGen;
      const x = this._coreService
      .Post("hr/contract/AutoGenCode", param)
      .subscribe((res: any) => {

        this.model.decisionNo = res;
        x.unsubscribe();
      });
    }
  }
  // change date
  changeDate = (model: any) => {
    setTimeout(() => {
      const idDate = "#" + model + "_input";
      const value = $(idDate).val();
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      if (value.length == 0) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;}
      else if (value.length > 0 && patt.test(value.toLowerCase()) === true) {
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
    this.loadConcurrentlyNo();
  };

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/concurrentlymng"]);
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
