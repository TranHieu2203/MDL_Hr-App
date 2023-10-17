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
import { Candidate1 } from "src/app/_models/app/cms";
import { DomSanitizer } from '@angular/platform-browser';

setCulture("en");

@Component({
  selector: "cms-profile-candidatescancv-edit",
  templateUrl: "./candidatescancv-edit.component.html",
  styleUrls: ["./candidatescancv-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class CandidatescancvEditComponent implements OnInit {
  // Varriable Language
  flagState = "";
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";
  imageSource: any;
  model: Candidate1 = new Candidate1();
  modelTemp: Candidate1 = new Candidate1();
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  uploadAvatar(e: any) {}
  ViewHistory(e: any) {}

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;

  lstStatusId = [];
  lstDisciplineObjId = [];
  lstPeriodId: any[] = [];

  confirmDelete(e: string) {

  }

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
    private sanitizer: DomSanitizer,
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
        code: [""],
        fullName : [""],
        genderName : [""],
        birthDate: ["", []],
        address : [""],
        skill :[""],
        description: [""],
        email: [""],
        mobilePhone: [""],
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
    this.mode = "CheckBox";
  }
  loadData() {
    Promise.all([
      new Promise<void>((resolve) => {
        if (this.paramId) {
          this._coreService
            .Get("hr/candidate1/get?id=" + this.paramId)
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
        this._coreService
          .Get("hr/otherlist/OBJECTCOMMEND")
          .subscribe((res: any) => {
            resolve(res.data);
          });
      }), //2
    ]).then((res: any[]) => {
      if (this.paramId) {
        this.model = res[0];
      }
      this.lstStatusId = res[1];
      this.lstDisciplineObjId = res[2];
    });
  }
  inputFile(file: FileList | null) {
    setTimeout(() => {
      if (file!.length > 0) {
  
        let data = new FormData();
        
        data.append("file", file![0]);
        this.modalService.loading.next(true);
        this._coreService
          .Upload("hr/candidate1/ReadFileCV", data)
          .subscribe(
            (res: any) => {
              if (res.statusCode == 400) {

                  this.notification.warning("Đọc file CV không thành công!");
                  this.modalService.loading.next(false);
              } else {
                this.notification.success("Đọc file CV thành công");
           
                var predict=JSON.parse(res.data).predicted
                var text=JSON.parse(res.data).text
                this.model.fullName=predict.name;
                this.model.genderName=predict.gender;
                //this.model.Gender=predict.;
                this.model.birthDate=predict.date_of_birth;
                this.model.address=predict.address;
                this.model.skill=predict.skill.toString();
                this.model.description=text;
                var base64=predict.imageBase64;
                this.imageSource = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${base64}`);
                this.model.email=predict.email;
                this.model.mobilePhone=predict.phone;
                this.modalService.loading.next(false);
              
              }
            },
            (err) => {
              this.notification.success("Đọc file CV không thành công");
              this.modalService.loading.next(false);
            }
          );
      }
    }, 200);
  }

  // Build Toolbar
  buildToolbar = () => {
    setTimeout(() => {
      let toolbarList: any[] = [];
      if (this.flagState === "view") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
      }
      if (this.flagState === "new") {
        toolbarList = [ToolbarItem.BACK,ToolbarItem.IMPORT, ToolbarItem.SAVE];
      }
      if (this.flagState === "edit") {
        toolbarList = [ToolbarItem.BACK,ToolbarItem.IMPORT, ToolbarItem.SAVE];
      }
      this.toolbar = this.globals.buildToolbar(
        "candidatescancv",
        toolbarList
      );
    }, 200);
  };

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.IMPORT:
        document.getElementById("file")!.click();
        break;
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
          this.router.navigate(["hrms/profile/business/candidatescancv"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState = "edit";
        this.flagePopup = true;
        this.editForm.enable();
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

    let param = this.convertModel(this.model);

    if (this.flagState === "new") {
      this._coreService.Post("hr/candidate1/add", param).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/business/candidatescancv"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/candidate1/Update", param).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/business/candidatescancv"]);
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
      ? moment(param.dateStart).format("MM/DD/YYYY")
      : null;
    model.signDate = param.signDate
      ? moment(param.signDate).format("MM/DD/YYYY")
      : null;
    return model;
  }
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

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/candidate"]);
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
