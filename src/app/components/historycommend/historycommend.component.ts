import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  Input,
  ViewChildren,
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
import { GridComponent, ToolbarItems } from "@syncfusion/ej2-angular-grids";
import { ModalService } from "src/app/_services/modal.service";
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import { DataManager, Query, Predicate } from "@syncfusion/ej2-data";

setCulture("en");

@Component({
  selector: "app-historycommend",
  templateUrl: "./historycommend.component.html",
  styleUrls: ["./historycommend.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class HistorycommendComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  @Input() data : any;
  @ViewChild("overviewgridLstEmp", { static: true })
  public gridInstanceLstEmp!: GridComponent;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  // Toolbar Item;
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  selectionOptions = {
    type: "Multiple",
    enableSimpleMultiRowSelection: true,
  };

  /**
   * Constructor
   *
   */
  constructor(
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private notification: Notification,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private modalService: ModalService,
    private el: ElementRef
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
    // this.toolbarGrid = [
    //   {
    //     text: "Thêm nhân viên",
    //     tooltipText: "Thêm nhân viên",
    //     prefixIcon: "e-plus",
    //     id: "add",
    //   },
    //   {
    //     text: "Xóa nhân viên",
    //     tooltipText: "Xóa nhân viên",
    //     prefixIcon: "e-minus",
    //     id: "remove",
    //   },
    // ];
  }
  getName(arr: any[]) {
    if(arr && arr.length > 0)
    {
      return arr.map((i: any) => i.name).join(",");
    }
    return null;
  }

  ViewRecord(param: any){
    const objParamAdd = { id: param.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    let Url = window.location.origin + "/hrms/profile/business/commend/" + paramAdd;
    window.open(Url,"_blank")
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
  }
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstanceLstEmp.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
}
