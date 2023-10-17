import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
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
import { L10n } from "@syncfusion/ej2-base";
import {
  FilterService,
  GridComponent,
  VirtualScrollService,ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  KpiFormula,
} from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { Query } from "@syncfusion/ej2-data";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
const _ = require("lodash");

@Component({
  selector: "cms-attendance-kpiformula",
  templateUrl: "./kpiformula.component.html",
  styleUrls: ["./kpiformula.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class KpiFormulaComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SAVE
  ])
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

  model = new KpiFormula();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  statusId: number = 0;
  wrapSettings!: { wrapMode: string };
  elements: any;
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
    this.getLisElements();
    this.wrapSettings = { wrapMode: "Content" };
  }

  drag(e: any) {
    e.dataTransfer.setData("text", "[" + e.target.id + "]");
  }
  rowDrop(e: any) {
    this.statusId = 1;
  }
  // GetListData
  getListData = (): void => {
    this._coreService.Get("KpiFormula/GetListFomula").subscribe((res: any) => {
      this.data = res.data;
    });
  };
  getLisElements = (): void => {
    this._coreService.Get("kpiTarget/getlist").subscribe((res: any) => {
      this.elements = res.data;
    });
  };

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.SAVE:
        if (this.model.formula != null) {
          this._coreService
            .Post("KpiFormula/Update", this.model)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.error);
              } else {
                this.notification.editSuccess();
                this.data[this.model.index!].formula = this.model.formula;
                this.gridInstance.refresh();
              }
            });
        }
        else {
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
            .Post("KpiFormula/moveTableIndex", param)
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
      case ToolbarItem.LOCK:
        break;
      default:
        break;
    }
  };

  rowSelecting(e: any) {
    this.model.id = e.data.id;
    this.model.colName = e.data.colName;
    this.model.formula = !e.data.formula ? "" : e.data.formula;
    this.model.index = e.rowIndex;
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
