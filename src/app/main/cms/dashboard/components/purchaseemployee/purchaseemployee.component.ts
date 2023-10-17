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
import { Options } from "ng5-slider";

setCulture("en");

@Component({
  selector: "app-dash-purchaseemployee",
  templateUrl: "./purchaseemployee.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AppDashPurchaseEmployeeComponent implements OnInit {
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
  public lstWidgets: any[] = [
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

  defaultMinValue = 0;
  lstOrderStatuses: any[] = [];
  objOrder = {
    order_count: 0,
    order_value: 0,
    finish_order: 0,
    finish_order_value: 0
  };

  // Newest Quote
  newest_quote = {
    id: "1",
    order_code: "PO001",
    status: "Bản thảo",
    quantity: 3,
    name: "Báo giá cho YCMH cho kế hoạch trồng cây"
  };

  newest_order = {
    id: "1",
    order_code: "HD001",
    status: "Chờ phê duyệt",
    quantity: 1,
    name: "Nhà cung cấp Giống vật tư cây trồng"
  };

  lstYCMH = [
    {
      id: "1",
      order_code: "YCMH001",
      status: "Chờ phê duyệt",
      quantity: 1,
      name: "Nhà cung cấp Giống vật tư cây trồng"
    },
    {
      id: "2",
      order_code: "YCMH002",
      status: "Chờ phê duyệt",
      quantity: 1,
      name: "Nhà cung cấp Giống vật tư cây trồng"
    }
  ];
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
        status_name: "Đang thực hiện"
      },
      {
        id: "2",
        work_date: "10/09/2019",
        work_name: "Mua VTSX",
        status_id: 1,
        status_name: "Chờ phê duyệt"
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
        code: "processing",
        name: "Phê duyệt",
        max_value: 2,
        process_value: 1,
        order_value: 1000000,
        finish_order_value: 500000
      },
      {
        id: "3",
        code: "approve",
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
  viewNewestQuote = (quote: any) => {
    const objParamAdd = { id: quote.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/purchase/purchasequote/", paramAdd]);
  };

  // Xem báo giá mới nhất
  viewNewestOrder = (quote: any) => {
    const objParamAdd = { id: quote.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/purchase/orderpurchase/", paramAdd]);
  };
}
