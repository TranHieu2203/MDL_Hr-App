import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject } from "rxjs";
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
  VirtualScrollService,ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import {
  FilterSettingsModel,
  IFilter,
  Filter,
} from "@syncfusion/ej2-angular-grids";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { createElement } from "@syncfusion/ej2-base";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
const _ = require("lodash");
import { Booking } from "src/app/_models/app/cms/index";

setCulture("en");

@Component({
  selector: "cms-app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class BookingComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  editForm!: FormGroup;
  model: Booking = new Booking();
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  public modelPost = {
    id: null,
    note: null
  }
  public formatString: string = "HH:mm:ss";
  public interval: number = 60;
  public flagTool = "";
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;

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
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private _formBuilder: FormBuilder,
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

    this.editForm = this._formBuilder.group({
      roomName: [""],
      empName: [""],
      empCode: [""],
      orgName: [""],
      bookingDay: [""],
      hourFrom: [""],
      hourTo: [""],
      note: [""],
      status: [""],
      approveName: [""],
      approveDate: [""],
      approveNote: [""]
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
    //this.buildToolbar();
    // Load List Data
    this.getListData();
    this.editForm.disable();


  }

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.APPROVED, ToolbarItem.DENIED];
    this.toolbar = this.globals.buildToolbar("booking", toolbarList!);
  };
  // filter checkbox

  // GetListData
  getListData = (): void => {
    
    this._coreService.execute(this.state, "hr/booking/GetAll");
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    this._coreService.execute(this.state, "hr/booking/GetAll", extraParams);
  }
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
    let selectDeletes = this.gridInstance.getSelectedRecords();
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.APPROVED:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes.map((i: any) => i.id);
          this._coreService
            .Post("hr/booking/Approve", ids)
            .subscribe((res: any) => {
              if (res.statusCode == 200) {
                this.notification.approvedSuccess();
                this.gridInstance.refresh();
              } else {
                this.notification.checkErrorMessage(res.message);
              }
            });
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.DENIED:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes.map((i: any) => i.id);
          this._coreService.Post("hr/booking/Reject", ids).subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.deniedSuccess();
              this.gridInstance.refresh();
            }
          });
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      default:
        break;
    }
  };
  ClickRecord(data: any, status: any) {
    this.flagTool = status;
    this.model = data;
    if (this.flagTool == 'view') {
      this.editForm.get("approveNote")!.disable();
    }
    else {
      this.editForm.get("approveNote")!.enable();
    }
    this.modalService.open("confirm-tool-modal");
  }
  Confirm(status: any) {
    if (status == "cancel") {
      this.modalService.close("confirm-tool-modal")
    }
    else {
      if (this.flagTool == "accept") {
        this._coreService
          .Post("hr/booking/Approve", this.model)
          .subscribe((res: any) => {
            if (res.statusCode == 200) {
              this.notification.approvedSuccess();
              this.modalService.close("confirm-tool-modal")
              this.gridInstance.refresh();
            } else {
              this.notification.checkErrorMessage(res.message);
            }
          });
      }
      else {
        this._coreService.Post("hr/booking/Reject", this.model).subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.deniedSuccess();
            this.modalService.close("confirm-tool-modal")
            this.gridInstance.refresh();
          }
        });
      }
    }
  }

  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}

