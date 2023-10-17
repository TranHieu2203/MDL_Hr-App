import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { TranslationLoaderService } from "src/app/common/translation-loader.service";
import { TranslateService } from "@ngx-translate/core";
import { locale as english } from "src/app/i18n/en";
import { locale as vietnam } from "src/app/i18n/vi";
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
import {
  FilterSettingsModel,
  IFilter,
  Filter,
} from "@syncfusion/ej2-angular-grids";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-app-approvetemplatedetail",
  templateUrl: "./approvetemplatedetail.component.html",
  styleUrls: ["./approvetemplatedetail.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ApproveTemplateDetailComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public filterType!: IFilter;
  public filterStatus!: IFilter;
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  // search
  public fields: FieldSettingsModel = { text: "name", value: "id" };
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };
  lstType = [];

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
  paramId = "";
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
    public activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private ip: IpServiceService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // Get Route Param
    this.activatedRoute.params.subscribe((params: Params) => {
      const paramId = params["templateId"];
      const objParam = window.atob(paramId);
      const paramUrl = JSON.parse(objParam);
      if (paramUrl && paramUrl.templateId) {
        this.paramId = paramUrl.templateId;
      } else {
        this.router.navigate(["/errors/404"]);
      }
    });

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

    // Build toolbar
    this.buildToolbar();
    // Load List Data
    this.getListData();
  }

  viewRecord = (event: any) => {

  };

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.DELETE, ToolbarItem.BACK];
    this.toolbar = this.globals.buildToolbar("sys_approvetemplatedetail", toolbarList!);
  };

  // GetListData
  getListData = (): void => {
    
    this._coreService.execute(this.state, "tenant/approvetemplate/getapprovetemplatedetail?templateId=" + this.paramId);
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    this._coreService.execute(this.state, "tenant/approvetemplate/getapprovetemplatedetail?templateId=" + this.paramId, extraParams);
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
        this.router.navigate(["/hrms/system/approvetemplate/edit/", this.paramId, "new"]);
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
          this.router.navigate(["/hrms/system/approvetemplate/edit/", this.paramId, this.modelAdd.id]);
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
      case ToolbarItem.BACK:
        this.router.navigate(["hrms/system/approvetemplate"]);
        break;
      default:
        break;
    }
  };

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      let lstDeleteIds = _.map(this.modelDelete, "id");
      if (lstDeleteIds.length > 0) {
        this._coreService
          .Post("tenant/approvetemplate/deleteapprovetemplatedetail", lstDeleteIds)
          .subscribe((success: any) => {
            if (success.statusCode == "200") {
              this.notification.deleteSuccess();
              this.modalService.close("confirm-delete-modal");
              this.gridInstance.clearSelection();
              this.gridInstance.refresh();
            }
            else {
              this.notification.deleteError();
              this.modalService.close("confirm-delete-modal");
            }
          });
      }
    }
  };
  // disbale button chon nhieu ban ghi
  setButtonStatus = (event: any) => {
    setTimeout(() => {
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
  };
}
