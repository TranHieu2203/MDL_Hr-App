import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  Input,
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
import { GridComponent, PagerAllModule } from "@syncfusion/ej2-angular-grids";
import { ModalService } from "src/app/_services/modal.service";
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import { ScrollService } from './../../_services/scroll.service';
import {
  DataManager,
  Query,
  ReturnOption,
  Predicate,
} from "@syncfusion/ej2-data";
setCulture("en");

@Component({
  selector: "cms-app-modals-org",
  templateUrl: "./modalsorganization.component.html",
  styleUrls: ["./modalsorganization.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ModalsOrgComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  @Input() id!: string;
  @Input() model: any;
  @ViewChild("treeView", { static: true }) listTreeObj!: TreeViewComponent;
  @ViewChild("maskObj", { static: true }) maskObj!: MaskedTextBoxComponent;
  selectionOptions = "";
  showCheckBox = false;
  // list data source for TreeView component
  public localData: any[] = [];
  // Mapping TreeView fields property with data source properties
  public field: any;

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data!: any[];

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  element: any;
  isDisso: any;

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
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private modalService: ModalService,
    private el: ElementRef,
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
    this.element = el.nativeElement;
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
  }
  //Change the dataSource for TreeView
  public changeDataSource(data: any) {
    this.listTreeObj.fields = {
      dataSource: data,
      id: "ID",
      parentID: "PARENT_ID",
      text: "NAME",
      hasChildren: "HAS_CHILD",
      isChecked: "IS_CHECKED",
      expanded: "EXPAND",
    };
  }
  //Filtering the TreeNodes
  public searchNodes(args: any) {
    // let _text = this.maskObj.element.value;
    // let predicats = [],
    //   _array = [],
    //   _filter = [];
    // if (_text == "") {
    //   this.changeDataSource(this.localData);
    // } else {
    //   let predicate = new Predicate("name", "contains", _text, true);
    //   let filteredList = new DataManager(this.localData).executeLocal(
    //     new Query().where(predicate)
    //   );
    //   for (let j = 0; j < filteredList.length; j++) {
    //     _filter.push((filteredList[j] as any)["id"]);
    //     let filters = this.getFilterItems(filteredList[j], this.localData);
    //     for (let i = 0; i < filters.length; i++) {
    //       if (_array.indexOf(filters[i]) == -1 && filters[i] != null) {
    //         _array.push(filters[i]);
    //         predicats.push(new Predicate("id", "equal", filters[i], false));
    //       }
    //     }
    //   }
    //   if (predicats.length == 0) {
    //     this.changeDataSource([]);
    //   } else {
    //     let query = new Query().where(Predicate.or(predicats));
    //     let newList = new DataManager(this.localData).executeLocal(query);
    //     this.changeDataSource(newList);
    //     let proxy = this;
    //     setTimeout(function (this: any) {
    //       proxy.listTreeObj.expandAll();
    //     }, 100);
    //   }
    // }
    let _text = this.maskObj.element.value;
    setTimeout(() => {
      this.loadTreeView(_text)
    }, 300);
  }
  //Find the Parent Nodes for corresponding childs
  public getFilterItems(fList: any, list: any): any {
    let nodes = [];
    nodes.push(fList["id"]);
    let query2 = new Query().where("id", "equal", fList["pid"], false);
    let fList1 = new DataManager(list).executeLocal(query2);
    if (fList1.length != 0) {
      let pNode = this.getFilterItems(fList1[0], list);
      for (let i = 0; i < pNode.length; i++) {
        if (nodes.indexOf(pNode[i]) == -1 && pNode[i] != null)
          nodes.push(pNode[i]);
      }
      return nodes;
    }
    return nodes;
  }

  // open modal
  open(param?: any): void {
    this.maskObj.element.value = "";
    let orgId: any = localStorage.getItem("orgIds");
    this.localData = JSON.parse(orgId);
    this.loadTreeView();
    if (param.showCheckBox == true) {
      this.selectionOptions = "showCheckBox";
      this.showCheckBox = true;
    }
    if (param.selected) {
      this.listTreeObj.selectedNodes = [param.selected.toString()];
    }
    this.element.style.display = "block";
    document.body.classList.add("v2hrm-modal-open");
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
  // close modal
  close(): void {
    this.element.style.display = "none";
    document.body.classList.remove("v2hrm-modal-open");
    this.modalService.modalStatus.next("close");
    this.listTreeObj.selectedNodes = [];
  }
  maximize() {
  }
  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }
  nodeSelecting(e: any) {
    let id = Number(e.nodeData.id);
    this.nodeSelected = _.find(this.localData, { ID: id });
  }
  choiseOrg() {
    if (this.showCheckBox) {
      let y: any = this.listTreeObj.checkedNodes;
      this.modalService.organization.next(y);
      this.modalService.close("cms-app-modals-org");
    }
    else {
      this.modalService.organization.next(this.nodeSelected);
      this.modalService.close("cms-app-modals-org");
    }
  }
  public isDissoCheck(e: any) {
    this.isDisso = e.checked ? 1 : 0;
    this._coreService.isDisso.next(this.isDisso);
    this.loadTreeView()

  }
  // getTreeView() {
  //   return new Promise((resolve) => {
  //     this._coreService
  //       .Get("hr/organization/GetOrgPermission")
  //       .subscribe((res: any) => {
  //         resolve(res);
  //       });
  //   });
  // }
}
