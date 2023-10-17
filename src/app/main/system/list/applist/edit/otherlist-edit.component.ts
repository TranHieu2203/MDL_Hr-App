import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  AfterViewInit,
} from "@angular/core";
import { Subject } from "rxjs";
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
import { Function } from "src/app/_models/app/list/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
const async = require("async");
import { OtherList } from "src/app/_models/app/list/otherlist";
setCulture("en");

@Component({
  selector: "app-otherlist-edit",
  templateUrl: "./otherlist-edit.component.html",
  styleUrls: ["./otherlist-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class OtherListEditComponent implements OnInit {
  // Varriable Language
  flagState = "";
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";
  typeId: any;

  model: OtherList = new Function();
  modelTemp: OtherList = new Function();
  languages: any;
  selectedLanguage: any;

  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  //list data
  public lstType: any[] = [];


  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstApplication: any;
  lstGroup: any;
  lstModule: any;

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
        if (paramUrl && paramUrl.id && paramUrl.type != "new") {
          this.paramId = paramUrl.id;
          this.flagState = paramUrl.type;
        }
        else if(paramUrl && paramUrl.type == "new"){
          this.flagState = paramUrl.type;
          this.typeId = paramUrl.id
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState = "new";
      }
    });

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(/^[-+\/.,_a-zA-Z0-9]+$/),
        ],
      ],
      name: [
        "",
        [
          Validators.required,
          this.globals.noWhitespaceValidator,
          Validators.maxLength(300),
        ],
      ],
      type: ["", Validators.required],
      order: [""],
      note: [""],
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
    this.buildToolbar();

    if (this.flagState === "view") {
      this.editForm.disable();
    }
    if (this.flagState === "edit") {
      this.editForm.get("code")!.disable();
      this.editForm.get("type")!.disable();
    }
    async.waterfall(
      [
        (cb: any) => {
          if (this.paramId) {
            this._coreService
              .Get("hr/otherlist/get?id=" + this.paramId)
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
            .Get("hr/otherlist/GetAllType")
            .subscribe((res: any) => {
              this.lstType = res.data;
              cb();
            });
        },
        (cb: any) => {
          this._coreService.Get("package/module/GetAll").subscribe((res: any) => {
            this.lstModule = res.data;
            cb();
          });
        },
      ],
      (err: any, ok: any) => {
        this.model = _.cloneDeep(this.modelTemp);
        ////delete this.modelTemp;
        if(this.flagState == "new")
        {
          this.model.typeId = this.typeId;
        }
      }
    );
  }

  // Build Toolbar
  buildToolbar = () => {
    setTimeout(() => {
      let toolbarList: any[] = [];
      if (this.flagState === "view") {
        toolbarList = [
          ToolbarItem.BACK,
          ToolbarItem.EDIT,
        ];
      }
      if (this.flagState === "new") {
        toolbarList = [
          ToolbarItem.BACK,
          ToolbarItem.SAVE,
        ];
      }
      if (this.flagState === "edit") {
        toolbarList = [
          ToolbarItem.BACK,
          ToolbarItem.SAVE,
        ];
      }
      this.toolbar = this.globals.buildToolbar(
        "app-otherlist-edit",
        toolbarList
      );
    }, 200);
  };

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
          this.router.navigate(["sys/listsys/otherlist"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState = "edit";
        this.flagePopup = true;
        this.editForm.enable();
        this.editForm.get("code")!.disable();
        this.editForm.get("type")!.disable();
        this.buildToolbar();
        break;
      case ToolbarItem.DELETE:
        break;
      case ToolbarItem.COPY:
        break;
      default:
        break;
    }
  };
  // lưu data open popup
  saveData = () => {
    if (!this.editForm.valid) {
      this.notification.warning("Lưu không thành công!");
      this.editForm.markAllAsTouched();
    } else {
      if (this.flagState === "new") {
        this._coreService.Post("hr/otherlist/add", this.model).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.notification.addSuccess();
              this.router.navigate(["/sys/listsys/otherlist"]);
            } else {
              this.notification.addError();
            }
          },
          (error: any) => {
            this.notification.addError();
          }
        );
      } else {
        this._coreService.Post("hr/otherlist/update", this.model).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.notification.editSuccess();
              this.router.navigate(["/sys/listsys/otherlist"]);
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

 
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/sys/listsys/otherlist"]);
    }
  };
  onFiltering = (e: any, lst: any) =>{

  }
  confirmDelete= (status: any): void => {
  }
}
