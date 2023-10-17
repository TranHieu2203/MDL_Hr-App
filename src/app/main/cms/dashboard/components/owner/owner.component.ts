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

import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from '@syncfusion/ej2-dropdowns';

setCulture("en");

@Component({
  selector: "app-dash-owner",
  templateUrl: "./owner.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AppDashOwnerComponent implements OnInit {
  Highcharts = Highcharts;
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // Widget Yêu cầu tuyển dụng
  searchRecruimentRequest = "";
  lstRecruitmentRequest = [];
  lstRecruitmentRequestOrigin = [];

  // Widget Bảng chấm công
  searchTimeKeeping = "";
  lstTimeKeeping = [];
  lstTimeKeepingOrigin = [];

  query = new Query();
  public model = {
    provinces: null,
    org: null,
    include_child_org: false
  }
  public fields: FieldSettingsModel = { text: 'name', value: 'id' };
  public lstProvinces = [{
    id: '1',
    name: 'Hà Nội'
  }, {
    id: '2',
    name: 'Thái Nguyên'
  }];

  public lstOrgs = [{
    id: '1',
    name: 'Tập đoàn HimLam'
  }, {
    id: '2',
    name: 'Công ty CP Mắc ca'
  }];

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

  public costCompareChart = {
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
      text: "Biểu đồ chi phí theo tháng"
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
        text: "Tỷ VNĐ"
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
        name: "2018",
        data: [14, 8, 5, 7, 8, 9, 7, 8, 9, 7, 8, 9]
      },
      {
        name: "2019",
        data: [3, 4, 5, 6, 3, 4, 5, 6, 3, 4, 5, 6]
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

  public treeOriginChart = {
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
      text: "Số lượng giống cây đã trồng"
    },
    xAxis: {
      categories: ["248", "357", "657"],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: "Số cây"
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
        name: "Dự kiến",
        data: [10, 11, 12, 14]
      },
      {
        name: "Thực tế",
        data: [14, 10, 9, 8]
      },
      {
        name: "% hoàn thành",
        data: [14, 10, 9, 8]
      }
    ]
  };

  public staffChart = {
    chart: {
      renderTo: "container",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      height: "400",
      type: "pie",
      style: {
          fontFamily: 'v2hrm-font'
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: "Báo cáo nhân sự 2018"
    },
    tooltip: {
      pointFormat: "<b>{point.percentage}%</b>",
      percentageDecimals: 1
    },
    legend: {
      align: "right",
      layout: "vertical",
      verticalAlign: "middle",
      itemMarginBottom: 10
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false
        },
        showInLegend: true,
        colors: this.globals.lstColorNormal
      }
    },
    series: [
      {
        type: "pie",
        data: [
          {
            name: "Tổng chi tiêu",
            y: 20
          },
          {
            name: "Số lao động tuyển mới",
            y: 10
          },
          {
            name: "Số lao động nghỉ việc (bỏ việc)",
            y: 5
          },
          {
            name: "Số lao động nghỉ việc (sa thải)",
            y: 5
          }
        ]
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

  }

  closeWidget = (widget: string) => {
    this.showHideWidget[widget] = false;
  };

  public onFilteringProvinces(e: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate('name', 'contains', e.text);
    this.query = new Query();
    this.query = e.text !== '' ? this.query.where(predicate) : this.query;
    e.updateData(this.lstProvinces, this.query);
  };

  public onFilteringOrgs(e: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate('name', 'contains', e.text);
    this.query = new Query();
    this.query = e.text !== '' ? this.query.where(predicate) : this.query;
    e.updateData(this.lstOrgs, this.query);
  };
}
