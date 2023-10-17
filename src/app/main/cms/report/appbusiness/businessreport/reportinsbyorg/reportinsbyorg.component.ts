import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  Input,
  ViewChildren,
  ModuleWithComponentFactories,
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
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
const _ = require("lodash");
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
import {
  DataResult,
  GridComponent,
  SelectionSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import * as moment from "moment";
import { takeUntil } from "rxjs/operators";

setCulture("en");

@Component({
  selector: "cms-app-reportinsbyorg",
  templateUrl: "./reportinsbyorg.component.html",
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ReportInsByOrgComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  model: ReportInsByOrg = new ReportInsByOrg();
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
  yearId: any;
  groupOptions!: { columns: string[] };
  genGrid: boolean = false;

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
        if (res && res.typeId == 7) {
          if (!this.model.dateStart || !this.model.dateEnd) {
            this.notification.warning("Nhập ngày");
            return;
          }
          if (!res.orgId) {
            this.notification.warning("Chọn phòng ban");
            return;
          }
          this.getListData(res.orgId);
        }
      });
    this._coreService.reportExport
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((typeId) => {
        if (typeId == 7) {
          this.gridInstance.excelExport();
        }
      });
    //this.groupOptions = { columns: ["ORG_NAME"] };
    setTimeout(() => {
      this.genGrid == true;
    }, 100);
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
      field: "dateStart",
      value: moment(this.model.dateStart).format("DD/MM/YYYY"),
    });
    extraParams.push({
      field: "dateEnd",
      value: moment(this.model.dateEnd).format("DD/MM/YYYY"),
    });
    this._coreService
      .GetAll(state, "hr/Report/ReportInsByOrg", extraParams)
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
      field: "dateStart",
      value: moment(this.model.dateStart).format("DD/MM/YYYY"),
    });
    extraParams.push({
      field: "dateEnd",
      value: moment(this.model.dateEnd).format("DD/MM/YYYY"),
    });
    this._coreService
      .GetAll(state, "hr/Report/ReportInsByOrg", extraParams)
      .subscribe((res: any) => {
        this.data = res.result;
      });
  }
}
class ReportInsByOrg {
  dateStart?: any;
  dateEnd?: any;
  orgId?: any;
}
