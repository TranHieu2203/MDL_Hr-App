import { Component, OnInit, ViewEncapsulation } from "@angular/core";
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

import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";

import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  QuickToolbarService,
} from "@syncfusion/ej2-angular-richtexteditor";
const $ = require("jquery");
import { Survey } from "src/app/_models/app/cms/blog/survey";
import * as moment from "moment";
setCulture("en");

@Component({
  selector: "app-survey-edit",
  templateUrl: "./survey-edit.component.html",
  styleUrls: ["./survey-edit.component.scss"],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SurveyEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // flag show popup toolbar Back
  flagePopup = true;
  flagState$ = new BehaviorSubject<string>('')
  // Khai báo biến
  paramId = "";
  model: Survey = new Survey();
  editForm!: FormGroup;
  answerForm: FormArray = this._formBuilder.array([]);
  arrAnswer: any = [];
  lstEmp: any[] = [];
  titlePopup = "";
  public query = new Query();

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;

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
      name: ["", [Validators.required, this.globals.noWhitespaceValidator]],
      expire: [""],
      isMultiple: [""],
      isAddAnswer: [""],
      answerForm: this.answerForm
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
        toolbarList = [ToolbarItem.BACK];
      } else {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      this.toolItems$.next(toolbarList)
    })

    if (this.flagState$.value === "view") {
      this.editForm.disable();
    }

    if (this.paramId) {
      this.GetById();
    }
    else {
      this.addForm({ answer: "" });
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
          this.router.navigate(["/hrms/media/business/survey"]);
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
    let modelParam = this.PrepareBeforeSave(this.model);
    if (modelParam) {
      if (this.flagState$.value === "new") {
        this.model.answers = this.arrAnswer;
        this._coreService
          .Post("hr/Vote/CreateQuestion", this.model)
          .subscribe((res: any) => {
            if (res.statusCode == "400") {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.addSuccess();
              this.router.navigate(["/hrms/media/business/survey"]);
            }
          });
      } else {
        this._coreService
          .Post("hr/BlogInternal/update", this.model)
          .subscribe((res: any) => {
            if (res.statusCode == "400") {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.editSuccess();
              this.router.navigate(["/hrms/media/business/survey"]);
            }
          });
      }
    }
  };
  GetById() {
    this._coreService.Get("hr/Vote/Get?id=" + this.paramId).subscribe((res: any) => {
      if (res.statusCode == "200") {
        this.model = res.data;
        this.model.answers!.forEach((item, index) => {
          this.addForm(item);
          this.answerForm.controls[index].get("answer")!.disable();
        })

      }
      else {
        this.notification.warning(res.message);
      }
    })
  }
  addForm(data: any) {
    this.arrAnswer.push(data);
    this.answerForm.push(this.createForm());
  }
  ClickAdd() {
    this.addForm({ answer: "" });
  }
  createForm(): FormGroup {
    return this._formBuilder.group({
      answer: ["", Validators.required]
    });
  }
  Remove(index: any) {
    this.arrAnswer.splice(index, 1);
    this.answerForm.removeAt(index);
  }
  ViewDetail(ans: any) {
    this.modalService.open("employees");
    this.lstEmp = ans.employees;
    this.titlePopup = ans.answer;
  }
  CloseEmp() {
    this.modalService.close("employees");
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
  PrepareBeforeSave = (value: any) => {
    let modelInit = _.cloneDeep(value);
    // kiểm tra ngày hết hạn bình chọn
    let checkNow = moment().isBefore(modelInit.expire);
    if (!checkNow) {
      this.notification.warning("Thời hạn bình chọn phải lớn hơn hiện tại !")
      return null
    }
    return modelInit;
  }
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/media/business/survey"]);
    }
  };
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
