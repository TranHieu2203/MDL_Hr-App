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
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
const _ = require("lodash");
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ModalService } from "src/app/_services/modal.service";

setCulture("en");

@Component({
  selector: "cms-app-modalsdecision",
  templateUrl: "./modalsdecision.component.html",
  styleUrls: ["./modalsdecision.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ModalsdecisionComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  @Input() id!: string;

  @ViewChild("overviewgrid", { static: true })
  public gridInstance!: GridComponent;

  // Khai báo data
  public data!: any[];

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  element: any;
  localData = [];
  showMask = false;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
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

  // open modal
  open(param?: any): void {
    this.getListData(param.employeeId).then((res: any) => {
      if (param.selected) {
        let data = this.gridInstance.getCurrentViewRecords();
        let index = _.findIndex(data, { id: param.selected });
        this.gridInstance.selectRow(index);
      }
    });
    this.element.style.display = "block";
    document.body.classList.add("v2hrm-modal-open");
  }

  // close modal
  close(): void {
    this.gridInstance.clearSelection();
    this.element.style.display = "none";
    document.body.classList.remove("v2hrm-modal-open");
    this.modalService.modalStatus.next("close");
  }
  maximize() {
  }
  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }
  choise() {
    let x = this.gridInstance.getSelectedRecords()[0];
    this.modalService.decision.next(x);
    this.modalService.close("cms-app-modalsdecision");
  }

  // GetListData
  getListData(id?: any) {
    const state = { skip: 0, take: 1000 };
    let extraParams: any[] = [];
    if (id) {
      extraParams.push({
        field: "EmployeeId",
        value: id,
      });
    }
    return new Promise<void>((resolve) => {
      this._coreService
        .GetAll(state, "hr/working/GetWorking", extraParams)
        .subscribe((res: any) => {
          this.data = res.result;
          resolve();
        });
    });
  }

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
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
