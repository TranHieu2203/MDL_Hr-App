import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Subject, Observable } from "rxjs";
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
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarInterface, TimeSheet } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { TimeSheetService } from "src/app/_services/timesheet.service";
import { throttleTime } from "rxjs/internal/operators/throttleTime";
import { takeUntil } from "rxjs/operators";
setCulture("en");

@Component({
  selector: "cms-attendance-timesheetmonthly",
  templateUrl: "./timesheetmonthly.component.html",
  styleUrls: ["./timesheetmonthly.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class TimeSheetMonthlyComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  // @ViewChild("filterMenu", { static: false })
  // public filterMenu!: ListBoxComponent;
  public fields: FieldSettingsModel = { text: "name", value: "id" };
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };
  selectionOptions = {
    cellSelectionMode: "Box",
    type: "Multiple",
    mode: "Cell",
  };
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  // query auto complete
  public query = new Query();
  // public groupSettings: GroupSettingsModel = {
  //   showDropArea: false,
  //   columns: ["orgName"],
  //   captionTemplate: '<span style="color:black">${key}</span>',
  // };
  model = new TimeSheet();
  // list filter
  // lstYearId = [
  //   { id: 2019, name: "2019" },
  //   { id: 2020, name: "2020" },
  // ];
  // lstMonthId = [];
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  m!: number;
  y!: number;
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
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private _timesheet: TimeSheetService
  ) {
    this.data = _coreService;
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
    // tong hop cong
    this._timesheet.timesheetstandardsumwork
      .pipe(takeUntil(this._unsubscribeAll))
      .pipe(throttleTime(300))
      .subscribe((res: any) => {
        this.model = res;
        this.modalService.loading.next(true);
        this._coreService
          .Post("hr/TimeSheetMonthly/sumwork", this.model)
          .subscribe((res: any) => {
            this.modalService.loading.next(false);
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.error);
            } else {
              this.notification.success("Tổng hợp thành công");
              this.getListData(this.model.orgId, this.model.periodId);
            }
          });
      });
    //
    this._timesheet.timesheetmonthly
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: TimeSheet) => {
        if (res === "EXPORT") {
          this.gridInstance.excelExport();
          // const state = { skip: 0, take: 1000 };
          // let extraParams: any = [
          //   {
          //     field: "ORG_ID",
          //     value: this.model.orgId,
          //   },
          //   {
          //     field: "PERIOD_ID",
          //     value: this.model.periodId,
          //   },
          //   // {
          //   //   field: "IS_QUIT",
          //   //   value: this.model.isQuit,
          //   // },
          // ];
          // this._coreService
          //   .GetAll(state, "hr/TimeSheetMonthly/ListTimeSheetMonthly", extraParams)
          //   .subscribe((res: any) => {
          //     let header = new Object();
          //     this.gridInstance.columns.forEach((element: any) => {
          //       if (element.visible == true) {
          //         header[element.field] = element.headerText;
          //       }
          //     });
          //     this._coreService.exportExcel(res.result, "CongTongHop", header);
          //   });
        } else {
          this.getListData(res.orgId, res.periodId);
        }
      });
  }
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  // GetListData
  getListData = (orgId?: any, periodId?: any): void => {
    
    this.model.orgId = orgId;
    this.model.periodId = periodId;
    let extraParams: any = [
      {
        field: "ORG_ID",
        value: this.model.orgId,
      },
      {
        field: "PERIOD_ID",
        value: this.model.periodId,
      },
      {
        field: "IS_QUIT",
        value: 1,
      },

    ];
    this._coreService.execute(
      this.state,
      "hr/TimeSheetMonthly/ListTimeSheetMonthly",
      extraParams
    );
  };
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any = [
      {
        field: "ORG_ID",
        value: this.model.orgId,
      },
      {
        field: "PERIOD_ID",
        value: this.model.periodId,
      },
      {
        field: "IS_QUIT",
        value: 1,
      },
    ];
    this._coreService.execute(
      state,
      "hr/TimeSheetMonthly/ListTimeSheetMonthly",
      extraParams
    );
  }

  // change date
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
