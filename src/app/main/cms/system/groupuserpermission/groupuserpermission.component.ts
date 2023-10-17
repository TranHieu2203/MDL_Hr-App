import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
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
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import { DataManager, Query, Predicate } from "@syncfusion/ej2-data";
setCulture("en");

@Component({
  selector: "cms-app-groupuserpermission",
  templateUrl: "./groupuserpermission.component.html",
  styleUrls: ["./groupuserpermission.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class GroupUserPermissionComponent implements OnInit {

  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SAVE
  ])

  // Varriable Language
  languages: any;
  selectedLanguage: any;

  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild("gridReport", { static: false })
  public gridReport!: GridComponent;



  @ViewChild("treeView", { static: false })
  public treeView!: TreeViewComponent;

  @ViewChild("listTreeObj", { static: true })
  public listTreeObj!: TreeViewComponent;
  @ViewChild("maskObj", { static: true })
  public maskObj!: MaskedTextBoxComponent;
  localData = [];
  public field = {};

  public dataUserOrg: Object[] = [];
  public field2: Object = {
    dataSource: this.dataUserOrg,
    id: "ID",
    parentID: "PARENT_ID",
    text: "NAME",
    hasChildren: "HAS_CHILD",
    isChecked: "IS_CHECKED",
  };
  // set the CheckBox to the TreeView
  public showCheckBox: boolean = true;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data!: any[];

  public datareport!: any[]
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  tab: number = 1;
  isAllColumnChecked = false;
  isAddColumnChecked = false;
  isEditColumnChecked = false;
  isDeleteColumnChecked = false;
  isApprovedColumnChecked = false;
  isLockColumnChecked = false;
  isSumColumnChecked = false;
  isExportColumnChecked = false;
  isImportColumnChecked = false;
  isCalColumnChecked = false;
  isViewColumnChecked = false;
  isSendMailColumnChecked = false;
  isSendColumnChecked = false;
  isCreateColumnChecked = false

  checkAllHeader: any;
  checkExportHeader: any;
  checkImportHeader: any;
  checkCalHeader: any;
  checkViewHeader: any;
  checkAddHeader: any;
  checkEditHeader: any;
  checkDeleteHeader: any;
  checkApprovedHeader: any;
  checkLockHeader: any;
  checkSumHeader: any;
  checkSendMailHeader: any;
  checkCreateHeader: any;
  checkSendHeader: any;

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

    // Load List Data
    this.getListData();
    this.getTenantUser().then((res: any) => {
      this.localData = res.data;
      this.changeDataSource(this.localData);
    });
    this.GetUserOrg().then((res: any) => {
      this.dataUserOrg = res;
      let orgId: any = localStorage.getItem("orgIds");
      this.localData = JSON.parse(orgId);
      this.field2 = {
        dataSource: this.localData,
        id: "ID",
        parentID: "PARENT_ID",
        text: "NAME",
        hasChildren: "HAS_CHILD",
        expanded: "EXPAND",
      };
    });
    //this.getPermissionReport(0).then((res: any) => this.datareport = res)
  }
  check(e: any, field: string, event: any) {
    let index = _.findIndex(this.data, (item: any) => {
      return item.functionId == e.functionId;
    });
    if (index > -1) {
      this.data[index][field] = event.target.checked;
      if (!event.target.checked) {
        this.data[index].isAll = false;
        this.gridInstance.refreshColumns();
      }
      if (field == "isAll") {
        var newData = Object.assign({}, (this.gridInstance.dataSource as any)[index]);
        this.data[index] = newData;
        newData.isView = event.target.checked;
        newData.isAdd = event.target.checked;
        newData.isEdit = event.target.checked;
        newData.isDelete = event.target.checked;
        newData.isApproved = event.target.checked;
        newData.isLock = event.target.checked;
        newData.isSum = event.target.checked;
        newData.isCal = event.target.checked;
        newData.isImport = event.target.checked;
        newData.isExport = event.target.checked;
        newData.isSendMail = event.target.checked;
        newData.isSend = event.target.checked
        newData.isCreate = event.target.checked
        this.gridInstance.setRowData(index, newData)
        this.gridInstance.updateRow(index, newData);
        this.gridInstance.refreshColumns();
      }
    }
  }
  checkReport(e: any, event: any) {
    let isCheck = event.target.checked
    
    let index = _.findIndex(this.datareport, (item: any) => {
      return item.functionId == e.functionId;
    });
    if (index > -1) {
      this.datareport[index]['isPermision'] = isCheck;
    }
    this.gridReport.refresh();

  }
  checkAll(event: any) {
    this.isAllColumnChecked = event.target.checked;
    this.isViewColumnChecked = event.target.checked;
    this.isAddColumnChecked = event.target.checked;
    this.isEditColumnChecked = event.target.checked;
    this.isEditColumnChecked = event.target.checked;
    this.isDeleteColumnChecked = event.target.checked;
    this.isApprovedColumnChecked = event.target.checked;
    this.isLockColumnChecked = event.target.checked;
    this.isSumColumnChecked = event.target.checked;
    this.isCalColumnChecked = event.target.checked;
    this.isImportColumnChecked = event.target.checked;
    this.isExportColumnChecked = event.target.checked;
    this.isSendMailColumnChecked = event.target.checked;
    this.isSendColumnChecked = event.target.checked;
    this.isCreateColumnChecked = event.target.checked;

    this.checkExportHeader = event.target.checked;
    this.checkImportHeader = event.target.checked;
    this.checkCalHeader = event.target.checked;
    this.checkViewHeader = event.target.checked;
    this.checkAddHeader = event.target.checked;
    this.checkEditHeader = event.target.checked;
    this.checkDeleteHeader = event.target.checked;
    this.checkApprovedHeader = event.target.checked;
    this.checkLockHeader = event.target.checked;
    this.checkSumHeader = event.target.checked;
    this.checkSendMailHeader = event.target.checked;
    this.checkCreateHeader = event.target.checked;
    this.checkSendHeader = event.target.checked;

    for (const item of this.data) {
      item.isAll = this.isAllColumnChecked;
      


      // Áp dụng trạng thái ngược cho các checkbox khác trong hàng
      item.isView = this.isAllColumnChecked;
      item.isAdd = this.isAllColumnChecked;
      item.isEdit = this.isAllColumnChecked;
      item.isDelete = this.isAllColumnChecked;
      item.isApproved = this.isAllColumnChecked;
      item.isLock = this.isAllColumnChecked;
      item.isSum = this.isAllColumnChecked;
      item.isCal = this.isAllColumnChecked;
      item.isImport = this.isAllColumnChecked;
      item.isExport = this.isAllColumnChecked;
      item.isSendMail = this.isAllColumnChecked;
      item.isCreate = this.isAllColumnChecked;
      item.isSend = this.isAllColumnChecked;
    }

    this.gridInstance.refresh(); // Refresh grid để cập nhật giao diện
  }
  checkAllButton(field: string, event: any) {
    if (field == "isView") {
      this.isViewColumnChecked = event.target.checked;
    }
    if (field == "isAdd") {
      this.isAddColumnChecked = event.target.checked;
    }
    if (field == "isEdit") {
      this.isEditColumnChecked = event.target.checked;
    }
    if (field == "isDelete") {
      this.isDeleteColumnChecked = event.target.checked;
    }
    if (field == "isApproved") {
      this.isApprovedColumnChecked = event.target.checked;
    }
    if (field == "isLock") {
      this.isLockColumnChecked = event.target.checked;
    }
    if (field == "isSum") {
      this.isSumColumnChecked = event.target.checked;
    }
    if (field == "isCal") {
      this.isCalColumnChecked = event.target.checked;
    }
    if (field == "isImport") {
      this.isImportColumnChecked = event.target.checked;
    }
    if (field == "isExport") {
      this.isExportColumnChecked = event.target.checked;
    }
    if (field == "isSendMail") {
      this.isSendMailColumnChecked = event.target.checked;
    }
    if (field == "isSend") {
      this.isSendColumnChecked = event.target.checked;
    }
    if (field == "isCreate") {
      this.isCreateColumnChecked = event.target.checked;
    }


    for (const item of this.data) {
      item.isView = this.isViewColumnChecked;
      item.isAdd = this.isAddColumnChecked;
      item.isEdit = this.isEditColumnChecked;
      item.isDelete = this.isDeleteColumnChecked;
      item.isApproved = this.isApprovedColumnChecked;
      item.isLock = this.isLockColumnChecked;
      item.isSum = this.isSumColumnChecked;
      item.isCal = this.isCalColumnChecked;
      item.isImport = this.isImportColumnChecked;
      item.isExport = this.isExportColumnChecked;
      item.isSendMail = this.isExportColumnChecked;
      item.isSend = this.isSendColumnChecked;
      item.isCreate = this.isCreateColumnChecked;
      
    }

    this.gridInstance.refresh(); // Refresh grid để cập nhật giao diện
  }
  checkAllReport(event: any) {
    let isCheck = event.target.checked;
    for (const item of this.datareport) {
      item.isPermision = (isCheck);
    }
    this.gridReport.refresh();
  }
  userSelecting(e: any) {
    this.nodeSelected = e.nodeData.id;
    this.getListData(this.nodeSelected);
    this.getPermissionSelect(this.nodeSelected).then((res: any) => {
      this.treeView.checkedNodes = res.map((i: any) => i.toString());
    });
    this.getPermissionReport(this.nodeSelected).then((res: any) => {
      this.datareport = res
    })
  }
  getPermissionSelect(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/Setting/ListGroupPermission?Id=" + id)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getPermissionReport(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Post("hr/Setting/GetUserGroupReport?groupId=" + id, {})
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getTenantUser() {
    return new Promise((resolve) => {
      this._coreService.Get("tenant/group/GetListGroup").subscribe((res: any) => {
        resolve(res);
      });
    });
  }
  GetUserOrg() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/Organization/GetOrgPermission")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  changetab(id: any) {
    this.tab = id;
  }
  //Filtering the TreeNodes
  public searchNodes(args: any) {
    let _text = this.maskObj.element.value;
    this.getTenantUser().then((res: any) => {
      this.localData = res.data;
    });
    let predicats = [],
      _array = [],
      _filter = [];
    if (_text == "") {
      this.changeDataSource(this.localData);


    } else {
      let predicate = new Predicate("name", "contains", _text, true);

      let filteredList = new DataManager(this.localData).executeLocal(
        new Query().where(predicate)
      );


      for (let j = 0; j < filteredList.length; j++) {
        _filter.push((filteredList[j] as any)["id"]);
        let filters = this.getFilterItems(filteredList[j], this.localData);
        for (let i = 0; i < filters.length; i++) {
          if (_array.indexOf(filters[i]) == -1 && filters[i] != null) {
            _array.push(filters[i]);
            predicats.push(new Predicate("id", "equal", filters[i], false));
          }
        }
      }
      if (predicats.length == 0) {
        this.changeDataSource([]);
      } else {
        let query = new Query().where(Predicate.or(predicats));
        let newList = new DataManager(this.localData).executeLocal(query);
        this.changeDataSource(newList);
        let proxy = this;
        setTimeout(function (this: any) {
          proxy.listTreeObj.expandAll();
        }, 100);
      }
    }
  }
  //Find the Parent Nodes for corresponding childs
  public getFilterItems(fList: any, list: any): any {
    let nodes = [];
    nodes.push(fList["id"]);
    let query2 = new Query().where("id", "equal", fList["pid"], false);
    let fList1 = new DataManager(list).executeLocal(query2);
    if (fList1.length != 0) {
      let pNode = this.getFilterItems(fList1[0], list);
      for (let i = 0; i < pNode.length; i++) {
        if (nodes.indexOf(pNode[i]) == -1 && pNode[i] != null)
          nodes.push(pNode[i]);
      }
      return nodes;
    }
    return nodes;
  }
  public changeDataSource(data: any) {
    this.listTreeObj.fields = {
      dataSource: data,
      id: "id",
      text: "name",
      parentID: "pid",
      hasChildren: "hasChild",
    };
  }

  getListData = (id?: any): void => {
    const state = { skip: 0, take: 1000 };
    let extraParams: any[] = [];
    if (id) {
      extraParams.push({
        field: "userGroupId",
        value: id,
      });
    }
    this._coreService
      .GetAll(state, "tenant/grouppermission/GridFuntion", extraParams)
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
          this.notification.warning("Chưa chọn nhóm tài khoản");
          return;
        }
        if (this.tab == 1) {
          let y = this.data.map((item: any) => {
            return {
              groupId: item.userGroupId,
              functionId: item.functionId,
              permissionString:
                (item.isView ? "VIEW," : "") +
                (item.isAdd ? "ADD," : "") +
                (item.isEdit ? "EDIT," : "") +
                (item.isDelete ? "DELETE," : "") +
                (item.isApproved ? "APPROVED," : "") +
                (item.isLock ? "LOCK," : "") +
                (item.isSum ? "AT_SUM," : "") +
                (item.isCal ? "PA_CAL," : "") +
                (item.isImport ? "IMPORT," : "") +
                (item.isExport ? "EXPORT," : "") +
                (item.isSendMail ? "SENDMAIL," : "") +
                (item.isSend ? "SEND," : "") +
                (item.isCreate ? "CREATE," : "") +
                (item.isAll ? "ALL," : ""),
                

            };
          });
          this._coreService
            .Post("tenant/grouppermission/Update", y)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.message);
              } else {
                this.notification.editSuccess();
              }
            });
        } else if (this.tab == 2) {
          let checkIds = Object.assign(
            [],
            this.treeView.checkedNodes.map((i: any) => Number(i))
          );
          if (checkIds.length > 0) {
            checkIds.forEach((id) => {
              let p;
              findParent(null, id, this.dataUserOrg);
              function findParent(parentId?: any, findId?: any, array?: any) {
                if (array && array.length > 0) {
                  array.forEach((element: any) => {
                    if (element.id == findId && parentId) {
                      p = parentId;
                    }
                  });
                  array.forEach((element: any) => {
                    findParent(element.id, id, element.child);
                  });
                }
              }
              if (p && checkIds.indexOf(p) == -1) {
                checkIds.push(p);
              }
            });
          }
          let a = {
            GroupId: this.nodeSelected,
            OrgIds: checkIds,
          };
          this._coreService
            .Post("hr/Setting/UpdateGroup", a)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.message);
              } else {
                this.notification.editSuccess();
              }
            });
        } else if (this.tab == 3) {
          let param: any = {
            groupId: this.nodeSelected,

          }
          let checkIds: any[] = []
          let y = this.datareport.map((item: any) => {

            if (item.isPermision) checkIds.push(item.reportId)
          });
          param.reportId = checkIds
          this._coreService
            .Post("hr/Setting/UpdateUserGroupReport", param)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.message);
              } else {
                this.notification.editSuccess();
              }
            });
        }
        break;
      default:
        break;
    }
  };
}
