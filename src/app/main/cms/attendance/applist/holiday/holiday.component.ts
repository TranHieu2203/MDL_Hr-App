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

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";

import { ToolbarItem, ToolbarInterface, Holiday } from "src/app/_models/index";
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Consts } from "src/app/common/const";


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
import { createElement } from "@syncfusion/ej2-base";

const _ = require("lodash");
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "cms-app-holiday",
  templateUrl: "./holiday.component.html",
  styleUrls: ["./holiday.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class HolidayComponent implements OnInit {
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
  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };


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
  button: any;
  public dialogHeader!: string;
  public animationSettings: Object = { effect: 'Zoom' };

  // edit
  model: Holiday = new Holiday();
  modelTemp: Holiday = new Holiday();
  editForm!: FormGroup;
  flagState$ = new BehaviorSubject<string>('');

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
      name: ["", [Validators.required, Validators.maxLength(51), this.globals.noWhitespaceValidator]],
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(31),
          this.globals.checkExistSpace,
        ],
      ],
      startDayoff: ["", [Validators.required]],
      endDayoff: ["", [Validators.required]],
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
    this.buildToolbar();
    // Load List Data
    this.getListData();
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/attendance/list/holiday/", paramAdd]);
  };

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.LOCK];
    this.toolbar = this.globals.buildToolbar("holiday", toolbarList);
  };

  // filter checkbox

  // GetListData
  getListData = (): void => {
    
    this._coreService.execute(this.state, "hr/holiday/GetAll");
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    this._coreService.execute(this.state, "hr/holiday/GetAll", extraParams);
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
        this.dialogHeader = "Thêm mới ngày nghỉ lễ";
        this.flagState$.next(Consts.add)
        this.model = new Holiday();
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
        this.getById(this.modelAdd.id)
        this.defaultDialog.show();

        break;
      case ToolbarItem.EXPORT_EXCEL:
        var data = this._coreService.ExecuteToExport('hr/holiday/GetAll','',this.state).subscribe((res: any) => {
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
            fileName: "ngaynghile" + "-" + formattedDate + ".xlsx"
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
            .Post("hr/holiday/ChangeStatus", ids)
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
  /**
     * getbyid
     * @returns 
     */
  getById(id: any) {

    // Lấy dữ liệu 
    if (id) {
      this._coreService
        .Get("hr/holiday/get?id=" + id)
        .subscribe((res: any) => {

          this.modelTemp = res.data;
          this.model = _.cloneDeep(this.modelTemp);
          this.dialogHeader = "Sửa ngân hàng " + this.model.name;

        });
    } else {
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
      this._coreService.Post("hr/holiday/add", this.model).subscribe(
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
      this._coreService.Post("hr/holiday/Update", this.model).subscribe(
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
  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      let lstDeleteIds = _.map(this.modelDelete, "id");
      if (lstDeleteIds.length > 0) {
        this._coreService
          .Post("hr/holiday/delete", lstDeleteIds)
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
  changeDate = (model: any) => {
    setTimeout(() => {
      const idDate = "#" + model + "_input";
      const value = $(idDate).val();
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      var patt1 = new RegExp(
        /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.]/
      );
      // check nhập sai năm
      if (value && value.indexOf("/") != -1) {
        let valueArray = value.split("/");
        if (valueArray.length != 3) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        }
        if (valueArray[0].length != 2 || valueArray[1].length != 2 || valueArray[2].length != 4) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        }
      }
      let FindSpace = value.indexOf(" ");
      if (FindSpace != -1) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      } else
        if (value.length === 0) {
          this.editForm.get(model)!.setErrors({ required: true });
          return;
        } else if (value.length > 0 && (patt.test(value.toLowerCase()) === true || patt1.test(value.toLowerCase()) === true)) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        } else if (value.length > 10) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        } else {
          this.editForm.get(model)!.setErrors(null);
        }
      if (
        value &&
        ((value.length === 8 && value.indexOf("/") === -1) ||
          (value.length === 6 && value.indexOf("/") === -1) ||
          (value.length === 10 && value.indexOf("/") > -1))
      ) {
        if (value.indexOf("-") === -1) {
          const returnDate = this.globals.replaceDate(value);
          // (this.model as any)[model] = returnDate;
          if (returnDate && returnDate.length > 0) {
            $(idDate).val(returnDate);
            const dateParts: any = returnDate.split("/");
            (this.model as any)[model] = new Date(
              +dateParts[2],
              dateParts[1] - 1,
              +dateParts[0]
            );
            this.editForm.get(model)!.clearValidators();
          }
        }
      }
    }, 200);
  };
}
