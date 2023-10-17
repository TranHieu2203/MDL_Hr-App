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
import { Chart } from "angular-highcharts";

setCulture("en");

@Component({
  selector: "app-dash-techemployee",
  templateUrl: "./techemployee.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AppDashTechEmployeeComponent implements OnInit {
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
  chartSummary = new Chart({
    chart: {
      plotBackgroundColor: undefined,
      plotBorderWidth: undefined,
      plotShadow: false,
      height: "245",
      type: "pie",
      style: {
          fontFamily: 'v2hrm-font'
      }
    },
    title: {
      text: "Tổng quan công việc"
    },
    tooltip: {
      pointFormat: "<b>{point.percentage:.1f}%</b>"
    },
    credits: {
      enabled: false
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
        colors: ["#E3E3E7", "#29D28E", "#14618C", "#F09393", "#E94949"]
      }
    },
    series: [
      {
        type: "pie",
        data: this.lstWorkSummary
      }
    ]
  });

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
      id: "work_summary",
      title: "Tổng quan công việc"
    }
  ];

  public showHideWidget: any = {
    work_assigned: true,
    my_work: true,
    work_summary: true
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
    this.lstWorkAssigned = this.lstWorkAssignedOrigin = [
      {
        id: "1",
        work_date: "05/09/2019",
        work_name: "Phân công cv cho đội SX",
        status_id: 2,
        status_name: "Đang hoạt động"
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
        status_name: "Đang hoạt động"
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
      if (this.searchWorkAssigned.length > 0) {
        this.lstWorkAssigned = _.filter(this.lstWorkAssignedOrigin, (item: any) => {
          return item.work_name.indexOf(this.searchWorkAssigned) > -1;
        });
      } else {
        this.lstWorkAssigned = this.lstWorkAssignedOrigin;
      }
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
      if (this.searchMyWork.length > 0) {
        this.lstMyWorks = _.filter(this.lstMyWorksOrigin, (item: any) => {
          return item.work_name.indexOf(this.searchMyWork) > -1;
        });
      } else {
        this.lstMyWorks = this.lstMyWorksOrigin;
      }

    }, 200);
  };
}
