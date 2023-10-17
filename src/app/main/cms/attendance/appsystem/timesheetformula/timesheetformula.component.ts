import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Observable } from "rxjs";
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
  VirtualScrollService,
  GroupSettingsModel,
  QueryCellInfoEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  TimeSheet,
  TimeSheetFormula,
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
import {
  FilterSettingsModel,
  IFilter,
  Filter,
} from "@syncfusion/ej2-angular-grids";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { createElement } from "@syncfusion/ej2-base";

const _ = require("lodash");
import * as moment from "moment";
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "cms-attendance-timesheetformula",
  templateUrl: "./timesheetformula.component.html",
  styleUrls: ["./timesheetformula.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class TimeSheetFormulaComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SAVE
  ]);
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: any[] = [];
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };

  // query auto complete
  public query = new Query();

  model = new TimeSheetFormula();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;

  lstSymbol: any;
  wrapSettings!: { wrapMode: string };
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
    private _translateService: TranslateService,
    private _configService: ConfigService,
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
    // Load List Data
    this.getListData();
    this.getRightList();
    this.wrapSettings = { wrapMode: "Content" };
  }

  drag(e: any) {
    e.dataTransfer.setData("text", e.target.id);
  }

  getRightList() {
    this._coreService.Get("hr/Symbol/getlist").subscribe((res: any) => {
      this.model.elements = res.data.map(function (el: any) {
        return el.name;
      });



    });
  }

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.SAVE];
    this.toolbar = this.globals.buildToolbar(
      "timesheet_formula",
      toolbarList
    );
  };
  // filter checkbox

  // GetListData
  getListData = (orgId?: any, periodId?: any): void => {
    
    this._coreService
      .GetAll(this.state, "hr/TimeSheetMonthly/GetListFormula")
      .subscribe((res: any) => {
        this.data = res.result;
        this.gridInstance.pageSettings.totalRecordsCount = res.count;
        this.gridInstance.refresh();
      });
  };

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.SAVE:
        this._coreService
          .Post("hr/TimeSheetMonthly/UpdateFormula", this.model)
          .subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.error);
            } else {
              this.notification.editSuccess();
              this.getListData();
            }
          });
        break;
      case ToolbarItem.LOCK:
        break;
      default:
        break;
    }
  };
  nodeSelecting(e: any) {
    this.model.formulaName += e.nodeData.text;
  }

  add(e: any) {
    this.model.formulaName += e;
  }
  del() {
    this.model.formulaName = "";
  }
  ac() {
    this.model.formulaName = this.model.formulaName!.slice(
      0,
      this.model.formulaName!.length - 1
    );
  }
  rowSelecting(e: any) {
    this.model.id = e.data.id;
    this.model.formulaName = !e.data.formulaName ? "" : e.data.formulaName;
  }

  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  // disbale button chon nhieu ban ghi
  setButtonStatus = (event: any) => {
    if (!this.button) {
      this.button = setTimeout(() => {
        // đếm số bản ghi select
        const rowSelects = this.gridInstance.getSelectedRecords();
        const rowSelectCounts = rowSelects.length;
        // Nếu count > 1 thì disable toolbar
        if (rowSelectCounts > 1) {
          for (let i = 0; i < this.toolbar.length; i++) {
            //disable sửa
            if (this.toolbar[i].id === ToolbarItem.EDIT) {
              this.toolbar[i].isDisable = true;
            }
          }
        } else {
          for (let i = 0; i < this.toolbar.length; i++) {
            // enabled sửa
            if (this.toolbar[i].id === ToolbarItem.EDIT) {
              this.toolbar[i].isDisable = false;
            }
          }
        }
      }, 200);
    }
  };
}
