import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
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
  ColumnModel,
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
const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-importmachines",
  templateUrl: "./importmachines.component.html",
  styleUrls: ["./importmachines.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ImportMachinesComponent implements OnInit, OnDestroy {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.EXPORT_TEMPLATE,
    ToolbarItem.IMPORT,
    ToolbarItem.EXPORT_EXCEL,
    ToolbarItem.DELETE
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
  lstColumn: ColumnModel[] = [

    {
      field: "EMP_CODE",
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
      field: "FULLNAME",
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
      width: "200px",
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
      if (this.lstPeriodId) this.model.periodId = this.lstPeriodId[0].id;
      setTimeout(() => {
        this._coreService.organizationSelect.next(true);
      }, 200);
    });
    this.model.isQuit = 1;
    this.getListData();
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
        //await this.getListColumn();
        resolve(false);
      });
    });
  }


  getListShiftPeriod(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/SalaryPeriod/getlist?Id=" + id)
        .subscribe((res: any) => {
          this.lstPeriodId = res.data;
          this.model.periodId = res.data[0].id;
          resolve(res.data);
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
    if (this.model.orgId && this.model.periodId) {
      this.getListData();
    }
  }
  // GetListData
  getListData = (): void => {
    
    let extraParams: any = [
      {
        field: "org_Id",
        value: this.model.orgId,
      },
      {
        field: "period_Id",
        value: this.model.periodId,
      },

    ];


    this._coreService.execute(
      this.state,
      "payroll/machinesimport/GetAll",
      extraParams
    );
  };

  // GetEmp = (e: any) => {
  //   this.flagStatusEmp = e.checked;
  //   this.getListData();
  // }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any = [
      {
        field: "org_Id",
        value: this.model.orgId,
      },
      {
        field: "period_Id",
        value: this.model.periodId,
      },
      {
        field: "salaryTypeId",
        value: this.model.salaryTypeId,
      },

    ];
    this._coreService.execute(
      state,
      "payroll/machinesimport/GetAll",
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
          .Download("payroll/machinesimport/ExportTemplate", paramExport)
          .subscribe((response: HttpResponse<Blob>) => {
            let filename: string = "TempImpSal.xlsx";
            let binaryData = [];
            binaryData.push(response.body);
            if (binaryData.length > 0) {
              let downloadLink = document.createElement("a");
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData as BlobPart[], { type: "blob" }));
              downloadLink.setAttribute("download", filename);
              document.body.appendChild(downloadLink);
              downloadLink.click();
            }
          });
        break;
      case ToolbarItem.IMPORT:
        document.getElementById("file")!.click();
        break;
      case ToolbarItem.EXPORT_EXCEL:
        this.gridInstance.excelExport();
        break;
      default:
        break;
    }
  };

  confirmDelete = (status: any): void => {
    if (status === "ok") {
      let ids = this.modelDelete.map((i: any) => i.id);
      let paramExport = {
        orgId: this.model.orgId,
        periodId: this.model.periodId,
        Ids: ids
      }

      this._coreService.Post("payroll/machinesimport/Delete", paramExport).subscribe((res: any) => {
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.deleteSuccess();
          this.getListData();
        }
      });
    }
    this.modalService.close("confirm-delete-modal");
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
          // add clomun vao list column
          res.data.forEach((item: any) => {
            columns.push({
              field: item.code,
              headerText: item.name,
              headerTextAlign: "Center",
              allowFiltering: true,
              allowSorting: false,
              allowEditing: false,
              width: "150px",
              textAlign: "Center",
              type: "number",
              format: item.code.indexOf("WORKING") > -1 ? "N1" : "N0",
            });
          });
          //
          this.gridInstance.columns = columns;
          setTimeout(() => {
            this.gridInstance.refreshColumns();
            resolve(true);
          }, 300);
        });
    });
  }
  inputFile = async (e: any) => {
    var files = e.target.files;
    var file = files[0];
    var data = await this._coreService.readExcel(file);
    data.periodId = this.model.periodId;
    this.dataImport = data;
    let x: any = document.getElementById("file");
    x.value = null;
    this.modalService.open("confirm-import-modal");
  };
  confirmImport = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-import-modal");
    } else {
      if (this.dataImport) {
        var data2 = [];
        data2 = this.dataImport.splice(0, 1)
        data2 = this.dataImport
        if (data2.length > 0 && data2.length < 10000) {
          let param = [{
            data: data2,
            period_Id: this.model.periodId,
            org_Id: this.model.orgId,
          }]
          this.modalService.loading.next(true);
          this._coreService
            .Post("payroll/machinesimport/ImportTemplate", param[0])
            .subscribe((res: any) => {
              this.modalService.loading.next(false);
              //check error
              if (res.statusCode == 400) {
                this.notification.warning("Sai mã :" + res.message);
              } else {
                this.notification.success("Import thành công");
              }
            });
        }
      }
      this.modalService.close("confirm-import-modal");
    }
  };
}
