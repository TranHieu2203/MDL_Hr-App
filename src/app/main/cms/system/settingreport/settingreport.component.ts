import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  ElementRef,
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
  ToolbarItem,
  ToolbarInterface,
  TimeSheet,
  SettingReport,
} from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query} from "@syncfusion/ej2-data";

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
  RichTextEditorComponent,
} from "@syncfusion/ej2-angular-richtexteditor";
import { ToolbarService } from "@syncfusion/ej2-angular-documenteditor";
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
@Component({
  selector: "cms-attendance-settingreport",
  templateUrl: "./settingreport.component.html",
  styleUrls: ["./settingreport.component.scss"],
  providers: [ToolbarService, LinkService, ImageService],
  encapsulation: ViewEncapsulation.None,
})
export class SettingReportComponent implements OnInit {

  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SAVE, ToolbarItem.PRINT
    ])


  // Varriable Language
  languages: any;
  selectedLanguage: any;
  public field = {};
  public fields = {};
  @ViewChild("treeView", { static: false })
  public treeView!: TreeViewComponent;
  // @ViewChild("rteTool", { static: false })
  // public rteTool!: RichTextEditorComponent;
  public fontFamily: Object = {
    default: "Arial", // to define default font-family
  };
  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Khai báo data
  public tools: object = {
    items: [
      "Undo",
      "Redo",
      "|",
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "|",
      "FontName",
      "FontSize",
      "FontColor",
      "BackgroundColor",
      "|",
      "SubScript",
      "SuperScript",
      "|",
      "LowerCase",
      "UpperCase",
      "|",
      "Formats",
      "Alignments",
      "|",
      "OrderedList",
      "UnorderedList",
      "|",
      "Indent",
      "Outdent",
      "|",
      "CreateLink",
      "Image",
      "CreateTable",
      "|",
      "ClearFormat",
      //"Print",
      "SourceCode",
      "|",
      "FullScreen",
    ],
  };
  // public quickTools: object = {
  //   image: [
  //     "Replace",
  //     "Align",
  //     "Caption",
  //     "Remove",
  //     "InsertLink",
  //     "-",
  //     "Display",
  //     "AltText",
  //     "Dimension",
  //   ],
  // };

  // query auto complete
  public query = new Query();

  model = new SettingReport();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  localData: any;

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

    // Build toolbar
    this.buildToolbar();
    this.getTreeView();
  }

  drag(e: any) {
   var a = e.dataTransfer.setData("text", e.target.id);
  }
  nodeSelecting(e: any) {


    let id = Number(e.nodeData.id);
    this.getById(id).then((data: any) => {
      // if (data && data.text) {
      //   this.rteTool.value = data.text;
      // } else {
      //   this.rteTool.value = null;
      // }
      this.model.text = data.text || '';
      this.model.elements = data.elements;
      this.model.idMap = id;
    });
  }
  getTreeView() {
    this._coreService.Get("hr/FormList/GetTreeView").subscribe((res: any) => {
      this.localData = res.data;
      this.treeView.fields = {
        dataSource: this.localData,
        id: "idMap",
        text: "name",
        parentID: "parentId",
        hasChildren: "hasChild",
      };
    });
  }

  getById(id: number) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/FormList/GetByid?id=" + id)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.SAVE, ToolbarItem.PRINT];
    this.toolbar = this.globals.buildToolbar("sys_report", toolbarList!);
  };
  // filter checkbox
  keypress(e: any) {
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.SAVE:
        if (this.model.idMap == null) {
          this.notification.warning("Chọn báo cáo!");
          break;
        }

        //this.model.text = this.rteTool.getHtml();
       // this.model.text = this.rteTool.getHtml();
        let param = { idMap: this.model.idMap, text: this.model.text };

        // nếu là loại bảng công hoặc bảng lương
        this._coreService.Post("hr/FormList/Update", param).subscribe((res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
          }
        });

        break;
      case ToolbarItem.PRINT:
       // let data = this.rteTool.value;
        let popupWin = window.open(
          "",
          "_blank",
          "top=0,left=0,height='100%',width=auto"
        );

       // popupWin!.document.write(data);
       popupWin!.document.write(this.model.text!);
        popupWin!.document.close();
        popupWin!.print();
        popupWin!.onafterprint = function () {
          popupWin!.close();
        };

        break;
      case ToolbarItem.LOCK:
        break;
      default:
        break;
    }
  };
}
