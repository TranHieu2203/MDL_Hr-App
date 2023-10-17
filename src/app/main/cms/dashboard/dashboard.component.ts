import { DASHBOARD_BAR_COLOR, DASHBOARD_BAR_SECOND_SERIE, PIE_COLORS, PIE_COLORS2 } from "src/app/constants";

const EMP_MONTH_COLOR = PIE_COLORS[4];
const SENIORITY_COLOR = PIE_COLORS[3];

import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
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
const _ = require("lodash");
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
declare var require: any;
import * as Highcharts from "highcharts/highstock";
import { ToolbellService } from "src/app/_services/toolbell.service";
const IndicatorsCore = require("highcharts/indicators/indicators");
IndicatorsCore(Highcharts);
const IndicatorZigZag = require("highcharts/indicators/zigzag");
IndicatorZigZag(Highcharts);

setCulture("en");
@Component({
  selector: "app-cms-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
  animations: [
    // Define animation here
    trigger("myfirstanimation", [
      state(
        "small",
        style({
          height: "0px",
          opacity: "0",
        })
      ),
      state(
        "large",
        style({
          height: "*",
          opacity: "1",
        })
      ),
      transition("large => small", animate("400ms ease-out")),
      transition("small => large", animate("400ms ease-in")),
    ]),
    trigger("rotatedState", [
      state("small", style({ transform: "rotate(0)" })),
      state("large", style({ transform: "rotate(-180deg)" })),
      transition("large => small", animate("400ms ease-out")),
      transition("small => large", animate("400ms ease-in")),
    ]),
  ],
})
export class AppDashboardComponent implements OnInit {
  // Varriable Language

  languages: any;
  selectedLanguage: any;
  modelForm = null;
  dataGender: any[] = [];
  Highcharts = Highcharts;
  showChart1 = false;

  danglamviec: any;
  chinhthuc: any;
  tuyenmoi: any;
  nghiviec: any;

  loadding: boolean = true;

  public OptionChartGender: Highcharts.Options = {
    chart: {
      renderTo: "container",
      plotShadow: false,
      height: "300",
      type: "pie",
      style: {
        fontFamily: "v2hrm-font",
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: 'Thống kê tỷ lệ giới tính',
      style: {
        display: ''
      }
    },
    tooltip: {
      pointFormat: "<b>{point.y}/{point.total}</b>  ",
      //    percentageDecimals: 1,
    },
    legend: {
      align: "right",
      layout: "vertical",
      verticalAlign: "middle",
      itemMarginBottom: 10,
    },

    plotOptions: {
      pie: {
        innerSize: '70%',
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          distance: -50,
        },
        showInLegend: true,
        colors: PIE_COLORS,
      },
    },
    series: [
      {
        type: "pie",
        data: [
          {
            name: "Nam",
            y: 2,
          },
          {
            name: "Nữ",
            y: 1,
          },
        ],
      },
    ],
  };
  public OptionChartContract: Highcharts.Options = {
    chart: {
      renderTo: "container",
      plotShadow: false,
      height: "300",
      type: "pie",
      style: {
        fontFamily: "v2hrm-font",
      },
    },
    credits: {
      enabled: false,
    },

    title: {
      text: 'Thống kê Hợp đồng',
      style: {
        display: ''
      }
    },
    tooltip: {
      pointFormat: "<b>{point.y}/{point.total}</b>  ",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
        showInLegend: false,
        colors: PIE_COLORS2,

      }
    },
    series: [
      {
        type: "pie",
        data: [
          {
            // ID: 7,
            name: "Hợp đồng học viêc",
            y: 1,
          },
          {
            // ID: 8,
            name: "Hợp đồng thử việc",
            y: 1,
          },
          {
            // ID: 9,
            name: "Hợp đồng chính thức",
            y: 1,
          },
        ],
      },
    ],
  };
  public OptionChartLearnning: Highcharts.Options = {
    chart: {
      renderTo: "container",
      plotShadow: false,
      height: "300",
      type: "pie",
      style: {
        fontFamily: "v2hrm-font",
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Thống kê Bảo hiểm xã hội",
      style: {
        display: ''
      }
    },
    tooltip: {
      pointFormat: "<b>{point.y}/{point.total}</b>  ",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          distance: -50,
        },
        showInLegend: true,
        colors: PIE_COLORS,
      },
    },
    series: [
      {
        type: "pie",
        data: [
          {
            name: "Đại học",
            y: 1,
          },
        ],
      },
    ]
  };
  public OptionChartEmpMonth: Highcharts.Options = {
    chart: {
      renderTo: "container",
      height: "300",
      zoomType: 'xy',
      style: {
        fontFamily: "v2hrm-font",
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Biểu đồ tổng số nhân viên theo tháng",
      style: {
        display: ''
      }
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
          color: DASHBOARD_BAR_COLOR
        }
      },
      title: {
        text: 'Tăng mới',
        style: {
          color: DASHBOARD_BAR_COLOR
        }
      }
    }, { // Secondary yAxis
      title: {
        text: 'Số lượng nhân viên',
        style: {
          color: DASHBOARD_BAR_COLOR
        }
      },
      labels: {
        format: '{value}',
        style: {
          color: DASHBOARD_BAR_COLOR
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
      x: 460,
      verticalAlign: 'top',
      y: 50,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend!.backgroundColor || // theme
        'rgba(255,255,255,0.25)'
    },

    series: [{
      name: 'Số lượng',
      type: 'column',
      yAxis: 1,
      data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
      color: DASHBOARD_BAR_COLOR,
      tooltip: {
        valueSuffix: ' nhân sự'
      }
    }, {
      name: 'Tăng mới',
      type: 'spline',
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
      color: DASHBOARD_BAR_SECOND_SERIE,
      tooltip: {
        valueSuffix: ' nhân sự'
      }
    }]
  };
  public OptionChartSeniority: Highcharts.Options = {
    chart: {
      renderTo: "container",
      height: "300",
      type: "column",
      style: {
        fontFamily: "v2hrm-font",
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: "Biểu đồ thâm niên nhân viên",
      style: {
        display: ''
      }
    },
    xAxis: {
      categories: [
        "Dưới 1 năm",
        "Từ 1 đến 3 năm",
        "Từ 3 đến 5 năm",
        "Trên 5 năm",
      ],
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Số lượng",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },

    },
    series: [
      {
        name: "2020",
        type: 'line',
        data: [1, 2, 3, 4],
        color: DASHBOARD_BAR_COLOR,
      },
    ],

  };

  // Private
  private _unsubscribeAll: Subject<any>;
  updateFlag: boolean = false;
  total: number = 0;
  data: any = [];

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
    private toolbellService: ToolbellService

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
    this.toolbellService.toolbellData$.subscribe(res => {
      if (res.statusCode == 400) {
        // this.notification.checkErrorMessage(res.message);
      } else {
        if (res.data != undefined) {
          let x = 0;
          res.data.forEach((element: any) => {
            x += Number(element.count);
          });
          this.total = x;
        }

      }
    })
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.languages);
    this.getData();
    this.loadData().then(async (res: any) => {
      if (res) {

        let genders = res[0];
        let contract = res[1];
        let learnning = res[2];
        let empMonth = res[3]![0];
        let seniority = res[4]![0];
        this.danglamviec = res[5]![0]['DANG_LV'];
        this.chinhthuc = res[5]![0]['CHINH_THUC'];
        this.nghiviec = res[5]![0]['NGHI_VIEC'];
        this.tuyenmoi = res[5]![0]['TUYEN_MOI'];

        if (genders && genders.length > 0) {

          if (this.OptionChartGender.series![0].type === 'pie') {
            let data = genders.map((val: any) => ({
              name: val.NAME,
              y: val.TOTAL,
            }));
            this.OptionChartGender.series![0].data = [...data];
          }
        }
        if (contract && contract.length > 0) {

          if (this.OptionChartContract.series![0].type === 'pie') {
            let datacontract = contract.map((valcontract: any) => ({
              name: valcontract.NAME,
              y: valcontract.TOTAL,
            }));
            this.OptionChartContract.series![0].data = [...datacontract];
          }

        }
        if (learnning && learnning.length > 0) {
          if (this.OptionChartLearnning.series![0].type === 'pie') {
            let dataLeanrning = [
              {
                name: "Chưa tham gia",
                y: learnning[0].TOTAL_CHUADONG,
              },
              {
                name: "Đã tham gia",
                y: learnning[0].TOTAL_DADONG,
              },
            ]
            this.OptionChartLearnning.series![0].data = [...dataLeanrning];
          }
        }

        if (empMonth) {
          if (this.OptionChartEmpMonth.series![0].type === 'column') {
            this.OptionChartEmpMonth.series![0].data = [empMonth.T01, empMonth.T02, empMonth.T03, empMonth.T04, empMonth.T05, empMonth.T06, empMonth.T07, empMonth.T08, empMonth.T09, empMonth.T10, empMonth.T11, empMonth.T12];
          }
          if (this.OptionChartEmpMonth.series![1].type === 'spline') {
            this.OptionChartEmpMonth.series![1].data = [empMonth.TM01, empMonth.TM02, empMonth.TM03, empMonth.TM04, empMonth.TM05, empMonth.TM06, empMonth.TM07, empMonth.TM08, empMonth.TM09, empMonth.TM10, empMonth.TM11, empMonth.TM12]
          }
        }
        if (seniority) {
          this.OptionChartSeniority.series = [
            {
              type: 'bar',
              name: "",
              data: Object.keys(seniority).map((key) => seniority[key]),
              color: DASHBOARD_BAR_COLOR,
            },
          ];
        }
      }
      await new Promise(f => setTimeout(f, 500));
      this.showChart1 = true;
      this.loadding = false;
    });




  }
  getData() {

  }
  Directional(code: any, epm: any) {
    let url = "hr/employee/GetInforContract?Id=";
    let objParamAdd = { id: epm.id, type: "new" };
    let paramAdd = window.btoa(JSON.stringify(objParamAdd));
    switch (code) {
      case "EMP_EXPIRE_CONTRACT":
        this.router.navigate(["/hrms/profile/business/contractinfor/", paramAdd]);
        break;
      case "EMP_REGISTER_CONTRACT":
        this.router.navigate(["/hrms/profile/business/contractinfor/", paramAdd]);
        break;
      case "EMP_REGISTER_WORKING":
        this.router.navigate(["/hrms/profile/business/decision/", paramAdd]);
        break;
      case "EMP_REGISTER_INSURANCE":
        this._coreService.Get(url + epm.id).subscribe((res: any) => {
          localStorage.setItem("modelTemp1", JSON.stringify(res.data));
          setTimeout(() => {
            this.router.navigate(["/hrms/profile/business/insinformation/new"]);
          }, 200)
        });
        break;
      case "EMP_METTTING_ROOM":
        this.router.navigate(["/cms/administration/business/booking"]);
        break;
      case "EMP_BIRTH_DAY":
        let objParamAdd1 = { id: epm.id, type: "view" };
        let paramAdd1 = window.btoa(JSON.stringify(objParamAdd1));
        this.router.navigate(["/hrms/profile/business/staffprofile/", paramAdd1]);
        break;
      default:
        break;
    }
  }
  toggle(index: number) {
    let state = this.data[index].state;
    this.data[index].state = state === "small" ? "large" : "small";
  }
  loadData() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/formlist/GetDashboard")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  navigate(e: any) {
    this.router.navigate([e]);
  }

}
