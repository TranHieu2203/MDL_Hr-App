import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject } from "rxjs";
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
  ColumnModel,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  KpiEmployee,
} from "src/app/_models/index";
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
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { setCurrencyCode } from "@syncfusion/ej2-base";
const $ = require("jquery");
import { map, takeUntil } from "rxjs/operators";
import { HttpResponse } from "@angular/common/http";
setCulture("en");
setCurrencyCode("TRY");
@Component({
  selector: "cms-profile-kpiemployee",
  templateUrl: "./kpiemployee.component.html",
  styleUrls: ["./kpiemployee.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class KpiEmployeeComponent implements OnInit {
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
  selectionOptions = {
    cellSelectionMode: "Box",
    type: "Multiple",
  };
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };

  // query auto complete
  public query = new Query();
  public groupSettings: GroupSettingsModel = {
    showDropArea: false,
    columns: ["orgName"],
    captionTemplate: '<span style="color:black">${key}</span>',
  };
  model = new KpiEmployee();
  lstTypeId: any = [
    { id: 1, name: "Theo tháng" },
    { id: 0, name: "Theo ngày" },
  ];
  lstMonthId = [];

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  editForm!: FormGroup;
  lstSalaryType: any;
  y!: number;
  m!: number;
  lstPeriodId: any;
  lstKpiTargetId: any;
  modelDelete!: Object[];
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
    this.data = _coreService;
    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);

    this.editForm = this._formBuilder.group({
      yearId: ["", [Validators.required]],
      periodId: ["", [Validators.required]],
      kpiTargetId: [""],
      typeId: [null, [Validators.required]],
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
    this.model.typeId = 1;
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.model.orgId = model.id;
        this.search();
        this.checkLockKPI();
      });
    this.model.yearId = new Date().getFullYear();
    Promise.all([
      this.getKpiTarget(),
      this.getListShiftPeriod(this.model.yearId),
    ]).then((res: any) => {
      this.lstKpiTargetId = res[0];
      this.model.periodId = this.lstPeriodId[0].id;
      setTimeout(() => {
        this._coreService.organizationSelect.next(true);
      }, 200);
    });
  }
  changeType(e: any) {
    if (e.e) {
      this.model.typeId = e.itemData.periodId;
      setTimeout(() => {
        this.getKpiTarget();
        this.search();
        this.checkLockKPI();
      }, 200)


    }
  }
  changeYear(e: any) {
    if (e.isInteracted) {
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriodId = res;
      });
    }
  }
  changePeriod(e: any) {
    if (e.e) {
      this.model.periodId = e.itemData.periodId;
      setTimeout(() => {
        this.search();
        this.checkLockKPI();
      }, 200)
    }
  }
  changeKpiTargetId(e: any) {
    if (e.e) {
      this.model.kpiTargetId = e.itemData.periodId;
      setTimeout(() => {
        this.search();
        this.checkLockKPI();
      }, 200)
    }
  }
  getListShiftPeriod(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/SalaryPeriod/getlist?Id=" + id)
        .subscribe((res: any) => {
          this.lstPeriodId = res.data;
          resolve(res.data);
        });
    });
  }
  getKpiTarget() {
    return new Promise((resolve) => {
      this._coreService
        .Get("kpiTarget/GetList?typeId=" + this.model.typeId)
        .subscribe((res: any) => {
          this.lstKpiTargetId = res.data;
          resolve(res.data);
        });
    });
  }

  customiseCell(args: QueryCellInfoEventArgs) {
    if ((args.data as any)[args.column!.field] == "X") {
      args.cell!.classList.add("cell-green");
    } else if ((args.data as any)[args.column!.field] == "V") {
      args.cell!.classList.add("cell-red");
    } else {
      args.cell!.classList.add("above-80");
    }
  }

  search() {
    if (this.model.orgId && this.model.periodId && this.model.typeId) {
      this.getListData();
    }
  }

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [
      ToolbarItem.PAYROLL_CAL,
      ToolbarItem.EXPORT_TEMPLATE,
      ToolbarItem.DELETE,
      ToolbarItem.IMPORT,
      ToolbarItem.LOCK
    ];
    this.toolbar = this.globals.buildToolbar("kpiemployee", toolbarList!);
  };

  // GetListData
  getListData() {
    
    let extraParams: any = [
      {
        field: "orgId",
        value: this.model.orgId,
      },
      {
        field: "periodId",
        value: this.model.periodId,
      },
      {
        field: "kpiTargetId",
        value: this.model.kpiTargetId,
      },
      {
        field: "typeId",
        value: this.model.typeId,
      },
    ];

    this._coreService.execute(this.state, "KpiEmployee/GetAll", extraParams);
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any = [
      {
        field: "orgId",
        value: this.model.orgId,
      },
      {
        field: "periodId",
        value: this.model.periodId,
      },
      {
        field: "kpiTargetId",
        value: this.model.kpiTargetId,
      },
    ];
    this._coreService.execute(this.state, "KpiEmployee/GetAll", extraParams);
  }
  inputFile(file: FileList | null) {
    setTimeout(() => {
      if (file!.length > 0) {
        let data = new FormData();
        data.append("periodId", this.model.periodId!.toString());
        data.append("orgId", this.model.orgId!.toString());
        data.append("file", file![0]);
        this.modalService.loading.next(true);
        this._coreService
          .Upload("KpiEmployee/ImportFromTemplate", data)
          .subscribe(
            (res: any) => {
              if (res.statusCode == 400) {
                if (res.message.indexOf("NOT_FOUND_TABLE") > -1) {
                  this.notification.warning(
                    "Excel không có bảng: " + res.message.split(":")[1]
                  );
                } else {
                  this.notification.warning("Import không thành công!");
                }
              } else {
                this.notification.success("Import thành công");
                this.getListData();
              }
              this.modalService.loading.next(false);
              let x: any = document.getElementById("file");
              x.value = null;
            },
            (err) => {
              this.notification.success("Import không thành công");
              this.modalService.loading.next(false);
            }
          );
      }
    }, 200);
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.IMPORT:
        document.getElementById("file")!.click();
        break;
      case ToolbarItem.PAYROLL_CAL:
        if (!this.model.isLock) {
          this.notification.warning("Bảng lương KPI đã bị khóa");
          return;
        }
        this.modalService.loading.next(true);
        this._coreService
          .Post("kpiEmployee/CaclKpiSalary", this.model)
          .subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.error);
            } else {
              this.notification.success("Tính lương KPI thành công");
              this.getListData();
            }
            this.modalService.loading.next(false);
          });
        break;
      case ToolbarItem.EXPORT_TEMPLATE:
        this._coreService
          .Download("KpiEmployee/ExportTemplate", this.model)
          .subscribe((response: HttpResponse<Blob>) => {
            let filename: string = "Template.xlsx";
            let binaryData = [];
            binaryData.push(response.body);
            if (binaryData.length > 0) {
              let downloadLink = document.createElement("a");
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData as BlobPart[], { type: "blob" })
              );
              downloadLink.setAttribute("download", filename);
              document.body.appendChild(downloadLink);
              downloadLink.click();
            }
          });

        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;

          this._coreService
            .Post(
              "kpiEmployee/Delete",
              this.modelDelete.map((i: any) => i.id)
            )
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.error);
              } else {
                this.notification.deleteSuccess();
                this.gridInstance.refresh();
              }
            });
        } else {
          this.notification.noRecordSelect();
        }
        break;
      case ToolbarItem.LOCK:
        if (this.model.periodId && this.model.orgId) {
          this._coreService
            .Get(
              "KpiEmployee/LockKPI?ORG_ID=" +
              this.model.orgId +
              "&PERIOD_ID=" +
              this.model.periodId
            )
            .subscribe((res: any) => {
              if (res.data.IS_BLOCK == 0) {
                this.notification.success("khóa thành công");
              } else {
                this.notification.success("Mở khóa thành công");
              }
              this.model.isLock = !this.model.isLock;
            });
        } else {
          this.notification.warning("Chưa chọn phòng ban");
        }

        break;
      default:
        break;
    }
  };
  // update islock moi khi khoa mo bang cong doi phong ban
  checkLockKPI() {
    this._coreService
      .Get(
        "KpiEmployee/CheckKPILock?ORG_ID=" +
        this.model.orgId +
        "&PERIOD_ID=" +
        this.model.periodId
      )
      .subscribe((res: any) => {
        this.model.isLock = !res.data;
      });
  }
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
