import { ScrollService } from './../../_services/scroll.service';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
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
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
const _ = require("lodash");
import { TreeViewComponent, FieldsSettingsModel } from "@syncfusion/ej2-angular-navigations";
import { ModalService } from "src/app/_services/modal.service";
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import { takeUntil } from "rxjs/operators";
setCulture("en");

@Component({
  selector: "cms-app-org",
  templateUrl: "./organization.component.html",
  styleUrls: ["./organization.component.css"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class OrganizationComponent implements OnInit, OnDestroy {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  @ViewChild("treeView", { static: true }) listTreeObj!: TreeViewComponent;
  @ViewChild("maskObj", { static: true }) maskObj!: MaskedTextBoxComponent;
  // list data source for TreeView component
  public localData: any[] = [];
  // Mapping TreeView fields property with data source properties
  public field: any;

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data!: any[];
  public showCheckBox: boolean = false;

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  isDisso: any;
  element: any;
  curentText: string = '';
  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private modalService: ModalService,
    private scrollService: ScrollService
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
    this.modalService.add(this);
    this.loadDataFromLocal();
    this.loadTreeView();
    this._coreService.organizationSelect
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        if (res) {
          let rootItem = this.localData.find(item=>item.PARENT_ID==undefined)
          this.listTreeObj.selectedNodes = [rootItem.ID];
          this._coreService.organization.next({ id: rootItem.ID });
        }
      });
  }
  loadDataFromLocal() {
    let orgId: any = localStorage.getItem("orgIds");
    this.localData = JSON.parse(orgId);
  }
  // Refesh data when add  organization new
  refesh() {
    this._coreService
      .Get("hr/Organization/GetOrgPermission")
      .subscribe((res: any) => {
        // Xóa những parent Id node không có trong treeView
        if (res.data && res.data.length > 0) {
          var ids = res.data.map((item: any) => item.ID);
          res.data.forEach((element: any) => {
            if (!ids.includes(element.PARENT_ID)) {
              delete element.PARENT_ID;
            }
          });
          localStorage.setItem("orgIds", JSON.stringify(res.data));
        }
      });
  }
  loadTreeView(keyWord: string = '') {
    var datasource: any;
    datasource = this.localData;
    let firstId = 1

    if (keyWord != '' && keyWord.length >= 2) {
      datasource = this.findByKeyWord(datasource, keyWord)
      const set = new Set(datasource);
      const filteredArr = [...set];
      datasource = filteredArr
    } else {
    }
    if (this.isDisso === 1) {
    } else {
      datasource = datasource.filter((item: any) => {
        return (item.STATUS == 'Active')
      });
    }

    // hightlight

    datasource.map((u: any) => u.hightLight = (keyWord != '' && (u.NAME.toLowerCase().includes(keyWord.toLowerCase()))) ? true : false);
    firstId = datasource.find((data: any) => data.NAME.toLowerCase().includes(keyWord.toLowerCase()))?.ID;
    this.listTreeObj.fields = {
      dataSource: datasource,
      id: "ID",
      parentID: "PARENT_ID",
      text: "NAME",
      hasChildren: "HAS_CHILD",
      isChecked: "IS_CHECKED",
      expanded: "EXPAND",
    };
    if (keyWord != '') {
      setTimeout(() => {
        if (firstId) this.scrollService.scrollToElementById(firstId.toString())
      }, 200);
    }
  }
  findByKeyWord(data: any, keyword: string) {
    let newData = [];
    // lấy gốc của tree
    newData.push(data.find((item: any) => item.PARENT_ID == undefined))

    let findData = data.filter((item: any) => { return item.NAME.toLowerCase().includes(keyword.toLowerCase()) })
    
    if (findData.length > 0) {
      findData.forEach((el: any) => {
        newData.push(el)
        let parent = this.findParent(data, el)
        if (parent.length > 0) {
          parent.forEach(el => newData.push(el))
        }
      });

    }
    return newData;
  }
  findParent(data: any, item: any) {
    let newData = []
    // find parent
    let newParent = data.find((el: any) => el.ID === item.PARENT_ID && el.PARENT_ID != undefined)
    if (newParent) {
      newData.push(newParent)
      if (newParent.PARENT_ID != undefined) {
        let hightParent: any = this.findHightParent(data, newParent)
        if (hightParent.length > 0) {
          hightParent.forEach((el: any) => newData.push(el))
        }
      }
    }
    return newData;
  }
  findHightParent(data: any, item: any) {
    let newData = []
    // find parent
    let newParent = data.find((el: any) => el.ID === item.PARENT_ID && el.PARENT_ID != undefined)
    if (newParent) {
      newData.push(newParent)
      let hightParent: any = this.findParent(data, newParent)
      if (hightParent.length > 0) {
        hightParent.forEach((el: any) => {
          newData.push(el)
        });
      }
    }
    return newData;

  }

  //Filtering the TreeNodes
  public searchNodes(args: any) {
    let _text = this.maskObj.element.value;
    setTimeout(() => {
      this.loadTreeView(_text)
    }, 300);
  }

  nodeSelecting(e: any) {
    if (e.isInteracted) {
      let id = Number(e.nodeData.id);
      this.nodeSelected = _.find(this.localData, { ID: id });
      this.nodeSelected.id = id;
      this._coreService.organization.next(this.nodeSelected);
    }
  }
  public isDissoCheck(e: any) {
    this.isDisso = e.checked ? 1 : 0;
    this._coreService.isDisso.next(this.isDisso);
    this.loadTreeView()

  }
  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this._unsubscribeAll.next(true);
    this._unsubscribeAll.complete();
  }
}
