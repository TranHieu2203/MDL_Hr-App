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
import { ToolbarItem, ToolbarInterface, ContractInfor } from "src/app/_models/index";
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
import { ILoadedEventArgs, ChartComponent, ChartTheme } from '@syncfusion/ej2-angular-charts';
import { ChartSeriesType } from '@syncfusion/ej2-charts';
import { Browser } from '@syncfusion/ej2-base';

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

  public dev: Object[] = [
    { x: 'Năng lực chuyên môn', y: 4 }, { x: 'Năng lực quản lý', y: 2.8 },
    { x: 'Làm việc nhóm', y: 3 }, { x: 'Khả năng nghiên cứu', y: 3.4 },
    { x: 'Tư duy', y: 1.2 }
  ];
  public techlead: Object[] = [
    { x: 'Năng lực chuyên môn', y: 5 }, { x: 'Năng lực quản lý', y: 4.0 },
    { x: 'Làm việc nhóm', y: 5 }, { x: 'Khả năng nghiên cứu', y: 4.5 },
    { x: 'Tư duy', y: 4 } ,{ x: 'Kỹ năng lãnh đạo đội nhóm', y: 4 },{ x: 'Khả năng định hướng', y: 4 },{ x: 'Xây dựng quy trình', y: 4 },
  ];
    public primaryXAxis: Object = {
      valueType: 'Category',
      labelPlacement: 'OnTicks',
      interval: 1,
      coefficient: Browser.isDevice ? 80 : 100
  };
  public primaryYAxis: Object = {
      title: 'Revenue in Millions',
      labelFormat: '{value}'
  };
public tooltip: Object = {
    enable: true
};
public legendSettings: Object = {
    visible: true,
    enableHighlight: true
};
public marker: Object = {
    visible: false
};
  // custom code start
public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark").replace(/contrast/i, 'Contrast');
};
public loadDev=false;
public loadTechnicalLead = false;
  // custom code end
public title: string = 'Average Sales Comparison';
  @ViewChild('chart')
  public chart!: ChartComponent;
  public seriesType!: DropDownList;
  model: ContractInfor = new ContractInfor();

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
    this.seriesType = new DropDownList({
      index: 0,
      width: 80,
      change: () => {
          let type: string = this.seriesType.value.toString();
          this.chart.series[0].type = <ChartSeriesType>type;
          this.chart.refresh();
      }
  });
  this.seriesType.appendTo('#selmode');

  }


  // GetListData
  getListData = () => {

  };
  onChange() {
this.loadTechnicalLead=true}

  choiseEmp() {
    let param = {
      selected: -1,//this.model.employeeId, //select employee on grid
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.employeeId = res.employeeId;
      this.model.employeeCode = res.employeeCode + "-" + res.employeeName;
      this.loadDev=true;
      x.unsubscribe();
    });
  }


  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
