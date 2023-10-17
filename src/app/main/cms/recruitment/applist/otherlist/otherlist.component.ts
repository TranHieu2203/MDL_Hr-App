import { OtherList } from "./../../../../../_models/app/list/otherlist";
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { BehaviorSubject, pipe, Subject } from "rxjs";
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
  VirtualScrollService,
  ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
import { Consts } from "src/app/common/const";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";

import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { takeUntil } from "rxjs/operators";
setCulture("en");

@Component({
  selector: "cms-app-otherlist",
  templateUrl: "./otherlist.component.html",
  styleUrls: ["./otherlist.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class OtherlistComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD,
    ToolbarItem.EDIT,
    ToolbarItem.LOCK,
    ToolbarItem.DELETE,
    ToolbarItem.EXPORT_EXCEL,
  ]);
  toolItemsEdit$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  //editForm!: FormGroup;
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  @ViewChild('defaultDialog')
  public defaultDialog!: DialogComponent;
  localData: any = [];
  @ViewChild("treeView", { static: false })
  listTreeObj!: TreeViewComponent;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  //model: OtherList = new OtherList();
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  mode: any;
  public fields: FieldSettingsModel = { value: "id", text: "name" };
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  nodeSelected: any;
  public dialogHeader!: string;
  public animationSettings: Object = { effect: 'Zoom' };

  field: any = { value: "id", text: "name" };
  // edit
  model: OtherList = new OtherList();
  modelTemp: OtherList = new OtherList();
  editForm!: FormGroup;
  flagState$ = new BehaviorSubject<string>('');
  lstType: any;
  PTypeId: any;

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
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.editForm = this._formBuilder.group({
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[-+\/.,_a-zA-Z0-9]+$/),
        ],
      ],
      name: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(300),
        ],
      ],
      type: ["", Validators.required],
      order: [""],
      note: [""],
    });
    this.flagState$.subscribe(x => {
      let toolbarList: any[] = [];

      if (x === Consts.view) {
        toolbarList = [ToolbarItem.EDIT];
        this.editForm.disable();
      }
      if (x === Consts.add) {
        toolbarList = [ToolbarItem.SAVE];
        this.editForm.get("code")!.enable();
      }
      if (x === Consts.edit) {
        toolbarList = [ToolbarItem.SAVE];
        this.editForm.get("code")!.disable();
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

    // Build toolbar
    this.getTreeView();
    // Load List Data
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id;
        this.getListData();
      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/recruitment/list/otherlist/", paramAdd]);
  };

  // GetListData
  getListData = (): void => {
    
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "TypeId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "hr/otherlist/GetAllByType", extraParams);
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "TypeId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "hr/otherlist/GetAllByType", extraParams);
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        //
        this.dialogHeader = "Thêm mới tham số hệ thống";
        this.flagState$.next(Consts.add)
        this.model = new OtherList();
        this.getType();
        this.model.typeId = this.nodeSelected;
        this.defaultDialog.show();
        break;
      case ToolbarItem.EDIT:

        this.flagState$.next(Consts.edit)
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
          break;
        }
        this.getType();
        this.getById(this.modelAdd.id);

        this.defaultDialog.show();

        break;
      case ToolbarItem.EXPORT_EXCEL:
        var extraParams: any = [];
        if (this.nodeSelected) {
          extraParams.push({
            field: "TypeId",
            value: this.nodeSelected,
          });
        }
      var data = this._coreService.ExecuteToExport('hr/otherlist/GetAllByType', extraParams).subscribe((res: any) => {
        // Lấy ngày hiện tại
        const currentDate: Date = new Date();

        // Lấy ngày, tháng và năm
        const year: number = currentDate.getFullYear();
        const month: number = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
        const day: number = currentDate.getDate();
        // Chuyển đổi thành chuỗi "yyyyMMdd"
        const formattedDate: string = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
        const exportProperties: ExcelExportProperties = {
          dataSource: res.data,
          columns: [],
          fileName: "danhmucdungchung" + "-" + formattedDate +".xlsx"
        };
        this.gridInstance.excelExport(exportProperties)

      })
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
            .Post("hr/otherlist/ChangeStatus", ids)
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
      let lstDeleteIds = _.map(this.modelDelete, "id");
      if (lstDeleteIds.length > 0) {
        this._coreService
          .Post("hr/otherlist/Delete", lstDeleteIds)
          .subscribe((success: any) => {
            if (success.statusCode == "200") {
              this.notification.deleteSuccess();
              this.modalService.close("confirm-delete-modal");
              this.gridInstance.clearSelection();
              this.gridInstance.refresh();
            } else {
              this.notification.deleteError();
              this.modalService.close("confirm-delete-modal");
            }
          });
      }
    }
  };
  nodeSelecting(e: any) {
    this.nodeSelected = Number(e.nodeData.id);
    this.getListData();
  }
  getTreeView() {
    this._coreService
      .Get("hr/otherlist/GetOtherListTreeView?ModuleId=2")
      .subscribe((res: any) => {
        this.localData = res.data;
        this.loadTreeView();
      });
  }
  loadTreeView() {
    const x = setInterval(() => {
      if (this.listTreeObj && this.listTreeObj.fields) {
        this.listTreeObj.fields = {
          dataSource: this.localData,
          id: "id",
          text: "name",
        };
        clearInterval(x);
      }
    }, 100);
  }
  /**
   * getbyid
   * @returns 
   */
  getById(id: any) {

    // Lấy dữ liệu 
    if (id) {
      this._coreService
        .Get("hr/otherlist/get?id=" + id)
        .subscribe((res: any) => {
          this.modelTemp = res.data;
          this.model = _.cloneDeep(this.modelTemp);
          this.dialogHeader = "Sửa " + this.model.name;

        });
    } else {
    }

  }
  getType() {

    // Lấy dữ liệu 

    this._coreService
      .Get("hr/otherlist/GetAllType?ModuleId=2")
      .subscribe((res: any) => {
        this.lstType = res.data;
      });


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
      this._coreService.Post("hr/otherlist/add", this.model).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.defaultDialog.hide();
            this.getListData();
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/otherlist/Update", this.model).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.defaultDialog.hide();
            this.getListData();
          }
        },
        (error: any) => {
          this.notification.editError();
        }
      );
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
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
