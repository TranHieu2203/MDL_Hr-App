import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject
} from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

// Service Translate
import { TranslationLoaderService } from 'src/app/common/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
// Import the locale files
import { locale as english } from './i18n/en';
import { locale as vietnam } from './i18n/vi';
// Globals File
import { Globals } from 'src/app/common/globals';
import { Configs } from 'src/app/common/configs';
import { Notification } from 'src/app/common/notification';
const _ = require('lodash');
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  FilterService,
  GridComponent,
  VirtualScrollService
} from '@syncfusion/ej2-angular-grids';
import { DataStateChangeEventArgs } from '@syncfusion/ej2-angular-grids';
import { ToolbarItem, ToolbarInterface } from 'src/app/_models/index';
import { CoreService } from 'src/app/_services/core.service';
import { ConfigService } from 'src/app/_services/config.service';

setCulture('en');

@Component({
  selector: 'app-sys-dashboard',
  templateUrl: './sdashboard.component.html',
  styleUrls: ['./sdashboard.component.scss'],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None
})
export class SysDashboardComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  // View child Grid
  @ViewChild('overviewgrid', { static: false })
  public gridInstance!: GridComponent;

  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // List data
  public data: any[] = [];
  public modelAdd: any;

  // Private
  private _unsubscribeAll: Subject<any>;

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
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    this.data = [];

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next('true');
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
      id: this._translateService.currentLang
    });
    this._translateService.use(this.languages);

    // Build toolbar
    this.buildToolbar();

    // Load List Data
    this.getListData();
  }

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [
      ToolbarItem.ADD,
      ToolbarItem.EDIT,
      ToolbarItem.DELETE,
      ToolbarItem.PRINT
    ];
    this.toolbar = this.globals.buildToolbar('app-sys-account', toolbarList);
  };

  // GetListData
  getListData = (): void => {
    
    //this._coreService.execute(this.state, 'OtherListType/List');
  };

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.router.navigate(['/sys/config/account/new']);
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
          this.router.navigate(['/sys/config/account/', this.modelAdd.id]);
        } else {
          this.notification.warning('notify.NO_RECORD_SELECT');
        }
        break;
      case ToolbarItem.DELETE:
        const selectDeletes = this.gridInstance.getSelectedRecords();
        if (selectDeletes && selectDeletes.length > 0) {
        } else {
          this.notification.warning('notify.NO_RECORD_SELECT');
        }
        break;
      default:
        break;
    }
  };

  // Grid Createad
  gridCreated = (event: any) => {
    // this.gridInstance
    //   .getHeaderContent()
    //   .querySelector('#name_filterBarcell')
    //   .setAttribute('placeholder', 'tìm kiếm');
  };
}
