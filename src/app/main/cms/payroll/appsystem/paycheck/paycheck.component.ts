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
import { Query } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-payroll-paycheck",
  templateUrl: "./paycheck.component.html",
  styleUrls: ["./paycheck.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class PayCheckComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD,
    ToolbarItem.EDIT,
    ToolbarItem.DELETE,
    ToolbarItem.EXPORT_EXCEL,
  ]);
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild("elementgrid", { static: false })
  public elementgrid!: GridComponent;

  @ViewChild("listTreeObj", { static: true })
  public listTreeObj!: TreeViewComponent;

  // // View child filter
  // @ViewChild("filterMenu", { static: false })
  // public filterMenu!: ListBoxComponent;

  // public fields: FieldSettingsModel = { text: "name", value: "id" };
  // public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  public dataElement!: any[];
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  salaryId: number = 0;
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

    this.tableSalary();
    // Load List Data
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/payroll/setting/paycheck/", paramAdd]);
  };

  public tableSalary() {
    this._coreService.Get("hr/Salarytype/GetList").subscribe((res: any) => {
      this.listTreeObj.fields = {
        dataSource: res.data,
        id: "id",
        text: "name",
        parentID: "pid",
        hasChildren: "hasChild",
      };
      this.getListData(res.data[0].id);
      this.salaryId = res.data[0].id;
      this.BindingElement();
    });
  }

  // GetListData
  getListData = (id: any): void => {
    
    this.salaryId = id;
    let extraParams: any[] = [];
    if (id) {
      extraParams.push({
        field: "salaryId",
        value: id,
      });
    }
    this._coreService.execute(this.state, "payroll/paycheck/GetAll", extraParams);
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    extraParams.push({
      field: "salaryId",
      value: this.salaryId,
    });
    this._coreService.execute(this.state, "payroll/paycheck/GetAll", extraParams);
  }
  // Số thứ tự
  formatStt1 = (index: string) => {
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
        if (this.nodeSelected) {
          this.modalService.open("ListElement");
        } else {
          this.notification.warning("Bạn chưa chọn bảng lương!");
        }
        break;
      case ToolbarItem.EXPORT_EXCEL:
        var data = this._coreService.ExecuteToExport('payroll/paycheck/GetAll','',this.state).subscribe((res: any) => {
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
            fileName: "thietlapphieuluong" + "-" + formattedDate + ".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
          const objParamAdd = { id: this.modelAdd.id, type: "edit" };
          const paramAdd = window.btoa(JSON.stringify(objParamAdd));
          this.router.navigate(["/cms/payroll/setting/paycheck/", paramAdd]);
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
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
          .Post("payroll/paycheck/remove", ids)
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

  userSelecting(e: any) {
    this.nodeSelected = e.nodeData.id;
    this.getListData(this.nodeSelected);
  }

  check(e: any, field: string, event: any) {
    let param: any[] = [];
    if (field == "isVisible") {
      param.push({
        id: e.id,
        colName: e.colName,
        isVisible: event.checked,
      });
    }
    this._coreService.Post("payroll/paycheck/quickUpdate", param[0]).subscribe(
      (res: any) => {
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.editSuccess();
        }
      },
      (error: any) => {
        this.notification.editError();
      }
    );
  }

  BindingElement = () => {
    this._coreService
      .Get("payroll/element/GetListAll")
      .subscribe((res: any) => {
        if (res.statusCode == "200") {
          this.dataElement = res.data;
        }
      });
  };
  funcSave = () => {
    let paperData = this.elementgrid.getSelectedRecords();
    let arr: any[] = [];
    Object.keys(paperData).map(function (key) {
      arr.push((paperData as any)[key].id);
      return arr;
    });
    let param = {
      salaryTypeId: this.nodeSelected,
      elementId: arr,
    };

    // call API
    this._coreService
      .Post("payroll/paycheck/add", param)
      .subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.notification.addSuccess();
          this.modalService.close("ListElement");
          this.getListData(this.nodeSelected);
        } else {
          this.notification.lockError();
        }
      });
  };
  // Số thứ tự
  formatStt = (index: string) => {
    (this.data as any)[index].orders =
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1;
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
}
