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
  VirtualScrollService, ExcelExportProperties
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
import { Query } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";

import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { HttpResponse } from "@angular/common/http";

const _ = require("lodash");
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Splitter, SplitterComponent } from "@syncfusion/ej2-angular-layouts";
setCulture("en");

@Component({
  selector: "cms-payroll-advance",
  templateUrl: "./advance.component.html",
  styleUrls: ["./advance.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class AdvanceComponent implements OnInit, OnDestroy {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD,
    ToolbarItem.EDIT,
    ToolbarItem.PRINT,
    ToolbarItem.EXPORT_EXCEL,
    ToolbarItem.DELETE,

  ]);
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  model = new CalculatePayroll();
  dataImport: any[] = [];
  lstYear = [];
  lstPeriodId: any;
  editForm!: FormGroup;
  @ViewChild("splitterInstance", { static: false })
  splitterObj!: SplitterComponent;

  public onCreated() {
    let splitterObj1 = new Splitter({
      height: "100%",
      paneSettings: [
        { size: "94%", min: "20%" },
        { size: "6%", min: "6%" },
      ],
      orientation: "Vertical",
    });
    splitterObj1.appendTo("#vertical_splitter");
  }
  public fields: FieldSettingsModel = { text: "name", value: "id" };
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public flagStatusEmp: any;
  public modelDelete: Array<any> = [];
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
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
    this.data = _coreService;
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

    // Build toolbar
    this.buildToolbar();
    this.getListYear();
    // Load List Data
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id;
        this.getListData();
      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);

    this.editForm = this._formBuilder.group({
      yearId: ["", [Validators.required]],
      periodId: ["", [Validators.required]],
    });
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/cms/payroll/business/advance/", paramAdd]);
  };

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [
      ToolbarItem.ADD,
      ToolbarItem.EDIT,
      ToolbarItem.PRINT,
    ];
    this.toolbar = this.globals.buildToolbar("advance", toolbarList!);
  };
  // filter checkbox

  // GetListData
  getListData = (): void => {
    
    var extraParams: any = [];
    if (this.nodeSelected) {
      extraParams.push(
        {
          field: "orgId",
          value: this.nodeSelected,
        },
        {
          field: "periodId",
          value: this.model.periodId,
        }
      );
    }
    this._coreService.execute(this.state, "advance/GetAll", extraParams);
  };
  GetEmp = (e: any) => {
    this.flagStatusEmp = e.checked;
    this.getListData();
  };
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push(
        {
          field: "orgId",
          value: this.nodeSelected,
        },
        {
          field: "periodId",
          value: this.model.periodId,
        }
      );
    }
    this._coreService.execute(this.state, "advance/GetAll", extraParams);
  }
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };

  getListYear() {
    this._coreService.Get("hr/SalaryPeriod/GetYear").subscribe((res: any) => {
      this.lstYear = res.data;
      this.model.yearId = res.data[0].id;
      this.getListShiftPeriod(res.data[0].id);
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
        this.getListData();
      });
    }
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        localStorage.removeItem("modelTemp1");
        this.router.navigate(["/cms/payroll/business/advance/new"]);
        break;
      case ToolbarItem.EXPORT_EXCEL:
        var extraParams1: any = [];
        if (this.nodeSelected) {
          extraParams1.push(
            {
              field: "orgId",
              value: this.nodeSelected,
            },
            {
              field: "periodId",
              value: this.model.periodId,
            }
          );
        }
        var data = this._coreService.ExecuteToExport('advance/GetAll', extraParams1).subscribe((res: any) => {
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
            fileName: "tamungluong" + "-" + formattedDate + ".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
          if (this.modelAdd.statusId == 2) {
            this.notification.warning("notify.APPROVED");
            return;
          }
          const objParamAdd = { id: this.modelAdd.id, type: "edit" };
          const paramAdd = window.btoa(JSON.stringify(objParamAdd));
          this.router.navigate(["/cms/payroll/business/advance/", paramAdd]);
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.PRINT:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes.map((i: any) => i.id);

          this._coreService
            .Get("hr/FormList/PrintForm?typeId=1&id=" + ids[0])
            .subscribe((res: any) => {
              //check error
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.message);
              } else {
                let data = res.data.FORM;
                let popupWin = window.open(
                  "",
                  "_blank",
                  "top=0,left=0,height='100%',width=auto"
                );

                popupWin!.document.write(data);
                popupWin!.document.close();
                popupWin!.print();
                popupWin!.onafterprint = function () {
                  popupWin!.close();
                };
              }
            });
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }

        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          let checkHieuLuc = false;
          for (let i = 0; i < this.modelDelete.length; i++) {
            if (this.modelDelete[i].statusId == 2) {
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

        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes.map((i: any) => i.id);
          this._coreService
            .Post("hr/contractinfor/ChangeStatus", ids)
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
      case ToolbarItem.EXPORT_TEMPLATE:
        let extraParams = [
          {
            orgId: this.nodeSelected,
            periodId: this.model.periodId,
          },
        ];

        this._coreService
          .Download("Advance/TemplateImport", extraParams[0])
          .subscribe((response: HttpResponse<Blob>) => {
            let filename: string = "TempAdvance.xlsx";
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
      case ToolbarItem.IMPORT:
        document.getElementById("file")!.click();
        break;
      default:
        break;
    }
  };

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      let lstDeleteIds = _.map(this.modelDelete, "id");
      if (lstDeleteIds.length > 0) {
        this._coreService
          .Post("hr/Advance/delete", lstDeleteIds)
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

  inputFile = async (e: any) => {
    var files = e.target.files;
    var file = files[0];
    var data = await this._coreService.readExcel(file);
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
        if (this.dataImport.length > 0 && this.dataImport.length < 10000) {
          let param = [
            {
              data: this.dataImport,
              orgId: this.nodeSelected,
              periodId: this.model.periodId,
              year: this.model.yearId,
            },
          ];
          this.modalService.loading.next(true);
          this._coreService
            .Download("Advance/ImportTemplate", param[0])
            .subscribe((response: HttpResponse<Blob>) => {

              this.modalService.loading.next(false);
              this.modalService.close("confirm-import-modal");
              if (response.status == 204) {
                this.notification.error(
                  "Import không thành công! bạn vui lòng kiểm tra lại!"
                );
              } else {
                if (response.body!.type == "application/json") {
                  this.notification.success("Import thành công");
                  this.gridInstance.clearSelection();
                  this.gridInstance.refresh();
                } else {
                  let binaryData = [];
                  binaryData.push(response.body);
                  if (binaryData.length > 0) {
                    let filename: string = "TempAdvanceError.xlsx";
                    let downloadLink = document.createElement("a");
                    downloadLink.href = window.URL.createObjectURL(
                      new Blob(binaryData as BlobPart[], { type: "blob" })
                    );
                    downloadLink.setAttribute("download", filename);
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    this.notification.warning(
                      "Import không thành công! bạn vui lòng kiểm tra lại file TempAdvanceError.xlsx!"
                    );
                  }
                }
              }
            });
        }
      } else {
        this.modalService.close("confirm-import-modal");
      }
    }
  };
}
