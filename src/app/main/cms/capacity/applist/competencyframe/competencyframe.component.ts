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
import { ToolbarItem, ToolbarInterface, CompetencyFrame } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from "@angular/forms";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";

import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { Consts } from "src/app/common/const";
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";

const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-app-competencyframe",
  templateUrl: "./competencyframe.component.html",
  styleUrls: ["./competencyframe.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class CompetencyFrameComponent implements OnInit {
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

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  @ViewChild('defaultDialog')
  public defaultDialog!: DialogComponent;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public fields: FieldSettingsModel = { value: "id", text: "name" };
  public modelDelete: Array<any> = [];
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  public dialogHeader!: string;
  public animationSettings: Object = { effect: 'Zoom' };

  // edit
  model: CompetencyFrame = new CompetencyFrame();
  modelTemp: CompetencyFrame = new CompetencyFrame();
  editForm!: FormGroup;
  flagState$ = new BehaviorSubject<string>('');
  lstSalaryScaleId: any;

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
    this.editForm = this._formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(51), this.globals.noWhitespaceValidator]],
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(31),
          this.globals.checkExistSpace,
        ],
      ],
      capacityGroupId: ["", [Validators.required, this.requireNonZeroValidator()]],
      startDate: ["", []],
      endDate: ["", []],
      remark: ["", []],
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
  requireNonZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === 0) {
        return { requireNonZero: true };
      }
      return null;
    };
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/capacity/list/competencyframe/", paramAdd]);
  };

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.LOCK];
    this.toolbar = this.globals.buildToolbar("competencyframe", toolbarList);
  };
  // filter checkbox

  // GetListData
  getListData = (): void => {
    
    this._coreService.execute(this.state, "hr/competencyframe/GetAll");
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    this._coreService.execute(this.state, "hr/competencyframe/GetAll", extraParams);
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
  // clickToolbar = (itemButton: any): void => {
  //   const buttonId = itemButton.id;
  //   let selectDeletes = this.gridInstance.getSelectedRecords();
  //   switch (buttonId) {
  //     case ToolbarItem.ADD:
  //       this.router.navigate(["/hrms/capacity/list/competencyframe/new"]);
  //       break;
  //     case ToolbarItem.EDIT:
  //       const selectRows = this.gridInstance.getSelectedRecords();
  //       if (selectRows && selectRows.length > 0) {
  //         this.modelAdd = selectRows[0];
  //         const objParamAdd = { id: this.modelAdd.id, type: "edit" };
  //         const paramAdd = window.btoa(JSON.stringify(objParamAdd));
  //         this.router.navigate([
  //           "/hrms/capacity/list/competencyframe/",
  //           paramAdd,
  //         ]);
  //       } else {
  //         this.notification.warning("notify.NO_RECORD_SELECT");
  //         return;
  //       }
  //       break;
  //     case ToolbarItem.DELETE:
  //       if (selectDeletes && selectDeletes.length > 0) {
  //         this.modelDelete = selectDeletes;
  //         let checkHieuLuc = false;
  //         // for (let i = 0; i < this.modelDelete.length; i++) {
  //         //   if (this.modelDelete[i].status.name === "Hiệu lực") {
  //         //     checkHieuLuc = true;
  //         //   }
  //         // }
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
  //     case ToolbarItem.EXPORT_EXCEL:
  //       this.gridInstance.excelExport();
  //       break;
  //     case ToolbarItem.LOCK:
  //       if (selectDeletes && selectDeletes.length > 0) {
  //         let ids = selectDeletes.map((i: any) => i.id);
  //         this._coreService
  //           .Post("hr/competencyframe/ChangeStatus", ids)
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
  //     default:
  //       break;
  //   }
  // };
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.dialogHeader = "Thêm mới năng lực";
        this.flagState$.next(Consts.add)
        this.model = new CompetencyFrame();
        this.getSalarySclareId();
        this.defaultDialog.show();
        break;
      case ToolbarItem.EDIT:

        this.flagState$.next(Consts.edit)
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
          return;
        }
        this.getSalarySclareId();
        this.getById(this.modelAdd.id);

        this.defaultDialog.show();

        break;
      case ToolbarItem.EXPORT_EXCEL:
        var data = this._coreService.ExecuteToExport('hr/competencyframe/GetAll','',this.state).subscribe((res: any) => {
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
            fileName: "nangluc" + "-" + formattedDate + ".xlsx"
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
            .Post("hr/competencyframe/ChangeStatus", ids)
            .subscribe((res: any) => {
              if (res.statusCode == 200) {
                this.notification.lockSuccess();
                this.gridInstance.refresh();
              } else {
                this.notification.checkErrorMessage(res.message);
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
          .Post("hr/competencyframe/delete", lstDeleteIds)
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
  getById(id: any) {

    // Lấy dữ liệu 
    if (id) {
      this._coreService
        .Get("hr/competencyframe/get?id=" + id)
        .subscribe((res: any) => {
          this.modelTemp = res.data;
          this.model = _.cloneDeep(this.modelTemp);
          this.dialogHeader = "Sửa " + this.model.name;
        });
    } else {
    }

  }
  getSalarySclareId() {

    // Lấy dữ liệu 

    this._coreService
      .Get("hr/otherlist/CAPACITYGROUP")
      .subscribe((res: any) => {
        this.lstSalaryScaleId = res.data;
      });


  }
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
  saveData = () => {
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }
    if (this.model.startDate != null && this.model.endDate != null) {
      if (this.model.startDate > this.model.endDate) {
        this.notification.warning("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc !");
        return;
      }
    }
    if (this.flagState$.value === Consts.add) {
      this._coreService.Post("hr/competencyframe/add", this.model).subscribe(
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
      this._coreService.Post("hr/competencyframe/Update", this.model).subscribe(
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
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
