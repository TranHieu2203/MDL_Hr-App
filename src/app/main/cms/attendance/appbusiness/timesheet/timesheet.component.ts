import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
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
  // GroupSettingsModel,
  QueryCellInfoEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  TimeSheet
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
import * as moment from "moment";
const $ = require("jquery");
import { TimeSheetService } from "src/app/_services/timesheet.service";
import { takeUntil } from "rxjs/operators";
import { FormBuilder, Validators } from "@angular/forms";
setCulture("en");

@Component({
  selector: "cms-profile-timesheet",
  templateUrl: "./timesheet.component.html",
  styleUrls: ["./timesheet.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class TimeSheetComponent implements OnInit {

  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.EDIT,
    ToolbarItem.LOCK,
    ToolbarItem.SUM_WORK,
    ToolbarItem.EXPORT_EXCEL,
    ToolbarItem.PRINT,
  ])

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
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: any[] = [];
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelDelete: Array<any> = [];
  // query auto complete
  public query = new Query();

  model = new TimeSheet();
  tab: number = 1;
  // list filter

  lstPeriodId: any[] = [];
  lstYear = [];
  lstType = [{
    id: 1,
    name: "Công"
  }, {
    id: 2,
    name: "Giờ"
  }];
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  m!: number;
  y!: number;
  dataImport: any;
  editForm: any;
  
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
    private _timesheet: TimeSheetService,
    private _formBuilder: FormBuilder
  ) {
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
      isQuit: ["", [Validators.required]],
      typeId: []
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
        this.nodeSelecting(model.id);
      });
    this._coreService
      .Get("hr/SalaryPeriod/GetYear")
      .subscribe((res: any) => {
        this.lstYear = res.data;
        this.model.yearId = res.data[0].id;
        this.getListShiftPeriod(this.model.yearId).then((res: any) => {
          if (this.lstPeriodId[0]) {
            this.model.periodId = this.lstPeriodId[0].id;
            this.model.dateStart = this.lstPeriodId[0].dateStart;
            this.model.dateEnd = this.lstPeriodId[0].dateEnd;
          }
          this._coreService.organizationSelect.next(true);
        });
      });
    this.model.typeId = 1;
  }

  changeTab(id: number) {
    this.tab = id;
    if (!this.model.orgId) return;
    if (id == 1) {
      this._timesheet.timesheetroot.next(this.model);
    } else if (id == 2) {
      this._timesheet.timesheetstandard.next(this.model);
    } else if (id == 3) {
      this._timesheet.timesheetmonthly.next(this.model);
    }
    
  }

  getTimeSheetRoot(tab: number, orgId: any, period: any) { }
  customiseCell(args: QueryCellInfoEventArgs) {
    if ((args.data as any)[args.column!.field] == "X") {
      args.cell!.classList.add("cell-green");
    } else if ((args.data as any)[args.column!.field] == "V") {
      args.cell!.classList.add("cell-red");
    } else {
      args.cell!.classList.add("above-80");
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
        for (let i = 1; i <= soNgay; i++) {
          let column = this.gridInstance.getColumnByField("day" + i);
          column.visible = true;
          let d = new Date(y, m, i);
          let dayOfWeek = moment(d);

          let day =
            dayOfWeek.day() != 0 ? "T" + Number(dayOfWeek.day() + 1) : "CN";
          column.headerText = day + " " + i + "/" + Number(m + 1);
        }

        let column29 = this.gridInstance.getColumnByField("day29");
        let column30 = this.gridInstance.getColumnByField("day30");
        let column31 = this.gridInstance.getColumnByField("day31");
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
      }, 200);
    });
  };

  changePeriod(e: any) {
    if (e.e) {
      this.model.dateStart = e.itemData.dateStart;
      this.model.dateEnd = e.itemData.dateEnd;
      this.model.periodId = e.itemData.id;
      if (this.model.orgId) {
        this.checkLockTimeSheet();
        this.changeTab(this.tab);
      }
    }
  }

  changeType(e: any) {
    if (e.e) {
      this.model.typeId = e.itemData.id;
      this._timesheet.timesheetstandard.next(this.model);
    }
  }

  nodeSelecting(id: any) {
    this.model.orgId = id;
    this.checkLockTimeSheet();
    this.changeTab(this.tab);
  }

  // update islock moi khi khoa mo bang cong doi phong ban
  checkLockTimeSheet() {
    this._coreService
      .Get(
        "hr/TimeSheetMonthly/IsLockTimeSheet?ORG_ID=" +
        this.model.orgId +
        "&PERIOD_ID=" +
        this.model.periodId
      )
      .subscribe((res: any) => {
        this.model.isLock = !res.data;
      });
  }
  changeYear(e: any) {
    if (e.isInteracted) {
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriodId = res;
        if (res) {
          this.model.periodId = this.lstPeriodId[0].id;
          this.model.dateStart = this.lstPeriodId[0].dateStart;
          this.model.dateEnd = this.lstPeriodId[0].dateEnd;
          if (this.model.orgId) {
            this.checkLockTimeSheet();
            this.changeTab(this.tab);
          }
        }
      });
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
        if (this.dataImport.length > 0 && this.dataImport.length < 200000) {
          let param = {
            data: this.dataImport,
            orgId: this.model.orgId,
            periodId: this.model.periodId
          }
          this.modalService.loading.next(true);
          this._coreService
            .Post("hr/TimeSheetMonthly/ImportSwipeDataNew", param)
            .subscribe((res: any) => {
              //check error
              if (res.statusCode == 400) {
                this.modalService.loading.next(false);
                this.notification.warning("Import không thành công, vui lòng kiểm tra file!");
                this._coreService.exportExcel(res.data, "template");
              } else {
                if (res.data != null) {
                  this.modalService.loading.next(false);
                  this.notification.warning("Import không thành công, vui lòng kiểm tra file!");
                  this._coreService.exportExcel(res.data, "template");
                }
                else {
                  this.modalService.loading.next(false);
                  this.notification.success("Import thành công");
                  this._timesheet.timesheetroot.next(this.model);
                }
              }
            });
        } else {
          this.modalService.loading.next(false);
          this.notification.warning("Giới hạn 200.000 bản ghi");
        }
      }
      this.modalService.close("confirm-import-modal");
    }
  };
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
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.router.navigate(["/hrms/profile/appbusiness/timesheet/new"]);
        break;
      case ToolbarItem.EDIT:
        // check lock time sheet
        if (this.model.isLock == true) {
          if (this.tab == 1) {
            this._timesheet.timesheetroot.next("EDIT");
          }
          else {
            this._timesheet.timesheetstandardedit.next(this.model);
          }
        } else {
          this.notification.warning("notify.TIME_SHEET_LOCKED");
        }
        break;
      case ToolbarItem.SUM_WORK:
        if (!this.model.isLock) {
          this.notification.warning("notify.TIME_SHEET_LOCKED");
          break;
        }
        if (!this.model.orgId) {
          this.notification.warning("Chưa chọn phòng ban.");
          break;
        }
        if (this.tab == 1) {
          this.modalService.loading.next(true);
          this._coreService
            .Post("hr/timesheetdaily/CalTimesheetDaily", this.model)
            .subscribe((res: any) => {
              if (res.statusCode == 400) {
                this.notification.checkErrorMessage(res.message);
              } else {
                this.notification.success("Tổng hợp thành công");
                this._timesheet.timesheetroot.next(this.model);
                //this._timesheet.timesheetstandard.next(this.model);
              }
              this.modalService.loading.next(false);
            });
        } else if (this.tab == 2) {

        } else if (this.tab == 3) {
          this._timesheet.timesheetstandardsumwork.next(this.model);
        }
        break;
      case ToolbarItem.LOCK:
        if (this.model.periodId && this.model.orgId) {
          this._coreService
            .Get(
              "hr/TimeSheetMonthly/LockTimeSheet?ORG_ID=" +
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
      case ToolbarItem.IMPORT:
        if (!this.model.isLock) {
          this.notification.warning("notify.TIME_SHEET_LOCKED");
          break;
        }
        if (!this.model.orgId) {
          this.notification.warning("Chưa chọn phòng ban.");
          break;
        }
        document.getElementById("file")!.click();
        break;
      case ToolbarItem.EXPORT_TEMPLATE:
        let data = [
          { CODE: "HL002", TIME: "25/11/2022 08:05" }
        ];
        this._coreService.exportExcel(data, "template");
        break;
      case ToolbarItem.EXPORT_EXCEL:
        if (this.tab == 1) {
          this._timesheet.timesheetroot.next("EXPORT");
        } else if (this.tab == 2) {
          this._timesheet.timesheetstandard.next("EXPORT");
        } else if (this.tab == 3) {
          this._timesheet.timesheetmonthly.next("EXPORT");
        }
        break;
      case ToolbarItem.PRINT:
        this._coreService
          .Post("hr/FormList/PrintFormAttendance", this.model)
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
