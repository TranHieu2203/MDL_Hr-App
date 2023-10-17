import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject } from "rxjs";
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
setCulture("en");

@Component({
  selector: "cms-profile-timesheetmonthly",
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

  public fields: FieldSettingsModel = { text: "name", value: "id" };
  // selectionOptions = {
  //   cellSelectionMode: "Box",
  //   type: "Multiple",
  //   mode: "Cell",
  // };
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: any[] = [];
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  // query auto complete
  public query = new Query();
  public groupSettings: GroupSettingsModel = {
    showDropArea: false,
    columns: ["orgName"],
    captionTemplate: '<span style="color:black">${key}</span>',
  };
  model = new TimeSheet();
  // list filter
  lstYearId = [
    { id: 2019, name: "2019" },
    { id: 2020, name: "2020" },
  ];
  lstMonthId = [];
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
    //this.getListData();
    this.getTreeView();

    this.model.yearId = new Date().getFullYear();
    this.getListShiftPeriod(this.model.yearId).then((res: any) => {
      let shiftPeriod = _.find(res, (item: any) => {
        return new Date(item.dateStart).getMonth() == new Date().getMonth();
      });
      this.model.periodId = shiftPeriod.id;
    });
  }

  changeYear(e: any) {
    if (e.e) {
      this.getListShiftPeriod(e.itemData.id);
    }
  }
  changeMonth(e: any) {
    if (e.e) {
      this.model.dateStart = e.itemData.dateStart;
      this.model.dateEnd = e.itemData.dateEnd;

      if (this.model.orgId) {
        this.getListData(this.model.orgId, e.itemData.id);
      }
    }
  }
  nodeSelecting(e: any) {
    this.model.orgId = e.nodeData.id;
    this.getListData(this.model.orgId, this.model.periodId);
  }

  getListShiftPeriod(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/SalaryPeriod/getlist?Id=" + id)
        .subscribe((res: any) => {
          this.lstMonthId = res.data;
          resolve(res.data);
        });
    });
  }

  getTreeView() {
    this._coreService.Get("hr/organization/getlist").subscribe((res: any) => {
      this.field = {
        dataSource: res.data,
        id: "id",
        text: "name",
        parentID: "pid",
        hasChildren: "hasChild",
      };
    });
  }
  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate([
      "/hrms/profile/appbusiness/timesheetmonthly/",
      paramAdd,
    ]);
  };

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.SUM_WORK];
    this.toolbar = this.globals.buildToolbar(
      "sys-app-TimeSheetMonthly",
      toolbarList
    );
  };
  // filter checkbox

  // GetListData
  getListData = (orgId?: any, periodId?: any): void => {
    
    let extraParams: any[] = [];
    if (orgId) {
      extraParams.push({
        field: "orgId",
        value: orgId,
      });
    }
    if (periodId) {
      extraParams.push({
        field: "periodId",
        value: periodId,
      });
    }
    this._coreService
      .GetAll(state, "hr/TimeSheetMonthly/getall", extraParams)
      .subscribe((res: any) => {
        this.data = res.result;
        this.gridInstance.pageSettings.totalRecordsCount = res.count;
      });
  };
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.model.orgId) {
      extraParams.push({
        field: "orgId",
        value: this.model.orgId,
      });
    }
    if (this.model.periodId) {
      extraParams.push({
        field: "periodId",
        value: this.model.periodId,
      });
    }
    this._coreService
      .GetAll(state, "hr/TimeSheetMonthly/getall", extraParams)
      .subscribe((res: any) => {
        this.data = res.result;
        this.gridInstance.pageSettings.totalRecordsCount = res.count;
      });
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.SUM_WORK:
        if (!this.model.orgId) {
          this.notification.warning("Chọn phòng ban");
          break;
        }
        this.modalService.loading.next(true);
        this._coreService
          .Post("hr/TimeSheetMonthly/sumwork", this.model)
          .subscribe((res: any) => {
            this.modalService.loading.next(false);
            this.notification.success("Tổng hợp thành công1");
            this.getListData(this.model.orgId, this.model.periodId);
          });
        break;
      case ToolbarItem.LOCK:
        break;
      default:
        break;
    }
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
