import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { Subject } from "rxjs";
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
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { HttpResponse } from "@angular/common/http";
const _ = require("lodash");
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  GridComponent,
  SelectionSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import * as moment from "moment";
import { takeUntil } from "rxjs/operators";
setCulture("en");

@Component({
  selector: "cms-app-reportattandence",
  templateUrl: "./reportattandence.component.html",
  styleUrls: ["./reportattandence.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ReportAttandenceComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  model: ReportAttandence = new ReportAttandence();
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public field = {};
  @ViewChild("listTreeObj", { static: true })
  public listTreeObj!: TreeViewComponent;

  @ViewChild("maskObj", { static: true })
  public maskObj!: MaskedTextBoxComponent;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  lstYear = [];
  lstPeriodId: any;
  // Khai báo data
  public data!: any[];
  public selectionOptions!: SelectionSettingsModel;
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  element: any;
  localData = [];
  showMask = false;
  param: any;
  orgId: any;
  periodId: any;
  yearId: any;
  groupOptions!: { columns: string[] };
  genGrid: boolean = false;
  type: any;
  public fields: FieldSettingsModel = { text: "name", value: "id" };

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
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private el: ElementRef,
    private cdref: ChangeDetectorRef
  ) {
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.element = el.nativeElement;
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

    this._coreService.reportSubject
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.type = res.typeId;
        if (res.statusId == null) {
          if (res && res.typeId == 8) {
            if (!this.model.fromDate) {
              this.notification.warning("Bạn chưa nhập từ ngày!");
              return;
            }
            if (!this.model.toDate) {
              this.notification.warning("Bạn chưa nhập đến ngày!");
              return;
            }
            if (!res.orgId) {
              this.notification.warning("Chọn phòng ban");
              return;
            }

            this.getListData(res.orgId);
          }
        }
      });
    this._coreService.reportExport
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.type = res.typeId;
        if (res.typeId == 8) {
          let paramExport = {
            orgId: this.orgId,
            fromDate: moment(this.model.fromDate).format("MM/DD/YYYY"),
            toDate: moment(this.model.toDate).format("MM/DD/YYYY")
          }
          this._coreService
            .Download("hr/TimeSheetMonthly/ReportSwipeDataExp", paramExport)
            .subscribe((response: HttpResponse<Blob>) => {
              let filename: string = "BaoCaoChamCong.xlsx";
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
          // this.gridInstance.excelExport();
        } else if (res.typeId == 9) {
          let paramExport = {
            orgId: res.orgId,
            periodId: this.model.periodId
          }
          this._coreService
            .Download("attendance/report/AT002", paramExport)
            .subscribe((response: HttpResponse<Blob>) => {
              let filename: string = "KeHoachCong.xlsx";
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
            })
        } else if (res.typeId == 10) {
          let paramExport = {
            orgId: res.orgId,
            periodId: this.model.periodId
          }
          this._coreService
            .Download("attendance/report/AT003", paramExport)
            .subscribe((response: HttpResponse<Blob>) => {
              let filename: string = "BangCong.xlsx";
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
            })
        }
      });
    setTimeout(() => {
      this.genGrid == true;
    }, 100);

    this.getListYear();
  }

  getListYear() {
    this._coreService
      .Get("hr/SalaryPeriod/GetYear")
      .subscribe((res: any) => {
        this.lstYear = res.data;
        this.model.yearId = res.data[0].id;
        this.getListShiftPeriod(res.data[0].id)
      });
  };

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

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ngOnDestroy() {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
  // GetListData
  getListData = (orgId: any): void => {
    const state = { skip: 0, take: 1000 };
    this.orgId = orgId;
    let extraParams: any[] = [];
    extraParams.push({
      field: "orgId",
      value: this.orgId,
    });
    extraParams.push({
      field: "toDate",
      value: moment(this.model.toDate).format("MM/DD/YYYY"),
    });
    extraParams.push({
      field: "fromDate",
      value: moment(this.model.fromDate).format("MM/DD/YYYY"),
    });
    this._coreService
      .GetAll(state, "hr/TimeSheetMonthly/ReportSwipeData", extraParams)
      .subscribe((res: any) => {
        this.data = res.result;
      });
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    let extraParams: any[] = [];
    extraParams.push({
      field: "orgId",
      value: this.orgId,
    });
    extraParams.push({
      field: "toDate",
      value: moment(this.model.toDate).format("MM/DD/YYYY"),
    });
    extraParams.push({
      field: "fromDate",
      value: moment(this.model.fromDate).format("MM/DD/YYYY"),
    });
    this._coreService
      .GetAll(state, "hr/TimeSheetMonthly/ReportSwipeData", extraParams)
      .subscribe((res: any) => {
        this.data = res.result;
      });
  }
  changeYear(e: any) {
    if (e.isInteracted) {
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriodId = res;
      });
    }
  }
}
class ReportAttandence {
  toDate?: Date;
  fromDate?: Date;
  orgId?: any;
  periodId?: any;
  yearId?: any;
}
