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
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";

const _ = require("lodash");
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
setCulture("en");

@Component({
  selector: "cms-profile-kpiposition",
  templateUrl: "./kpiposition.component.html",
  styleUrls: ["./kpiposition.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class KpiPositionComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD, ToolbarItem.DELETE
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild("listPosition", { static: true })
  public listPosition!: TreeViewComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public model: kpiposition = new kpiposition();
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
  editForm!: FormGroup;
  mode!: string;
  lstPositionId = [];
  lstKpiTargetId: any = [];
  posId: number = 0;
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
    private _formBuilder: FormBuilder
  ) {
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    this.editForm = this._formBuilder.group({
      kpiTargetId: ["", Validators.required],
      positionId: ["", Validators.required],
    });
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
    this.getKpiTarget();
    this.getPosition();
    this.mode = "CheckBox";
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    this.modalService.open("modal-md");
  };

  // GetListData
  getListData = (posId: any): void => {
    
    this.posId = posId;
    let extraParams: any[] = [];
    if (posId) {
      extraParams.push({
        field: "positionId",
        value: posId,
      });
    }
    this._coreService.execute(this.state, "kpiposition/GetAll", extraParams);
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    extraParams.push({
      field: "positionId",
      value: this.posId,
    });
    this._coreService.execute(this.state, "kpiposition/GetAll", extraParams);
  }
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
  getPosition() {
    this._coreService.Get("hr/Position/getlist").subscribe((res: any) => {
      this.lstPositionId = res.data;
      this.listPosition.fields = {
        dataSource: res.data,
        id: "id",
        text: "name",
        parentID: "pid",
        hasChildren: "hasChild",
      };
      this.getListData(res.data[0].id);
      this.posId = res.data[0].id;
    });
  }
  getKpiTarget() {
    this._coreService.Get("kpiTarget/getlist").subscribe((res: any) => {
      this.lstKpiTargetId = res.data;
    });
  }
  close() {
    this.modalService.close("modal-md");
  }
  save() {
    if (!this.editForm.valid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this._coreService.Post("kpiPosition/Add", this.model).subscribe((res: any) => {
      if (res.statusCode == 400) {
        this.notification.checkErrorMessage(res.message);
      } else {
        this.notification.addSuccess();
        this.getListData(this.posId);
        this.editForm.reset();
        this.close();
      }
    });
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.modalService.open("modal-md");
        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          this._coreService
            .Post(
              "kpiPosition/Removes",
              selectDeletes.map((i: any) => i.id)
            )
            .subscribe((res: any) => {
              this.notification.deleteSuccess();
              this.getListData(this.posId);
            });
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.LOCK:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = selectDeletes.map((i: any) => i.id);
          this._coreService
            .Post("kpiposition/ChangeStatus", ids)
            .subscribe((res: any) => {
              if (res.statusCode == 200) {
                this.notification.lockSuccess();
                this.gridInstance.refresh();
              } else {
                this.notification.lockError();
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

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      let lstDeleteIds = _.map(this.modelDelete, "id").toString();
      if (lstDeleteIds.length > 0) {
        this._coreService
          .Delete("app-item/delete-many?ids=" + lstDeleteIds, {
            ip_address: "123456",
            channel_code: "W",
          })
          .subscribe((success: any) => {
            this.notification.deleteSuccess();
            this.modalService.close("confirm-delete-modal");
            this.gridInstance.clearSelection();
            this.gridInstance.refresh();
          });
      }
    }
  };
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
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }

  positionSelecting(e: any) {
    this.getListData(e.nodeData.id);
  }


}
class kpiposition {
  kpiTargetId: any;
  positionId: any;
}
