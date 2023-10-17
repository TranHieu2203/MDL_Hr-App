declare var require: any;

import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit
} from "@angular/core";
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

import { Options } from "ng5-slider";
setCulture("en");

@Component({
  selector: "app-dash-techmanager",
  templateUrl: "./techmanager.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AppDashTechManagerComponent implements OnInit {
  Highcharts = Highcharts;
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // Widget Công việc được giao
  searchWorkAssigned = "";
  lstWorkAssigned: any[] = [];
  lstWorkAssignedOrigin: any[] = [];

  // Widget Công việc của tôi
  searchMyWork = "";
  lstMyWorks: any[] = [];
  lstMyWorksOrigin: any[] = [];

  // Danh sách kế hoạch kèm thông số
  lstPlans: any[] = [];
  pieChartOptions = {
    chart: {
      renderTo: "container",
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      height: "245",
      type: "pie",
      style: {
          fontFamily: 'v2hrm-font'
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: ""
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
        colors: []
      }
    },
    series: [
      {
        type: "pie",
        data: []
      }
    ]
  };
  // Danh sách Widget
  public lstWidgets = [
    {
      id: "work_assigned",
      title: "Công việc được giao"
    },
    {
      id: "my_work",
      title: "Công việc của tôi"
    },
    {
      id: "summary",
      title: "Tổng quan công việc"
    }
  ];

  public showHideWidget: any = {
    work_assigned: true,
    my_work: true,
    work_summary: true
  };

  defaultMinValue = 0;

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
    this.lstWorkAssigned = this.lstWorkAssignedOrigin = [
      {
        id: "1",
        work_date: "05/09/2019",
        work_name: "Phân công cv cho đội SX",
        status_id: 2,
        status_name: "Đang thực hiện"
      },
      {
        id: "2",
        work_date: "10/09/2019",
        work_name: "Hoàn thành YCMH cho KH 1",
        status_id: 1,
        status_name: "Chưa thực hiện"
      },
      {
        id: "3",
        work_date: "05/09/2019",
        work_name: "Phân công cv cho đội SX",
        status_id: 3,
        status_name: "Quá hạn"
      }
    ];

    this.lstMyWorks = this.lstMyWorksOrigin = [
      {
        id: "1",
        work_date: "05/09/2019",
        work_name: "Kiểm tra lại cây bị gãy cành",
        status_id: 2,
        status_name: "Đang thực hiện"
      },
      {
        id: "2",
        work_date: "10/09/2019",
        work_name: "Cập nhật lại KH chăm sóc",
        status_id: 1,
        status_name: "Chưa thực hiện"
      },
      {
        id: "3",
        work_date: "05/09/2019",
        work_name: "Cập nhật lại KH chăm sóc",
        status_id: 3,
        status_name: "Quá hạn"
      }
    ];

    this.lstPlans = [
      {
        id: "1",
        code: "KHSX01022019",
        name: "Kế hoạch trồng cây",
        farm: "Trang Trại Tuần Giáo",
        division: "Phân khu A",
        plan_phase: "Đợt trồng 10/2019",
        recruitment_process: [
          {
            name: "Kỹ sư trưởng",
            max_value: 1,
            process_value: 0
          },
          {
            name: "Kỹ sư nông nghiệp",
            max_value: 5,
            process_value: 3
          },
          {
            name: "Công nhân trồng cây",
            max_value: 5,
            process_value: 1
          }
        ],
        purchase_process: [
          {
            name: "Chờ xử lý",
            max_value: 2,
            process_value: 1
          },
          {
            name: "Đang thực hiện",
            max_value: 2,
            process_value: 1
          },
          {
            name: "Đã hoàn thành",
            max_value: 6,
            process_value: 4
          }
        ],
        order_reverse: 10,
        order_reverse_value: 1000000000,
        work_process: [
          {
            name: "Số lượng cây dự kiến",
            y: 10
          },
          {
            name: "Số lượng cây đã trồng",
            y: 6
          },
          {
            name: "Số lượng cây còn lại",
            y: 6
          }
        ],
        work_summary: [
          {
            name: "Chưa thực hiện",
            y: 2
          },
          {
            name: "Đang thực hiện",
            y: 2
          },
          {
            name: "Đã hoàn thành",
            y: 2
          },
          {
            name: "Sắp hết hạn",
            y: 2
          },
          {
            name: "Quá hạn",
            y: 2
          }
        ]
      },
      {
        id: "2",
        code: "KHSX02022019",
        name: "Kế hoạch chăm sóc",
        farm: "Trang Trại Tuần Giáo",
        division: "Phân khu A",
        plan_phase: "Đợt trồng 10/2019",
        recruitment_process: [
          {
            name: "Kỹ sư trưởng",
            max_value: 1,
            process_value: 0
          },
          {
            name: "Kỹ sư nông nghiệp",
            max_value: 5,
            process_value: 3
          },
          {
            name: "Công nhân trồng cây",
            max_value: 5,
            process_value: 1
          }
        ],
        purchase_process: null,
        order_reverse: null,
        order_reverse_value: null,
        work_process: [
          {
            name: "Số lượng cây dự kiến",
            y: 10
          },
          {
            name: "Số lượng cây đã trồng",
            y: 6
          },
          {
            name: "Số lượng cây còn lại",
            y: 6
          }
        ],
        work_summary: null
      }
    ];

    this.processLoadWidgetPlan();
  };

  // Enter tìm kiếm Widget Công việc được giao
  searchWorkAssignedEnterFunc = ($event: any) => {
    if ($event.keyCode === 13) {
      this.searchWorkAssignedFunc();
    }
  };

  // Hàm tìm kiếm công việc được giao
  searchWorkAssignedFunc = () => {
    setTimeout(() => {
      this.lstWorkAssigned = _.filter(this.lstWorkAssignedOrigin, (item: any) => {
        return item.work_name.indexOf(this.searchWorkAssigned) > -1;
      });
    }, 200);
  };

  // Enter tìm kiếm Widget Công việc được giao
  searchMyWorkEnterFunc = ($event: any) => {
    if ($event.keyCode === 13) {
      this.searchMyWorkFunc();
    }
  };

  // Hàm tìm kiếm công việc được giao
  searchMyWorkFunc = () => {
    setTimeout(() => {
      this.lstMyWorks = _.filter(this.lstMyWorksOrigin, (item: any) => {
        return item.work_name.indexOf(this.searchMyWork) > -1;
      });
    }, 200);
  };

  // Load widgetPlan
  processLoadWidgetPlan = () => {
    if (this.lstPlans && this.lstPlans.length > 0) {
      for (let i = 0; i < this.lstPlans.length; i++) {
        let itemPlan = this.lstPlans[i];
        // Kiểm tra xem có Tiến độ tuyển dụng không
        if (
          itemPlan.recruitment_process &&
          itemPlan.recruitment_process.length > 0
        ) {
          itemPlan.is_recruitment_process = true;
          for (let j = 0; j < itemPlan.recruitment_process.length; j++) {
            const options: Options = {
              floor: 0,
              ceil: itemPlan.recruitment_process[j].max_value,
              showTicksValues: true,
              readOnly: true
            };
            itemPlan.recruitment_process[j].tick_color =
              itemPlan.recruitment_process[j].process_value === 0
                ? 'tick-grey'
                : 'tick-blue';
            itemPlan.recruitment_process[j].options = options;
          }
        } else {
          itemPlan.is_recruitment_process = false;
        }

        // Kiểm tra xem có tiến độ mua hàng không
        if (itemPlan.purchase_process && itemPlan.purchase_process.length > 0) {
          itemPlan.is_purchase_process = true;
          for (let j = 0; j < itemPlan.purchase_process.length; j++) {
            const options: Options = {
              floor: 0,
              ceil: itemPlan.purchase_process[j].max_value,
              showTicksValues: false,
              showSelectionBar: false,
              showTicks: false,
              readOnly: true
            };
            switch (itemPlan.purchase_process[j]) {
              case "Chờ xử lý":
                itemPlan.purchase_process[j].tick_color = "tick-yellow";
                break;
              case "Đang thực hiện":
                itemPlan.purchase_process[j].tick_color = "tick-blue";
                break;
              case "Đã hoàn thành":
                itemPlan.purchase_process[j].tick_color = "tick-green";
                break;
            }
            itemPlan.purchase_process[j].options = options;
          }
        } else {
          itemPlan.is_purchase_process = false;
        }

        // Kiểm tra xem có tiến độ công việc không
        if (itemPlan.work_process && itemPlan.work_process.length > 0) {
          itemPlan.is_work_process = true;
          itemPlan.work_process_chart_id = "WC" + itemPlan.id;
          itemPlan.work_process_chart = {
            chart: {
              renderTo: "container",
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              height: "245",
              type: "pie",
              style: {
                  fontFamily: 'v2hrm-font'
              }
            },
            credits: {
              enabled: false
            },
            title: {
              text: "Tiến độ công việc"
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
                data: itemPlan.work_process
              }
            ]
          };
        } else {
          itemPlan.is_work_process = false;
        }

        // Kiểm tra xem có tổng quan công việc không
        if (itemPlan.work_summary && itemPlan.work_summary.length > 0) {
          itemPlan.is_work_summary = true;
          itemPlan.work_summary_chart_id = "WS" + itemPlan.id;
          itemPlan.work_summary_chart = {
            chart: {
              renderTo: "container",
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false,
              height: "245",
              type: "pie",
              style: {
                  fontFamily: 'v2hrm-font'
              }
            },
            credits: {
              enabled: false
            },
            title: {
              text: "Tổng quan công việc"
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
                colors: this.globals.lstColorProcess
              }
            },
            series: [
              {
                type: "pie",
                data: itemPlan.work_summary
              }
            ]
          };
        } else {
          itemPlan.is_work_summary = false;
        }
      }
    }
  };
}
