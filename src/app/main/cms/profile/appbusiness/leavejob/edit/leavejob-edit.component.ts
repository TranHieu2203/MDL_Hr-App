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

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const async = require("async");
const $ = require("jquery");
import { LeaveJob, ParamGenCode } from "src/app/_models/app/cms";
import { Consts } from "src/app/common/const";
setCulture("en");
let chiphiboihoan: number;
let boithuongkhac: number;

@Component({
  selector: "cms-profile-leavejob-edit",
  templateUrl: "./leavejob-edit.component.html",
  styleUrls: ["./leavejob-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class LeaveJobEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([])
  // Varriable Language
  
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: LeaveJob = new LeaveJob();
  modelTemp: LeaveJob = new LeaveJob();
  modelAutoGen : ParamGenCode = new ParamGenCode();
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };
  flagState$ = new BehaviorSubject<string>('');
  
  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;

  lstStatusId: any = [];
  lstTerReasonId: any = [];

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
      employeeName: [{ value: "", disabled: true }, [Validators.required]],
      positionName: [{ value: "", disabled: true }, [Validators.required]],
      orgName: [{ value: "", disabled: true }, [Validators.required]],
      contractNo: [{ value: "", disabled: true },[]],
      dateStart: [{ value: "", disabled: true }, []],
      dateEnd: [{ value: "", disabled: true }, []],

      effectDate: ["", [Validators.required]],
      sendDate: ["", [Validators.required]],
      lastDate: ["", [Validators.required]],
      decisionNo: ["", [Validators.required]],
      signDate: ["", [Validators.required]], //Ngày ký
      signId: [{ value: "", disabled: true }, [Validators.required]],
      signerPosition: ["", []], //Chức danh
      terReason: ["", [Validators.required]], //lý do khen thưởng
      amountViolations: ["", []], //Số tiền vi pham thoi han bao trước
      trainingCosts: ["", []], //
      otherCompensation: ["", []], //bồi thường khác
      statusId: ["", [Validators.required]],
      terReasonId: ["", [Validators.required]],
      salary6m: ["", []],
      remaingLeave: ["", []],
      remaingLeaveMoney: ["", []],
      allowanceLeaveTime: ["", []],
      allowanceLeaveMoney: ["", []],
      sumFinal: ["", []]
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
      }
      this.toolItems$.next(toolbarList)
    })

    this.mode = "CheckBox";
  }
  loadData() {
    Promise.all([
      new Promise<void>((resolve) => {
        if (this.paramId) {
          this._coreService
            .Get("hr/terminate/get?id=" + this.paramId)
            .subscribe((res: any) => {
              resolve(res.data);
              
            });
        } else {
          resolve();
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
        this._coreService.Get("hr/otherlist/GetTerReasonId").subscribe((res: any) => {
          resolve(res.data);
        });
      }),
    ]).then((res: any[]) => {
      if (this.paramId) {
        this.model = _.cloneDeep(res[0]);
        chiphiboihoan = this.model.trainingCosts || 0;
        boithuongkhac = this.model.otherCompensation || 0;
      } else {
        this.model.statusId = 1;
      }
      this.lstStatusId = res[1];
      this.lstTerReasonId = res[2];
      if(this.model.statusId==1 || this.model.statusId == null){

        if(this.flagState$.value==Consts.edit){
          this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.SAVE])

        }
        if(this.flagState$.value==Consts.view){
          this.toolItems$.next([ToolbarItem.BACK, ToolbarItem.EDIT])

        }
  
      }else{
        this.toolItems$.next([ToolbarItem.BACK])
      }
      
    });
  }
  choiseSigner() {
    if (this.flagState$.value==Consts.view) {
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
    if (this.flagState$.value==Consts.view) {
      return;
    }
    let param = {
      selected: this.model.employeeId, //select employee on grid
      state: "leavejob"
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.employeeId = res.employeeId;
      this.model.employeeCode = res.employeeCode;
      this.model.employeeName = res.employeeName;
      this.model.positionId = res.positionId;
      this.model.positionName = res.positionName;
      this.model.orgName = res.orgName;

      this.model.dateStart = res.dateStart;
      this.model.dateEnd = res.dateEnd;
      this.model.contractNo = res.contractNo;
    
      if (res.employeeId) {
        //this.loadDecisionNo(res.employeeId);
        this.loadTerminateNo();
      }
      x.unsubscribe();
    });
    
  }

  loadDecisionNo(id: number) {
    const x = this._coreService
      .Get("hr/terminate/GetDecisionNo?id=" + id )
      .subscribe((res: any) => {
        this.model.decisionNo = res.message;
        x.unsubscribe();
      });
  }

  // Build Toolbar
  buildToolbar = () => {
    setTimeout(() => {
      let toolbarList: any[] = [];
      if (this.flagState$.value==Consts.view) {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
      }
      if (this.flagState$.value==Consts.add) {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      if (this.flagState$.value==Consts.edit) {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      this.toolbar = this.globals.buildToolbar("leavejob", toolbarList!);
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
          this.router.navigate(["hrms/profile/business/leavejob"]);
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

        //this.buildToolbar();
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
    } else {
    }

    let param = this.convertModel(this.model);



    if (this.flagState$.value=="new") {
      this._coreService.Post("hr/terminate/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/business/leavejob"]);
            return;
          } else if (res.error == "INS_NOT_OFF") {
            this.notification.warning("Nhân viên chưa báo giảm Bảo hiểm!");
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
      this._coreService.Post("hr/terminate/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/business/leavejob"]);
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
    model.sendDate = param.sendDate
      ? moment(param.sendDate).format("YYYY-MM-DD")
      : null;
    model.lastDate = param.lastDate
      ? moment(param.lastDate).format("YYYY-MM-DD")
      : null;
    return model;
  }
  loadTerminateNo() {

    if (this.model.employeeId != null && this.model.effectDate != null){

      this.modelAutoGen.EmployeeId = this.model.employeeId;
      this.modelAutoGen.DecisionType = 6;
      this.modelAutoGen.dEffectDate = this.model.effectDate ? moment(this.model.effectDate).format("YYYY-MM-DD").toString(): undefined;
      this.modelAutoGen.TypeId = 6;
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
    }, 200);
    this.loadTerminateNo();
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
          this.router.navigate(["/hrms/profile/business/leavejob"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/leavejob"]);
    }
  };
  calculateSum() {
    const sotienphepnam = this.model.remaingLeaveMoney || 0;
    const sotientrocap = this.model.allowanceLeaveMoney|| 0;
    this.model.sumFinal = sotienphepnam + sotientrocap - chiphiboihoan -boithuongkhac;
    
  }
  calStoreQT() {
    
    this._coreService
            .Post("hr/terminate/calStoreQT",this.paramId).subscribe(
              (res: any) => {
                if (res.statusCode == 200) {
                  this.notification.editSuccess();
                  location.reload();
                } else if (res.statusCode == 400) {
                  this.notification.warning("Sửa không thành công");
                }
              },
              (error: any) => {
                this.notification.editError();
              }
            );
            
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
}
