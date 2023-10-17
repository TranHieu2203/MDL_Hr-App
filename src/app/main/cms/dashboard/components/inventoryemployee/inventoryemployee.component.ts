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
  selector: "app-dash-inventoryemployee",
  templateUrl: "./inventoryemployee.component.html",
  encapsulation: ViewEncapsulation.None
})
export class AppDashInventoryEmployeeComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // Widget Phiếu nhập kho
  searchImportOrder = "";
  lstImportOrder: any[] = [];
  lstImportOrderOrigin: any[] = [];

  // Widget Phiếu xuất kho
  searchExportOrder = "";
  lstExportOrder: any[] = [];
  lstExportOrderOrigin: any[] = [];

  // Widget Phiếu điều chuyển
  searchTransferOrder = "";
  lstTransferOrder: any[] = [];
  lstTransferOrderOrigin: any[] = [];

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
  import_order = {
    id: "1",
    order_code: 'PN001',
    status: "Bản thảo",
    quantity: 3,
    name: "Báo giá cho YCMH cho kế hoạch trồng cây"
  };

  export_order = {
    id: "1",
    order_code: 'PX001',
    status: "Chờ phê duyệt",
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
    this.lstImportOrder = this.lstImportOrderOrigin = [
      {
        id: "1",
        date: "05/09/2019",
        name: "Tạo phiếu Đ/C kho",
        status_id: 1,
        status_name: "Đã nhập kho"
      },
      {
        id: "2",
        date: "04/09/2019",
        name: "Kiểm kê hàng tồn kho",
        status_id: 2,
        status_name: "Chờ nhập kho"
      },
      {
        id: "3",
        date: "03/09/2019",
        name: "Kiểm kê hàng tồn kho",
        status_id: 3,
        status_name: "Bản thảo"
      }
    ];
    this.lstExportOrder = this.lstExportOrderOrigin = [ {
      id: "1",
      date: "05/09/2019",
      name: "Tạo phiếu xuất kho kho",
      status_id: 1,
      status_name: "Đã xuất kho"
    },
    {
      id: "2",
      date: "04/09/2019",
      name: "Điều chuyển kho",
      status_id: 2,
      status_name: "Chờ xuất kho"
    },
    {
      id: "3",
      date: "03/09/2019",
      name: "Điều chuyển kho",
      status_id: 3,
      status_name: "Bản thảo"
    }];
    this.lstTransferOrder = this.lstTransferOrderOrigin = [ {
      id: "1",
      date: "05/09/2019",
      name: "Tạo phiếu xuất kho",
      status_id: 1,
      status_name: "Đang thực hiện"
    },
    {
      id: "2",
      date: "04/09/2019",
      name: "Điều chuyển kho",
      status_id: 2,
      status_name: "Chờ phê duyệt"
    },
    {
      id: "3",
      date: "03/09/2019",
      name: "Điều chuyển kho",
      status_id: 3,
      status_name: "Hoàn thành"
    }];
  };

  // Enter tìm kiếm Widget Phiếu nhập kho
  searchImportOrderEnterFunc = ($event: any) => {
    if ($event.keyCode === 13) {
      this.searchImportOrderFunc();
    }
  };

  // Hàm tìm kiếm Phiếu nhập kho
  searchImportOrderFunc = () => {
    setTimeout(() => {
      this.lstImportOrder = _.filter(this.lstImportOrderOrigin, (item: any) => {
        return item.work_name.indexOf(this.searchImportOrder) > -1;
      });
    }, 200);
  };

  // Enter tìm kiếm Widget Phiếu nhập kho
  searchExportOrderEnterFunc = ($event: any) => {
    if ($event.keyCode === 13) {
      this.searchExportOrderFunc();
    }
  };

  // Hàm tìm kiếm Phiếu nhập kho
  searchExportOrderFunc = () => {
    setTimeout(() => {
      this.lstExportOrder = _.filter(this.lstExportOrderOrigin, (item: any) => {
        return item.work_name.indexOf(this.searchExportOrder) > -1;
      });
    }, 200);
  };

  // Enter tìm kiếm Widget Phiếu nhập kho
  searchTransferOrderEnterFunc = ($event: any) => {
    if ($event.keyCode === 13) {
      this.searchTransferOrderFunc();
    }
  };

  // Hàm tìm kiếm Phiếu nhập kho
  searchTransferOrderFunc = () => {
    setTimeout(() => {
      this.lstTransferOrder = _.filter(this.lstTransferOrderOrigin, (item: any) => {
        return item.work_name.indexOf(this.searchTransferOrder) > -1;
      });
    }, 200);
  };
  // Xem báo giá mới nhất
  viewOrderImport = (order: any) => {
    const objParamAdd = { id: order.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/inventory/orderimport/", paramAdd]);
  };

  // Xem báo giá mới nhất
  viewOrderExport = (order: any) => {
    const objParamAdd = { id: order.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/inventory/orderexport/", paramAdd]);
  };
}
