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
import { InsInformation } from "src/app/_models/app/cms";
setCulture("en");

@Component({
  selector: "cms-profile-insinformation-edit",
  templateUrl: "./insinformation-edit.component.html",
  styleUrls: ["./insinformation-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class InsInformationEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    
  ])

  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: InsInformation = new InsInformation();
  modelTemp: InsInformation = new InsInformation();
  modelTemp1: InsInformation = new InsInformation();
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

  lstBhxhStatusId: any = [];
  lstPlaceRegisId: any = [];

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
      positionName: [""],
      orgName: [""],
      bhxhNo: ["", []], // số sổ bảo hiểm
      bhxhDate: [""], //ngày cấp
      bhxhPlace: [""],
      bhxhStatusId: ["", []], // tình trạng sổ
      bhxhNote: ["", []],
      bhytNo: ["", []],
      bhytEffectDate: ["", []],
      bhytExpireDate: [""],
      placeRegisId: ["", []],
      bhtnldBnnEffectDate: ["", []],
      bhtnldBnnExpireDate: ["", []],
      isBhxh:["", []],
      isBhyt:["", []],
      isBhtn:["", []],
      isBhtnldBnn:["", []],
      salaryBhxh:["", []],
      salaryBhtn:["", []],
      totalTimeInsBefore:["", []],
      bhtnEffectDate: ["", []],
      bhtnExpireDate: ["", []],

      // statusId: ["", [Validators.required]], //
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
  ngAfterViewInit(): void {
    if(this.flagState$.value =="new")
    {
      if(localStorage.getItem("modelTemp1"))
      {
        this.model =_.cloneDeep(JSON.parse(localStorage.getItem("modelTemp1")!))
      }
      //
    }
  }
  loadData() {
    Promise.all([
      new Promise((resolve) => {
        if (this.paramId) {
          this._coreService
            .Get("hr/insinformation/get?id=" + this.paramId)
            .subscribe((res: any) => {
              resolve(res.data);
            });
        } else {
          resolve(false);
        }
      }),
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/statusbhxh").subscribe((res: any) => {
          resolve(res.data);
        });
      }),
      new Promise((resolve) => {
        this._coreService.Get("hr/otherlist/GetListNoiKhamBenh").subscribe((res: any) => {
          resolve(res.data);
        });
      }),
    ]).then((res: any[]) => {
      this.lstBhxhStatusId = res[1];
      this.lstPlaceRegisId = res[2];
      if (this.paramId) {
        this.model = _.cloneDeep(res[0]);
      }
    });
  }

  choiseEmp() {
    if (this.flagState$.value == "view" || this.flagState$.value == "edit") {
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
      x.unsubscribe();
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
          this.router.navigate(["hrms/profile/business/insinformation"]);
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
    } else {
    }

    let param = this.convertModel(this.model);

    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/insinformation/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/business/insinformation"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/insinformation/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/business/insinformation"]);
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
    model.bhxhDate = param.bhxhDate
      ? moment(param.bhxhDate).format("YYYY-MM-DD")
      : null;
    model.bhytEffectDate = param.bhytEffectDate
      ? moment(param.bhytEffectDate).format("YYYY-MM-DD")
      : null;
    model.bhytExpireDate = param.bhytExpireDate
      ? moment(param.bhytExpireDate).format("YYYY-MM-DD")
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
      //if (value.length === 0) {
      //  this.editForm.get(model)!.setErrors({ required: true });
      //  return;
      //} else if (value.length > 0 && patt.test(value.toLowerCase()) === true) {
      //  this.editForm.get(model)!.setErrors({ incorrect: true });
      //  return;
      //} else if (value.length > 10) {
      //  this.editForm.get(model)!.setErrors({ incorrect: true });
      //  return;
      //} else {
      //  this.editForm.get(model)!.clearValidators();
      //}
      if (value && (value.length === 6 || value.length === 8)) {
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
          }
        }
      }
    }, 200);
  };
  changeDateNoRequire = (model: any) => {
    setTimeout(() => {
      const idDate = "#" + model + "_input";
      const value = $(idDate).val();
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      let FindSpace = value.indexOf(" ");
      if (FindSpace != -1) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      } else
      if (value.length > 0 && patt.test(value.toLowerCase()) === true) {
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
          this.router.navigate(["/hrms/profile/business/insinformation"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/insinformation"]);
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
