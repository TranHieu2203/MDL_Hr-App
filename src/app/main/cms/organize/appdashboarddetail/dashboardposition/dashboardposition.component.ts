import { Component, OnInit } from "@angular/core";
import { sampleData } from "./datasource";
import {
  PageSettingsModel,
  SortSettingsModel,
} from "@syncfusion/ej2-angular-treegrid";
import { ViewChild, ViewEncapsulation } from "@angular/core";
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
import { L10n, setCulture,closest } from "@syncfusion/ej2-base";
import {
  CommandClickEventArgs,
  FilterService,
  GridComponent,
  RowDataBoundEventArgs,
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
import { ConfigService } from "src/app/_services/config.service";
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

import { TreeGridComponent,EditService, PageService, CommandColumnService } from "@syncfusion/ej2-angular-treegrid";
import { CoreService } from "src/app/_services/core.service";
import { ModalService } from "src/app/_services/modal.service";
import { jobPositionTree } from "src/app/_models/app/cms/organize/appbusiness/jobPositionTree";
setCulture("en");

@Component({
  selector: "cms-organize-dashboard",
  templateUrl: "./dashboardposition.component.html",
  styleUrls: ["./dashboardposition.component.scss"],
  providers: [FilterService, VirtualScrollService,EditService,PageService,CommandColumnService],
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
export class DashboardPositionComponent implements OnInit {
  // Varriable Language
  languages: any;
  tab: any;
  selectedLanguage: any;
  model:jobPositionTree = new jobPositionTree();
  public dropInstance!: DropDownList;
  // View child Grid
  // @ViewChild("treegridOrgChartPosition", { static: false })
  // @ViewChild("treegridJobChartPosition", { static: false })
  @ViewChild("treegridJobChartPositionChild", { static: false })
  public gridInstance!: TreeGridComponent;

  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  @ViewChild("splitterInstance", { static: false })
  splitterObj!: SplitterComponent;

  public editSettings!: Object;
  public commands!: Object[];
  public data!: Object[];
  public data2!: Object[];
  public data3!: Object[];
  public sortSettings!: SortSettingsModel;
  public pageSettings!: PageSettingsModel;
  public localData!: any;
  public localData2!: any;
  public localChildData!: any;

  public modelAdd: any;
  pageIndex: number = 0;

  public treegrid!: TreeGridComponent;
  constructor(
    private _coreService: CoreService,
    private modalService: ModalService,
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
    // if (this.tab == null){
    //   this.loadDataCombobx();
    // }
    this.loadDataCombobx();
    this.loadDataJobCharPosition(); 
  }

  ngOnInit(): void {
    this.pageSettings = { pageSize: 12 }; 
    this.editSettings = {
            allowAdding: false,
            allowEditing: true,
            allowDeleting: false,
            mode: 'Row', 
            allowEditOnDblClick: false
        };
        this.commands = [{ type: 'Edit', buttonOption: { iconCss: ' e-icons e-edit', cssClass: 'e-flat'} },
        { type: 'Save', buttonOption: { iconCss: 'e-icons e-update', cssClass: 'e-flat',click: this.commandClick.bind(this) } },
        { type: 'Cancel', buttonOption: { iconCss: 'e-icons e-cancel-icon', cssClass: 'e-flat'} }];    
  }
  commandClick(args: Event): void {
    if (this.tab == 2){
      let rowIndex: number = (<HTMLTableRowElement>closest(args.target as Element, '.e-row')).rowIndex;
      let data: Object = this.gridInstance.getCurrentViewRecords();
      //alert(JSON.stringify(data[rowIndex]));
      let getDataDetails = (data as any)[rowIndex];
      this.modelAdd = getDataDetails;
      let param = this.convertModel(this.modelAdd);
      this.InsertUpdateTreegrid(param);
    }
  }
  // GetListData
  InsertUpdateTreegrid(param?: any) {
    let extraParams: any[] = [];
    if (param) {
      this.model=param;
      this._coreService.Post("hr/organization/UpdateCreateRptJobPosHis", this.model)
      .subscribe((res: any) => {
        //check error
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.editSuccess();
          //this.loadDataJobCharPosition();
        }
      });
    }
  }
  rowSelecting2(e: any) {
    this.loadDataJobCharPositionChild(e.data.id);
  }
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    return model;
  }
  changeTab(e: any) {
    this.tab = e;
     if (this.tab == 1){
       this.loadDataCombobx();
     }else if (this.tab == 2){
       this.loadDataJobCharPosition(); 
     }
  }
  loadDataCombobx() {
    Promise.all([this.GetAllOrgChartPosition()]).then((res: any) => {     
      this.localData = res[0];
      
    const table = this.localData;

    const ids = table.map((x: any) => x.id);
    const result = table
      .map((parent: any) => {
        const children = table.filter((child: any) => {
          if (child.id !== child.parentId && child.parentId === parent.id) {
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
        if (obj.id === obj.parentId || !ids.includes(obj.parentId)) {
          return true;
        }

        return false;
      });

    this.data = result;
    });
  }
  loadDataJobCharPosition() {
    Promise.all([this.GetAllJobCharPosition()]).then((res: any) => {     
      this.localData2 = res[0];
      
    const table = this.localData2;

    const ids = table.map((x: any) => x.id);
    const result = table
      .map((parent: any) => {
        const children2 = table.filter((child: any) => {
          if (child.id !== child.parentId && child.parentId === parent.id) {
            return true;
          }

          return false;
        });

        if (children2.length) {
          parent.children2 = children2;
        }

        return parent;
      })
      .filter((obj: any) => {
        if (obj.id === obj.parentId || !ids.includes(obj.parentId)) {
          return true;
        }

        return false;
      });

    this.data2 = result;
    });
  }
  loadDataJobCharPositionChild(e: any) {
    Promise.all([this.GetAllJobCharPositionChild(e)]).then((res: any) => {     
      this.localChildData = res[0];
      
    const table = this.localChildData;

    const ids = table.map((x: any) => x.id);
    const result = table
      .map((parent: any) => {
        const children3 = table.filter((child: any) => {
          if (child.id !== child.parentId && child.parentId === parent.id) {
            return true;
          }

          return false;
        });

        if (children3.length) {
          parent.children3 = children3;
        }

        return parent;
      })
      .filter((obj: any) => {
        if (obj.id === obj.parentId || !ids.includes(obj.parentId)) {
          return true;
        }

        return false;
      });

    this.data3 = result;
    });
  }
  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/organize/dashboarddetail/dashboardposition/", paramAdd]);
  };
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
  rowDataBound(args: RowDataBoundEventArgs) {
    if ((args.data as any)['isJob'] === true) {
      args.row!.classList.add('NodeJOB1');
      args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeJOB');
    } else {
      if ((args.data as any)['nhomDuan'] === true) {
          args.row!.classList.add('NodeNhomDuAn1');
          args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeNhomDuAn');
        }
        else{
          args.row!.classList.add('NodeTree1');
          args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeTree');
        }
    }
  }
  rowDataBound2(args: RowDataBoundEventArgs) {
    if ((args.data as any)['isJob'] === true) {
      args.row!.classList.add('NodeJOB1');
      args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeJOB');
    } else {
      if ((args.data as any)['nhomDuan'] === true) {
          args.row!.classList.add('NodeNhomDuAn1');
          args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeNhomDuAn');
        }
        else{
          args.row!.classList.add('NodeTree1');
          args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeTree');
        }
    }
  }
  rowDataBound3(args: RowDataBoundEventArgs) {
    if ((args.data as any)['functionName'] == null) {
      args.row!.classList.add('NodeFolderContent1');
      args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeFolderContent');
    } else {
      if ((args.data as any)['functionName'] !== "") {
          args.row!.classList.add('NodeFileContent1');
          args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeFileContent');
        }
        else{
          args.row!.classList.add('NodeFolderContent1');
          args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeFolderContent');
        }
    }
  }
    GetAllOrgChartPosition() {
      return new Promise((resolve) => {
        this._coreService
          .Get("hr/organization/GetAllOrgChartPosition?language=vi-VN")
          .subscribe((res: any) => {

            resolve(res.data);
          });
      });
    }
    
  GetAllJobCharPosition() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/organization/GetJobPosTree?language=vi-VN")
        .subscribe((res: any) => {
     
          resolve(res.data);
        });
    });
  }
  GetAllJobCharPositionChild(e: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/organization/GetJobChildTree?language=vi-VN&jobId="+(e))
        .subscribe((res: any) => {
 
          resolve(res.data);
        });
    });
  }
}