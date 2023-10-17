import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject } from "rxjs";
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

const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class BlogComponent implements OnInit {
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
  public data: any[] = [];
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
    
    private _configService: ConfigService,
    private ip: IpServiceService,
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private _translateService: TranslateService
    
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
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.languages);

    // Build toolbar
    this.buildToolbar();
    // Load List Data
    this.getListData();
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd._id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/sys/website/blog/", paramAdd]);
  };

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [
      ToolbarItem.ADD,
      ToolbarItem.EDIT,
      ToolbarItem.LOCK,
      ToolbarItem.DELETE,
    ];
    this.toolbar = this.globals.buildToolbar("sys-app-Blog", toolbarList!);
  };

  getListData = (): void => {
    this._coreService.GetNode("blog/listBlog").subscribe((res: any) => {
      this.data = res.data;
      setTimeout(() => {
        this.gridInstance.refresh();
      }, 100);
    });
  };

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.router.navigate(["/sys/website/blog/new"]);
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
          const objParamAdd = { id: this.modelAdd._id, type: "edit" };
          const paramAdd = window.btoa(JSON.stringify(objParamAdd));
          this.router.navigate(["/sys/website/blog/", paramAdd]);
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes[0];
          this._coreService
            .PostNode("blog/removeBlog", ids)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.message);
              } else {
                this.notification.lockSuccess();
                this.getListData();
              }
            });
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.LOCK:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes[0];
          this._coreService.PostNode("blog/activeBlog", ids).subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.lockSuccess();
              this.getListData();
            }
          });
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
      let lstDeleteIds = _.map(this.modelDelete, "id").toString();
      if (lstDeleteIds.length > 0) {
        this._coreService
          .Delete("app-item/delete-many?ids=" + lstDeleteIds, {
            ip_address: "123456",
            channel_code: "W",
          })
          .subscribe((success: any) => {
            this.notification.deleteSuccess();
            this.modalService.close("confirm-delete-modal");
            this.gridInstance.clearSelection();
            this.gridInstance.refresh();
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
}
