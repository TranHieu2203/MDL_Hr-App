import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
const $ = require("jquery");
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
  TextWrapSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  PayrollFormula
} from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query } from "@syncfusion/ej2-data";
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-attendance-payrollformula-edit",
  templateUrl: "./payrollformula-edit.component.html",
  styleUrls: ["./payrollformula-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class PayrollFormulaEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SAVE, ToolbarItem.BACK
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild("maskObj", { static: true })
  public maskObj!: MaskedTextBoxComponent;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: any[] = [];
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };

  // query auto complete
  public query = new Query();

  model = new PayrollFormula();
  // list filter
  highlightTexts = ["CASE", "WHEN", "THEN", "ELSE", "END"];
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  statusId: number = 0;
  lstSymbol: any;
  paramId: any;
  wrapSettings!: TextWrapSettingsModel;
  elements: any = [];
  elements1: any = [];
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
    // Load List Data
    this.getListData();
    this.getRightList();
    this.wrapSettings = { wrapMode: "Content" };
  }

  getRightList() {
    this._coreService.Get("payroll/element/getlistcal?SalaryTypeId=" + this.model.salaryTypeId).subscribe((res: any) => {
      this.elements = res.data;
      this.elements1 = res.data
    });
  }

  test() {
    var area = $('#textarea');
    var findWord = "CASE";
    var index = area.val().indexOf(findWord);
    area.focus().prop({ 'selectionStart': index, 'selectionEnd': index + findWord.length });

  }
  public searchNodes(args: any) {
    if (args.event != undefined) {
      let _text = args.value.toUpperCase();
      this.elements1 = _.filter(this.elements, (item: any) => {
        return item.name.toUpperCase().indexOf(_text) > -1;
      });
      // this.test();
    }
  }

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
      .GetAll(state, "payroll/formula/GetElementCal", extraparam)
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
      .GetAll(state, "payroll/formula/GetElementCal", extraparam)
      .subscribe((res: any) => {
        this.data = res.result;
      });
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.BACK:
        this.router.navigate(["/cms/payroll/setting/payrollformula"]);
        break;
      case ToolbarItem.SAVE:
        if (this.model.formulaName != null) {
          this._coreService
            .Post("payroll/formula/update", this.model)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.warning("Công thức không hợp lệ")
              } else {
                this.notification.success("Thiết lập công thức thành công!");
                this.data[this.model.index!].formulaName = this.model.formulaName;
                this.gridInstance.refresh();
              }
            });
          if (this.statusId == 0) {
            this.notification.warning("Công thức không được để trống!")
          }
        }

        if (this.statusId == 1) {
          let param: any[] = [];



          this.data.forEach((element: any) => {
            param.push({
              tmpId: element.id,
              orders: element.orders
            });
          });
          this._coreService
            .Post("payroll/formula/moveTableIndex", param)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.warning("Có lỗi xảy ra trong quá trình sắp xếp, bạn vui lòng thử lại")
              } else {
                this.notification.success("Sắp xếp vị trí thành công!");
                this.statusId = 0;
              }
            });
        }
        break;
      default:
        break;
    }
  };

  rowSelecting(e: any) {
    this.model.colName = e.data.colName;
    this.model.formulaName = e.data.formulaName;
    this.model.index = e.rowIndex;
  }
  rowDrop(args: any) {
    this.statusId = 1;
    this.gridInstance.refresh();

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

  // Số thứ tự
  formatStt = (index: string) => {
    (this.data as any)[index].orders = this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1;
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
}
