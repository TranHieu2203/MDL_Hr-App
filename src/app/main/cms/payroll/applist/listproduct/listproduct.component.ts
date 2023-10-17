import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject } from "rxjs";
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
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { HttpResponse } from "@angular/common/http";

const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-profile-listproduct",
  templateUrl: "./listproduct.component.html",
  styleUrls: ["./listproduct.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ListproductComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.EXPORT_TEMPLATE, ToolbarItem.IMPORT, ToolbarItem.EXPORT_EXCEL, ToolbarItem.DELETE
  ])
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
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
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
  dataImport: any[] = [];

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
    this.getListData();
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/payroll/list/listproduct/", paramAdd]);
  };

  // GetListData
  getListData = (): void => {
    
    this._coreService.execute(this.state, "payroll/product/GetAll");
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    this._coreService.execute(this.state, "payroll/product/GetAll", extraParams);
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
        this.router.navigate(["/hrms/payroll/list/listproduct/new"]);
        break;

      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.EXPORT_EXCEL:
        this.gridInstance.excelExport();
        break;
      case ToolbarItem.IMPORT:
        document.getElementById("file")!.click();
        break;
      case ToolbarItem.EXPORT_TEMPLATE:
        let paramExport = {
        }
        this._coreService
          .Download("payroll/product/TemplateExport", paramExport)
          .subscribe((response: HttpResponse<Blob>) => {
            let filename: string = "TemplateProduct.xlsx";
            let binaryData = [];
            binaryData.push(response.body);
            if (binaryData.length > 0) {
              let downloadLink = document.createElement("a");
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData as BlobPart[], { type: "blob" }));
              downloadLink.setAttribute("download", filename);
              document.body.appendChild(downloadLink);
              downloadLink.click();
            }
          });
        break;
      default:
        break;
    }
  };

  inputFile = async (e: any) => {
    var files = e.target.files;
    var file = files[0];
    var data = await this._coreService.readExcel(file);
    this.dataImport = data;
    let x: any = document.getElementById("file");
    x.value = null;
    this.modalService.open("confirm-import-modal");
  };
  confirmImport = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-import-modal");
    } else {

      if (this.dataImport) {
        var data2 = [];

        data2 = this.dataImport.splice(0, 2)
        this.modalService.loading.next(true);
        if (this.dataImport.length > 0 && this.dataImport.length < 10000) {
          this._coreService
            .Post("payroll/product/ImportProduct", this.dataImport)
            .subscribe((res: any) => {
              this.modalService.loading.next(false);
              //check error
              if (res.statusCode == 400) {
                this.notification.warning("Sai mã :" + res.message);
              } else {
                this.notification.success("Import thành công");
              }
            });
        }
      }
      this.modalService.close("confirm-import-modal");
    }
  };

  confirmDelete = (status: any): void => {
    if (status === "ok") {
      let ids = this.modelDelete.map((i: any) => i.id);
      this._coreService.Post("payroll/product/Delete", ids).subscribe((res: any) => {
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.deleteSuccess();
          this.getListData();
        }
      });
    }
    this.modalService.close("confirm-delete-modal");
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
