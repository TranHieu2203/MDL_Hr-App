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
  VirtualScrollService,
  GroupSettingsModel,
  QueryCellInfoEventArgs,
  ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface, SwipeData } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);

import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { takeUntil } from "rxjs/operators";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DatePipe } from '@angular/common';
import * as moment from "moment";
import { WelfareCal } from "src/app/_models/app/cms/profile/appbusiness/welfarecal";
import { publicDecrypt } from "crypto";
const $ = require("jquery");

setCulture("en");

class modelCal {
  orgId!: number;
  calDate!: string;
  welfareListId!: number;
}

@Component({
  selector: "cms-profile-overtime",
  templateUrl: "./welfarecal.component.html",
  styleUrls: ["./welfarecal.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})

export class WelfarecalComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  searchFrom!: FormGroup;
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };
  selectionOptions = {
    cellSelectionMode: "Box",
    type: "Multiple",
    mode: "Cell",
  };
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data

  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  // query auto complete
  public query = new Query();
  model = new WelfareCal();
  modelCal: modelCal = new modelCal();
  lstWelfareList: any[] = [];
  public data: Observable<DataStateChangeEventArgs>;
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  m!: number;
  y!: number;
  oninit: boolean = false;
  isDisso: any;

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
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private _formBuilder: FormBuilder
    //private datePipe: DatePipe
  ) {
    // Set language
    this.languages = this.globals.currentLang;
    this.data = _coreService;
    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);

    this.searchFrom = this._formBuilder.group({
      welfareListId: [],
      calDate: [],
      orgId: [],
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

    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id == null ? model.ID : model.id;
        this.getListData();
      });
      this._coreService.isDisso
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((checked: any) => {

        this.isDisso = checked;
        this.getListData();

      });
    this.getWelfareList();
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
      // this.getListData();
    }, 200);
  }
  //ST sửa
  getWelfareList() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/welfare/GetList")
        
        .subscribe((res: any) => {
          this.lstWelfareList = res.data;
          resolve(res.data);
        });
    });
  }

  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.EXPORT_EXCEL,
    ToolbarItem.SUM_WORK,
  ])

  // filter checkbox

  // GetListData
  getListData = (): void => {
    

    let extraParams: any = [
      {
        field: "orgId",
        value: this.nodeSelected,
      },
      {
        field: "IsDissolve",
        value: this.isDisso,
      },
      {
        field: "welfareListId",
        value: this.model.welfareListId,
      },
      {
        field: "calDate",
        value: moment(this.model.calDate).format("YYYY-MM-DD"),
      },
    ];

    this._coreService.execute(this.state, "hr/welfarecal/GetAll", extraParams);
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
          this.searchFrom.get(model)!.setErrors({ incorrect: true });
          return;
        }
        if (valueArray[0].length != 2 || valueArray[1].length != 2 || valueArray[2].length != 4) {
          this.searchFrom.get(model)!.setErrors({ incorrect: true });
          return;
        }
      }
      let FindSpace = value.indexOf(" ");
      if (FindSpace != -1) {
        this.searchFrom.get(model)!.setErrors({ incorrect: true });
        return;
      } else
        if (value.length === 0) {
          this.searchFrom.get(model)!.setErrors({ required: true });
          return;
        } else if (value.length > 0 && (patt.test(value.toLowerCase()) === true || patt1.test(value.toLowerCase()) === true)) {
          this.searchFrom.get(model)!.setErrors({ incorrect: true });
          return;
        } else if (value.length > 10) {
          this.searchFrom.get(model)!.setErrors({ incorrect: true });
          return;
        } else {
          this.searchFrom.get(model)!.setErrors(null);
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
            this.searchFrom.get(model)!.clearValidators();
          }
        }
      }
    }, 200);
  };
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any = [
      {
        field: "orgId",
        value: this.nodeSelected,
      },
      {
        field: "IsDissolve",
        value: this.isDisso,
      },
      {
        field: "welfareListId",
        value: this.model.welfareListId,
      },
      {
        field: "calDate",
        value: moment(this.model.calDate).format("YYYY-MM-DD"),
      },
    ];

    this._coreService.execute(this.state, "hr/welfarecal/GetAll", extraParams);
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes: any = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.EXPORT_EXCEL:
        let extraParams: any = [
          {
            field: "orgId",
            value: this.nodeSelected,
          },
          {
            field: "IsDissolve",
            value: this.isDisso,
          },
          {
            field: "welfareListId",
            value: this.model.welfareListId,
          },
          {
            field: "calDate",
            value: moment(this.model.calDate).format("YYYY-MM-DD"),
          },
        ];
        var data = this._coreService.ExecuteToExport('hr/welfarecal/GetAll', extraParams, this.state).subscribe((res: any) => {
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
            fileName: "phucloi" + "-" + formattedDate +".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      case ToolbarItem.SUM_WORK:
        if (!this.nodeSelected) {
          this.notification.warning("Chọn phòng ban");
          break;
        }
        if (!this.model.welfareListId) {
          this.notification.warning("Chọn Loại phúc lợi");
          break;
        }
        if (!this.model.calDate) {
          this.notification.warning("Chọn ngày tính toán");
          break;
        }

        this.modelCal.orgId = this.nodeSelected;
        this.modelCal.welfareListId = this.model.welfareListId;
        this.modelCal.calDate = moment(this.model.calDate).format("YYYY-MM-DD"),


          this.modalService.loading.next(true);
        this._coreService
          .Post("hr/welfarecal/Calculate", this.modelCal)
          .subscribe((res: any) => {
            this.modalService.loading.next(false);
            this.notification.success("Tổng hợp thành công");
            this.getListData();
          });
        break;
      default:
        break;
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
