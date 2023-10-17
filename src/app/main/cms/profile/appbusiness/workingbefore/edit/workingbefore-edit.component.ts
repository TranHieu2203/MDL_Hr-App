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
import { WorkingBefore } from "src/app/_models/app/cms";
setCulture("en");
// interface PositionLM {
//   id: number;
//   direcManagerTitleName: string;
//   direcManagerName: string;
// }
@Component({
  selector: "cms-profile-workingbefore-edit",
  templateUrl: "./workingbefore-edit.component.html",
  styleUrls: ["./workingbefore-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class WorkingbeforeEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('')
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: WorkingBefore = new WorkingBefore();
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
  lstCompanyId: any = [];
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
    this.languages = this.globals.languages;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      employeeCode: [{ value: "", disabled: true }, [Validators.required]],
      employeeName: ["",[Validators.required]],
      companyName: ["", []],
      orgName: ["", []],
      joinDate: ["", []],
      endDate: ["", []],
      companyAddress: ["", []],
      telephone: [""],
      salary: [""],
      titleName: [""],
      levelName: [""],
      reference: [""],
      remark: [""],
      workDetail: [""],
      terReason: [""],
      companyId: ["", [Validators.required]],

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
    this._translateService.use(this.selectedLanguage.id);

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
        this.isButtonDisabled = true;
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
              .Get("hr/workingbefore/get?id=" + this.paramId)
              .subscribe((res: any) => {
                resolve(res.data);


              });
          }
          else {
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
      }),
      new Promise((resolve) => {
        this._coreService
          .Get("hr/otherlist/COMPANY_BEFORE")
          .subscribe((res: any) => {
            resolve(res.data);
          });
      }), //1
      // this.getlstCompanyId()
    ]).then((res: any) => {
      this.lstCompanyId = res[1];

      setTimeout(() => {
        this.model = _.cloneDeep(_.omit(res[0]));
      }, 200)
    });
  }

  ngAfterContentInit(): void {

  }
  loadDataLazy(model: WorkingBefore) {


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
      x.unsubscribe();
    });
  }
  getlstCompanyId() {
    //đối tượng thường trú
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/COMPANY_BEFORE")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
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
          this.router.navigate(["hrms/profile/business/workingbefore"]);
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
    if(this.model.joinDate != null && this.model.joinDate != undefined && this.model.endDate != null && this.model.endDate != undefined){
      if(this.model.joinDate > this.model.endDate){
        this.notification.warning("Ngày vào phải nhỏ hơn hoặc bằng ngày nghỉ việc!");
        return;
      }
    }
    let param = this.convertModel(this.model);
    

    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/workingbefore/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/business/workingbefore"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/workingbefore/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/business/workingbefore"]);
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

    model.joinDate = param.joinDate
      ? moment(param.joinDate).format("YYYY-MM-DD")
      : null;
    model.endDate = param.endDate
      ? moment(param.endDate).format("YYYY-MM-DD")
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
      if (value && value.indexOf("/") != -1) {
        let valueArray = value.split("/");
        if (valueArray.length != 3) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        }
        if (valueArray[0].length != 2 || valueArray[1].length != 2 || valueArray[2].length != 4) {
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
    }, 200);
  };

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/workingbefore"]);
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
