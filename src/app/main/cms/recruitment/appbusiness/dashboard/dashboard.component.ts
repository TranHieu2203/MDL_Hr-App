import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
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
  VirtualScrollService,ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query } from "@syncfusion/ej2-data";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { IAccTextRenderEventArgs, IAccPointRenderEventArgs } from '@syncfusion/ej2-charts';

const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-app-job",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD,
    ToolbarItem.EDIT,
    ToolbarItem.LOCK,
    ToolbarItem.DELETE,
  ])
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
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  groupId: number = 0;

  public funneldata?: Object[];
  public gapRatio: number = 0.08;
  public onPointRender: Function | any;
  public dataFunnelChart: Object[] = [
    { x: 'Thành nhân viên', text: 'Thành nhân viên', y: 50 },
    { x: 'Phỏng vấn lần 2', text: 'Phỏng vấn lần 2', y: 80 },
    { x: 'Phỏng vấn lần 1', text: 'Phỏng vấn lần 1', y: 135 },
    { x: 'Ứng viên', text: 'Ứng viên', y: 155 },

  ];
  public chartDataColumn = [
    { month: 'Jan', sales: 35, sales1: 28 }, { month: 'Feb', sales: 28, sales1: 35 },
    { month: 'Mar', sales: 34, sales1: 32 }, { month: 'Apr', sales: 32, sales1: 34 },
    { month: 'May', sales: 40, sales1: 32 }, { month: 'Jun', sales: 32, sales1: 40 },
    { month: 'Jul', sales: 35, sales1: 55 }, { month: 'Aug', sales: 55, sales1: 35 },
    { month: 'Sep', sales: 38, sales1: 30 }, { month: 'Oct', sales: 30, sales1: 38 },
    { month: 'Nov', sales: 25, sales1: 32 }, { month: 'Dec', sales: 32, sales1: 25 }

  ];
  public pieDataChart: Object[] = [
    { x: 'Online', y: 155 }, 
    { x: 'Kênh truyền thống', y: 122 }, 
    { x: 'Giới thiệu', y: 30 }   ]
   public piedata?: Object[]=[
    { x: 'Vietnamwork', y: 70020000, text: 'Vietnamwork' }, 
    { x: 'Linkedin',    y: 80500000, text: 'Linkedin' },
    { x: 'TopCV',       y: 50000000, text: 'TopCV' }, 
    { x: 'ITViec',      y: 12000000, text: 'ITViec' },
    { x: 'Khác',        y: 20000000, text: 'Khác' }, 
    ];;
    public openPosition?: Object[]=[
      { x: 'Finance', y: 3, text: 'Finance' }, 
      { x: 'Sale',    y: 15, text: 'Sale' },
      { x: 'Hr',       y: 2, text: 'Hr' }, 
      { x: 'Marketing',      y: 7, text: 'Marketing' },
      { x: 'Operation',        y: 5, text: 'Operation' }, 
      ];
  public chartDataMuntiple?:Object[];
  public dataLabel?: Object;
  public dataLabe2?: Object;

  public legendSettings?: Object;
  public tooltip?: Object;
  public primaryXAxis: any;
  public primaryYAxis: any;

  public chartDataBar?: Object[];
  public map: Object = 'fill';
  public marker?: Object;

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
    private ip: IpServiceService,
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
    // Load List Data
    this.getListData();

    this.dataLabel = { visible: true, name: 'text', position: 'Inside' };
    this.dataLabe2 = { visible: true, name: 'text', position: 'Outside' };

    this.legendSettings = { visible: false };
    this.tooltip = {
      enable: true, format: '${point.x} : <b>${point.y}</b>'
    };
    this.primaryXAxis = {
      valueType: 'Category'
    };
    this.chartDataBar =  [
      { x: "Salary", y: 50 },
      { x: "Other", y: 70},
      { x: "Exper lence", y: 20 },
      { x: "Culture", y: 10 },
      { x: "Technical", y: 5},
      

 ];
 this.chartDataMuntiple =  [
  { x: 'Vietnamwork', y: 50, y1: 40, y2: 20, y3: 20, y4: 10 },
  { x: 'Linkedin', y: 30, y1: 22, y2: 10, y3: 0, y4: 19 },
  { x: 'TopCV', y: 45, y1: 15, y2: 10, y3: 9, y4: 9 },
  { x: 'ITViec', y: 60, y1: 40, y2: 5, y3: 35, y4: 30 },
  { x: 'Khác', y: 10, y1: 9, y2: 3, y3: 5, y4: 5 },
];
this.marker = { visible: true, width: 10, opacity: 0.6, height: 10 };

  }


  // GetListData
  getListData = () => {

  };



  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
