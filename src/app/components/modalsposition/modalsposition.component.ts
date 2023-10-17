import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  Input,
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
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { PositionOrg, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
const _ = require("lodash");
import { map, takeUntil } from "rxjs/operators";
import {
  GridComponent,
  SelectionSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { ModalService } from "src/app/_services/modal.service";
setCulture("en");

@Component({
  selector: "cms-app-modalsposition",
  templateUrl: "./modalsposition.component.html",
  styleUrls: ["./modalsposition.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ModalsPositionComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  modelAdd: PositionOrg = new PositionOrg();
  @Input() id!: string;
  @Input() model: any;

  @ViewChild("overviewgridposition", { static: false })
  public gridInstance!: GridComponent;

  public field = {};
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  private status: number = -1;
  // Khai báo data
  public dataPosition: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public selectionOptions!: SelectionSettingsModel;
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  element: any;
  param: any;
  terminate: number = 0;
  positionCode: any;


  /**
   * Constructor
   *
   */
  constructor(
    private _coreServiceEmp: CoreService,
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
    this.dataPosition = _coreServiceEmp;
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
    this.getListDataPosition();

    if (param && param.multiselect) {
      this.selectionOptions = {
        type: "Multiple",
        enableSimpleMultiRowSelection: true
      };
    } else if (param && !param.multiselect) {
      this.selectionOptions = {
        type: "Single",
        enableSimpleMultiRowSelection: true
      };
    }

    this.param = param;
    this.element.style.display = "block";
    document.body.classList.add("v2hrm-modal-open");
  }

  // close modal
  close(): void {
    this.status = 0;
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


  async choise() {
    this.status = 0;
    let x: any = this.gridInstance.getSelectedRecords();
    let checkExists = false;

    if (x.length == 0) {
      this.notification.warning("Chưa chọn vị trí");
      return;
    }

    if (x.length >= 1) {
      let lstmodelAdd: PositionOrg[] = [];
      for (let i = 0; i < x.length; i++) {
        const newItem: PositionOrg = {
          orgId: this.param.selected,
          positionId: x[i].positionId
        };
        lstmodelAdd.push(newItem);
      }
      this._coreServiceEmp.Post("hr/positionorg/add", lstmodelAdd).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
            this.modalService.position.next(true);

            this.modalService.close("cms-app-modalsposition");
        
          } else {
            this.notification.addSuccess()
            this.modalService.position.next(true);

            this.modalService.close("cms-app-modalsposition");
        
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    }
    var extraParams: any = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }


  }
  getListDataPosition() {
    

    this.pageIndex = Math.floor(this.state.skip! / this.state.take!);
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    this._coreServiceEmp.execute(this.state, "hr/position/GetPopupPosition", extraParams);

  }

  public dataStateChangePosition(state: DataStateChangeEventArgs): void {

    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    this._coreServiceEmp.execute(state, "hr/position/GetPopupPosition", extraParams);
  }

}
