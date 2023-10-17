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
import { ToolbarItem, ToolbarInterface, JobEvaluationDtl } from "src/app/_models/index";
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
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import { DataManager, Query, Predicate } from "@syncfusion/ej2-data";
setCulture("en");

@Component({
  selector: "cms-app-config-jobevaluetion",
  templateUrl: "./jobevaluetionconfig.component.html",
  styleUrls: ["./jobevaluetionconfig.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class JobEvaluetionConfigComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild("treeView", { static: false })
  public treeView!: TreeViewComponent;

  @ViewChild("maskObj", { static: true })
  public maskObj!: MaskedTextBoxComponent;
  localData = [];
  public field = {};
  public model: JobEvaluationDtl = new JobEvaluationDtl();
  // set the CheckBox to the TreeView
  public showCheckBox: boolean = true;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data!: any[];
  public dataPosition = [];

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  tab: number = 1;

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
    this.GetlistPosition();
    this.GetListTreeView();
  }

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.SAVE];
    this.toolbar = this.globals.buildToolbar(
      "sys_user_permission",
      toolbarList
    );
  };
  GetlistPosition(){
    this._coreService
    .Get("hr/JobEvaluation/ListPosMark")
    .subscribe((res: any) => {
      if (res.statusCode == 400) {
      } else {
        this.dataPosition = res.data
      }
    });
  }
  GetListTreeView(){
    this._coreService.Get("hr/JobEvaluation/GetTreeView").subscribe((res: any) => {
      this.localData = res.data;
      const x = setInterval(() => {
        if (this.treeView) {
          this.treeView.fields = {
            dataSource: this.localData,
            id: "id",
            text: "name",
            parentID: "parentId",
            hasChildren: "hasChildren",
            expanded: "expand"
          };
          clearInterval(x);
        }
      }, 100);
    });
  }
  RowSelect = (event: any) =>{
    this.model.posId = event.data.POS_ID;
    // lấy dữ liệu JE
    this._coreService
    .Get("hr/JobEvaluation/ListByPos?posId=" + this.model.posId)
    .subscribe((res: any) => {
      if(res.statusCode == "200")
      {
        this.treeView.checkedNodes = res.data.map((i: any) => i.ID.toString());
      }
    });
      
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.EDIT:
        break;
      case ToolbarItem.SAVE:
        if(!this.model.posId)
        {
          this.notification.warning("Bạn chư chọn chức danh!");
          return;
        }
        let checkIds = Object.assign(
          [],
          this.treeView.checkedNodes.map((i: any) => Number(i))
        );
        if(checkIds.length > 0)
          this.model.jobEvalId = checkIds;
       
        this._coreService
        .Post("hr/JobEvaluation/AddDtl",this.model)
        .subscribe((res: any) => {
          if (res.statusCode == "200") {
            this.notification.addSuccess();
            this.GetlistPosition();
            this.GetListTreeView();
          } else {
           this.notification.addError();
          }
        });
        break;

      default:
        break;
    }
  };
}
