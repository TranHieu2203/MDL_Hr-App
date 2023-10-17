import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  AfterViewInit,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";

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
const _ = require("lodash");
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { TemplateDecision } from "src/app/_models/app/list/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import { Consts } from "src/app/common/const";
const async = require("async");
setCulture("en");

@Component({
  selector: "app-templatedecision-edit",
  templateUrl: "./templatedecision-edit.component.html",
  styleUrls: ["./templatedecision-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class TemplateDecisionEditComponent implements OnInit {
  
  toolItems$ = new BehaviorSubject<any[]>([
  ]);
  // Varriable Language
  flagState = "";
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: TemplateDecision = new TemplateDecision();
  modelTemp: TemplateDecision = new TemplateDecision();
  languages: any;
  selectedLanguage: any;

  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };
  flagState$ = new BehaviorSubject<string>('');
  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstApplication: any;
  lsttypeId: any;
  lstdecisionId: any;

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
    private _formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // Get Route Param
    this.activatedRoute.params.subscribe((params: Params) => {
      const paramId = params["id"];
      // Nếu trạng thái chỉnh sửa thì Get dữ liệu
      if (paramId !== "new") {
        const objParam = window.atob(paramId);
        const paramUrl = JSON.parse(objParam);        
        if (paramUrl && paramUrl.id) {
          this.paramId = paramUrl.id;
          this.flagState$.next(paramUrl.type);
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState$.next("new");
      }
    });

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      typeId: ["",Validators.required],
      decisionId: ["",Validators.required],
      templateCode: [""],
      name: ["",Validators.required]
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

     // Build toolbar
     this.flagState$.subscribe(x => {
      let toolbarList: any[] = [];
      
      if (x === "view") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
        this.editForm.disable();
      } else {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }


      if (x === "edit") {
      }
      this.toolItems$.next(toolbarList)

    })
    
    async.waterfall(
      [
        (cb: any) => {
          if (this.paramId) {
            this._coreService
              .Get("author/TemplateDecision/get?id=" + this.paramId)
              .subscribe((res: any) => {
                this.modelTemp = res.data;
                cb();
              });
          } else {
            cb();
          }
        },
        (cb: any) => {
          this._coreService
            .Get("hr/otherlist/GetTypeTemplateDecision")
            .subscribe((res: any) => {
              this.lsttypeId = res.data;
              cb();
            });
        },
      ],
      (err: any, ok: any) => {

        
        this.model = _.cloneDeep(this.modelTemp);
        this.loadDatalazy(this.model)
        //delete this.modelTemp;
      }
    );
  }
  changeType(e: any) {
    if (e.e) {

      this.lstdecisionId = [];
      if(e.itemData.id == 1){
        this._coreService
        .Get("hr/contracttype/GetList")
        .subscribe((res: any) => {
          this.lstdecisionId = res.data;
        });
      }
      if(e.itemData.id == 2){
        this._coreService
        .Get("hr/otherlist/TYPEDECISION")
        .subscribe((res: any) => {
          this.lstdecisionId = res.data;
        });
      }
    }
  }
  
  loadDatalazy(model: TemplateDecision) {

    if (model && model.typeId) {
      this.getlstDecisionId(model.typeId)
        .then((res: any) => {
          this.lstdecisionId = res;
        })
        .then((x) => {
          this.model.decisionId = model.decisionId;
        });
      
    }
    
  }
  getlstDecisionId(id: number) {
    
      return new Promise((resolve) => {
        if (id == 1) {
          this._coreService
          .Get("hr/contracttype/GetList")
            .subscribe((res: any) => {
              resolve(res.data);
            });
        }
        else if(id ==2){
          this._coreService
          .Get("hr/otherlist/TYPEDECISION")
            .subscribe((res: any) => {
              resolve(res.data);
            });
        } else {
          resolve(false);
        }
      });
    
    
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.BACK:
        if (this.editForm.dirty && this.editForm.touched) {
          this.flagePopup = false;
        }
        if (
          (this.editForm.dirty && this.editForm.touched) ||
          this.flagePopup === false
        ) {
          this.modalService.open("confirm-back-modal");
        }
        if (this.flagePopup === true) {
          this.router.navigate(["hrms/system/templatedecision"]);
        }
        break;     
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState$.next("edit");
        this.flagePopup = true;
        this.editForm.enable();
        break;       
      default:
        break;
    }
  };
  // lưu data open popup
  saveData = () => {
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ!");
      this.editForm.markAllAsTouched();
    } else {

      if (this.flagState$.value === 'new') {
        this._coreService.Post("author/TemplateDecision/add", this.model).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.notification.addSuccess();
              this.router.navigate(["/hrms/system/templatedecision"]);
            } else {
              this.notification.addError();
            }
          },
          (error: any) => {
            this.notification.addError();
          }
        );
      } else {
        this._coreService.Post("author/TemplateDecision/update", this.model).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.notification.editSuccess();
              this.router.navigate(["/hrms/system/templatedecision"]);
            } else {
              this.notification.addError();
            }
          },
          (error: any) => {
            this.notification.editSuccess();
          }
        );
      }
    }
  };

  // confirm delete
  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      this._coreService
        .Delete("app-item/delete-many?ids=" + this.model.id, {
          ip_address: "123456",
          channel_code: "W",
        })
        .subscribe((success: any) => {
          this.notification.deleteSuccess();
          this.modalService.close("confirm-delete-modal");
          this.router.navigate(["/hrms/system/templatedecision"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/system/templatedecision"]);
    }
  };
  // filter type

  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
