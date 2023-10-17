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
import { Options } from "ng5-slider";

import * as Highcharts from "highcharts/highstock";
const IndicatorsCore = require("highcharts/indicators/indicators");
IndicatorsCore(Highcharts);
const IndicatorZigZag = require("highcharts/indicators/zigzag");
IndicatorZigZag(Highcharts);

setCulture("en");

@Component({
  selector: "app-dash-salemanager",
  templateUrl: "./salemanager.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AppDashSaleManagerComponent implements OnInit {
  Highcharts = Highcharts;

  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // Widget Công việc được giao
  searchWorkGeneral = "";
  lstWorkGeneral: any[] = [];
  lstWorkGeneralOrigin: any[] = [];

  // Widget Công việc của tôi
  searchMyWork = "";
  lstMyWorks: any[] = [];
  lstMyWorksOrigin: any[] = [];

  // Tổng quan công việc
  lstWorkSummary = [
    {
      name: "Chưa thực hiện",
      y: 10
    },
    {
      name: "Đang thực hiện",
      y: 10
    },
    {
      name: "Đã hoàn thành",
      y: 10
    },
    {
      name: "Sắp hết hạn",
      y: 10
    },
    {
      name: "Hết hạn",
      y: 10
    }
  ];

  // Danh sách Widget
  public lstWidgets = [
    {
      id: "work_general",
      title: "Công việc chung"
    },
    {
      id: "order_request",
      title: "Đơn đặt hàng/Báo giá mới nhất"
    },
    {
      id: "order_status",
      title: "Tình trạng được giao"
    },
    {
      id: "order_chart",
      title: "Biểu đồ chi phí mua hàng theo tháng"
    }
  ];

  order_chart = {
    chart: {
      renderTo: "container",
      height: "280",
      type: "column",
      style: {
          fontFamily: 'v2hrm-font'
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: "Biểu đồ doanh thu bán hàng theo tháng"
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
        text: "Triệu (VNĐ)"
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f}Triệu VNĐ</b></td></tr>',
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
        name: "2018",
        data: [
          49.9,
          71.5,
          106.4,
          129.2,
          144.0,
          176.0,
          135.6,
          148.5,
          216.4,
          194.1,
          95.6,
          54.4
        ]
      },
      {
        name: "2019",
        data: [
          83.6,
          78.8,
          98.5,
          93.4,
          106.0,
          84.5,
          105.0,
          104.3,
          91.2,
          83.5,
          106.6,
          92.3
        ]
      }
    ]
  };

  public showHideWidget: any = {
    work_general: true,
    order_status: true,
    order_request: true,
    order_chart: true
  };

  defaultMinValue = 0;
  lstOrderStatuses: any[] = [];
  objOrder = {
    order_count: 0,
    order_value: 0,
    finish_order: 0,
    finish_order_value: 0
  };

  // Order Sale
  order_sale1 = {
    code: "SO000012",
    status: "Đã phê duyệt",
    name: "Mắc ca Loại 1",
    quantity: 3,
    customer_name: "Công ty Cổ phần Akidi Việt Nam"
  };

  order_sale2 = {
    code: "SO000013",
    status: "Đã phê duyệt",
    name: "Mắc ca Loại 2",
    quantity: 2,
    customer_name: "Công ty Cổ phần Akidi Việt Nam"
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
    this.lstWorkGeneral = this.lstWorkGeneralOrigin = [
      {
        id: "1",
        work_date: "05/09/2019",
        work_name: "Mua CCDC",
        status_id: 2,
        status_name: "Đang hoạt động"
      },
      {
        id: "2",
        work_date: "10/09/2019",
        work_name: "Mua VTSX",
        status_id: 1,
        status_name: "Chưa thực hiện"
      },
      {
        id: "3",
        work_date: "05/09/2019",
        work_name: "Mua CCDC",
        status_id: 4,
        status_name: "Phê duyệt"
      }
    ];

    this.lstOrderStatuses = [
      {
        id: "1",
        code: "unapprove",
        name: "Chờ phê duyệt",
        max_value: 2,
        process_value: 1,
        order_value: 1000000,
        finish_order_value: 500000
      },
      {
        id: "2",
        code: "approve",
        name: "Phê duyệt",
        max_value: 2,
        process_value: 1,
        order_value: 1000000,
        finish_order_value: 500000
      },
      {
        id: "3",
        code: "processing",
        name: "Đang thực hiện",
        max_value: 6,
        process_value: 4,
        order_value: 6000000,
        finish_order_value: 4000000
      }
    ];

    this.processOrderStatus();
  };

  // Xử lý dữ liệu widget tình trạng đơn hàng
  processOrderStatus = () => {
    for (let i = 0; i < this.lstOrderStatuses.length; i++) {
      let options: Options = {
        floor: 0,
        ceil: this.lstOrderStatuses[i].max_value,
        showTicksValues: false,
        showSelectionBar: false,
        showTicks: false,
        readOnly: true
      };
      this.lstOrderStatuses[i].options = options;
      switch (this.lstOrderStatuses[i].code) {
        case "unapprove":
          this.lstOrderStatuses[i].tick_color = "tick-yellow";
          break;
        case "processing":
          this.lstOrderStatuses[i].tick_color = "tick-blue";
          break;
        case "approve":
          this.lstOrderStatuses[i].tick_color = "tick-green";
          break;
      }

      this.objOrder.order_count += this.lstOrderStatuses[i].max_value;
      this.objOrder.finish_order += this.lstOrderStatuses[i].process_value;
      this.objOrder.order_value += this.lstOrderStatuses[i].order_value;
      this.objOrder.finish_order_value += this.lstOrderStatuses[
        i
      ].finish_order_value;
    }
  };

  // Enter tìm kiếm Widget Công việc được giao
  searchWorkGeneralEnterFunc = ($event: any) => {
    if ($event.keyCode === 13) {
      this.searchWorkGeneralFunc();
    }
  };

  // Hàm tìm kiếm công việc được giao
  searchWorkGeneralFunc = () => {
    setTimeout(() => {
      this.lstWorkGeneral = _.filter(this.lstWorkGeneralOrigin, (item: any) => {
        return item.work_name.indexOf(this.searchWorkGeneral) > -1;
      });
    }, 200);
  };


  // Xem báo giá mới nhất
  viewNewestOrder = (quote: any) => {
    const objParamAdd = { id: quote.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/sale/orderreverse/", paramAdd]);
  };
}
