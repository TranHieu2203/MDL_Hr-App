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
  VirtualScrollService
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarInterface, TimeSheet } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import * as moment from "moment";
const _ = require("lodash");
import { TimeSheetService } from "src/app/_services/timesheet.service";
import { throttleTime } from "rxjs/internal/operators/throttleTime";
import { takeUntil } from "rxjs/operators";
import { Tooltip } from '@syncfusion/ej2-popups';
import { MapMultiMarkerComponent } from "src/app/components/mapmultimarker/mapmultimarker.component";
setCulture("en");

@Component({
  selector: "cms-attendance-timesheetroot",
  templateUrl: "./timesheetroot.component.html",
  styleUrls: ["./timesheetroot.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class TimeSheetRootComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  @ViewChild("mapcore", { static: false })
  public mapcore!: MapMultiMarkerComponent;

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
    // Set language
    this.languages = this.globals.currentLang;
    this.data = _coreService;
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
    this._timesheet.timesheetroot
      .pipe(takeUntil(this._unsubscribeAll))
      .pipe(throttleTime(300))
      .subscribe((res: any) => {
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
          //   }
          // ];
          // this._coreService
          //   .GetAll(state, "hr/TimeSheetMonthly/ListSwipeData", extraParams)
          //   .subscribe((res: any) => {
          //     let header = new Object();
          //     this.gridInstance.columns.forEach((element: any) => {
          //       if (element.visible == true) {
          //         header[element.field] = element.headerText;
          //       }
          //     });
          //     this._coreService.exportExcel(res.result, "CongGoc", header);
          //   });
        }
        else if (res == "EDIT") {
          const selectRowIndex = this.gridInstance.getSelectedRowCellIndexes() as any;
          if (selectRowIndex.length == 0) {
            this.notification.warning("notify.NO_RECORD_SELECT")
            return;
          }
          let cells = selectRowIndex[0].cellIndexes[0];
          let row = selectRowIndex[0].rowIndex;
          let lstData: any = this.gridInstance.getCurrentViewRecords()[row]
          let modelSelect = _.cloneDeep(lstData)
          if (cells == 8)
            modelSelect.TYPE_EDIT = "IN"
          if (cells == 10)
            modelSelect.TYPE_EDIT = "OUT"
          modelSelect.ORG_ID = this.model.orgId;
          modelSelect.PERIOD_ID = this.model.periodId;

          this.modalService.open("cms-app-modalstimesheetroot", modelSelect)
        }
        else {
          this.getListData(res.orgId, res.periodId);
        }
      });
  }
  customiseCell(args: any) {
    if (args.data.IS_EDIT_IN && args.column.field === 'VALTIME1') {
      args.cell.classList.add("cell-red-1");
      const tooltip: Tooltip = new Tooltip({
        content: args.data["NOTE"] != null ? args.data["NOTE"].toString() : null
      }, args.cell as HTMLTableCellElement);
    }
    if (args.data.IS_EDIT_OUT && args.column.field === 'VALTIME4') {
      args.cell.classList.add("cell-red-1");
      const tooltip: Tooltip = new Tooltip({
        content: args.data["NOTE"] != null ? args.data["NOTE"].toString() : null
      }, args.cell as HTMLTableCellElement);
    }
  }
  // GetListData
  getListData = (orgId?: any, periodId?: any): void => {
    this.gridInstance.clearFiltering();
    
    this.model.orgId = orgId;
    this.model.periodId = periodId;
    let extraParams: any = [
      {
        field: "OrgId",
        value: this.model.orgId,
      },
      {
        field: "PeriodId",
        value: this.model.periodId,
      },
    ];
    this._coreService.execute(
      this.state,
      "hr/TimeSheetMonthly/ListSwipeData",
      extraParams
    );
    //this.gridInstance.clearFiltering();
  };
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any = [
      {
        field: "OrgId",
        value: this.model.orgId,
      },
      {
        field: "PeriodId",
        value: this.model.periodId,
      },
      // {
      //   field: "IS_QUIT",
      //   value: this.model.isQuit,
      // },
    ];

    this._coreService.execute(
      state,
      "hr/TimeSheetMonthly/ListSwipeData",
      extraParams
    );
  }
  // check map
  // CheckMap = (data: any) => {
  //   this._coreService.Get("hr/TimeSheetDaily/MapKeeping?EmpId=" + data.EMPLOYEE_ID + "&PeriodId=" + this.model.periodId + "&day=" + moment(data.WORKINGDAY).format("YYYY-MM-DD")).subscribe((res: any) => {
  //     let data1 = res.data[0];
  //     let param = {
  //       lat: data1.LATITUDE,
  //       long: data1.LONGITUDE,
  //       markers: res.data,
  //       zoom: 6
  //     }
  //     this.mapcore.setValue(param);
  //     this.modalService.open("modal-md");
  //   })

  // }
  close = () => {
    this.modalService.close("modal-md");
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
