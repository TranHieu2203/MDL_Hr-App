import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  ChangeDetectorRef,
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
  VirtualScrollService,
  GroupSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';

ListBoxComponent.Inject(CheckBoxSelection);

import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { setCurrencyCode } from "@syncfusion/ej2-base";
const $ = require("jquery");
import { takeUntil } from "rxjs/operators";
import { TimeSheetService } from "src/app/_services/timesheet.service";
setCulture("en");
setCurrencyCode("TRY");
@Component({
  selector: "cms-report-businessreport",
  templateUrl: "./businessreport.component.html",
  styleUrls: ["./businessreport.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessReportComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SEARCH,
    ToolbarItem.EXPORT_EXCEL,
    ToolbarItem.PRINT,
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;

  // View child filter
  // @ViewChild("ReportIns", { static: false })
  // public filterMenu: ReportInsComponent;

  localData: any = [];
  @ViewChild("treeViewReport", { static: false })
  listTreeObj!: TreeViewComponent;

  @ViewChild('spreadsheet', { static: false })
  public spreadsheetObj!: SpreadsheetComponent;

  public field: any;
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
  model = new BusinessReport();
  lstYear = [];
  lstPeriodId: any;

  lstMonthId = [];

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;

  nodeSelected: any;
  editForm!: FormGroup;
  lstSalaryType: any;
  curentUrlDownLoad :string="";
  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _formBuilder: FormBuilder,
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private notification: Notification,
    private cdref: ChangeDetectorRef
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
      //empId: [""],
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
    this.getTreeViewReport();
    this.getListYear();

    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.model.orgId = model.id;
      });
    
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
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

  getSalaryType() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Salarytype/getlist").subscribe(async (res: any) => {
        this.lstSalaryType = res.data;
        this.model.salaryTypeId = this.lstSalaryType[0].id;
        resolve(false);
      });
    });
  }

  nodeSelecting(e: any) {
    this.nodeSelected = Number(e.nodeData.id);
    this.model.reportId = this.nodeSelected;
    this._coreService.reportSubject.next({
      orgId: this.model.orgId,
      typeId: e.nodeData.id,
      statusId: 1,
    });
    
  }
  getTreeViewReport() {
    this._coreService.Get("hr/Report/GetTreeView").subscribe((res: any) => {
      this.localData = res.data;
      this.loadTreeView();
    });
  }
  loadTreeView() {
    const x = setInterval(() => {
      if (this.listTreeObj && this.listTreeObj.fields) {
        this.listTreeObj.fields = {
          dataSource: this.localData,
          id: "id",
          parentID: "pid",
          text: "name",
          hasChildren: "hasChild",
        };
        clearInterval(x);
      }
    }, 100);
  }
  search() {
    if (this.model.orgId && this.model.periodId && this.model.salaryTypeId) {
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
  };
  changeYear(e: any) {
    if (e.isInteracted) {
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriodId = res;
      });
    }
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    var bodyReportConfig:ReportConfigModel = new ReportConfigModel();
    bodyReportConfig.id=this.model.reportId;

    switch (buttonId) {
      case ToolbarItem.SEARCH:
        if (!this.nodeSelected) {
          this.notification.warning("Chọn loại báo cáo");
          break;
        }
        this._coreService.reportSubject.next({
          orgId: this.model.orgId,
          typeId: this.nodeSelected,
        });
        break;
      case ToolbarItem.EXPORT_EXCEL:


        // fix tạm báo cáo công để demo

        if(1==1){
          // nếu reportId = 10 là bảng công
          // gọi đến services báo cáo để export dữ liệu

          this._coreService.reportWithConfigsV2Hrm(bodyReportConfig).subscribe((res: any) => {
            if(res.statusCode==200){
              var host = (this.globals.apiUrlReport + res.data).replace("api/","")
              this.curentUrlDownLoad = host;
              fetch(host,{cache: "no-cache"}) 
              .then((response) => {
      
                response.blob().then((fileBlob) => { 
                  let file = new File([fileBlob], "dynamicReport.xlsx"); 
                  this.spreadsheetObj.open({ file: file }); 
                })
              })
            }else{
              this.notification.warning("Không có dữ liệu để in báo cáo")
            }
          })
  

        }else{
          return;
        }

        this._coreService.reportExport.next({
          orgId: this.model.orgId,
          typeId: this.nodeSelected,
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
      default:
        break;
    }
  };

  downloadFile(data:any){
    window.open(this.curentUrlDownLoad, "_blank");
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
}
export class BusinessReport {
  name?: string;
  parentId?: number;
  parentName?: any;
  note?: string;
  orgId?: any;
  periodId?: any;
  salaryTypeId?: any;
  yearId?: any;
  dateDate?: any;
  dateEnd?: any;
  reportId?:number;
}
export class ReportConfigModel{
  id?:number;
  requestParam?:object
}