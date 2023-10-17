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
  ColumnModel,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  CalculatePayroll,
} from "src/app/_models/index";
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
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { setCurrencyCode } from "@syncfusion/ej2-base";
const $ = require("jquery");
import { takeUntil } from "rxjs/operators";
setCulture("en");
setCurrencyCode("TRY");
@Component({
  selector: "cms-profile-calculatepayroll",
  templateUrl: "./calculatepayroll.component.html",
  styleUrls: ["./calculatepayroll.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class CalculatePayrollComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.PAYROLL_CAL,
    ToolbarItem.EXPORT_EXCEL,
    ToolbarItem.PRINT,
    ToolbarItem.LOCK
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  // @ViewChild("filterMenu", { static: false })
  // public filterMenu!: ListBoxComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };
  selectionOptions = {
    cellSelectionMode: "Box",
    type: "Multiple",
  };
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  aggregates!: Object[];
  // query auto complete
  public query = new Query();
  public groupSettings: GroupSettingsModel = {
    showDropArea: false,
    columns: ["orgName"],
    captionTemplate: '<span style="color:black">${key}</span>',
  };
  model = new CalculatePayroll();

  lstYear = [];
  lstColumn: ColumnModel[] = [
    {
      field: "EMPLOYEE_CODE",
      headerText: "Mã nhân viên",
      allowFiltering: true,
      allowSorting: false,
      allowEditing: false,
      width: "130px",
      textAlign: "Left",
      headerTextAlign: "Center",
      isFrozen: false,
    },
    {
      field: "EMPLOYEE_NAME",
      headerText: "Tên nhân viên",
      allowFiltering: true,
      allowSorting: false,
      allowEditing: false,
      width: "200px",
      textAlign: "Left",
      headerTextAlign: "Left",
      isFrozen: false,
    },
    {
      field: "ORG_NAME",
      headerText: "Phòng ban",
      allowFiltering: true,
      allowSorting: false,
      allowEditing: false,
      width: "200px",
      textAlign: "Left",
      headerTextAlign: "Left",
      //isFrozen: true,
    },
    {
      field: "POSITION_NAME",
      headerText: "Chức danh",
      allowFiltering: true,
      allowSorting: false,
      allowEditing: false,
      textAlign: "Left",
      headerTextAlign: "Left",
      width: "200px",
      //isFrozen: true,
    },
  ];
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
      salaryTypeId: [""],
      isQuit: [""],
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
        this.model.orgId = model.id;
        this.search();
        this.checkLockPayroll();

      });
    Promise.all([
      this.getListYear(),
      this.getSalaryType()
    ]).then((res: any) => {
      this.model.periodId = this.lstPeriodId[0].id;
      setTimeout(() => {
        this._coreService.organizationSelect.next(true);
      }, 200);
    });
    this.model.isQuit = 1;
    // this.aggregates = [{
    //   columns: [{
    //     type: 'Sum',
    //     field: 'SAL_FINAL',
    //     format: 'C2',
    //     footerTemplate: 'Sum: ${Sum}'
    //   }]
    // }];
  }
  changeYear(e: any) {
    if (e.isInteracted) {
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriodId = res;
      });
    }
  }
  changePeriod(e: any) {
    if (e.isInteracted) {
      this.model.periodId = e.itemData.periodId;
      setTimeout(() => {
        this.search();
        this.checkLockPayroll();
      });
    }
  }

  getListYear() {
    this._coreService
      .Get("hr/SalaryPeriod/GetYear")
      .subscribe((res: any) => {
        this.lstYear = res.data;
        this.model.yearId = res.data[0].id;
        this.getListShiftPeriod(res.data[0].id)
      });
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

  getListColumn() {
    return new Promise((resolve) => {
      this._coreService
        .Get(
          "payroll/structure/getlist?SalaryTypeId=" + this.model.salaryTypeId
        )
        .subscribe((res: any) => {
          let columns: ColumnModel[] = _.cloneDeep(this.lstColumn);
          // add clomun vao list column
          //this.aggregates = [];
          res.data.forEach((item: any) => {


            // this.aggregates.push({
            //   columns: [{
            //     type: 'Sum',
            //     field: 'SAL_FINAL',
            //     format: 'C2',
            //     footerTemplate: 'Sum: ${Sum}'
            //   }]
            // });

            columns.push({
              field: item.code,
              headerText: item.name,
              allowFiltering: true,
              allowSorting: false,
              allowEditing: false,
              width: "150px",
              textAlign: "Center",
              type: "number",
              // format: item.code.indexOf("WORKING") > -1 ? "N1" : "N0",
              format: "N2",
            });
          });
          //
          this.gridInstance.columns = columns;

          setTimeout(() => {
            this.gridInstance.refreshColumns();
            resolve(true);
          }, 500);
        });
    });
  }

  getSalaryType() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Salarytype/getlist").subscribe(async (res: any) => {
        this.lstSalaryType = res.data;
        this.model.salaryTypeId = this.lstSalaryType[0].id;
        await this.getListColumn();
        resolve(false);
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
    if (this.model.orgId && this.model.periodId && this.model.salaryTypeId) {
      this.getListData();
    }
  }

  changeSalaryTypeId(e: any) {
    if (e.e) {
      this.model.salaryTypeId = e.itemData.id;
      this.getListColumn().then((res: any) => {
        this.search();
        this.checkLockPayroll();
      });
    }
  }
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
        field: "salaryTypeId",
        value: this.model.salaryTypeId,
      },
      // {
      //   field: "IS_QUIT",
      //   value: 1,
      // },

    ];

    this._coreService.execute(
      this.state,
      "payroll/formula/ListPayrollSum",
      extraParams
    );
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
        field: "salaryTypeId",
        value: this.model.salaryTypeId,
      },

    ];
    this._coreService.execute(
      state,
      "payroll/formula/ListPayrollSum",
      extraParams
    );
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.PAYROLL_CAL:
        if (!this.model.isLock) {
          this.notification.warning("Bảng lương đã bị khóa");
          return;
        }
        if (!this.model.yearId) {
          this.notification.warning("Chưa chọn năm");
          return;
        }
        if (!this.model.periodId) {
          this.notification.warning("Chưa chọn kỳ lương");
          return;
        }
        this.modalService.loading.next(true);
        this._coreService
          .Post("payroll/formula/PayrollCal", this.model)
          .subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.error);
            } else {
              this.notification.success("Tính lương thành công");
              this.getListData();
            }
            this.modalService.loading.next(false);
          });
        break;
      case ToolbarItem.EXPORT_EXCEL:
        const state = { skip: 0, take: 1000 };
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
            field: "salaryTypeId",
            value: this.model.salaryTypeId,
          },
        ];
        this._coreService
          .GetAll(state, "payroll/formula/ListPayrollSum", extraParams)
          .subscribe((res: any) => {
            let header = new Object();
            this.gridInstance.columns.forEach((element: any) => {
              (header as any)[element.field] = element.headerText;
            });
            this._coreService.exportExcel(res.result, "salary_table", header);
          });
        break;
      case ToolbarItem.PRINT:
        this._coreService
          .Post("hr/FormList/PrintFormSalary", this.model)
          .subscribe((res: any) => {
            if (res.data && res.data[0] && res.data[1] && res.data[1][0]) {
              let data = res.data[0];
              let form = res.data[1][0]["TEXT"];
              var div = document.createElement("div");
              div.innerHTML = form;
              let listTr = div.querySelectorAll("tr");
              let name = Object.getOwnPropertyNames(data[0]);
              let trs: any[] = [];
              listTr.forEach((element: any) => {
                let a = $(element).html();
                let key = false;
                for (let i = 0; i < name.length; i++) {
                  if (a.indexOf(name[i]) > -1) {
                    key = true;
                    break;
                  }
                }
                if (key) trs.push(element);
              });
              trs.forEach((tr) => {
                let tbody = $(tr).parent();
                let td = $(tr).html();
                data.forEach((item: any) => {
                  let s = td;
                  for (let i = 0; i < name.length; i++) {
                    while (s.indexOf(name[i]) > -1) {
                      s = s.replace(name[i], item[name[i]]);
                    }
                  }
                  let newTr = tr.cloneNode();
                  $(newTr).html(s);
                  tbody.append(newTr);
                });
                tr.remove();
              });

              //print
              print($(div).html());
              function print(text: any) {
                let popupWin = window.open(
                  "",
                  "_blank",
                  "top=0,left=0,height='100%',width=auto"
                );

                popupWin!.document.write(text);
                popupWin!.document.close();
                popupWin!.print();
                popupWin!.onafterprint = function () {
                  popupWin!.close();
                };
              }
            }
          });

        break;
      case ToolbarItem.LOCK:
        if (this.model.periodId && this.model.orgId) {
          this._coreService
            .Get(
              "payroll/LockPayroll?ORG_ID=" +
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
  checkLockPayroll() {
    this._coreService
      .Get(
        "payroll/CheckPayrollLock?ORG_ID=" +
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
