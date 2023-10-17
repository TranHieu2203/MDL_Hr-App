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
import {
  ToolbarItem,
  ToolbarInterface,
  Organization,
  Competence,
} from "src/app/_models/index";
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
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
const $ = require("jquery");
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
setCulture("en");

@Component({
  selector: "cms-app-competence",
  templateUrl: "./competence.component.html",
  styleUrls: ["./competence.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class CompetenceComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  @ViewChild("treeView", { static: false })
  public listTreeObj!: TreeViewComponent;

  public localData: any[] = [];

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data

  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;

  model: Competence = new Competence();
  modelTemp: Competence = new Competence();
  editForm!: FormGroup;
  paramId!: string;
  nodeSelected: any;
  field: any;
  lstParentId: any;
  flagState!: string;

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
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.editForm = this._formBuilder.group({
      name: ["",[Validators.required,this.globals.noWhitespaceValidator]],
      code: ["",
        [
          Validators.required,
          Validators.maxLength(31),
          this.globals.checkExistSpace,
        ],
      ],
      parentName: [""],
      note: [""],
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
    this.buildToolbar();
    // Load List Data
    // xử lý bất đồng bộ
    
    this.GetListTreeView();
    this.editForm.disable();
  }

  getById(id: any) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Competence/get?id=" + id).subscribe((res: any) => {
        resolve(res.data);
      });
    });
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

  nodeSelecting(e: any) {
    this.nodeSelected = e.nodeData.id;
    this.getById(this.nodeSelected).then((res: any) => {
      this.model = res;
    });
    this.editForm.disable();
  }
  // lưu data open popup
  saveData = () => {
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }
   
    if (this.flagState === "new") {
      this._coreService
        .Post("hr/Competence/add", this.model)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            // reload treeview
            setTimeout(() => {
              this.editForm.disable();
              this.flagState = "";
              this.buildToolbar();
              this.GetListTreeView();
            }, 300);
          }
        });
    } else {
      this._coreService
        .Post("hr/Competence/Update", this.model)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            setTimeout(() => {
              this.editForm.disable();
              this.flagState = "";
              this.buildToolbar();
              this.GetListTreeView();
            }, 300);
          }
        });
    }
  };
  // Build Toolbar
  buildToolbar = () => {
    let toolbarList: any[] = [];
    if(!this.flagState)
    {
      toolbarList = [ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.SAVE];
    }
    if(this.flagState == 'new' || this.flagState == 'edit')
    {
      toolbarList = [ToolbarItem.CANCEL, ToolbarItem.SAVE];
    }
    this.toolbar = this.globals.buildToolbar("organization", toolbarList!);
  };
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.flagState = "new";
        // if (!this.nodeSelected) {
        //   this.notification.warning("Chưa chọn đơn vị cha");
        //   break;
        // }
        let parentName = this.model.name;
        this.editForm.enable();
        this.editForm.reset();
        this.model = new Organization();
        setTimeout(() => {
          this.model.parentId = this.nodeSelected;
          this.model.parentName = parentName;
        }, 200);

        this.buildToolbar();
        break;
      case ToolbarItem.EDIT:
        this.modelTemp = _.cloneDeep(this.model)
        this.flagState = "edit";
        this.editForm.enable();
        this.editForm.get("code")!.enable();
        this.buildToolbar();
        break;
      case ToolbarItem.DELETE:
        if (!this.nodeSelected) {
          this.notification.warning("Chưa chọn phòng ban");
        }
        this._coreService
          .Get("hr/organization/Delete?id=" + this.nodeSelected)
          .subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.deleteSuccess();
              this.editForm.disable();
              this.editForm.reset();
            }
          });

        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.LOCK:
        break;
        case ToolbarItem.CANCEL:
          if(this.flagState == 'new')
          {
            this.model = new Organization();
           
          }
          else {
            this.model = _.cloneDeep(this.modelTemp);
          }
          this.flagState = "";
          this.editForm.disable();
          this.buildToolbar();
          break;
      default:
        break;
    }
  };
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
