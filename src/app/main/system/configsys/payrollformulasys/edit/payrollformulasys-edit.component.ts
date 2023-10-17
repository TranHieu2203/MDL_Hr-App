import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject } from "rxjs";
import { Observable } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";

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
  GroupSettingsModel,
  QueryCellInfoEventArgs,
  TextWrapSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  PayrollFormula,
} from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { createElement } from "@syncfusion/ej2-base";

const _ = require("lodash");
import { PayrollFormulaSys } from "src/app/_models/app/system";

setCulture("en");

@Component({
  selector: "sys-payrollformula-edit",
  templateUrl: "./payrollformulasys-edit.component.html",
  styleUrls: ["./payrollformulasys-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class PayrollFormulaSysEditComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: any[] = [];
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };

  // query auto complete
  public query = new Query();

  model = new PayrollFormulaSys();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;

  lstSymbol: any;
  paramId: any;
  wrapSettings!: TextWrapSettingsModel;
  elements: any = [];
  areaId: any;
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
    public activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // Get Route Param
    this.activatedRoute.params.subscribe((params: Params) => {
      const paramId = params["id"];
      // Nếu trạng thái chỉnh sửa thì Get dữ liệu
      if (paramId !== "new") {
        const objParam = window.atob(paramId);
        const paramUrl = JSON.parse(objParam);
        if (paramUrl && paramUrl.id) {
          this.paramId = paramUrl.id;
          this.areaId = paramUrl.areaId;
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      }
    });

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
    this.model.salaryTypeId = this.paramId;
    // Build toolbar
    this.buildToolbar();
    // Load List Data
    this.getListData();
    this.getRightList();

    this.wrapSettings = { wrapMode: "Content" };
   
  }

  getRightList() {
    this._coreService.Get("hr/salaryelementsys/getlistcal?SalaryTypeId="+ this.model.salaryTypeId).subscribe((res: any) => {
      this.elements = res.data;
    });
  }

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.SAVE, ToolbarItem.BACK];
    this.toolbar = this.globals.buildToolbar("payroll_formula", toolbarList!);
  };
  // filter checkbox

  // GetListData
  getListData() {
    const state = { skip: 0, take: 100 };
    let extraparam = [
      {
        field: "SalaryTypeId",
        value: this.paramId,
      },
    ];
    this._coreService
      .GetAll(state, "hr/formulasys/GetElementCal", extraparam)
      .subscribe((res: any) => {
        this.data = res.result;
      });
  }
  drag(e: any) {
    e.dataTransfer.setData("text", "[" + e.target.id + "]");
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    let extraparam = [
      {
        field: "SalaryTypeId",
        value: this.paramId,
      },
    ];
    this._coreService
      .GetAll(state, "hr/formulasys/GetElementCal", extraparam)
      .subscribe((res: any) => {
        this.data = res.result;
      });
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.BACK:
        this.router.navigate(["/sys/configsys/payrollformulasys"]);
        break;
      case ToolbarItem.SAVE:
        this._coreService
          .Post("hr/formulasys/update", this.model)
          .subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.warning("Công thức không hợp lệ")
            } else {
              this.notification.editSuccess();
              this.getListData();
            }
          });
        break;
      case ToolbarItem.LOCK:
        break;
      default:
        break;
    }
  };

  rowSelecting(e: any) {
    this.model.colName = e.data.colName;
    this.model.areaId = this.areaId;
    this.model.formulaName = e.data.formulaName || "";
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
