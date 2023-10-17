import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Router } from "@angular/router";

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
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  GridComponent,
  VirtualScrollService,ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  SettingRemind,
} from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);

const _ = require("lodash");
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import * as moment from "moment";
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "cms-app-settingremind",
  templateUrl: "./settingremind.component.html",
  styleUrls: ["./settingremind.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SettingRemindComponent implements OnInit {
  
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SAVE
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data

  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;

  arrayData: Array<SettingRemind> = new Array<SettingRemind>();
  public arrayForm: FormArray = this._formBuilder.array([]);

  editForm!: FormGroup;
  paramId!: string;
  nodeSelected: any;
  fields: FieldSettingsModel = { value: "id", text: "name" };
  field: any;
  lstParentId: any;
  flagState!: string;

  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _formBuilder: FormBuilder,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);

    this.editForm = this._formBuilder.group({
      arrayForm: this.arrayForm,
    });
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

    // Load List Data
    this.loadData();
  }
  loadData() {
    this._coreService.Get("hr/FormList/GetListRemind").subscribe((res: any) => {
      res.data.forEach((element: any) => {
        this.addForm(element);
      });
    });
  }
  changeCheckBox(value: any, index: number) {
    if (!value) {
      let control = (<FormArray>this.editForm.get("arrayForm")).controls[
        index
      ].get("day");
      control!.disable();
      control!.setValidators(null);
      control!.updateValueAndValidity();
    } else {
      let control = (<FormArray>this.editForm.get("arrayForm")).controls[
        index
      ].get("day");
      control!.enable();
      control!.setValidators([Validators.required]);
      control!.updateValueAndValidity();
    }
  }

  addForm(data: SettingRemind) {
    this.arrayForm.push(this.createForm());
    this.arrayData.push(data);
  }
  createForm(): FormGroup {
    return this._formBuilder.group({
      isActive: [],
      day: [],
    });
  }
  // lưu data open popup
  saveData = () => {
    if (!this.editForm.get("arrayForm")!.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }
    this._coreService
      .Post("hr/FormList/UpdateRemind", this.arrayData)
      .subscribe((res: any) => {
        //check error
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.editSuccess();
        }
      });
  };

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.SAVE:
        this.saveData();
        break;

      default:
        break;
    }
  };
}
