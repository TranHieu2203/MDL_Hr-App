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
  selector: "app-dash-staffemployee",
  templateUrl: "./staffemployee.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AppDashStaffEmployeeComponent implements OnInit {
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

  // Newest Quote
  recruiment_bill = {
    id: "1",
    status: "Bản thảo",
    code: 'YCTD0001',
    quantity: 3,
    name: "Báo giá cho YCMH cho kế hoạch trồng cây"
  };

  time_keeping_bill = {
    id: "1",
    status: "Chờ phê duyệt",
    code: 'BC00001',
    quantity: 1,
    name: "Nhà cung cấp Giống vật tư cây trồng"
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
        status_name: "Đã phê duyệt"
      },
      {
        id: "2",
        date: "04/09/2019",
        name: "YC Tuyển dụng 002",
        status_id: 2,
        status_name: "Chờ phê duyệt"
      },
      {
        id: "3",
        date: "03/09/2019",
        name: "YC Tuyển dụng 003",
        status_id: 3,
        status_name: "Từ chối"
      }
    ];
    this.lstTimeKeeping = this.lstTimeKeepingOrigin = [ {
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
    }];
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
      this.lstRecruitmentRequest = _.filter(this.lstRecruitmentRequestOrigin, (item: any) => {
        return item.work_name.indexOf(this.searchRecruimentRequest) > -1;
      });
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

  // Xem báo giá mới nhất
  viewRecruitment = (order: any) => {
    const objParamAdd = { id: order.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/staff/recruitmentrequest/", paramAdd]);
  };

  // Xem báo giá mới nhất
  viewTimeKeeping = (order: any) => {
    const objParamAdd = { id: order.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/staff/timekeeping/", paramAdd]);
  };
}
