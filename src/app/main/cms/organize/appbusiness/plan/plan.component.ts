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
  GridComponent, 
  RowDDService, 
  EditService, 
  EditSettingsModel, 
  RowDropSettingsModel,
  FilterService, 
  VirtualScrollService,
  GroupSettingsModel,
  RowDataBoundEventArgs,
  QueryCellInfoEventArgs
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService as CoreService  } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query } from "@syncfusion/ej2-data";
import { IpServiceService } from "src/app/_services/ip-service.service";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";

const _ = require("lodash");
import { takeUntil } from 'rxjs/operators';
import { SplitterComponent, Splitter } from "@syncfusion/ej2-angular-layouts";
import { async } from "rxjs/internal/scheduler/async";
import { Position } from "src/app/_models/app/cms/organize/appbusiness";
import { FormArray,FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  PageSettingsModel,
  SortSettingsModel,
} from "@syncfusion/ej2-angular-treegrid";
import { TreeGridComponent, PageService, CommandColumnService } from "@syncfusion/ej2-angular-treegrid";
setCulture("en");

@Component({
  selector: "cms-organize-plan",
  templateUrl: "./plan.component.html",
  styleUrls: ["./plan.component.scss"],
  providers: [FilterService, VirtualScrollService, RowDDService, EditService],
  encapsulation: ViewEncapsulation.None,
})
export class PlanComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  editForm!: FormGroup;
  groupOptions!: GroupSettingsModel;
  model:Position = new Position();
  chairForm: FormArray = this._formBuilder.array([]);

  public dropInstance!: DropDownList;

  // View child Grid
  // @ViewChild("overviewgrid", { static: false })
  @ViewChild("overviewgrid2", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild("listGroup", { static: true })
  public listGroup!: TreeViewComponent;

  @ViewChild('splitterInstance', { static: false })
  splitterObj!: SplitterComponent;
  nodeSelected: any;

  public fields: FieldSettingsModel = { value: "id", text: "name" };
  public fieldsOrgId: Object = { value: "nodeId", text: "nodeText", child: 'nodeChild' };
  public onCreated() {
    let splitterObj1 = new Splitter({
      height: '100%',
      paneSettings: [
        { size: '100%', min: '20%' },
        { size: '6%', min: '6%' }
      ],
      orientation: 'Vertical'
    });
    splitterObj1.appendTo('#vertical_splitter');
    
  }
 

  // Toolbar Item
  //public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data!: Observable<DataStateChangeEventArgs>;
  public data2!: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  public localChildData!: any;
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  groupId: number = 0;
  public rowDropOptions!: RowDropSettingsModel;
  public destRowDropOptions!: RowDropSettingsModel;
  lstChair: any;
  lstOrgId: any;
  /**
   * Constructor
   *
   */
  constructor(
    public configs: Configs,
    public router: Router,

    private _formBuilder: FormBuilder,
    private _coreService: CoreService,
    private modalService: ModalService,
    private notification: Notification,
    private globals: Globals,
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

    this.lstChair = [
      {name: "Master", id: 1 },
      {name: "Interim", id: 2 },
      {name: "Kiêm nhiệm", id: 3 }
      ];

    this.editForm = this._formBuilder.group({
      model: this._formBuilder.group({            
        textboxSearch:["", []],        
        textbox2Search:["", []],        
        orgIdSearch:["", []],        
        orgIdSearchText:["", []],    
        orgId2Search:["", []],
        chairId:this.chairForm,
        chair2Id:this.chairForm
    })
  });
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
    this.rowDropOptions = { targetID: 'overviewgrid2' };
    this.destRowDropOptions = { targetID: 'overviewgrid' };
    // Build toolbar
    //this.buildToolbar();
    // Load List Data
    
    this.getListData();
    this.getListData2();
    this.loadDataOrg();
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/organize/business/plan/", paramAdd]);
  };
  // Build Toolbar
  // buildToolbar = () => {
  //   const toolbarList = [
  //     ToolbarItem.ADD,
  //     ToolbarItem.EDIT,
  //     ToolbarItem.PRINT_JD_POSITION,
  //     ToolbarItem.SYNC_LIST_MANAGER_POSITION,      
  //     ToolbarItem.SEARCH_VACANT_POSITION,
  //     ToolbarItem.SWAP_POSITION,   
  //     ToolbarItem.EXPORT_EXCEL, 
  //     ToolbarItem.LOCK,
  //     ToolbarItem.DELETE,
  //   ];
  //   this.toolbar = this.globals.buildToolbar(
  //     "position",
  //     toolbarList
  //   );
  // };
  // filter checkbox

  // GetListData

  getListData() {
    const state = { skip: 0, take: 1000 };
    let extraParams: any[] = [];
       // extraParams.push({
       //   field: "orgid",
       //   value: 1,
       // });
    return new Promise<void>((resolve) => {
      this._coreService
        .GetAll(state, "hr/position/GetPositionOrgID", extraParams)
        .subscribe((res: any) => {
      
          this.data = res.result;
          resolve();
        });
    });
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
  }

  getListData2() {
    const state = { skip: 0, take: 1000 };
    let extraParams: any[] = [];
       // extraParams.push({
       //   field: "orgid",
       //   value: 1,
       // });
    return new Promise<void>((resolve) => {
      this._coreService
        .GetAll(state, "hr/position/GetPositionOrgID", extraParams)
        .subscribe((res: any) => {
          this.data2 = res.result;
          resolve();
        });
    });
  }

  public dataStateChange2(state: DataStateChangeEventArgs): void {
    this.pageIndex = Math.floor(state.skip! / state.take!);
  }
  // Số thứ tự
  // formatStt = (index: string) => {
  //   return (
  //     this.pageIndex * this.gridInstance.pageSettings.pageSize! +
  //     parseInt(index, 0) +
  //     1
  //   );
  // };
  // Event Click Toolbar
  // clickToolbar = (itemButton: any): void => {
  //   const buttonId = itemButton.id;
  //   let selectDeletes = this.gridInstance.getSelectedRecords();
  //   switch (buttonId) {
  //     case ToolbarItem.ADD:
  //       this.router.navigate(["/hrms/organize/business/position/new"]);
  //       break;
  //     case ToolbarItem.EDIT:
  //       const selectRows = this.gridInstance.getSelectedRecords();
  //       if (selectRows && selectRows.length > 0) {
  //         this.modelAdd = selectRows[0];
  //         const objParamAdd = { id: this.modelAdd.id, type: "edit" };
  //         const paramAdd = window.btoa(JSON.stringify(objParamAdd));
  //         this.router.navigate(["/hrms/organize/business/position/", paramAdd]);
  //       } else {
  //         this.notification.warning("notify.NO_RECORD_SELECT");
  //       }
  //       break;
  //     case ToolbarItem.DELETE:
  //       if (selectDeletes && selectDeletes.length > 0) {
  //         this.modelDelete = selectDeletes;
  //         let checkHieuLuc = false;
  //         for (let i = 0; i < this.modelDelete.length; i++) {
  //           if (this.modelDelete[i].isActive === -1) {
  //             checkHieuLuc = true;
  //           }
  //         }
  //         if (checkHieuLuc) {
  //           this.notification.warning(
  //             "Hệ thống không cho phép xóa dữ liệu có trạng thái Hiệu lực!"
  //           );
  //           return;
  //         }
  //         this.modalService.open("confirm-delete-modal");
  //       } else {
  //         this.notification.warning("notify.NO_RECORD_SELECT");
  //       }
  //       break;
  //     case ToolbarItem.LOCK:
  //       if (selectDeletes && selectDeletes.length > 0) {
  //         let ids = selectDeletes.map((i: any) => i.id);
  //         this._coreService
  //           .Post("hr/position/ChangeStatus", ids)
  //           .subscribe((res: any) => {
  //             if (res.statusCode == 200) {
  //               this.notification.lockSuccess();
  //               this.gridInstance.refresh();
  //             } else {
  //               this.notification.lockError();
  //             }
  //           });
  //       } else {
  //         this.notification.warning("notify.NO_RECORD_SELECT");
  //       }
  //       break;
  //     case ToolbarItem.EXPORT_EXCEL:       
  //       this.gridInstance.excelExport();
  //       break;
  //     default:
  //       break;
  //   }
  // };  
//   confirmDelete = (status: any): void => {
//     if (status === "cancel") {
//       this.modalService.close("confirm-delete-modal");
//     } else {
//       let lstDeleteIds = this.modelDelete.map((i: any) => i.id);
//       if (lstDeleteIds.length > 0) {
//         this._coreService
//         .Post("hr/position/Delete", lstDeleteIds)
//         .subscribe((res: any) => {
//           if (res.statusCode == 200) {
//             this.notification.deleteSuccess();
//             this.gridInstance.clearSelection();
//             this.gridInstance.refresh();
//           } else {
//             this.notification.deleteError();
//           }
//           this.modalService.close("confirm-delete-modal");
//       })
//     }
//   }
// };
  // ngOnDestroy() {
  //   clearTimeout(this.button);
  //   this._unsubscribeAll.next();
  //   this._unsubscribeAll.complete();
  //   this._unsubscribeAll2.next();
  //   this._unsubscribeAll2.complete();
  // }
  // disbale button chon nhieu ban ghi
  // setButtonStatus = (event: any) => {
  //   if (!this.button) {
  //     this.button = setTimeout(() => {
  //       // đếm số bản ghi select
  //       const rowSelects = this.gridInstance.getSelectedRecords();
  //       const rowSelectCounts = rowSelects.length;
  //       // Nếu count > 1 thì disable toolbar
  //       if (rowSelectCounts > 1) {
  //         for (let i = 0; i < this.toolbar.length; i++) {
  //           //disable sửa
  //           if (this.toolbar[i].id === ToolbarItem.EDIT) {
  //             this.toolbar[i].isDisable = true;
  //           }
  //         }
  //       } else {
  //         for (let i = 0; i < this.toolbar.length; i++) {
  //           // enabled sửa
  //           if (this.toolbar[i].id === ToolbarItem.EDIT) {
  //             this.toolbar[i].isDisable = false;
  //           }
  //         }
  //       }
  //     }, 200);
  //   }
  // };

  // groupSelecting(e: any) {
  //   this.getListData();
  //   this.getListData2();
  // }

  // public groupPos() {
  //   this._coreService.Get("hr/groupposition/GetList").subscribe((res: any) => {
  //     this.listGroup.fields = {
  //       dataSource: res.data,
  //       id: "id",
  //       text: "name",
  //       parentID: "pid",
  //       hasChildren: "hasChild",
  //     };
  //     this.getListData();
  //     this.getListData2();
  //     this.groupId = res.data[0].id;
  //     //this.listGroup.selectedNodes = [res.data[0].id.toString()];
  //   });
  // }
  
  rowSelecting(e: any) {
    this.model.orgIdSearch = e.data.id;
    this.model.orgIdSearchText = e.data.name;
  }
  loadDataOrg() {
    Promise.all([this.GetAllOrg()]).then((res: any) => {     
      this.localChildData = res[0];
      
    const table = this.localChildData;

    const ids = table.map((x: any) => x.id);
    const result = table
      .map((parent: any) => {
        const orgChildren = table.filter((child: any) => {
          if (child.id !== child.parentId && child.parentId === parent.id) {
            return true;
          }

          return false;
        });

        if (orgChildren.length) {
          parent.orgChildren = orgChildren;
        }

        return parent;
      })
      .filter((obj: any) => {
        if (obj.id === obj.parentId || !ids.includes(obj.parentId)) {
          return true;
        }

        return false;
      });

    this.lstOrgId = result;
    });
  };
  
  GetAllOrg() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/position/GetOrgTreeApp?sLang=vi-VN")
        .subscribe((res: any) => {
  
          resolve(res.data);
        });
    });
  };
  rowOrgDataBound(args: RowDataBoundEventArgs) {    
      if ((args.data as any)['id'] < 1) {
        args.row!.classList.add('NodeFTEPlan1');
          args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeFTEPlan');
      }
      else{
        args.row!.classList.add('NodeFolder1');
        args.row!.getElementsByClassName('e-treecell').item(0)!.classList.add('NodeFolder');
      }    
  }
  rowDrop(args: any) {
    args.cancel = true;
    var value = [];
    for (var r = 0; r < args.rows.length; r++) {
        value.push(args.fromIndex + r);
    }
    this.gridInstance.reorderRows(value, args.dropIndex);
  }
  cellDataBound(args: QueryCellInfoEventArgs) {
    var id = (args.data as any)['color'];
    var bold = (args.data as any)['isowner'];
    if (id != null && id != "") {
      (args.cell as HTMLElement).style.color=id;
    }
    if (bold === true) {
      (args.cell as HTMLElement).style.fontWeight="bold";
    }
  }
  cellDataBound2(args: QueryCellInfoEventArgs) {
    var id = (args.data as any)['color'];
    var bold = (args.data as any)['isowner'];
    if (id != null && id != "") {
      (args.cell as HTMLElement).style.color=id;
    }
    if (bold === true) {
      (args.cell as HTMLElement).style.fontWeight="bold";
    }
  }
  confirmDelete(e: any) {}

  sortSettings!: SortSettingsModel;
  pageSettings!: PageSettingsModel;
}
