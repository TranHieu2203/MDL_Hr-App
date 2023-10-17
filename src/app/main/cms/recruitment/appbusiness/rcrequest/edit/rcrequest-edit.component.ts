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
import { RcRequest, ParamGenCode, PlanReg } from "src/app/_models/app/cms";
import { Consts } from "src/app/common/const";
setCulture("en");
// interface PositionLM {
//   id: number;
//   direcManagerTitleName: string;
//   direcManagerName: string;
// }
@Component({
  selector: "cms-recruitment-rcrequest-edit",
  templateUrl: "./rcrequest-edit.component.html",
  styleUrls: ["./rcrequest-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class RcRequestEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('')
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: RcRequest = new RcRequest();
  modelAutoGen: ParamGenCode = new ParamGenCode();
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
  lstdeadlineId: any = [];
  lstreasonId: any = [];
  lstsalaryScaleId: any = [];
  lstsalaryRankId: any = [];
  lstsalaryLevelId: any = [];
  lstStatusId: any = [];
  lstStaffRank: any = [];
  lsttypeId: any = [];
  lstplaceId: any = [];
  lststatusId: any = [];
  lstlearningLevelId: any = [];
  lstmajorId: any = [];
  lstexpId: any = [];
  lstlanguageId: any = [];
  lstschoolId: any = [];
  lstgenderId: any = [];
  public from = 0;
  public to = 0;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  file:string="";
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
      code: ["", [Validators.required]],
      name: ["", [Validators.required]], //Chức danh
      reasonId: [""],
      orgId: [""],
      positionId: [""],
      deadlineId: [""],
      deadlineDate: [""],
      numberCurrent: [""],
      numberPlan: [""],
      numberRec: [""],
      typeId: [""],
      placeId: [""],
      salaryFrom: [""],
      salaryTo: [""],
      learningLevelId: [""],
      majorId: [""],
      expId: [""],
      languageId: [""],
      schoolId: [""],
      ageFrom: [""],
      ageTo: [""],
      genderId: [""],
      heightFrom: [""],
      heightTo: [""],
      weightFrom: [""],
      weightTo: [""],
      detailWork: [""],
      fileAttach: [""],
      statusId: [""]
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
              .Get("hr/rcrequest/get?id=" + this.paramId)
              .subscribe((res: any) => {
                resolve(res.data);

              });
          }

        } else {
          resolve();
        }
      }),
      
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GetListRecruitReason").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //1
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GetListRecruitDeadline").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //2
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GetListRecruitType").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //3
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/PLACEWORK").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //4
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GetListRecruitStatus").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //5
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GetListLearningLevel").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //6
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/SPECIALIZED_TRAIN").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //7
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GetListRecruitExp").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //8
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GetListRecruitLanguage").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //9
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GetListSchool").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //10
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GENDER").subscribe((res: any) => {
          resolve(res.data);
        });
      }), //11
      

      12,
    ]).then((res: any) => {
      this.lstreasonId = res[1];
      this.lstdeadlineId = res[2];
      this.lsttypeId = res[3];
      this.lstplaceId = res[4];
      this.lststatusId = res[5];
      this.lstlearningLevelId = res[6];
      this.lstmajorId = res[7];
      this.lstexpId = res[8],
      this.lstlanguageId = res[9];
      this.lstschoolId = res[10];
      this.lstgenderId = res[11];

      if (this.paramId) {

        this.model = _.cloneDeep(
          _.omit(res[0], ["positionId"])
        );

        this.loadDataLazy(res[0]);
      }
    });
  }

  ngAfterContentInit(): void {

  }
  loadDataLazy(model: RcRequest) {

    if (model && model.orgId) {

      this.getPosition(model.orgId, undefined)
        .then((res: any) => {
          this.lstPositionId = res;
        })
        .then((x) => {
          this.model.positionId = model.positionId;
        });
    }


  }

  getPosition(orgId?: number, empId?: number) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Position/positions/" + orgId + "/" + (empId == undefined ? 0 : empId)).subscribe((res: any) => {
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
  getSLHT(orgId?: number, positionId?: number) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Position/getSLHT/" + orgId + "/" + positionId).subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getDinhBien(orgId?: number, positionId?: number, year?: number) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/PlanReg/GetPlanRegByPositionId/" + orgId + "/" + positionId + "/" + year).subscribe((res: any) => {
        resolve(res.data);
      });
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
      this.model.positionId = undefined;
      this.lstPositionId = [];
      if (this.model.orgId != null) {
        this.getPosition(this.model.orgId, this.model.id!).then((res: any) => {
          this.lstPositionId = res;
        });
      }
      x.unsubscribe();
    });
  }
  changePosition(e: any) {
    if (e.e) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();  
      let item = _.find(this.lstPositionId, { id: Number(e.itemData.id) });
      this.model.positionId = item.id;
      this.model.positionName = item.name;
      // this.model.directManagerName = "";
      // this.model.directManagerTitleName = "";
      this.lstStaffRank = [];
      this.getDirectManager(item.id).then((res: any) => {
        //let lmObj = res as PositionLM;
        // this.model.directManagerName = lmObj.direcManagerName;
        // this.model.directManagerTitleName = lmObj.direcManagerTitleName;
      });
      if (this.model.orgId != undefined && this.model.positionId != undefined) {
        this.getSLHT(this.model.orgId, this.model.positionId).then((res: any) => {
           this.model.numberCurrent = res.length;
        });
        this.getDinhBien(this.model.orgId, this.model.positionId, currentYear).then((res: any) => {
          
          const currentMonth = currentDate.getMonth() + 1;  
          if(currentMonth == 1){
            this.model.numberPlan = res.t1;
          }
          if(currentMonth == 2){
            this.model.numberPlan = res.t2;
          }
          if(currentMonth == 3){
            this.model.numberPlan = res.t3;
          }
          if(currentMonth == 4){
            this.model.numberPlan = res.t4;
          }
          if(currentMonth == 5){
            this.model.numberPlan = res.t5;
          }
          if(currentMonth == 6){
            this.model.numberPlan = res.t6;
          }
          if(currentMonth == 7){
            this.model.numberPlan = res.t7;
          }
          if(currentMonth == 8){
            this.model.numberPlan = res.t8;
          }
          if(currentMonth == 9){
            this.model.numberPlan = res.t9;
          }
          if(currentMonth == 10){
            this.model.numberPlan = res.t10;
          }
          if(currentMonth == 11){
            this.model.numberPlan = res.t11;
          }
          if(currentMonth == 12){
            this.model.numberPlan = res.t12;
          }  
       });
      }
    }
  }
  onFileChange(files: FileList | null) {
    setTimeout(() => {
      if (files!.length > 0) {
        let data = new FormData();
        // for (let i = 0; i < files!.length; i++) {
        //   data.append("files", files![i]);
        // }
        data.append("files", "recruitment");
        data.append("files", files![0]);
          this._coreService.uploadFileToGroupV2Hrm(data, Consts.recruitment,"dexuattuyendung",this.model.code?.toString()).subscribe((res: any) => {
            var url =  res.data;
            this.file = url;
            let arr = url.split('/')
            this.model.fileAttach = arr[arr.length-1]
            // let x: any = document.getElementById("file");
            // x.value = null;
        });
      }
    }, 200);
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
          this.router.navigate(["hrms/recruitment/business/rcrequest"]);
        }
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

    let param = this.convertModel(this.model);

    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/rcrequest/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/recruitment/business/rcrequest"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/rcrequest/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/recruitment/business/rcrequest"]);
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

    model.fromMonth = param.fromMonth
      ? moment(param.fromMonth).format("YYYY-MM-DD")
      : null;
    model.toMonth = param.toMonth
      ? moment(param.toMonth).format("YYYY-MM-DD")
      : null;

    return model;
  }
  // change date
  changeDate = (model: any) => {
    setTimeout(() => {
      const idDate = "#" + model + "_input";
      const value = $(idDate).val();
      //get form group of control
      let form: any;
      for (let field in this.editForm.controls) {
        if (this.editForm.controls[field].get(model)) {
          form = this.editForm.controls[field].get(model);
        }
      }
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      if (value.length === 0) {
        form.setErrors({ required: true });
        return;
      } else if (value.length > 0 && patt.test(value.toLowerCase()) === true) {
        form.setErrors({ incorrect: true });
        return;
      } else if (value.length > 10) {
        form.setErrors({ incorrect: true });
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
    }, 200);
  };

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/recruitment/business/rcrequest"]);
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
