import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  OnDestroy,
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
import { ToolbarItem, ToolbarInterface, LevelDetails } from "src/app/_models/index";
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

const _ = require("lodash");
import { takeUntil } from "rxjs/operators";
import { Splitter, SplitterComponent } from "@syncfusion/ej2-angular-layouts";
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
setCulture("en");

@Component({
  selector: "cms-leveldetails",
  templateUrl: "./leveldetails.component.html",
  styleUrls: ["./leveldetails.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class LevelDetailsComponent implements OnInit, OnDestroy {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  model: LevelDetails = new LevelDetails();
  name = "Mức năng lực";
  flagState = "view";
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  @ViewChild('splitterInstance', { static: false })
  splitterObj!: SplitterComponent;
  @ViewChild("treeView", { static: false })
  public listTreeObj!: TreeViewComponent;

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
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public flagStatusEmp: any;
  public modelDelete: Array<any> = [];
  public localData = [];
  public lstLevel = [];
  editForm!: FormGroup;
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
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
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _formBuilder: FormBuilder,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      level: ["", Validators.required],
      mark: ["", Validators.required],
      name: ["", Validators.required],
      code: ["", Validators.required]
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
    this.editForm.disable();
    // Build toolbar
    this.buildToolbar();
    // Load List Data
    this.GetListTreeView();
    this.GetLstLevel();
    this.getListData();
  }
  GetListTreeView() {
    this._coreService.Get("hr/Competence/GetTreeView").subscribe((res: any) => {
      this.localData = res.data;
      const x = setInterval(() => {
        if (this.listTreeObj) {
          this.listTreeObj.fields = {
            dataSource: this.localData,
            id: "id",
            text: "name",
            parentID: "parentId",
            hasChildren: "hasChildren",
            expanded: "expand"
          };
          clearInterval(x);
        }
      }, 100);
    });

  }
  GetLstLevel = () => {
    this._coreService.Get("hr/otherlist/GetOtherListByType?code=COMPETENCE").subscribe((res: any) => {
      this.lstLevel = res.data;
    });
  }
  nodeSelecting(e: any) {
    this.nodeSelected = e.nodeData.id;
    this.name = e.nodeData.text;
    this.editForm.reset();
    this.getListData();
  }
  viewRecord = (event: any) => {
    this.modelAdd = event.data;
    this._coreService.Get("hr/Competence/get?id=" + this.modelAdd.id).subscribe((res: any) => {
      this.model = res.data;
    });
  };

  // Build Toolbar
  buildToolbar = () => {
    var toolbarList: any[] = [];
    if (this.flagState == 'view') {
      toolbarList = [ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.DELETE]
      this.editForm.disable();
    }
    if (this.flagState !== "view") {
      toolbarList = [ToolbarItem.SAVE, ToolbarItem.CANCEL]
      this.editForm.enable();
    }
    this.toolbar = this.globals.buildToolbar("levelCompetence", toolbarList!);
  };
  // filter checkbox

  // GetListData
  getListData = (): void => {
    
    var extraParams: any = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "ParentId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "hr/Competence/GetAllLevel", extraParams);
  };
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "ParentId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "hr/Competence/GetAllLevel", extraParams);
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.flagState = "new";
        this.buildToolbar();
        this.editForm.reset();
        break;
      case ToolbarItem.EDIT:
        this.flagState = "edit";
        this.buildToolbar();
        break;
      case ToolbarItem.SAVE:
        if (!this.nodeSelected) {
          this.notification.warning("Bạn chưa chọn năng lực !");
          return;
        }
        if (!this.editForm.valid) {
          this.notification.warning("Bạn chưa nhập đủ các trường !");
          this.editForm.markAllAsTouched();
          return;
        }
        this.model.parentId = this.nodeSelected
        if (this.flagState == "new") {
          this._coreService.Post("hr/Competence/AddLevel", this.model).subscribe((res: any) => {
            if (res.statusCode == "200") {
              this.notification.addSuccess();
              this.editForm.reset();
              this.getListData();
              this.flagState = 'view';
              this.buildToolbar();
            }
            else {
              this.notification.checkErrorMessage(res.message)
            }
          });
        }
        if (this.flagState == "edit") {
          this._coreService.Post("hr/Competence/UpdateLevel", this.model).subscribe((res: any) => {
            if (res.statusCode == "200") {
              this.notification.editSuccess();
              this.editForm.reset();
              this.getListData();
              this.flagState = 'view';
              this.buildToolbar();
            }
            else {
              this.notification.editError();
            }
          });
        }
        break;
      case ToolbarItem.DELETE:
        this.modalService.open("confirm-delete-modal");
        const selectRows = this.gridInstance.getSelectedRecords();
        this.modelDelete = selectRows;
        break;
      case ToolbarItem.CANCEL:
        this.editForm.reset();
        this.flagState = "view";
        this.buildToolbar();
        this.gridInstance.clearRowSelection();
        break;
      default:
        break;
    }
  };
  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      let lstDeleteIds = _.map(this.modelDelete, "id");
      if (lstDeleteIds.length > 0) {
        this._coreService
          .Post("hr/Competence/DeleteLevel", lstDeleteIds[0])
          .subscribe((success: any) => {
            this.notification.deleteSuccess();
            this.modalService.close("confirm-delete-modal");
            this.gridInstance.clearSelection();
            this.gridInstance.refresh();
            this.editForm.reset();
          });
      }
    }
  };
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
