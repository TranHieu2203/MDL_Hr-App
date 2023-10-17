import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
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
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";

const _ = require("lodash");
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
setCulture("en");

@Component({
  selector: "cms-app-userpermission",
  templateUrl: "./userpermission.component.html",
  styleUrls: ["./userpermission.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class UserPermissionComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild("treeView", { static: false })
  public treeView!: TreeViewComponent;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public field = {};

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data!: any[];

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;

  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private ip: IpServiceService,
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
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.languages);

    // Build toolbar
    this.buildToolbar();
    // Load List Data
    this.getListData();
    this.getGroupUser().then((res: any) => {
      this.field = {
        dataSource: res.data,
        id: "id",
        text: "name",
      };
    });
  }
  check(e: any, field: string, event: any) {
    let index = _.findIndex(this.data, (item: any) => {
      return item.functionId == e.functionId;
    });
    if (index > -1) {
      this.data[index][field] = event.checked;
    }
  }
  nodeSelecting(e: any) {
    this.nodeSelected = e.nodeData.id;
    this.getListData(this.nodeSelected);
  }
  getGroupUser() {
    return new Promise((resolve) => {
      this._coreService.Get("Authen/getlist").subscribe((res: any) => {
        resolve(res);
      });
    });
  }
  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.SAVE];
    this.toolbar = this.globals.buildToolbar(
      "sys_user_permission",
      toolbarList
    );
  };

  // GetListData
  getListData = (id?: any): void => {
    
    let extraParams: any[] = [];
    if (id) {
      extraParams.push({
        field: "userId",
        value: id,
      });
    }
    this._coreService
      .GetAll(this.state, "author/userpermission/GridFuntion", extraParams)
      .subscribe((res: any) => {
        this.data = res.result;
        this.gridInstance.pageSettings.totalRecordsCount = res.count;
      });
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
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
    switch (buttonId) {
      case ToolbarItem.EDIT:
        break;
      case ToolbarItem.SAVE:
        if (!this.nodeSelected) {
          this.notification.warning("Chưa chọn Tài khoản");
          return;
        }

        let y = this.data.map((item: any) => {
          return {
            userId: item.userId,
            functionId: item.functionId,
            permissionString:
              (item.isAdd ? "ADD," : "") +
              (item.isEdit ? "EDIT," : "") +
              (item.isDelete ? "DELETE," : ""),
          };
        });

        this._coreService
          .Post("author/userpermission/Update", y)
          .subscribe((res: any) => {
            if (res.statusCode == "200") {
              this.notification.editSuccess();
            } else {
              this.notification.editError();
            }
          });
        break;

      default:
        break;
    }
  };
}
