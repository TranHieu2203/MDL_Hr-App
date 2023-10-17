import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
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
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  GridComponent,ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs, ColumnModel } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface, CalculatePayroll } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
const _ = require("lodash");
import { takeUntil } from "rxjs/operators";
import { Splitter, SplitterComponent } from "@syncfusion/ej2-angular-layouts";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import { Notification } from "src/app/common/notification";
setCulture("en");

@Component({
  selector: "cms-takeleave",
  templateUrl: "./takeleave.component.html",
  styleUrls: ["./takeleave.component.scss"],
  providers: [FilterService],
  encapsulation: ViewEncapsulation.None,
})
export class TakeLeaveComponent implements OnInit, OnDestroy {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;


  @ViewChild('splitterInstance', { static: false })
  splitterObj!: SplitterComponent;

  public onCreated() {
    let splitterObj1 = new Splitter({
      height: '100%',
      paneSettings: [
        { size: '94%', min: '20%' },
        { size: '6%', min: '6%' }
      ],
      orientation: 'Vertical'
    });
    splitterObj1.appendTo('#vertical_splitter');
  }
  public fields: FieldSettingsModel = { text: "name", value: "id" };
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public flagStatusEmp: any;
  editForm!: FormGroup;
  // list filter


  public inforColumn!: ColumnModel[];
  public inforColumnOff!: ColumnModel[];


  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  lstYear = [];
  lstPeriodId: any;
  model = new CalculatePayroll();



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
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.editForm = this._formBuilder.group({
      yearId: ["", [Validators.required]],
      periodId: ["", [Validators.required]]
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
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id;
        this.getListData();
      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);

    this._coreService
      .Get("hr/SalaryPeriod/GetYear")
      .subscribe((res: any) => {
        this.lstYear = res.data;
        this.model.yearId = res.data[0].id;
        this.getListShiftPeriod(this.model.yearId).then((res: any) => {
          if (this.lstPeriodId[0]) {
            this.model.periodId = this.lstPeriodId[0].id;
          }
          this._coreService.organizationSelect.next(true);
        });
      });

    // merge column
    this.inforColumn = [
      {
        field: 'AL_T1',
        headerText: this.getLang('[Tháng 1]'),
        width: 130,
        minWidth: 10,
      },
      {
        field: 'AL_T2',
        headerText: this.getLang('[Tháng 2]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T3',
        headerText: this.getLang('[Tháng 3]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T4',
        headerText: this.getLang('[Tháng 4]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T5',
        headerText: this.getLang('[Tháng 5]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T6',
        headerText: this.getLang('[Tháng 6]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T7',
        headerText: this.getLang('[Tháng 7]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T8',
        headerText: this.getLang('[Tháng 8]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T9',
        headerText: this.getLang('[Tháng 9]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T10',
        headerText: this.getLang('[Tháng 10]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T11',
        headerText: this.getLang('[Tháng 11]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'AL_T12',
        headerText: this.getLang('[Tháng 12]'),
        width: 120,
        minWidth: 10,
      }
    ];
    this.inforColumnOff = [
      {
        field: 'CUR_USED1',
        headerText: this.getLang('[Tháng 1]'),
        width: 130,
        minWidth: 10,
      },
      {
        field: 'CUR_USED2',
        headerText: this.getLang('[Tháng 2]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED3',
        headerText: this.getLang('[Tháng 3]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED4',
        headerText: this.getLang('[Tháng 4]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED5',
        headerText: this.getLang('[Tháng 5]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED6',
        headerText: this.getLang('[Tháng 6]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED7',
        headerText: this.getLang('[Tháng 7]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED8',
        headerText: this.getLang('[Tháng 8]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED9',
        headerText: this.getLang('[Tháng 9]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED10',
        headerText: this.getLang('[Tháng 10]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED11',
        headerText: this.getLang('[Tháng 11]'),
        width: 120,
        minWidth: 10,
      },
      {
        field: 'CUR_USED12',
        headerText: this.getLang('[Tháng 12]'),
        width: 120,
        minWidth: 10,
      }
    ];
  }


  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SUM_WORK,
    ToolbarItem.EXPORT_EXCEL
  ])

  public getLang(key: any): string {
    let lang = key;
    this._translateService.get(key).subscribe((data) => {
      lang = data;
    })
    return lang;
  }


  // filldata
  // GetListData
  getListData = (): void => {
    
    var extraParams: any = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
      extraParams.push({
        field: "periodId",
        value: this.model.periodId,
      });
      extraParams.push({
        field: "year",
        value: this.model.yearId,
      });
    }

    this._coreService.execute(this.state, "hr/timeSheetMonthly/ListEntitlement", extraParams);
  };

  getListShiftPeriod(id: any) {
    return new Promise((resolve, reject) => {
      this._coreService
        .Get("hr/SalaryPeriod/getlist?Id=" + id)
        .subscribe((res: any) => {

          if (Number(res.statusCode) === 200) {
            this.lstPeriodId = res.data;
            this.model.periodId = res.data[0].id;
            resolve(res.data);
          } else {
            reject("Error")
          }
        });
    });
  }
  GetEmp = (e: any) => {
    this.flagStatusEmp = e.checked;
    this.getListData();
  }

  changeYear(e: any) {
    if (e.isInteracted) {
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriodId = res;
      });
    }
  }
  changePeriod(e: any) {
    if (e.isInteracted) {
      this.model.periodId = e.value;
      setTimeout(() => {
        this.getListData();
      });
    }
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }

    this._coreService.execute(this.state, "hr/timeSheetMonthly/ListEntitlement", extraParams);
  }
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.EXPORT_EXCEL:
        var extraParams: any = [];
        if (this.nodeSelected) {
          extraParams.push({
            field: "orgId",
            value: this.nodeSelected,
          });
        }
        var data = this._coreService.ExecuteToExport('hr/timeSheetMonthly/ListEntitlement', extraParams, this.state).subscribe((res: any) => {
          // Lấy ngày hiện tại
          const currentDate: Date = new Date();

          // Lấy ngày, tháng và năm
          const year: number = currentDate.getFullYear();
          const month: number = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
          const day: number = currentDate.getDate();
          // Chuyển đổi thành chuỗi "yyyyMMdd"
          const formattedDate: string = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
          const exportProperties: ExcelExportProperties = {
            dataSource: res.data,
            columns: [],
            fileName: "quanlynghiphep" + "-" + formattedDate + ".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      case ToolbarItem.SUM_WORK:
        if (!this.model.yearId) {
          this.notification.warning("[Chưa chọn năm]");
          return;
        }
        if (!this.model.periodId) {
          this.notification.warning("[Chưa chọn kỳ công]");
          return;
        }

        this.model.orgId = this.nodeSelected;

        this._coreService
          .Post("hr/timeSheetMonthly/CalEntitlement", this.model)
          .subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.error);
            } else {
              this.notification.success("[Tính phép năm thành công]");
              this.getListData();
            }
          });
        break;
      default:
        break;
    }
  };

  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
