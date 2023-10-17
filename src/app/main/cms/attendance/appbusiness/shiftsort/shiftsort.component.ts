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
  ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  ShiftSort,
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

import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
const _ = require("lodash");
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { takeUntil } from "rxjs/operators";
import { ExcelService } from "src/app/_services/excel.service";
import { HttpResponse } from "@angular/common/http";
setCulture("en");

@Component({
  selector: "cms-profile-shiftsort",
  templateUrl: "./shiftsort.component.html",
  styleUrls: ["./shiftsort.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ShiftSortComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };
  selectionOptions = {
    cellSelectionMode: "Box",
    type: "Multiple",
    mode: "Cell",
  };
  public data: Observable<DataStateChangeEventArgs>;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data

  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };

  // query auto complete
  public query = new Query();
  public groupSettings: GroupSettingsModel = {
    showDropArea: false,
    columns: ["orgName"],
    captionTemplate: '<span style="color:black">${key}</span>',
  };
  model = new ShiftSort();
  // list filter

  lstPeriodId: any[] = [];
  dataImport: any[] = [];
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  editForm!: FormGroup;
  lstShift: any;
  y!: number;
  m!: number;
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
    private _formBuilder: FormBuilder,
    private _tlaTranslationLoaderService: TranslationLoaderService,
  ) {
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    this.editForm = this._formBuilder.group({
      yearId: ["", [Validators.required]],
      periodId: ["", [Validators.required]],
      shiftId: [""],
    });
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
  }

  /**
   * On init
   */
  ngOnInit() {
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.languages);

    this.model.yearId = new Date().getFullYear();
    this.model.type = 1;
    this.getListShiftPeriod(this.model.yearId).then((res: any) => {
      this.model.periodId = this.lstPeriodId[0].id;
      this.model.dateStart = this.lstPeriodId[0].dateStart;
      this.model.dateEnd = this.lstPeriodId[0].dateEnd;
      this.viewAttandance(this.model.dateStart, this.model.dateEnd);
      this._coreService.organizationSelect.next(true);
    });
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.model.orgId = model.id;
        this.nodeSelecting();
      });
      
this._coreService.isDisso
.pipe(takeUntil(this._unsubscribeAll))
.subscribe((checked: any) => {

  this.isDisso = checked;
  this.getListData();

});
    // this._coreService.Get("hr/shift/getlist").subscribe((res: any) => {
    //   this.lstShift = res.data;
    //   this.model.shiftId = this.lstShift[0].id;
    // });
  }

  // customiseCell(args: QueryCellInfoEventArgs) {
  //   if ((args.data as any)[args.column.field] == "X") {
  //     args.cell.classList.add("cell-green");
  //   } else if ((args.data as any)[args.column.field] == "V") {
  //     args.cell.classList.add("cell-red");
  //   } else {
  //     args.cell.classList.add("above-80");
  //   }
  // }
  changeYear(e: any) {
    if (e.isInteracted) {
      var dDate = new Date();
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriodId = res;
        res.data.forEach((item: any) => {
          if (item.month == dDate.getMonth()) {
            this.model.periodId = item.id;
          }
        });
      });
    }
  }
  getListShiftPeriod(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/SalaryPeriod/getlist?Id=" + id)
        .subscribe((res: any) => {
          this.lstPeriodId = res.data;
          var dDate = new Date();
          res.data.forEach((item: any) => {
            if (item.month == dDate.getMonth()) {
              this.model.periodId = item.id;
            }
          });
          resolve(res.data);
        });
    });
  }
  changePeriod(e: any) {
    if (e.e) {
      this.model.dateStart = e.itemData.dateStart;
      this.model.dateEnd = e.itemData.dateEnd;
      this.model.periodId = e.itemData.periodId;
      this.viewAttandance(e.itemData.dateStart, e.itemData.dateEnd);
      this.nodeSelecting();
    }
  }

  nodeSelecting() {
    if (this.model.orgId && this.model.periodId) {
      this.getListData();
    }
  }
  add() {
    this.model.type = 1;
    this.modalService.open("cms-app-modalsshiftsort", this.model);
    const z = this.modalService.shiftsort.subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.getListData();
      }
      z.unsubscribe();
    });
  }

  customiseCell(args: any) {
    // if(args.column.field === 'TIME_POINT1'){

    // }
    if (args.column.headerText.toString().indexOf("CN") != -1) {
      args.cell.classList.add("cell-red-1");
    }
  }


  // Xử lý dữ liệu chấm công
  viewAttandance = (dateStart: any, dateEnd: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let a = moment(dateStart);
        let b = moment(dateEnd);
        let m = a.month();
        let y = a.year();
        this.m = m;
        this.y = y;

        let soNgay = b.diff(a, "days") + 1;
        let today = a.date() - 1;
        for (let i = 1; i <= soNgay; i++) {
          today += 1;
          let column = this.gridInstance.getColumnByField("DAY" + i + "_CODE");
          column.visible = true;
          let d = new Date(y, m, today);
          let dayOfWeek = moment(d);
          let day = dayOfWeek.day() != 0 ? "T" + Number(dayOfWeek.day() + 1) : "CN";
          let numOffday = dayOfWeek.date();
          let numOfMonth = dayOfWeek.month() + 1;
          column.headerText =
            day +
            " " +
            (Number(numOffday) > 9 ? Number(numOffday) : "0" + Number(numOffday)) +
            "/" +
            (Number(numOfMonth) > 9 ? Number(numOfMonth) : "0" + Number(numOfMonth));
        }

        let column29 = this.gridInstance.getColumnByField("DAY29_CODE");
        let column30 = this.gridInstance.getColumnByField("DAY30_CODE");
        let column31 = this.gridInstance.getColumnByField("DAY31_CODE");
        switch (soNgay) {
          case 28:
            column29.visible = false;
            column30.visible = false;
            column31.visible = false;
            break;
          case 29:
            column30.visible = false;
            column31.visible = false;
            break;
          case 30:
            column31.visible = false;
            break;
        }
        this.gridInstance.refreshColumns();
        this.gridInstance.refreshHeader();
        resolve(false);
      }, 100);
    });
  };

  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD,
    ToolbarItem.EDIT,
    ToolbarItem.EXPORT_EXCEL,
    ToolbarItem.DELETE
  ])

  // GetListData
  getListData = (): void => {
    
    let extraParams: any = [
      {
        field: "ORG_ID",
        value: this.model.orgId,
      },
      {
        field: "PERIOD_ID",
        value: this.model.periodId,
      },
      {
        field: "TYPE",
        value: 1,
      },
      {
        field: "IS_DISSOLVE",
        value: this.isDisso== undefined?0:this.isDisso,
      },
    ];
    this._coreService.execute(this.state, "hr/WorkSign/getall", extraParams);
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any = [
      {
        field: "ORG_ID",
        value: this.model.orgId,
      },
      {
        field: "PERIOD_ID",
        value: this.model.periodId,
      },
      {
        field: "TYPE",
        value: 1,
      },
      {
        field: "IS_DISSOLVE",
        value: this.isDisso== undefined?0:this.isDisso,
      },
    ];

    this._coreService.execute(this.state, "hr/WorkSign/GetAll", extraParams);
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.model.isAdd = true;
        this.add();
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRowCellIndexes();
        if (selectRows && selectRows.length > 0) {
          let cells = selectRows[0].cellIndexes;
          let row = selectRows[0].rowIndex;
          let a = this.gridInstance
            .getColumnByIndex(cells[0])
            .field.replace("DAY", "")
            .replace("_CODE", "");
          let b = this.gridInstance
            .getColumnByIndex(cells[cells.length - 1])
            .field.replace("DAY", "")
            .replace("_CODE", "");

          this.model.dateStart = new Date(this.y, this.m, Number(a));
          this.model.dateEnd = new Date(this.y, this.m, Number(b));

          let x = (this.gridInstance.getCurrentViewRecords() as any)[row]["EMPLOYEE_ID"];
          this.model.empIds = [];
          this.model.empIds.push(x);
        }
        this.model.isAdd = false;
        this.add();
        break;
      case ToolbarItem.IMPORT:
        document.getElementById("file")!.click();
        break;
      case ToolbarItem.EXPORT_EXCEL:
        let extraParams: any = [
          {
            field: "ORG_ID",
            value: this.model.orgId,
          },
          {
            field: "PERIOD_ID",
            value: this.model.periodId,
          },
          {
            field: "TYPE",
            value: 1,
          },
          {
            field: "IS_DISSOLVE",
            value: this.isDisso== undefined?0:this.isDisso,
          },
        ];
        var data = this._coreService.ExecuteToExport('hr/WorkSign/GetAll', extraParams, this.state).subscribe((res: any) => {
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
            fileName: "quanlydulieuxepca" + "-" + formattedDate + ".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      case ToolbarItem.EXPORT_TEMPLATE:
        //this._exceltest.generateExcel(this.model.periodId);
        if (!this.model.orgId) {
          this.notification.warning("Chưa chọn phòng ban !");
          return;
        }
        if (!this.model.periodId) {
          this.notification.warning("Chưa chọn kỳ lương !")
          return;
        }
        let paramExport = {
          orgId: this.model.orgId,
          periodId: this.model.periodId
        }
        this._coreService
          .Download("hr/WorkSign/TemplateExport", paramExport)
          .subscribe((response: HttpResponse<Blob>) => {
            let filename: string = "TemplateShift.xlsx";
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
      case ToolbarItem.DELETE:
        let indexRowCells = this.gridInstance.getSelectedRowCellIndexes();
        if (indexRowCells.length == 0) {
          this.notification.warning("notify.NO_RECORD_SELECT");
          return;
        }
        let lstIds: any[] = [];
        let lstData = this.gridInstance.getCurrentViewRecords();
        indexRowCells.forEach((item: any) => {
          let rowIndex = item.rowIndex;
          let emp = lstData[rowIndex] as any;
          lstIds.push(emp.EMPLOYEE_ID);
        })
        let param = {
          ids: lstIds,
          periodId: this.model.periodId,
          type: 1
        }
        this._coreService
          .Post("hr/WorkSign/Delete", param)
          .subscribe((res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.deleteError()
            } else {
              this.notification.deleteSuccess();
              this.getListData();
            }
          });
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
  confirmImport = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-import-modal");
    } else {
      if (this.dataImport) {
        if (this.dataImport.length > 0 && this.dataImport.length < 10000) {
          this.modalService.loading.next(true);
          this._coreService
            .Post("hr/WorkSign/ImportTimeSort", this.dataImport)
            .subscribe((res: any) => {
              this.modalService.loading.next(false);
              if (res.statusCode == 400) {
                this.notification.warning("Sai mã :" + res.message);
              } else {
                this.notification.success("Import thành công");
              }
            });
        }
      }

      // if (this.dataImport) {
      //   if (this.dataImport.length > 0 && this.dataImport.length < 10000) {
      //     let param = [{
      //       data: this.dataImport
      //     }]
      //     this.modalService.loading.next(true);
      //     this._coreService
      //       .Post("hr/WorkSign/ImportTemplateNew", param[0])
      //       .subscribe((res: any) => {
      //         this.modalService.loading.next(false);
      //         if (res.statusCode == 400) {
      //           this.notification.warning("Sai mã :" + res.message);
      //         } else {
      //           this.notification.success("Import thành công");
      //         }
      //       });
      //   }
      // }
      this.modalService.close("confirm-import-modal");
    }
  };
}
