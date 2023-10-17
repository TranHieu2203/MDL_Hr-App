import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
} from "@angular/core";
import { Subject, BehaviorSubject, Observable } from "rxjs";
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
  ColumnModel,
  ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface, CalculatePayroll } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import { HttpResponse } from "@angular/common/http";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";

ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import { takeUntil } from "rxjs/operators";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Consts } from "src/app/common/const";
import { debug } from "console";

const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-importpayroll",
  templateUrl: "./importpayroll.component.html",
  styleUrls: ["./importpayroll.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ImportPayrollComponent implements OnInit, OnDestroy {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.DELETE,
    ToolbarItem.EXPORT_EXCEL
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  localData: any = [];

  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  model = new CalculatePayroll();
  lstMonthId = [];
  lstYear = [];
  lstPeriodId: any;
  lstSalaryType: any;
  dataImport: any[] = [];
  public flagStatusEmp: any;
  public modelDelete: Array<any> = [];
  filesImport!: any;
  lstColumn: ColumnModel[] = [
    {
      allowFiltering: false,
      allowSorting: false,
      allowEditing: false,
      width: "50px",
      textAlign: "Left",
      headerTextAlign: "Center",

      type: "checkbox"
    },
    {
      field: "ID",
      width: "130px",
      textAlign: "Left",
      headerTextAlign: "Center",
      visible: false
    },
    {
      field: "EMPLOYEE_CODE",
      headerText: "Mã nhân viên",
      allowFiltering: true,
      allowSorting: false,
      allowEditing: false,
      width: "130px",
      textAlign: "Left",
      headerTextAlign: "Center",

    },
    {
      field: "FULLNAME",
      headerText: "Tên nhân viên",
      allowFiltering: true,
      allowSorting: false,
      allowEditing: false,
      width: "250px",
      textAlign: "Left",
      headerTextAlign: "Left",

    },
    {
      field: "ONAME",
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
      field: "PNAME",
      headerText: "Chức danh",
      allowFiltering: true,
      allowSorting: false,
      allowEditing: false,
      textAlign: "Left",
      headerTextAlign: "Left",
      width: "200px"
      //isFrozen: true,
    },
  ];
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  editForm!: FormGroup;
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
    private _formBuilder: FormBuilder,
    private _tlaTranslationLoaderService: TranslationLoaderService
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

    // Load List Data

    this.model.isQuit = 1;

    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.model.orgId = model.id;
        this.search();
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

  }


  getListDataCombo() {

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
      });
    }
  }


  getSalaryType() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Salarytype/getlist").subscribe(async (res: any) => {
        this.lstSalaryType = res.data;
        this.model.salaryTypeId = this.lstSalaryType[0].id;
        // this.getSalaryPorperty(this.model.salaryTypeId).then((res: any) => {
        //   this.localData = res;
        // });
        await this.getListColumn();
        resolve(false);
      });
    });
  }


  getListShiftPeriod(id: any) {
    return new Promise((resolve, reject) => {
      this._coreService
        .Get("hr/SalaryPeriod/getlist?Id=" + id)
        .subscribe((res: any) => {

          if (Number(res.statusCode) === 200) {
            this.lstPeriodId = res.data;
            this.model.periodId = res.data[0].id;
            resolve(res.data);
          } else {
            reject("Error")
          }
        });
    });
  }

  changeSalaryTypeId(e: any) {
    if (e.e) {
      this.model.salaryTypeId = e.itemData.id;
      this.getListColumn().then((res: any) => {
        this.search();
      });
    }
  }
  search() {
    if (this.model.orgId && this.model.periodId && this.model.salaryTypeId) {
      this.getListData();
    }
  }
  // GetListData
  getListData = (): void => {
    
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
      }
    ];
    this._coreService.execute(
      this.state,
      "hr/salimport/GetAll",
      extraParams
    );
  };

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
      this.state,
      "hr/salimport/GetAll",
      extraParams
    );
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
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.EXPORT_TEMPLATE:
        let paramExport = {
          orgId: this.model.orgId,
          periodId: this.model.periodId,
          SalTypeId: this.model.salaryTypeId
        }
        this._coreService
          .templateImportV2Hrm("TemplateImportSalary", paramExport)
          .subscribe((res: any) => {

            if (res.statusCode == 200) {
              var host = (this.globals.apiUrlReport + res.data).replace("api/", "")
              window.open(host, "_blank")
            }
          });

        break;
      case ToolbarItem.IMPORT:
        document.getElementById("file")!.click();
        break;
      case ToolbarItem.EXPORT_EXCEL:
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
        var data = this._coreService.ExecuteToExport('hr/salimport/GetAll', extraParams, this.state).subscribe((res: any) => {
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
            fileName: "importluong" + "-" + formattedDate + ".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      default:
        break;
    }
  };

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      let lstDeleteIds = _.map(this.modelDelete, "ID");
      if (lstDeleteIds.length > 0) {
        let param = {
          ids: lstDeleteIds,
          periodId: this.model.periodId,
          salaryTypeId: this.model.salaryTypeId
        }
        this._coreService
          .Post("hr/salimport/Delete", param)
          .subscribe((success: any) => {
            if (success.statusCode == "200") {
              this.notification.deleteSuccess();
              this.modalService.close("confirm-delete-modal");
              this.gridInstance.clearSelection();
              this.gridInstance.refresh();
            }
            else {
              this.notification.deleteError();
              this.modalService.close("confirm-delete-modal");
            }
          });
      }
    }
  };
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next(true);
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

  getListColumn() {
    return new Promise((resolve) => {
      this._coreService
        .Get(
          "payroll/structure/GetListImport?SalaryTypeId=" + this.model.salaryTypeId
        )
        .subscribe((res: any) => {

          let columns: ColumnModel[] = _.cloneDeep(this.lstColumn);
          res.data?.forEach((item: any) => {
            columns.push({
              field: item.code,
              headerText: item.name,
              type: "number",
              headerTextAlign: "Center",
              allowFiltering: true,
              allowSorting: false,
              allowEditing: false,
              width: "150px",
              format: 'N',
              textAlign: 'Right'
            });
          });
          //

          this.gridInstance.columns = columns;
          // setTimeout(() => {
          this.gridInstance.refreshColumns();
          resolve(true);
          // }, 300);
        });
    });
  }
  inputFile = async (e: any) => {
    var files = e.target.files;
    this.filesImport = files[0];
    // var data = await this._coreService.readExcel(file);
    // data.periodId = this.model.periodId;
    // this.dataImport = data;
    let x: any = document.getElementById("file");
    x.value = null;
    this.modalService.open("confirm-import-modal");
  };
  confirmImport = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-import-modal");
    } else {

      let data = new FormData();
      data.append("files", this.filesImport);
      var period_id = this.model.periodId?.toString();
      data.append("type_sal", JSON.stringify(this.model.salaryTypeId));
      data.append("period_id", JSON.stringify(this.model.periodId));
      this._coreService.importTemplateV2Hrm(Consts.importpayroll, "import-payroll", data).subscribe((res: any) => {

        if (res.statusCode == 200) {
          this.notification.success("Import dữ liệu thành công")
          this.modalService.close("confirm-import-modal");
          this.getListData();
          return;
        } else {
          if (res.message == "IMPORT_ERROR") {
            this.notification.error("Import dữ liệu lỗi")
            this.modalService.close("confirm-import-modal");
            return;

          }
          if (res.message == "VALIDATE_ERROR") {
            this.notification.warning("File excel có lỗi, kiểm tra file trả về")
            var host = (this.globals.apiUrlReport + res.data).replace("api/", "")
            window.open(host, "_blank")
            this.modalService.close("confirm-import-modal");
            return;
          }
        }
      });
      return;


      if (this.dataImport) {
        if (this.dataImport.length > 0 && this.dataImport.length < 10000) {
          let param = [{
            data: this.dataImport,
            periodId: this.model.periodId,
            orgId: this.model.orgId,
            salTypeId: this.model.salaryTypeId
          }]
          this.modalService.loading.next(true);
          this._coreService
            .Post("hr/salimport/ImportTemplate", param[0])
            .subscribe((res: any) => {
              //check error
              if (res.statusCode == 400) {
                this.notification.warning("Sai mã :" + res.message);
              } else {
                this.notification.success("Import thành công");
                this.gridInstance.clearSelection();
                this.gridInstance.refresh();
                this.modalService.close("confirm-import-modal");
              }
              this.modalService.loading.next(false);
            });
        }
      }
      else {
        this.modalService.close("confirm-import-modal");
      }

    }
  };
}
