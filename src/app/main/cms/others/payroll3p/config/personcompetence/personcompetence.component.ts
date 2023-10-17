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
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
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
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { Splitter } from "@syncfusion/ej2-angular-layouts";
setCulture("en");

@Component({
  selector: "cms-app-config-personcompetence",
  templateUrl: "./personcompetence.component.html",
  styleUrls: ["./personcompetence.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class PersonCompetenceComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  @ViewChild("listCompetence", { static: false })
  public listCompetence!: TreeViewComponent;

  @ViewChild("treeView", { static: false })
  public treeView!: TreeViewComponent;

  @ViewChild("listTreeEmp", { static: false })
  public listTreeEmp!: TreeViewComponent;
  public onCreated() {
    let splitterObj1 = new Splitter({
      height: '820px',
      paneSettings: [
        { size: '94%', min: '20%' }
      ],
      orientation: 'Vertical'
    });
    splitterObj1.appendTo('#vertical_splitter');
  }
  public sampleData: Object[] = [];
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
  nodeOrgSelect: any;
  empId: any;
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
    // Load List Data
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeOrgSelect = model.id;
        this.GetListEmp(this.nodeOrgSelect);

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
  GetListEmp(orgId: any) {
    // lấy dữ liệu JE
    if (orgId) {
      this._coreService
        .Get("hr/Employee/GetListByOrg?OrgId=" + orgId)
        .subscribe((res: any) => {
          if (res.statusCode == "200") {
            this.listTreeEmp.fields = {
              dataSource: res.data,
              id: "id",
              text: "name",
              parentID: "pid",
              hasChildren: "hasChild",
            };
          }
        });
    }

  }
  GetListPC = () => {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/PersionalCompetence/GetTreeview")
        .subscribe((res: any) => {
          if (res.statusCode == "200") {
            this.listCompetence.fields = {
              dataSource: res.data,
              id: "id",
              text: "name",
              parentID: "parentId",
              hasChildren: "hasChildren",
              expanded: "expand"
            };
          }
          resolve("ok")
        });
    });


  }
  empSelecting = (e: any) => {
    this.empId = e.nodeData.id;
    this.GetListPC().then((res: any) => {
      if (res == "ok") {
        // get data check
        this._coreService
          .Get("hr/PersionalCompetence/GetByEmpId?empId=" + this.empId)
          .subscribe((res: any) => {
            if (res.statusCode == "200") {
              if (res.data.length > 0) {
                this.listCompetence.checkedNodes = res.data.map((i: any) => i.id.toString());
              }
            }
          });
      }
    })
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.EDIT:
        break;
      case ToolbarItem.SAVE:

        if (!this.empId) {
          this.notification.warning("Bạn chưa chọn nhân viên !");
          return;
        }
        let paramModel = {
          empId: this.empId,
          compatenceId: Object.assign(
            [],
            this.listCompetence.checkedNodes.map((i: any) => Number(i))
          )
        }
        this._coreService.Post("hr/PersionalCompetence/Add", paramModel).subscribe((res: any) => {
          if (res.statusCode == "200") {
            this.notification.editSuccess();

          }
          else {
            this.notification.checkErrorMessage(res.message);
          }
        })
        break;

      default:
        break;
    }
  };

}
