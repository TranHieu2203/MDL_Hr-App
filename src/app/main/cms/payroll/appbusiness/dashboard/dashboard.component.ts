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

  public primaryXAxis?: Object;
  public chartData?: Object[];
  public title?: string;
  public primaryYAxis?: Object;
  public palette?: string[];
  public data!: Object[] ;
  public chartArea: Object = {
    border: {
        width: 0
    }
};
public width: string = Browser.isDevice ? '100%' : '75%';
public circleMarker: Object = { visible: true, height: 7, width: 7 , shape: 'Circle' , isFilled: true };
public triangleMarker: Object = { visible: true, height: 6, width: 6 , shape: 'Triangle' , isFilled: true };
public diamondMarker: Object = { visible: true, height: 7, width: 7 , shape: 'Diamond' , isFilled: true };
public rectangleMarker: Object = { visible: true, height: 5, width: 5 , shape: 'Rectangle' , isFilled: true };
public pentagonMarker: Object = { visible: true, height: 7, width: 7 , shape: 'Pentagon' , isFilled: true };

public tooltip: Object = {
    enable: true
};
public legend: Object = {
  enable: true, format: '${point.x} : <b>${point.y}</b>'
}

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
    this.chartData = [
      { month: "Tháng 1", gold: 110, silver: 30, bronze: 45 },
      { month: "Tháng 2", gold: 100, silver: 40, bronze: 55 },
      { month: "Tháng 3", gold: 90, silver: 35, bronze: 50 },
      { month: "Tháng 4", gold: 80, silver: 56, bronze: 40 },
      { month: "Tháng 5", gold: 120, silver: 45, bronze: 35 },
      { month: "Tháng 6", gold: 110, silver: 30, bronze: 22 },
      { month: "Tháng 7", gold: 105, silver: 35, bronze: 37 },
      { month: "Tháng 8", gold: 109, silver: 45, bronze: 27 },
      { month: "Tháng 9", gold: 130, silver: 55, bronze: 27 },
      { month: "Tháng 10", gold: 130, silver: 35, bronze: 27 },
      { month: "Tháng 11", gold: 140, silver: 40, bronze: 27 },
      { month: "Tháng 12", gold: 140, silver: 37, bronze: 27 },
    ];
    this.data= [
      { month: "Tháng 1", gold: 110 + 50, silver: 30+ 90, bronze: 45 },
      { month: "Tháng 2", gold: 100 + 50, silver: 40+ 90, bronze: 55 },
      { month: "Tháng 3", gold: 90+ 50, silver: 35+ 90, bronze: 50 },
      { month: "Tháng 4", gold: 80+ 50, silver: 56+ 90, bronze: 40 },
      { month: "Tháng 5", gold: 120+ 50, silver: 45+ 90, bronze: 35 },
      { month: "Tháng 6", gold: 110+ 50, silver: 30+ 90, bronze: 22 },
      { month: "Tháng 7", gold: 105+ 50, silver: 35+ 90, bronze: 37 },
      { month: "Tháng 8", gold: 109+ 50, silver: 45+ 90, bronze: 27 },
      { month: "Tháng 9", gold: 130+ 50, silver: 55+ 90, bronze: 27 },
      { month: "Tháng 10", gold: 130+ 50, silver: 35+ 140, bronze: 27 },
      { month: "Tháng 11", gold: 140+ 50, silver: 40+ 155, bronze: 27 },
      { month: "Tháng 12", gold: 140+ 50, silver: 37+ 140, bronze: 27 },
  ];
    this.primaryXAxis = {
      valueType: 'Category',
      title: 'Tháng'
    };
    this.primaryYAxis = {
      minimum: 0, maximum: 200,
      interval: 20, title: 'Chi phí(VND)',
      labelFormat: '{value}'
    };
    this.palette = ["#E94649", "#F6B53F", "#6FAAB0", "#C4C24A"];
    this.title = 'Biểu đồ quỹ lương năm 2023';

  }
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
