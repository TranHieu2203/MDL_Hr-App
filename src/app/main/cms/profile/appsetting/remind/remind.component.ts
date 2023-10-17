import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

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
  ExcelExportProperties,
  RowSelectEventArgs,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface, SettingRemind, SendRemind } from "src/app/_models/index";
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
import { Splitter, SplitterComponent } from '@syncfusion/ej2-angular-layouts';
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
const _ = require("lodash");
import { takeUntil } from "rxjs/operators";
import { HttpResponse } from "@angular/common/http";
import { GRID_ROW_HEIGHT } from 'src/app/constants'
import * as moment from "moment";
setCulture("en");

@Component({
  selector: "cms-profile-remind",
  templateUrl: "./remind.component.html",
  styleUrls: ["./remind.component.scss"],
  providers: [FilterService],
  encapsulation: ViewEncapsulation.None,
})
export class RemindComponent implements OnInit, OnDestroy {

  gridRowHeight = GRID_ROW_HEIGHT;
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  searchFrom!: FormGroup;
  flagStatusEmp: any;
  public dropInstance!: DropDownList;
  model: SettingRemind = new SettingRemind();
  modelSendMail: SendRemind = new SendRemind();
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

  public fields: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  lstRemindId: any;
  // query auto complete
  public query = new Query();
  // variable
  dataImport: any[] = [];

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  isDisso: any;
  public selectionMode;

  toolItems$ = new BehaviorSubject<ToolbarItem[]>([
    ToolbarItem.SENDMAIL
  ]);


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
    private _formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    this.searchFrom = this._formBuilder.group({
      name: [""]
    });
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.gridInstance = (window as any).gridData;

    this.selectionMode = { selectionMode: ["row"], allowDragSelection: true };


    this.activatedRoute.queryParams.subscribe(params => {
      let type = params['type'];
      this.model.name = type;
      this.getListData();
    });


  }

  ngOnInit(): void {
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.languages);
    // Build toolbar
    this.buildToolbar();
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
    this._coreService
      .Get("hr/FormList/GetListRemind")
      .subscribe((res: any) => {
        
        this.lstRemindId = res.data
      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
  }


  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/profile/business/remind/", paramAdd]);
  };

  // Build Toolbar
  buildToolbar = () => {
    let toolbarList: any[] = [
      ToolbarItem.SENDMAIL
    ];
    // if (this.globals.isAdmin) {
    //   toolbarList.push()
    // }
    this.toolbar = this.globals.buildToolbar("sys_settingremind", toolbarList!);
  };
  // filter checkbox

  // GetListData
  getListData = (): void => {
    var extraParams: any = [];
    if (this.flagStatusEmp) {
      extraParams.push({
        field: "WorkStatusId",
        value: 1,
      });
    }
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    if (this.isDisso != undefined) {
      extraParams.push({
        field: "isDisso",
        value: this.isDisso,
      });
    }
    if (this.model.name != null) {
      extraParams.push({
        field: "TYPE_CODE",
        value: this.model.name
      })
    }

    this._coreService.execute(this.state, "hr/FormList/GetRemindNew", extraParams);
  };

  GetEmp = (e: any) => {
    this.flagStatusEmp = e.checked;
    this.getListData();
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.flagStatusEmp) {
      extraParams.push({
        field: "WorkStatusId",
        value: this.nodeSelected,
      });
    }
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    if (this.model.name != null) {
      extraParams.push({
        field: "TYPE_CODE",
        value: moment(this.model.name)
      })
    }
    this._coreService.execute(this.state, "hr/FormList/GetRemindNew", extraParams);
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.EXPORT_EXCEL:

        const excelExportProperties: ExcelExportProperties = {
          exportType: 'AllPages'
        };

        this.gridInstance.excelExport(excelExportProperties);
        break;
      default:
        break;

      case ToolbarItem.SENDMAIL:

        const rowSelects = this.gridInstance.getSelectedRecords();

        // this.modelSendMail.typeName = firstRecord.TYPE_NAME;
        const selectedrecords: any[] = (this.gridInstance as any).getSelectedRecords()
        this.modelSendMail.ID = selectedrecords[0].ID;
        this.modelSendMail.typE_NAME = selectedrecords[0].TYPE_NAME;
        this.modelSendMail.positioN_NAME = selectedrecords[0].POSITION_NAME;
        this.modelSendMail.orG_NAME = selectedrecords[0].ORG_NAME;
        this.modelSendMail.employeE_NAME = selectedrecords[0].EMPLOYEE_NAME;
        this.modelSendMail.employeE_CODE = selectedrecords[0].EMPLOYEE_CODE;
        this.modelSendMail.typE_CODE = selectedrecords[0].TYPE_CODE;
        this.modelSendMail.contracT_ID = selectedrecords[0].CONTRACT_ID;
        this.modelSendMail.maiL_CODE = selectedrecords[0].MAIL_CODE;
        this.modelSendMail.day = selectedrecords[0].DAY;
        this.modelSendMail.iS_SENDMAIL = selectedrecords[0].IS_SENDMAIL==1?true:false;
        if (this.modelSendMail.iS_SENDMAIL == false) {
          this.notification.warning("[Nội dung này không gửi mail]");
          return;
        }
        let param = this.convertModel(this.modelSendMail);

        this._coreService
          .Post("hr/FormList/SendRemind", param)
          .subscribe((res: any) => {

            if (res.statusCode == 200) {
              this.notification.success("Tác vụ thành công");

            }
            else {
              this.notification.warning("Lỗi");
            }

          });



        break;
    }
  };
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    return model;
  }
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
        const selectedrecords: any[] = (this.gridInstance as any).getSelectedRecords()
        // Nếu count > 1 thì disable toolbar

        if (rowSelectCounts > 1) {

          for (let i = 0; i < this.toolbar.length; i++) {
            //disable sửa
            if (this.toolbar[i].id === ToolbarItem.SENDMAIL) {
              this.toolbar[i].isDisable = true;
            }
          }
        } else {
          for (let i = 0; i < this.toolbar.length; i++) {
            // enabled sửa

            if (this.toolbar[i].id === ToolbarItem.SENDMAIL && selectedrecords[0].IS_SENDMAIL == 1) {
              this.toolbar[i].isDisable = false;
            }
            else {
              this.toolbar[i].isDisable = true;
            }
          }
        }
      }, 200);
    }
  };
  rowSelected(args: RowSelectEventArgs) {
    const selectedrowindex: number[] = (this.gridInstance as any).getSelectedRowIndexes();
    const selectedrecords: any[] = (this.gridInstance as any).getSelectedRecords();

    if (selectedrecords.length == 0) {
      this.toolItems$.next([
        ToolbarItem.SENDMAIL]);
    }
    if (selectedrecords.length == 1) {
      if (selectedrecords[0].IS_SENDMAIL == 1) {
        this.toolItems$.next([ToolbarItem.SENDMAIL]);
      } else {
        this.toolItems$.next([]);
      }
    }
    if (selectedrecords.length > 1) {
      this.toolItems$.next([
      ]);
    }

  }
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }

}
