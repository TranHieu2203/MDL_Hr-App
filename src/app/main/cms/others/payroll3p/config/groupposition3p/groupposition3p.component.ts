import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
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
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import {
  ListBoxComponent,
  CheckBoxSelection,
  FieldSettingsModel,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);

const _ = require("lodash");
import { FormBuilder, FormGroup } from "@angular/forms";
import { ToolbarInterface, ToolbarItem} from "src/app/_models/index";
const async = require("async");
import { Query, Predicate} from "@syncfusion/ej2-data";
setCulture("en");

@Component({
  selector: "cms-app-groupposition3p",
  templateUrl: "./groupposition3p.component.html",
  styleUrls: ["./groupposition3p.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class GroupPosition3PComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SAVE
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  // Array
  public data:any = [];
  public lstLearning = [];
  public lstRank = [];
   // Toolbar Item
   public toolbar!: ToolbarInterface[];

   public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Private
  private _unsubscribeAll: Subject<any>;

  field: any;
  editForm!: FormGroup;
  pageIndex: number = 0;
  query!: Query;

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
    this.GetListData();
  }

  GetListData = ()=>{
    async.waterfall([
      (cb: any)=>{
        this._coreService
        .Get("hr/otherlist/GetLeaningLvl")
        .subscribe((res: any) => {
          if(res.statusCode == "200"){
            this.lstLearning = res.data
          }
          return cb();
        });
      },
      (cb1: any)=>{
        this._coreService
        .Get("hr/SalaryRank/GetRankListAll")
        .subscribe((res: any) => {
          if(res.statusCode == "200"){
            this.lstRank = res.data
          }
          return cb1();
        });
      }
    ],(err: any,res: any)=>{
      this._coreService
      .Get("hr/classifyPostition/ListPNCD")
      .subscribe((res: any) => {
        if(res.statusCode == "200"){
          this.data = res.data
        }
      });
    })

  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
     const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.SAVE:
        this._coreService
        .Post("hr/classifyPostition/Add", this.data)
        .subscribe((res: any) => {
          if(res.statusCode == "200"){
            this.notification.editSuccess();
          }
          else{
            this.notification.editError();
          }
        });
      break;
      default:
        break;
    }
  };
  ChangeData = (event: any, data: any, field: any)  =>{
    setTimeout(()=>{
      if(event.isInteracted == true)
      {
        let index = parseInt(data.index);
        this.data[index][field] = data[field];
      }
    },300)
  }
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
   // Số thứ tự
   formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
}
