import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
import { Observable } from "rxjs";
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
import {
  FilterService,
  GridComponent,
  VirtualScrollService,
  ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { takeUntil } from "rxjs/operators";
import { Splitter, SplitterComponent } from "@syncfusion/ej2-angular-layouts";
import { PositionOrg } from "src/app/_models/app/cms";
setCulture("en");
@Component({
  selector: "cms-organize-positionorg",
  templateUrl: "./positionorg.component.html",
  styleUrls: ["./positionorg.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class PositionOrgComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD,
    ToolbarItem.DELETE,
    ToolbarItem.EXPORT_EXCEL,
  ]);
  // Varriable Language
  model: PositionOrg = new PositionOrg();
  languages: any;
  selectedLanguage: any;
  flagStatusEmp: any;
  dataImport: any[] = [];
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild("splitterInstance", { static: false })
  splitterObj!: SplitterComponent;

  public onCreated() {
    let splitterObj1 = new Splitter({
      height: "100%",
      paneSettings: [
        { size: "94%", min: "20%" },
        { size: "6%", min: "6%" },
      ],
      orientation: "Vertical",
    });
    splitterObj1.appendTo("#vertical_splitter");
  }

  public fields: FieldSettingsModel = { text: "name", value: "id" };
  //public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public dataClone: any;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;

  flag: string = '';
  currentTimestamp: string = Date.now().toString();

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
    private ip: IpServiceService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    this.data = _coreService;
    this.data.subscribe(data => {
      if (this.flag == '')
        this.dataClone = data
    })
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
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.languages);

    // Load List Data
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id;
        this.getListData();
      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
  }

  // GetListData
  getListData = (): void => {
    
    var extraParams: any = [];
    if (this.flagStatusEmp) {
      extraParams.push({
        field: "WorkStatusId",
        value: this.nodeSelected,
      });
    }
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "hr/positionorg/GetAll", extraParams);
  };
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    if (this.flagStatusEmp) {
      extraParams.push({
        field: "WorkStatusId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "hr/positionorg/GetAll", extraParams);
  }
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.flag = 'add';
        let param = {
          status: -1,
          selected: this.nodeSelected,
        };
        this.modalService.open("cms-app-modalsposition", param);
        const x = this.modalService.position.subscribe((res: any) => {
          this.gridInstance.refresh();
          x.unsubscribe();
          this.flag = ''
        });
        // this.getListData();
        return;

        break;

      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          let checkHieuLuc = false;
          // for (let i = 0; i < this.modelDelete.length; i++) {
          //   if (this.modelDelete[i].statusId === 2) {
          //     checkHieuLuc = true;
          //   }
          // }
          // if (checkHieuLuc) {
          //   this.notification.warning(
          //     "Dữ liệu đã được phê duyệt, bạn không thể xóa!"
          //   );
          //   return;
          // }
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;

      case ToolbarItem.EXPORT_EXCEL:
        var extraParams: any = [];
        if (this.flagStatusEmp) {
          extraParams.push({
            field: "WorkStatusId",
            value: 1,
          });
        }
        if (this.nodeSelected) {
          extraParams.push({
            field: "orgId",
            value: this.nodeSelected,
          });
        }
        var data = this._coreService.ExecuteToExport('hr/positionorg/GetAll', extraParams, this.state).subscribe((res: any) => {
          // Lấy ngày hiện tại
          const currentDate: Date = new Date();

          // Lấy ngày, tháng và năm
          const year: number = currentDate.getFullYear();
          const month: number = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
          const day: number = currentDate.getDate();
          // Chuyển đổi thành chuỗi "yyyyMMdd"
          const formattedDate: string = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
          const exportProperties: ExcelExportProperties = {
            dataSource: res.data,
            columns: [],
            fileName: "vitricongviecchobophan" + "-" + formattedDate +".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      default:
        break;
    }
  };

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      if (this.modelDelete.length > 0) {
        let ids = this.modelDelete.map((i: any) => i.id);
        this._coreService
          .Post("hr/positionorg/remove", ids)
          .subscribe((res: any) => {
            if (res.statusCode == 200) {
              this.notification.deleteSuccess();
              this.gridInstance.clearSelection();
              this.gridInstance.refresh();
            } else {
              this.notification.deleteError();
            }
            this.modalService.close("confirm-delete-modal");
          });
      }
    }
  };
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
