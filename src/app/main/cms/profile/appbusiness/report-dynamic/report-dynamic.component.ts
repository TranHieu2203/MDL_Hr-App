import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
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
  VirtualScrollService, ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface, ReportDynamic } from "src/app/_models/index";
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
import { RuleModel } from '@syncfusion/ej2-querybuilder';

const _ = require("lodash");
import { takeUntil } from 'rxjs/operators';
import { Splitter, SplitterComponent } from "@syncfusion/ej2-angular-layouts";
import { HttpResponse } from "@angular/common/http";
import { Predicate } from "@syncfusion/ej2-data";
import {
  QueryBuilderComponent,
  TemplateColumn,
  ColumnsModel,
  RuleChangeEventArgs
} from "@syncfusion/ej2-angular-querybuilder";

import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { SelectEventArgs } from "@syncfusion/ej2-lists";
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';

setCulture("en");

@Component({
  selector: "cms-profile-report-dynamic",
  templateUrl: "./report-dynamic.component.html",
  styleUrls: ["./report-dynamic.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})

export class ReportDynamicComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SAVE,
    ToolbarItem.EXPORT_EXCEL
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  flagStatusEmp: any;
  dataImport: any[] = [];
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild('splitterInstance', { static: false })
  splitterObj!: SplitterComponent;

  @ViewChild('querybuilder', { static: false })
  qryBldrObj!: QueryBuilderComponent;

  @ViewChild('spreadsheet', { static: false })
  public spreadsheetObj!: SpreadsheetComponent;

  @ViewChild('listbox1', { static: false })
  public listbox1!: ListBoxComponent;

  @ViewChild('listbox2', { static: false })
  public listbox2!: ListBoxComponent;

  @ViewChild("listview") listview: any;


  @ViewChild("dropdownlist", { static: false })
  public dropdownlist!: DropDownListComponent;


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
  //public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
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
  isDisso: any;
  lstReportDynamic: any;
  dataBuilder: any;
  model: ReportDynamicModel = new ReportDynamicModel();
  public groupFields: { [key: string]: Object }[] = [

  ];
  filter: ColumnsModel[] = [
  ];

  public groupFieldsSelected: { [key: string]: Object }[] = [
  ];

  public importRules!: RuleModel;

  public setfield = { text: "Name" }
  public dataReportDynamic!: Object;
  listReportDynamicByUser!: any;

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

    // Load List Data
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id;
      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id;
      });
    this._coreService.isDisso
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((checked: any) => {

        this.isDisso = checked;

      });

    Promise.all([
      this.getListReportDynamic(),
      this.getListReportDynamicByUser()
    ]).then((res: any) => {
      let data = res[0].map((val: any) => ({
        name: val.nameVn,
        id: val.id,
      }));
      this.lstReportDynamic = data

      let data1 = res[1].map((val: any) => ({
        text: val.reporT_NAME,
        id: val.id
      }));
      this.listReportDynamicByUser = res[1]
      this.dataReportDynamic = data1
    });
  }
  getListReportDynamic() {
    return new Promise((resolve) => {
      this._coreService.Get("package/reportdynamic/GetAll?PageNo=1&PageSize=200").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getListReportDynamicByUser() {
    return new Promise((resolve) => {
      this._coreService.getReportDynamicV2Hrm(undefined).subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getListFields(id: any) {
    //package/reportdynamicdtl/GetDynamiDtlDefault?id=1
    return new Promise((resolve) => {
      this._coreService.Get("package/reportdynamicdtl/GetDynamiDtlDefault?id=" + id)
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }

  changeReport(e: any) {

    this.groupFieldsSelected = [];
    this.groupFields = [];
    if (e.e) {
      this.getListFields(e.itemData.id).then((res: any) => {
        setTimeout(() => {
          this.groupFields = res.map((val: any) => ({
            Name: val.columnTranslate,
            Code: val.columnName,
          }));
          this.filter = res.map((val: any) => ({
            label: val.columnTranslate,
            field: val.columnName,
            type: val.dataType,
            format: 'dd/MM/yyyy'
          }));
        }, 200);

      });
    }


  }
  updateRule(args: RuleChangeEventArgs) {
    let querySql = this.qryBldrObj.getSqlFromRules(args.rule);
    let rule = (JSON.stringify(args.rule, null, 4));
    return querySql;
  }
  change(): void {
    this.updateRule({ rule: this.qryBldrObj.getValidRules(this.qryBldrObj.rule) })
  }
  onSelectListReportDynamic(args: SelectEventArgs) {
    this.model.reportName = args.text
    let selecteditem = this.listview.getSelectedItems();


    var obj = _.find(this.listReportDynamicByUser, {
      id: selecteditem.data.id,
    });
    this.groupFieldsSelected = [];
    this.groupFields = [];
    this.model.id = obj.syS_REPORT_DYNAMIC_ID
    this.getListFields(this.model.id).then((res: any) => {
      setTimeout(() => {
        this.groupFields = res.map((val: any) => ({
          Name: val.columnTranslate,
          Code: val.columnName,
        }));
        this.filter = res.map((val: any) => ({
          label: val.columnTranslate,
          field: val.columnName,
          type: val.dataType,
          format: 'dd/MM/yyyy'
        }));
      }, 200);

    });

    setTimeout(() => {
      var sql = obj.condition.substring(4)
      sql = sql.replace("(N'", "('").toString()
      this.qryBldrObj.setRulesFromSql(sql)
    }, 500);

  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    if (this.model.id == null) {
      this.notification.warning("Chưa chọn báo cáo!")
      return;
    }
    let columnSelected = this.listbox2.getDataList().map(function (x: any) { return x.Code });
    if (columnSelected.length == 0) {
      this.notification.warning("Chọn cột để hiển thị báo cáo!")
      return;

    }
    // lấy sqlQuery
    let queryBuilderSql = this.qryBldrObj.getSqlFromRules();
    let sql = queryBuilderSql != "" ? 'AND ' + this.qryBldrObj.getSqlFromRules() : "";
    // lấy list columnSelected
    sql = sql.replace("('", "(N'")
    var bodyReportDynamic: ReportDynamicModel = new ReportDynamicModel();
    bodyReportDynamic.id = this.model.id;
    bodyReportDynamic.orgId = this.nodeSelected;
    bodyReportDynamic.isDissolve = this.isDisso;
    bodyReportDynamic.conditions = sql;
    bodyReportDynamic.columns = JSON.stringify(columnSelected);
    bodyReportDynamic.reportName = this.model.reportName;
    switch (buttonId) {
      case ToolbarItem.SAVE:
        if (this.model.reportName == null || this.model.reportName.replace(" ", "") == "") {
          this.notification.warning("Nhập tên báo cáo để lưu");
          return;
        }
        this._coreService.saveReportDynamicV2Hrm(bodyReportDynamic).subscribe((res: any) => {
          if (res.statusCode == 200) {
            this.notification.addSuccess()
          } else {
            this.notification.addError()
          }
        })
        break;
      case ToolbarItem.EXPORT_EXCEL:
        this.spreadsheetObj.clear;
        this.spreadsheetObj.showSpinner();
        this._coreService.reportDynamicV2Hrm(bodyReportDynamic).subscribe((res: any) => {
          if (res.statusCode == 200) {
            var host = (this.globals.apiUrlReport + res.data).replace("api/", "")
            window.open(host, '_blank')
            fetch(host, { cache: "no-cache" })
              .then((response) => {

                response.blob().then((fileBlob) => {
                  let file = new File([fileBlob], "dynamicReport.xlsx");
                  this.spreadsheetObj.open({ file: file });
                })
              })
          } else {
            this.notification.warning("Không có dữ liệu để in báo cáo")
          }
        })

        break;
      default:
        break;
    }
  };


  // load list column

  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  // change date
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}

export class ReportDynamicModel {
  id?: number;
  reportName?: string;
  columns?: string;
  conditions?: string;
  orgId?: number;
  isDissolve?: number;
}