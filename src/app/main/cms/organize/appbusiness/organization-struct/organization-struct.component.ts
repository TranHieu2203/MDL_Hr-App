import { Component, OnInit } from "@angular/core";
import { sampleData } from "./datasource";
import {
  PageSettingsModel,
  SortSettingsModel,
} from "@syncfusion/ej2-angular-treegrid";
import { ViewChild, ViewEncapsulation } from "@angular/core";
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
import { Query } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
//import { IpServiceService } from "src/app/_services/ip-service.service";

import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { takeUntil } from "rxjs/operators";
import { Splitter, SplitterComponent } from "@syncfusion/ej2-angular-layouts";

import { TreeGridComponent } from "@syncfusion/ej2-angular-treegrid";

setCulture("en");

@Component({
  selector: "cms-organize-organization-struct",
  templateUrl: "./organization-struct.component.html",
  styleUrls: ["./organization-struct.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
  //   providers: [FilterService, VirtualScrollService],
  //   encapsulation: ViewEncapsulation.None,
  // selector: 'app-container',
  // template: `<ejs-treegrid [dataSource]='data' [treeColumnIndex]='1' [sortSettings]="sortSettings"
  //             [allowFiltering]="true" [allowSorting]="true"
  //             childMapping='subtasks' [allowPaging]="true" [pageSettings]='pageSettings'>
  //                 <e-columns>
  //                     <e-column field='taskID' headerText='Task ID' textAlign='Center' width=30></e-column>
  //                     <e-column field='taskName' headerText='Task Name' textAlign='Left' width=180></e-column>
  //                     <e-column field='startDate' headerText='Start Date' textAlign='Center' format='yMd' width=90></e-column>
  //                     <e-column field='duration' headerText='Duration' textAlign='Center' width=80></e-column>
  //                 </e-columns>
  //            </ejs-treegrid>`
})
export class OrganizationComponent implements OnInit {
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

  @ViewChild("splitterInstance", { static: false })
  splitterObj!: SplitterComponent;

  public data!: Object[];
  public sortSettings!: SortSettingsModel;
  public pageSettings!: PageSettingsModel;
  public localData: any[] = [];

  public modelAdd: any;
  pageIndex: number = 0;

  public treegrid!: TreeGridComponent;

  constructor(
    //private _coreService: CoreService,
    //private modalService: ModalService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    //private ip: IpServiceService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    // this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
  }

  ngOnInit(): void {
    // this.data = sampleData;

    let orgId: any = localStorage.getItem("orgIds");
    this.localData = JSON.parse(orgId);
    // this.data = this.localData;

    //====CUSTOM

    const table0 = [
      { ID: 1761, NAME: "Tập Đoàn Hòa Phát", PARENT_ID: 0 },
      { ID: 1762, NAME: "Công ty TNHH Ống Thép Hòa Phát", PARENT_ID: 1761 },
    ];

    const table = this.localData;

    const ids = table.map((x: any) => x.ID);
    const result = table
      .map((parent: any) => {
        const children = table.filter((child: any) => {
          if (child.ID !== child.PARENT_ID && child.PARENT_ID === parent.ID) {
            return true;
          }

          return false;
        });

        if (children.length) {
          parent.children = children;
        }

        return parent;
      })
      .filter((obj: any) => {
        if (obj.ID === obj.PARENT_ID || !ids.includes(obj.PARENT_ID)) {
          return true;
        }

        return false;
      });

    this.data = result;

    // this.sortSettings = {
    //   columns: [
    //     { field: "taskName", direction: "Ascending" },
    //     { field: "taskID", direction: "Descending" },
    //   ],
    // };
    this.pageSettings = { pageSize: 12 };
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/organize/business/organize/", paramAdd]);
  };
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };

  dataBound(): void {
    this.treegrid.grid.hideScroll();
  }
}
