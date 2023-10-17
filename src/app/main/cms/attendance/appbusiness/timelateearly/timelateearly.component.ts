import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
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
  VirtualScrollService,ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
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
setCulture("en");

@Component({
  selector: "cms-profile-timelateearly",
  templateUrl: "./timelateearly.component.html",
  styleUrls: ["./timelateearly.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class TimeLateEarlyComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];

  // Private
  private _unsubscribeAll: Subject<any>;
  button: any;
  field: any;
  nodeSelected: any;
  isDisso: any;
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
    this.getTreeView();
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id;
        this.getListData();
      });
      this._coreService.isDisso
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((checked: any) => {

        this.isDisso = checked;
        this.getListData();

      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
  }

  getTreeView() {
    this._coreService.Get("hr/organization/getlist").subscribe((res: any) => {
      this.field = {
        dataSource: res.data,
        id: "id",
        text: "name",
        parentID: "pid",
        hasChildren: "hasChild",
      };
    });
  }
  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/attendance/business/timelateearly/", paramAdd]);
  };

  toolItems$ = new BehaviorSubject<any[]>(
    [ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.APPROVED, ToolbarItem.DENIED, ToolbarItem.DELETE, ToolbarItem.EXPORT_EXCEL]
  )


  // GetListData
  getListData = (): void => {
    
    let extraParams: any = [
      {
        field: "orgId",
        value: this.nodeSelected,
      },
      {
        field: "IsDissolve",
        value: this.isDisso== undefined?0:this.isDisso,
      },
    ];
    this._coreService.execute(this.state, "hr/RegisterOff/GetAllEarlyLate", extraParams);
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    let extraParams: any = [
      {
        field: "orgId",
        value: this.nodeSelected,
      },
      {
        field: "IsDissolve",
        value: this.isDisso== undefined?0:this.isDisso,
      },
    ];
    this._coreService.execute(this.state, "hr/RegisterOff/GetAllEarlyLate", extraParams);
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.router.navigate(["/hrms/attendance/business/timelateearly/new"]);
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
          if (!this.globals.isAdmin && this.modelAdd.statusId == 2) {
            this.notification.warning("notify.APPROVED");
            return;
          }

          const objParamAdd = { id: this.modelAdd.id, type: "edit" };
          const paramAdd = window.btoa(JSON.stringify(objParamAdd));
          this.router.navigate([
            "/hrms/attendance/business/timelateearly/",
            paramAdd,
          ]);
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          if (!this.globals.isAdmin) {
            let checkHieuLuc = false;
            for (let i = 0; i < this.modelDelete.length; i++) {
              if (this.modelDelete[i].statusId == 2) {
                checkHieuLuc = true;
              }
            }
            if (checkHieuLuc) {
              this.notification.warning(
                "Hệ thống không cho phép xóa dữ liệu có trạng thái Hiệu lực!"
              );
              return;
            }
          }
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.APPROVED:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes.map((i: any) => i.id);
          this._coreService
            .Post("hr/registeroff/approved", ids)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.message);
              } else {
                this.notification.approvedSuccess();
                this.getListData();
              }
            });
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.DENIED:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes.map((i: any) => i.id);
          this._coreService
            .Post("hr/registeroff/denied", ids)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.message);
              } else {
                this.notification.deniedSuccess();
                this.getListData();
              }
            });
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.EXPORT_EXCEL:
        let extraParams: any = [
          {
            field: "orgId",
            value: this.nodeSelected,
          },
          {
            field: "IsDissolve",
            value: this.isDisso== undefined?0:this.isDisso,
          },
        ];
        var data = this._coreService.ExecuteToExport('hr/RegisterOff/GetAllEarlyLate', extraParams, this.state).subscribe((res: any) => {
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
            fileName: "quanlydimuonvesom" + "-" + formattedDate + ".xlsx"
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
      let ids = this.modelDelete.map((i: any) => i.id);
      this._coreService.Post("hr/registeroff/delete", ids).subscribe((res: any) => {
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.deleteSuccess();
          this.getListData();
          this.modalService.close("confirm-delete-modal");
        }
      });
    }
  };
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  // disbale button chon nhieu ban ghi
  setButtonStatus = (event: any) => {
    if (!this.button) {
      this.button = setTimeout(() => {
        // đếm số bản ghi select
        const rowSelects = this.gridInstance.getSelectedRecords();
        const rowSelectCounts = rowSelects.length;
        // Nếu count > 1 thì disable toolbar
        if (rowSelectCounts > 1) {
          for (let i = 0; i < this.toolbar.length; i++) {
            //disable sửa
            if (this.toolbar[i].id === ToolbarItem.EDIT) {
              this.toolbar[i].isDisable = true;
            }
          }
        } else {
          for (let i = 0; i < this.toolbar.length; i++) {
            // enabled sửa
            if (this.toolbar[i].id === ToolbarItem.EDIT) {
              this.toolbar[i].isDisable = false;
            }
          }
        }
      }, 200);
    }
  };
}
