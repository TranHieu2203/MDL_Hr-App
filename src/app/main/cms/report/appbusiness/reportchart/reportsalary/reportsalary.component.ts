import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  ChangeDetectorRef,
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
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
const _ = require("lodash");
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import * as moment from "moment";
import { takeUntil } from "rxjs/operators";
import * as Highcharts from "highcharts";
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
import HC_exportData from 'highcharts/modules/export-data';
HC_exportData(Highcharts)
setCulture("en");

@Component({
  selector: "cms-app-reportsalary",
  templateUrl: "./reportsalary.component.html",
  styleUrls: ["./reportsalary.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ReportSalaryComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  Highcharts = Highcharts;
  flagState = false;
  model: ReportEmployee = new ReportEmployee();

  public field = {};
  @ViewChild("listTreeObj", { static: true })
  public listTreeObj!: TreeViewComponent;

  @ViewChild("maskObj", { static: true })
  public maskObj!: MaskedTextBoxComponent;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data!: any[];
  public OptionChartEmpMonth: any = {
    chart: {
      renderTo: "container",
      height: "400",
      zoomType: 'xy',
      style: {
        fontFamily: "v2hrm-font",
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Báo cáo quỹ lương theo năm",
    },
    xAxis: [{
      categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      crosshair: true
    }],
    yAxis: [{ // Primary yAxis
      labels: {
        format: '{value}',
        style: {
          color: Highcharts.getOptions().colors![1]
        }
      },
      title: {
        text: 'Tăng mới',
        style: {
          color: Highcharts.getOptions().colors![1]
        }
      }
    }, { // Secondary yAxis
      title: {
        text: 'Quỹ lương',
        style: {
          color: Highcharts.getOptions().colors![0]
        }
      },
      labels: {
        format: '{value}',
        style: {
          color: Highcharts.getOptions().colors![0]
        }
      },
      opposite: true
    }],

    tooltip: {
      shared: true
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      x: 120,
      verticalAlign: 'top',
      y: 100,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend!.backgroundColor || // theme
        'rgba(255,255,255,0.25)'
    },

    series: [{
      name: 'Quỹ lương',
      type: 'column',
      yAxis: 1,
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      color: "#0075F2",
      tooltip: {
        valueSuffix: ' VNĐ'
      }

    }, {
      name: 'Tăng mới',
      type: 'spline',
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
      color: "#FFBB21",
      tooltip: {
        valueSuffix: ' nhân sự'
      }
    }],
  //   exporting: {
  //     showTable: true
  // }
  };

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  element: any;
  localData = [];
  showMask = false;
  param: any;
  orgId: any;
  yearId: any;
  groupOptions!: { columns: string[] };
  genGrid: boolean = false;
  lstIncOrg: any[] = [];
  lstIncPos: any[] = [];
  lstIncACA: any[] = [];
  lstIncEmp: any[] = [];
  lstEmp: any[] = [];


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
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private el: ElementRef,
    private cdref: ChangeDetectorRef
  ) {
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.element = el.nativeElement;
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

    this._coreService.reportSubject
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        if (res && res.typeId == 1 || res.typeId == 4) {
          if (!this.model.toDate) {
            this.notification.warning("Nhập ngày");
            return;
          }
          if (!res.orgId) {
            this.notification.warning("Chọn phòng ban");
            return;
          }
          this.flagState = false;
          this.getListData(res.orgId).then((result: any) => {
            this.flagState = true;
           this.lstIncEmp = (result as any)[0];
          
            let empMonth: any = this.lstIncEmp[0]

            // convert data to view table
            for (let i = 1; i <= 12; i++) {
              if(i < 10)
              {
                let strT = "T0" + i;
                let strTM = "TM0" + i
                let obj = {
                  name: "tháng 0" + i,
                  emp: empMonth[strT],
                  incEmp: empMonth[strTM]
                }
                this.lstEmp.push(obj);
              }
              else
              {
                let strT = "T" + i;
                let strTM = "TM" + i
                let obj = {
                  name: "tháng " + i,
                  emp: empMonth[strT],
                  incEmp: empMonth[strTM]
                }
                this.lstEmp.push(obj);
              }
             
              
            }
            this.OptionChartEmpMonth.series![0].data = [empMonth.T01, empMonth.T02, empMonth.T03, empMonth.T04, empMonth.T05, empMonth.T06, empMonth.T07, empMonth.T08, empMonth.T09, empMonth.T10, empMonth.T11, empMonth.T12];
            this.OptionChartEmpMonth.series[1].data = [empMonth.TM01, empMonth.TM02, empMonth.TM03, empMonth.TM04, empMonth.TM05, empMonth.TM06, empMonth.TM07, empMonth.TM08, empMonth.TM09, empMonth.TM10, empMonth.TM11, empMonth.TM12]
            //
          });
        }
      });
    setTimeout(() => {
      this.genGrid == true;
    }, 100);


  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
  // GetListData
  getListData = (orgId: any) => {
    return new Promise((resolve) => {
      let year = moment(this.model.toDate).year();
      this._coreService
        .Get("payroll/report/PA001?Year=" + year + "&OrgId="+ orgId)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });

  };

}
class ReportEmployee {
  toDate?: Date;
  orgId?: any;
}
