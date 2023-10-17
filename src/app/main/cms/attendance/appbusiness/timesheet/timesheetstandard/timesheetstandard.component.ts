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
  VirtualScrollService,
  GroupSettingsModel,
  QueryCellInfoEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  TimeSheet,
} from "src/app/_models/index";
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
import * as moment from "moment";
import { TimeSheetService } from "src/app/_services/timesheet.service";
import { throttleTime } from "rxjs/internal/operators/throttleTime";
import { takeUntil } from "rxjs/operators";
setCulture("en");

@Component({
  selector: "cms-attendance-timesheetstandard",
  templateUrl: "./timesheetstandard.component.html",
  styleUrls: [],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class TimeSheetStandardComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };
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
  public groupSettings: GroupSettingsModel = {
    showDropArea: false,
    columns: ["orgName"],
    captionTemplate: '<span style="color:black">${key}</span>',
  };
  model = new TimeSheet();
  checked = -1;
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
    this._timesheet.timesheetstandard
      .pipe(takeUntil(this._unsubscribeAll))
      .pipe(throttleTime(300))
      .subscribe((res: TimeSheet) => {
        if (res as string === "EXPORT") {
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
          //   {
          //     field: "IS_QUIT",
          //     value: 1,
          //   },
          // ];
          // this._coreService
          //   .GetAll(state, "hr/timesheetdaily/getall", extraParams)
          //   .pipe(takeUntil(this._unsubscribeAll))
          //   .subscribe((res: any) => {
          //     let header = new Object();
          //     this.gridInstance.columns.forEach((element: any) => {
          //       if (element.visible == true) {
          //         header[element.field] = element.headerText;
          //       }
          //     });
          //     this._coreService.exportExcel(res.result, "CongChuan", header);
          //   });
        } else {
          this.viewAttandance(res.dateStart, res.dateEnd).then((x) => {
            this.model = res;
            this.getListData(res.orgId, res.periodId);
          });
        }
      });
    this._timesheet.timesheetstandardedit
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: TimeSheet) => {
        const selectRows = this.gridInstance.getSelectedRowCellIndexes();
        if (selectRows && selectRows.length > 0) {
          this.update(selectRows);
        }
      });
  }
  customiseCell(args: QueryCellInfoEventArgs) {
    if ((args.data as any)[args.column!.field] == "X") {
      args.cell!.classList.add("cell-green");
    } else if ((args.data as any)[args.column!.field] == "P") {
      args.cell!.classList.add("cell-green");
    } else if ((args.data as any)[args.column!.field] == "KL") {
      args.cell!.classList.add("cell-red");
    } else if ((args.data as any)[args.column!.field] == "X/OFF") {
      args.cell!.classList.add("cell-orange");
    } else {
      args.cell!.classList.add("above-80");
    }
  }

  update(selectRows: any) {
    let cells = selectRows[0].cellIndexes;
    let row = selectRows[0].rowIndex;
    let modelSelect: any = this.gridInstance.getCurrentViewRecords()[row];
    let model: any = {};
    model.employeeId = modelSelect.EMPLOYEE_ID;
    model.employeeCode = modelSelect.EMPLOYEE_CODE;
    model.employeeName = modelSelect.EMPLOYEE_NAME;
    model.periodId = this.model.periodId;
    let a = this.gridInstance
      .getColumnByIndex(cells[0])
      .field.replace("DAY", "");

    let b = this.gridInstance
      .getColumnByIndex(cells[cells.length - 1])
      .field.replace("DAY", "");

    model.dateStart = new Date(this.y, this.m, Number(a));
    model.dateEnd = new Date(this.y, this.m, Number(b));

    this.modalService.open("cms-app-modalstimesheet", model);
    const z = this.modalService.timesheet.subscribe((model) => {
      setTimeout(() => {
        this.getListData(this.model.orgId, this.model.periodId);
        z.unsubscribe();
      }, 300);
    });
  }
  // Xử lý dữ liệu chấm công
  viewAttandance = (dateStart: any, dateEnd: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let a = moment(dateStart);
        let b = moment(dateEnd);
        let m = a.month();
        let y = a.year();
        this.m = m;
        this.y = y;
        let soNgay = b.diff(a, "days") + 1;
        for (let i = 1; i <= soNgay; i++) {
          let f = new Date(dateStart);
          let j = new Date(f.setDate(f.getDate() + i - 1));
          let dayOfM = j.getDate();
          let m = j.getMonth();
          let y = j.getFullYear();
          let column = this.gridInstance.getColumnByField("DAY" + i);
          column.visible = true;
          let d = new Date(y, m, dayOfM);
          let dayOfWeek = moment(d);

          let day =
            dayOfWeek.day() != 0 ? "T" + Number(dayOfWeek.day() + 1) : "CN";
          column.headerText =
            day +
            " " +
            dayOfM +
            "/" +
            (Number(m + 1) > 9 ? Number(m + 1) : "0" + Number(m + 1));
        }

        let column29 = this.gridInstance.getColumnByField("DAY29");
        let column30 = this.gridInstance.getColumnByField("DAY30");
        let column31 = this.gridInstance.getColumnByField("DAY31");
        switch (soNgay) {
          case 28:
            column29.visible = false;
            column30.visible = false;
            column31.visible = false;
            break;
          case 29:
            column30.visible = false;
            column31.visible = false;
            break;
          case 30:
            column31.visible = false;
            break;
        }
        this.gridInstance.refreshColumns();
        this.gridInstance.refreshHeader();
        resolve(false);
      }, 200);
    });
  };
  // GetListData
  getListData = (orgId?: any, periodId?: any): void => {
    this.gridInstance.clearFiltering();

    
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
        field: "TYPE_ID",
        value: this.model.typeId,
      },
    ];
    this._coreService.execute(this.state, "v2/timesheetdaily/getall", extraParams);
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
        field: "TYPE_ID",
        value: this.model.typeId,
      },
    ];
    if (this.model.periodId != null) {
      this._coreService.execute(this.state, "v2/timesheetdaily/getall", extraParams);
    }
  }
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
  // change date
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
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
