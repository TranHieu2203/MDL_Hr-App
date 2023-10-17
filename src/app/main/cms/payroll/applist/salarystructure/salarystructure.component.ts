import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
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
import { ToolbarItem, ToolbarInterface, SalaryStructure } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query,Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";

import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { truncateSync } from "fs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Consts } from "src/app/common/const";
const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-payroll-salarystructure",
  templateUrl: "./salarystructure.component.html",
  styleUrls: ["./salarystructure.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SalaryStructureComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD,
    ToolbarItem.EDIT,
    ToolbarItem.DELETE,
    ToolbarItem.EXPORT_EXCEL,
  ]);
  toolItemsEdit$ = new BehaviorSubject<any[]>([
    
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  @ViewChild('defaultDialog')
  public defaultDialog!: DialogComponent;
  @ViewChild("listTreeObj", { static: true })
  public listTreeObj!: TreeViewComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: any[] = [];
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  mode: any;

  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  salaryId: number = 0;
  public dialogHeader!:string;
  public animationSettings: Object = { effect: 'Zoom' };

  // edit
  model: SalaryStructure = new SalaryStructure();
  modelTemp: SalaryStructure = new SalaryStructure();
  editForm!: FormGroup;
  flagState$ = new BehaviorSubject<string>('');
  lstGroupId: any = [];
  lstElementId: any = [];
  lstSalaryTypeId: any = [];
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
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private _formBuilder: FormBuilder,
  ) {
    // this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.editForm = this._formBuilder.group({
      salaryTypeId: ["", [Validators.required]],
      groupId: ["", [Validators.required]],
      elementId: ["", [Validators.required]],

      isVisible: [""],
      isCalculate: [""],
      isImport: [""],
      isChange:[""],
      isSum: [""],
      orders: [""],
    });
    
    this.flagState$.subscribe(x => {
      let toolbarList: any[] = [];
      
      if (x === Consts.view) {
        toolbarList = [ToolbarItem.EDIT];
        this.editForm.disable();
      }
      if (x === Consts.add) {
        toolbarList = [ToolbarItem.SAVE];
        // this.editForm.get("code")!.enable();
        
      }
      if (x === Consts.edit) {
        toolbarList = [ToolbarItem.SAVE];
        // this.editForm.get("code")!.disable();
      }
      this.toolItemsEdit$.next(toolbarList)
    })
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

    this.tableSalary();
    // Load List Data
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/payroll/list/salarystructure/", paramAdd]);
  };
  rowDrop(e: any) {
    let param: any[] = [];
    this.data.forEach((element: any) => {
      param.push({
        tmpId: element.id,
        orders: element.orders,
      });
    });
    this._coreService
      .Post("payroll/structure/moveTableIndex", param)
      .subscribe((res: any) => {
        if (res.statusCode == 400) {
          this.notification.warning(
            "Có lỗi xảy ra trong quá trình sắp xếp, bạn vui lòng thử lại"
          );
        } else {
          this.notification.success("Sắp xếp vị trí thành công!");
        }
      });
  }

  public tableSalary() {
    this._coreService.Get("hr/Salarytype/GetList").subscribe((res: any) => {
      this.listTreeObj.fields = {
        dataSource: res.data,
        id: "id",
        text: "name",
        parentID: "pid",
        hasChildren: "hasChild",
      };
      this.getListData(res.data[0].id);
      this.salaryId = res.data[0].id;
    });
  }
  // filter checkbox

  // GetListData
  getListData(id: any) {
    const state = { skip: 0, take: 100 };
    let extraparam = [
      {
        field: "salaryId",
        value: id,
      },
    ];
    this._coreService
      .GetAll(state, "payroll/structure/GetAll", extraparam)
      .subscribe((res: any) => {
        this.data = res.result;
        this.gridInstance.refresh();
      });
  }

  // public dataStateChange(state: DataStateChangeEventArgs): void {

  //   let extraparam = [
  //     {
  //       field: "salaryId",
  //       value: this.salaryId,
  //     },
  //   ];
  //   this._coreService
  //     .GetAll(state, "payroll/structure/GetAll", extraparam)
  //     .subscribe((res: any) => {
  //       this.data = res.result;
  //     });
  // }

  // Số thứ tự
  formatStt = (index: string) => {
    (this.data as any)[index].orders =
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1;
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
        this.dialogHeader = "Thêm mới phần tử lương";
        this.flagState$.next(Consts.add)
        this.model=new SalaryStructure();
        this.getGroupElement();
        this.getSalaryType();
        this.defaultDialog.show();
        break;
      case ToolbarItem.EDIT:
        
        this.flagState$.next(Consts.edit)
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
        }else{
          this.notification.warning("notify.NO_RECORD_SELECT");
          break;
        }
        this.getGroupElement();
        this.getSalaryType();
        this.getById(this.modelAdd.id);
        
        this.defaultDialog.show();

        break;
      case ToolbarItem.EXPORT_EXCEL:
        this.gridInstance.excelExport();
        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          let checkHieuLuc = false;
          for (let i = 0; i < this.modelDelete.length; i++) {
            if (this.modelDelete[i].isActiveText === "Hiệu lực") {
              checkHieuLuc = true;
            }
          }
          if (checkHieuLuc) {
            this.notification.warning(
              "Hệ thống không cho phép xóa dữ liệu có trạng thái Hiệu lực!"
            );
            return;
          }
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.LOCK:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes.map((i: any) => i.id);
          this._coreService
            .Post("payroll/structure/ChangeStatus", ids)
            .subscribe((res: any) => {
              if (res.statusCode == 200) {
                this.notification.lockSuccess();
                this.gridInstance.refresh();
              } else {
                this.notification.lockError();
              }
            });
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.SAVE:
        this.saveData()
        break;
      default:
        break;
    }
  };

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      if (this.modelDelete.length > 0) {
        this._coreService
          .Post("payroll/structure/delete", this.modelDelete[0].id)
          .subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.deleteSuccess();
              this.getListData(this.salaryId);
            }
          });
      }
      this.modalService.close("confirm-delete-modal");
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

  userSelecting(e: any) {
    this.nodeSelected = e.nodeData.id;
    this.getListData(this.nodeSelected);
  }

  check(e: any, field: string, event: any) {
    let param: any[] = [];
    if (field == "isVisible") {
      param.push({
        id: e.id,
        colName: e.colName,
        isVisible: event.checked,
      });
    } else if (field == "isCalculate") {
      param.push({
        id: e.id,
        colName: e.colName,
        isCalculate: event.checked,
      });
    } else if (field == "isImport") {
      param.push({
        id: e.id,
        colName: e.colName,
        isImport: event.checked,
      });
    }
    this._coreService.Post("payroll/structure/quickUpdate", param[0]).subscribe(
      (res: any) => {
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.editSuccess();
        }
      },
      (error: any) => {
        this.notification.editError();
      }
    );
  }
  /**
   * getbyid
   * @returns 
   */
  getById(id:any){

    // Lấy dữ liệu 
    if (id) {
       this._coreService
         .Get("payroll/structure/get?id=" + id)
         .subscribe((res: any) => {
           this.modelTemp = res.data;
           this.model = _.cloneDeep(this.modelTemp);
           this.dialogHeader = "Sửa ";
          
         });
     } else {
     }

}
getGroupElement() {
  return new Promise((resolve) => {
    this._coreService.Get("payroll/element/getlistgroup").subscribe((res: any) => {
      resolve(res.data);
      this.lstGroupId = res.data
    });
  });
}
getElement(id: any) {
  return new Promise((resolve) => {
    this._coreService
      .Get("payroll/element/getlist?groupid=" + id)
      .subscribe((res: any) => {
        resolve(res.data);
      });
  });
}
getSalaryType() {
  return new Promise((resolve) => {
    this._coreService.Get("hr/Salarytype/getlist").subscribe((res: any) => {
      resolve(res.data);
      this.lstSalaryTypeId = res.data
    });
  });
}
changeGroup(e: any) {
  if (e.e) {
    this.getElement(e.itemData.id).then((res: any) => {
      this.lstElementId = res;
    });
  }
}

/**
 * save
 */
saveData = () => {
if (!this.editForm.valid) {
  this.notification.warning("Form chưa hợp lệ !");
  this.editForm.markAllAsTouched();
  return;
} 

if (this.flagState$.value === Consts.add) {    
  this._coreService.Post("payroll/structure/add", this.model).subscribe(
    (res: any) => {
      if (res.statusCode == 400) {
        this.notification.checkErrorMessage(res.message);
      } else {
        this.notification.addSuccess();
        this.defaultDialog.hide();
        this.tableSalary();
      }
    },
    (error: any) => {
      this.notification.addError();
    }
  );
} else {
  this._coreService.Post("payroll/structure/Update", this.model).subscribe(
    (res: any) => {
      if (res.statusCode == 400) {
        this.notification.checkErrorMessage(res.message);
      } else {
        this.notification.editSuccess();
        this.defaultDialog.hide();
        this.tableSalary();
      }
    },
    (error: any) => {
      this.notification.editError();
    }
  );
}
};
public onFiltering(e: any, a: any) {
  e.preventDefaultAction = true;
  const predicate = new Predicate("name", "contains", e.text, true, true);
  this.query = new Query();
  this.query = e.text !== "" ? this.query.where(predicate) : this.query;
  e.updateData(a, this.query);
}
}
