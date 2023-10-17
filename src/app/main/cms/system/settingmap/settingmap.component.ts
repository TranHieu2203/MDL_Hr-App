import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
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

import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query } from "@syncfusion/ej2-data";
import { takeUntil } from "rxjs/operators";

const $ = require("jquery");
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);

const _ = require("lodash");

setCulture("en");
import {
  LinkService,
  ImageService,
} from "@syncfusion/ej2-angular-richtexteditor";
import { ToolbarService } from "@syncfusion/ej2-angular-documenteditor";
import {
  GridComponent,
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
@Component({
  selector: "cms-settingmap",
  templateUrl: "./settingmap.component.html",
  styleUrls: ["./settingmap.component.scss"],
  providers: [ToolbarService, LinkService, ImageService],
  encapsulation: ViewEncapsulation.None,
})
export class SettingMapComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.DELETE
  ])

  ip!: any;
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  public modelAdd: any;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // query auto complete
  public query = new Query();
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  // list filter
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  // Private
  private _unsubscribeAll: Subject<any>;
  //localData: any;
  status!: string;
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
    // private http: HttpClient,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // Set language
    this.languages = this.globals.currentLang;
    this.data = this._coreService;
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
        this.getListData();
      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
  }
  // GetListData
  getListData = (): void => {
    
    var extraParams: any = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "SettingMap/GetAll", extraParams);
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "SettingMap/GetAll", extraParams);
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.ADD:
        const objParamAdd = { id: this.nodeSelected, type: "new" };
        const paramAdd = window.btoa(JSON.stringify(objParamAdd));
        this.router.navigate(["/hrms/system/settingmap/", paramAdd]);
        //this.router.navigate(["/hrms/system/settingmap/new"]);
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
          const objParamAdd = { id: this.modelAdd.id, type: "edit" };
          const paramAdd = window.btoa(JSON.stringify(objParamAdd));
          this.router.navigate(["/hrms/system/settingmap/", paramAdd]);
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.DELETE:
        let selectedDelete: any = this.gridInstance.getSelectedRecords();
        this._coreService
          .Post(
            "SettingMap/ChangeStatus",
            selectedDelete.map((i: any) => Number(i.id))
          )
          .subscribe((res: any) => {
            //check error
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
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

  GetIpCallback(data: any) {
    this.ip = data.ip;
  }

  GetIp() {
    this._coreService
      .GetOther("http://api.ipify.org/?format=json")
      .subscribe((res: any) => {
      });

    $.get('http://api.ipify.org/?format=json', this.GetIpCallback);
  }
  PrintQR(data: any) {
    var qrCode = data.qrCode;
    // đếm số bản ghi select
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=400px,width=400px');
    let qrScript = `var qr = new QRious({
      element: document.getElementById('qr'),
      level: 'H',
      size: 500,
      value: '`+ qrCode + `'
    });`
    let spanQr = ` <canvas id="qr"></canvas></br>`

    popupWin!.document.open();
    popupWin!.document.write(
      `
     <!DOCTYPE html>
     <html>
     <head>
     <style>
     .container{
      height: 380px;
     }
     </style>
 </head>
       <body>
       <div class="container">
         `+ spanQr + `
         </div>
         <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
         <script>
           (function() {
          ` + qrScript + `

           })();
         </script>
       </body>
     </html>
     `
    )
  }
}

