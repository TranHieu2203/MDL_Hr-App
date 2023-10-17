declare var require: any;

import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

// Service Translate
import { TranslationLoaderService } from "src/app/common/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
// Import the locale files
import { locale as english } from "../../i18n/en";
import { locale as vietnam } from "../../i18n/vi";
// Globals File
import { Globals } from "src/app/common/globals";
import { Configs } from "src/app/common/configs";
import { Notification } from "src/app/common/notification";
const _ = require("lodash");
import { L10n, setCulture } from "@syncfusion/ej2-base";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";

import * as Highcharts from "highcharts/highstock";
const IndicatorsCore = require("highcharts/indicators/indicators");
IndicatorsCore(Highcharts);
const IndicatorZigZag = require("highcharts/indicators/zigzag");
IndicatorZigZag(Highcharts);

setCulture("en");

@Component({
  selector: "app-dash-staffmanager",
  templateUrl: "./staffmanager.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AppDashStaffManagerComponent implements OnInit {
  Highcharts = Highcharts;
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // Widget Yêu cầu tuyển dụng
  searchRecruimentRequest = "";
  lstRecruitmentRequest: any[] = [];
  lstRecruitmentRequestOrigin: any[] = [];

  // Widget Bảng chấm công
  searchTimeKeeping = "";
  lstTimeKeeping: any[] = [];
  lstTimeKeepingOrigin: any[] = [];

  // Danh sách Widget
  public lstWidgets = [
    {
      id: "work_general",
      title: "Công việc chung"
    },
    {
      id: "order_status",
      title: "Tình trạng được giao"
    },
    {
      id: "new_order",
      title: "Đơn đặt hàng/Báo giá mới nhất"
    }
  ];

  public showHideWidget: any = {
    work_general: true,
    order_status: true,
    new_order: true
  };

  public staffExchangeChart = {
    chart: {
      renderTo: "container",
      height: "280",
      zoomType: "xy",
      style: {
          fontFamily: 'v2hrm-font'
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: "Biến động nhân sự theo thâm niên 6 tháng đầu năm 2019"
    },
    xAxis: {
      categories: [
        "<1 tháng",
        "<3 tháng",
        "<6 tháng",
        "<12 tháng",
        ">12 tháng"
      ],
      crosshair: true
    },
    yAxis: [
      {
        // Primary yAxis
        labels: {
          format: "{value} ",
          style: {
            color: Highcharts.getOptions().colors![1]
          }
        },
        title: {
          text: "Số lượng",
          style: {
            color: Highcharts.getOptions().colors![1]
          }
        }
      },
      {
        // Secondary yAxis
        title: {
          text: "Tỷ lệ",
          style: {
            color: Highcharts.getOptions().colors![0]
          }
        },
        labels: {
          format: "{value} %",
          style: {
            color: Highcharts.getOptions().colors![0]
          }
        },
        opposite: true
      }
    ],
    tooltip: {
      shared: true
    },
    legend: {
      layout: "vertical",
      align: "center",
      x: 120,
      verticalAlign: "bottom",
      y: 100,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend!.backgroundColor || // theme
        "rgba(255,255,255,0.25)"
    },

    series: [
      {
        name: "Số lượng",
        type: "column",
        yAxis: 1,
        data: [100, 120, 110, 90, 100]
      },
      {
        name: "Tỷ lệ",
        type: "spline",
        data: [10, 15, 20, 15, 10],
        tooltip: {
          valueSuffix: "%"
        }
      }
    ]
  };

  public recruimentChart = {
    chart: {
      renderTo: "container",
      height: "400",
      type: "column",
      style: {
          fontFamily: 'v2hrm-font'
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: "Tình hình tuyển dụng năm 2018"
    },
    xAxis: {
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12"
      ],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: "Triệu VNĐ"
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },

    series: [
      {
        name: "Tổng chi tiêu",
        data: [14, 8, 5, 7, 8, 9, 7, 8, 9, 7, 8, 9]
      },
      {
        name: "Số lao động tuyển mới",
        data: [3, 4, 5, 6, 3, 4, 5, 6, 3, 4, 5, 6]
      },
      {
        name: "Số lao động nghỉ việc(bỏ việc)",
        data: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
      },
      {
        name: "Số lao động nghỉ việc(sa thải)",
        data: [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]
      }
    ]
  };

  public recruimentInYearChart = {
    chart: {
      renderTo: "container",
      height: "400",
      type: "column",
      style: {
          fontFamily: 'v2hrm-font'
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: "Báo cáo tuyển dụng hàng năm"
    },
    xAxis: {
      categories: [
        "Tổng chỉ tiêu",
        "Số lao động tuyển mới",
        "Số lao động nghỉ việc (bỏ việc)",
        "Số lao động nghỉ việc (sa thải)"
      ],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: "Số lượng"
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },

    series: [
      {
        name: "2017",
        data: [10, 11, 12, 14]
      },
      {
        name: "2018",
        data: [14, 10, 9, 8]
      }
    ]
  };
  // Private
  private _unsubscribeAll: Subject<any>;

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
      id: this._translateService.currentLang
    });
    this._translateService.use(this.languages);

    this.loadWidgetData();
  }

  closeWidget = (widget: string) => {
    this.showHideWidget[widget] = false;
  };

  loadWidgetData = () => {
    this.lstRecruitmentRequest = this.lstRecruitmentRequestOrigin = [
      {
        id: "1",
        date: "05/09/2019",
        name: "YC Tuyển dụng 001",
        status_id: 1,
        status_name: "Đang thực hiện"
      },
      {
        id: "2",
        date: "04/09/2019",
        name: "YC Tuyển dụng 002",
        status_id: 2,
        status_name: "Chưa thực hiện"
      },
      {
        id: "3",
        date: "03/09/2019",
        name: "YC Tuyển dụng 003",
        status_id: 3,
        status_name: "Quá hạn"
      }
    ];
    this.lstTimeKeeping = this.lstTimeKeepingOrigin = [
      {
        id: "1",
        date: "05/09/2019",
        name: "Bảng chấm công tháng 1",
        status_id: 1,
        status_name: "Đã phê duyệt"
      },
      {
        id: "2",
        date: "04/09/2019",
        name: "Bảng chấm công tháng 2",
        status_id: 2,
        status_name: "Chờ phê duyệt"
      },
      {
        id: "3",
        date: "03/09/2019",
        name: "Bảng chấm công tháng 3",
        status_id: 3,
        status_name: "Từ chối"
      }
    ];
  };

  // Enter tìm kiếm Widget Phiếu nhập kho
  searchRecruitmentRequestEnterFunc = ($event: any) => {
    if ($event.keyCode === 13) {
      this.searchRecruitmentRequestFunc();
    }
  };

  // Hàm tìm kiếm Phiếu nhập kho
  searchRecruitmentRequestFunc = () => {
    setTimeout(() => {
      this.lstRecruitmentRequest = _.filter(
        this.lstRecruitmentRequestOrigin,
        (item: any) => {
          return item.work_name.indexOf(this.searchRecruimentRequest) > -1;
        }
      );
    }, 200);
  };

  // Enter tìm kiếm Widget Phiếu nhập kho
  searchTimeKeepingEnterFunc = ($event: any) => {
    if ($event.keyCode === 13) {
      this.searchTimeKeepingFunc();
    }
  };

  // Hàm tìm kiếm Phiếu nhập kho
  searchTimeKeepingFunc = () => {
    setTimeout(() => {
      this.lstTimeKeeping = _.filter(this.lstTimeKeepingOrigin, (item: any) => {
        return item.work_name.indexOf(this.searchTimeKeeping) > -1;
      });
    }, 200);
  };
}
