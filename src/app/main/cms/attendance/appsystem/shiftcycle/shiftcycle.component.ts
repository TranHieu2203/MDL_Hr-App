import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
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
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { FormBuilder, Validators } from "@angular/forms";
setCulture("en");

@Component({
  selector: "cms-profile-shiftcycle",
  templateUrl: "./shiftcycle.component.html",
  styleUrls: ["./shiftcycle.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ShiftCycleComponent implements OnInit {
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

  public fields: FieldSettingsModel = { text: "name", value: "id" };
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: any[] = [];
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  // query auto complete
  public query = new Query();
  public model: ShiftCycle = new ShiftCycle();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  lstShift: any = [];
  editForm: any;
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
    private _formBuilder: FormBuilder,
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
    this.editForm = this._formBuilder.group({
      monId: ["", [Validators.required]],
      tueId: ["", [Validators.required]],
      wedId: ["", [Validators.required]],
      thuId: ["", [Validators.required]],
      friId: ["", [Validators.required]],
      satId: ["", [Validators.required]],
      sunId: ["", [Validators.required]],
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

    // Build toolbar
    this.buildToolbar();
    // Load List Data
    this.getShift().then((res: any) => {
      this.lstShift = res;
      this.field = {
        dataSource: this.lstShift,
        id: "id",
        text: "name",
      };
      this.getShiftCycle(this.lstShift[0].id).then((res: any) => {
        this.model = res;
      });
    });
  }
  nodeSelecting(e: any) {
    this.model.id = e.nodeData.id;
    if (this.model.id) {
      this.getShiftCycle(this.model.id).then((res: any) => {
        this.model = res;
      });
    }
  }

  getShift() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/shift/getlist").subscribe((res: any) => {
        // default selected
        res.data[0].selected = true;
        resolve(res.data);
      });
    });
  }
  getShiftCycle(id: number) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/shift/GetShiftCycle?id=" + id)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/profile/appbusiness/shiftcycle/", paramAdd]);
  };
  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [
      ToolbarItem.SAVE,
      //ToolbarItem.EDIT,
      //ToolbarItem.LOCK,
      //ToolbarItem.EXPORT_EXCEL,
    ];
    this.toolbar = this.globals.buildToolbar("shift_cycle", toolbarList!);
  };
  // // GetListData
  // getListData = (): void => {
  //   const state = { skip: 0, take: 20 };
  //   this._coreService.execute(this.state, "hr/shiftcycle/GetAll");
  // };
  // public dataStateChange(state: DataStateChangeEventArgs): void {

  //   this.pageIndex = Math.floor(state.skip! / state.take!);
  //   let extraParams: any[] = [];
  //   this._coreService.execute(this.state, "hr/shiftcycle/GetAll", extraParams);
  // }
  // // Số thứ tự
  // formatStt = (index: string) => {
  //   return (
  //     this.pageIndex * this.gridInstance.pageSettings.pageSize! +
  //     parseInt(index, 0) +
  //     1
  //   );
  // };
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.SAVE:
        if (!this.model.id) {
          this.notification.warning("Chưa chọn ca");
          return;
        }
        if (!this.editForm.valid) {
          this.notification.warning("Form không hợp lệ");
          this.editForm.markAllAsTouched();
          return;
        }
        this._coreService
          .Post("hr/shift/UpdateShiftCycle", this.model)
          .subscribe((res: any) => {
            if (res.statusCode == 200) {
              this.notification.success("Cập nhật thành công");
            } else {
              this.notification.warning("Cập nhật thất bại");
            }
          });
        break;

      default:
        break;
    }
  };
  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      let lstDeleteIds = _.map(this.modelDelete, "id").toString();
      if (lstDeleteIds.length > 0) {
        this._coreService
          .Delete("app-item/delete-many?ids=" + lstDeleteIds, {
            ip_address: "123456",
            channel_code: "W",
          })
          .subscribe((success: any) => {
            this.notification.deleteSuccess();
            this.modalService.close("confirm-delete-modal");
            this.gridInstance.clearSelection();
            this.gridInstance.refresh();
          });
      }
    }
  };
  // change date
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
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
}
export class ShiftCycle {
  id?: number;
  monId?: number;
  tueId?: number;
  wedId?: number;
  thuId?: number;
  friId?: number;
  satId?: number;
  sunId?: number;
}
