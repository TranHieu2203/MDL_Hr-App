import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  OnDestroy,
} from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
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
  RowSelectEventArgs,
  ExcelExportProperties
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
import { IpServiceService } from "src/app/_services/ip-service.service";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { takeUntil } from "rxjs/operators";
import { Splitter, SplitterComponent } from "@syncfusion/ej2-angular-layouts";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CheckpointSum } from "src/app/_models/app/cms";
import * as moment from "moment";
setCulture("en");
const $ = require("jquery");
@Component({
  selector: "cms-capacity-checkpointsum",
  templateUrl: "./checkpointsum.component.html",
  styleUrls: ["./checkpointsum.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class CheckpointSumComponent implements OnInit, OnDestroy {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.PRINT,
    ToolbarItem.EXPORT_EXCEL,
    ToolbarItem.CREATECOMPENTENCY,
    ToolbarItem.SEND,
    ToolbarItem.SUM_WORK,
    ToolbarItem.DELETE,
    ToolbarItem.EXPORT_BC

  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  searchFrom!: FormGroup;
  model!: CheckpointSum;
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild('splitterInstance', { static: false })
  splitterObj!: SplitterComponent;

  public onCreated() {
    let splitterObj1 = new Splitter({
      height: '100%',
      paneSettings: [
        { size: '94%', min: '20%' },
        { size: '6%', min: '6%' }
      ],
      orientation: 'Vertical'
    });
    splitterObj1.appendTo('#vertical_splitter');
  }
  public fields: FieldSettingsModel = { text: "name", value: "id" };

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
  dataImport: any[] = [];
  lstPeriodId: any;
  isDisso: any;


  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  disable: any;
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
    private _formBuilder: FormBuilder,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private ip: IpServiceService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    this.searchFrom = this._formBuilder.group({
      year: ["", [Validators.required]],
      periodId: ["", [Validators.required]]
    });
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.model = new CheckpointSum();
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
        this.nodeSelected = model.id;
        this.getListData();
      });
    this._coreService.isDisso
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((checked: any) => {

        this.isDisso = checked;
        this.getListData();

      });
    //this.model.fromDate = (moment(new Date()).format("DD/MM/YYYY"));
    //this.model.toDate = (moment(new Date()).format("DD/MM/YYYY"));
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
    this.model.year = new Date().getFullYear();
    this.changeYear();
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/capacity/business/checkpointsum/", paramAdd]);
  };

  // GetListData
  getListData = (): void => {

    var extraParams: any = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    if (this.flagStatusEmp) {
      extraParams.push({
        field: "WorkStatusId",
        value: this.nodeSelected,
      });
    }
    if (this.isDisso != undefined) {
      extraParams.push({
        field: "IsDissolve",
        value: this.isDisso,
      });
    }
    if (this.model.year != null) {
      extraParams.push({
        field: "year",
        value: moment(this.model.year)
      })
    }
    if (this.model.periodId != null) {
      extraParams.push({
        field: "periodId",
        value: moment(this.model.periodId)
      })
    }
    this._coreService.execute(this.state, "hr/checkpointsum/GetAll", extraParams);
  };
  GetEmp = (e: any) => {
    this.flagStatusEmp = e.checked;
    this.getListData();
  }
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
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    if (this.flagStatusEmp) {
      extraParams.push({
        field: "WorkStatusId",
        value: this.nodeSelected,
      });
    }
    if (this.isDisso != undefined) {
      extraParams.push({
        field: "IsDissolve",
        value: this.isDisso,
      });
    }
    if (this.model.year) {
      extraParams.push({
        field: "year",
        value: this.model.year,
      })
    }
    if (this.model.periodId) {
      extraParams.push({
        field: "periodId",
        value: this.model.periodId,
      })
    }
    this._coreService.execute(this.state, "hr/checkpointsum/GetAll", extraParams);
  }
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
  //   rowSelected(args: RowSelectEventArgs) {
  //     const selectedrowindex: number[] = (this.gridInstance as any).getSelectedRowIndexes();  
  //     const selectedrecords: any[] = (this.gridInstance as any).getSelectedRecords();  
  //     if(selectedrecords.length==0){
  //       this.toolItems$.next([ ToolbarItem.CREATECOMPENTENCY,
  //         ToolbarItem.EXPORT_EXCEL]);
  //     }
  //     if(selectedrecords.length==1){
  //        if(selectedrecords[0].statusId==1){
  //         this.toolItems$.next([ToolbarItem.CREATECOMPENTENCY,
  //           ToolbarItem.SENDCOMPENTENCY, 
  //           ToolbarItem.DELETE,  
  //           ToolbarItem.EXPORT_EXCEL
  //           ]);
  //        }else{
  //         this.toolItems$.next([ToolbarItem.CREATECOMPENTENCY,
  //           ToolbarItem.EXPORT_EXCEL
  //           ]);
  //        }
  //     }
  //     if(selectedrecords.length>1){
  //       this.toolItems$.next([
  //         ToolbarItem.CREATECOMPENTENCY,  
  //         ToolbarItem.DELETE,  
  //         ToolbarItem.EXPORT_EXCEL
  //         ]);
  //     }

  // }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.CREATECOMPENTENCY:
        let param = this.model;

        if (!this.nodeSelected) {
          this.notification.warning("Chọn phòng ban");
          break;
        }
        param.orgId = this.nodeSelected;
        if (this.model.periodId != null) {
          this._coreService
            .Post("hr/checkpointsum/Create", param)
            .subscribe((res: any) => {
              if (res.statusCode == 200) {
                this.notification.addSuccess();
                this.getListData();
              }
              else {
                this.notification.addError();
              }


            });

        }
        else {
          this.notification.warning("Kỳ đánh giá không được để trống");
        }
        break;
      case ToolbarItem.SEND:
        let param1 = this.model;

        if (!this.nodeSelected) {
          this.notification.warning("Chọn phòng ban");
          break;
        }
        param1.orgId = this.nodeSelected;
        if (this.model.periodId != null) {
          this._coreService
            .Post("hr/checkpointsum/SendPerform", param1)
            .subscribe((res: any) => {
              if (res.statusCode == 200) {
                this.notification.editSuccess();
                this.getListData();
              }
              else {
                this.notification.editError();
              }


            });

        }
        else {
          this.notification.warning("Kỳ đánh giá không được để trống");
        }
        break;
      case ToolbarItem.SUM_WORK:
        let param2 = this.model;

        if (!this.nodeSelected) {
          this.notification.warning("Chọn phòng ban");
          break;
        }
        param2.orgId = this.nodeSelected;

        if (this.model.periodId != null) {
          this._coreService
            .Post("hr/checkpointsum/Calculate", param2)
            .subscribe((res: any) => {

              if (res.statusCode == 200) {
                this.notification.success("Tác vụ thành công");
                this.getListData();
              }
              else {
                this.notification.warning("Lỗi");
              }

            });
          //this.getListData();
        }
        else {
          this.notification.warning("Kỳ đánh giá không được để trống");
        }
        break;
      case ToolbarItem.PRINT:

        if (selectDeletes && selectDeletes.length > 0) {
          if (selectDeletes && selectDeletes.length > 1) {
            this.notification.warning("notify.NO_MULTI_RECORD_SELECT");
          } else {
            let ids = JSON.stringify(selectDeletes.map((i: any) => i.ID));
            let empId = JSON.stringify(selectDeletes.map((i: any) => i.EMPLOYEE_ID));
            let paramExport = {
              sid: JSON.stringify(ids),
              periodId: this.model.periodId,
              employeeId: JSON.stringify(empId),
            }
            this._coreService
              .templateImportV2Hrm("PrintCheckpoint", paramExport)
              .subscribe((res: any) => {

                if (res.statusCode == 200) {
                  var host = (this.globals.apiUrlReport + res.data).replace("api/", "")
                  window.open(host, "_blank")
                }
              });
          }

        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }

        break;
      case ToolbarItem.EXPORT_BC:
        if (!this.nodeSelected) {
          this.notification.warning("Chọn phòng ban");
          break;
        }  
        if (this.model.periodId != null) { 
            
            let paramExport = {
              periodId: this.model.periodId,
              orgId: this.nodeSelected
            }
            this._coreService
              .templateImportV2Hrm("PrintCheckpointReport", paramExport)
              .subscribe((res: any) => {

                if (res.statusCode == 200) {
                  var host = (this.globals.apiUrlReport + res.data).replace("api/", "")
                  window.open(host, "_blank")
                }
              });

        } else {
          this.notification.warning("Kỳ đánh giá không được để trống");
        }

        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {

          this.modelDelete = selectDeletes;
          let checkHieuLuc = false;
          for (let i = 0; i < this.modelDelete.length; i++) {
            if (this.modelDelete[i].STATUS_ID != 0) {
              checkHieuLuc = true;
            }
          }
          if (checkHieuLuc) {
            this.notification.warning(
              "Dữ liệu đã được đánh giá, bạn không thể xóa!"
            );
            return;
          }
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;

      case ToolbarItem.RESET:
        if (selectDeletes && selectDeletes.length > 0) {

          this.modelDelete = selectDeletes;
          let checkHieuLuc = false;
          for (let i = 0; i < this.modelDelete.length; i++) {
            if (this.modelDelete[i].STATUS_ID == 9 || this.modelDelete[i].STATUS_ID == 10) {
              checkHieuLuc = true;
            }
          }
          if (checkHieuLuc) {
            this.notification.warning(
              "Dữ liệu đã hoàn thành, không thể reset!"
            );
            return;
          }
          this.modalService.open("confirm-reset-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;

      case ToolbarItem.EXPORT_EXCEL:
        let extraParams: any[] = [];
        if (this.nodeSelected) {
          extraParams.push({
            field: "orgId",
            value: this.nodeSelected,
          });
        }
        if (this.flagStatusEmp) {
          extraParams.push({
            field: "WorkStatusId",
            value: this.nodeSelected,
          });
        }
        if (this.isDisso != undefined) {
          extraParams.push({
            field: "IsDissolve",
            value: this.isDisso,
          });
        }
        if (this.model.year) {
          extraParams.push({
            field: "year",
            value: this.model.year,
          })
        }
        if (this.model.periodId) {
          extraParams.push({
            field: "periodId",
            value: this.model.periodId,
          })
        }
        var data = this._coreService.ExecuteToExport('hr/checkpointsum/GetAll', extraParams, this.state).subscribe((res: any) => {
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
            fileName: "khoitaovatonghopcheckpoint" + "-" + formattedDate + ".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      default:
        break;
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


  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      if (this.modelDelete.length > 0) {
        let employees = JSON.stringify(this.modelDelete.map((i: any) => i.EMPLOYEE_ID));
        let perId = this.model.periodId;
        let param2 = this.model;

        param2.periodId = this.model.periodId;
        param2.employees = JSON.stringify(employees);
        if (this.model.periodId != null) {
          this._coreService
            .Post("hr/checkpointsum/Cancel", param2)
            .subscribe((res: any) => {
              this.modalService.loading.next(false);
              if (res.statusCode == 200) {
                this.notification.deleteSuccess();
                this.gridInstance.clearSelection();
                this.gridInstance.refresh();
              } else {
                this.notification.deleteError();
              }

            })
          this.modalService.close("confirm-delete-modal");
          //this.getListData();
        }
        else {
          this.notification.warning("Kỳ đánh giá không được để trống");
        }
      }
    }
  };
  confirmReset = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-reset-modal");
    } else {
      if (this.modelDelete.length > 0) {
        let employees = JSON.stringify(this.modelDelete.map((i: any) => i.EMPLOYEE_ID));
        let perId = this.model.periodId;
        let param2 = this.model;
        param2.periodId = this.model.periodId;
        param2.employees = JSON.stringify(employees);
        if (this.model.periodId != null) {
          this._coreService
            .Post("hr/checkpointsum/Cancel", param2)
            .subscribe((res: any) => {
              this.modalService.loading.next(false);
              if (res.statusCode == 200) {
                this.notification.editSuccess();
                this.gridInstance.clearSelection();
                this.gridInstance.refresh();
              } else {
                this.notification.editError();
              }

            })
          this.modalService.close("confirm-reset-modal");
          //this.getListData();
        }
        else {
          this.notification.warning("Kỳ đánh giá không được để trống");
        }
      }
    }
  };
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
  changeYear() {
    this._coreService
      .Get("hr/competencyperiodcp/getlist?year=" + this.model.year)
      .subscribe((res: any) => {
        this.lstPeriodId = res.data
      });
  }
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
