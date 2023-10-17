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
import { MailSetting } from "src/app/_models/app/system/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  LinkService,
  ImageService,
  RichTextEditorComponent,
} from "@syncfusion/ej2-angular-richtexteditor";
const async = require("async");
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "app-mailsetting-edit",
  templateUrl: "./mailsetting-edit.component.html",
  styleUrls: ["./mailsetting-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class MailSettingEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    
  ])
  @ViewChild("rteTool", { static: false })
  public rteTool!: RichTextEditorComponent;
  flagState$ = new BehaviorSubject<string>('');
  // Varriable Language
  // flagState = "";
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";
  public fontFamily: Object = {
    default: "Arial", // to define default font-family
  };
  model: MailSetting = new MailSetting();
  modelTemp: MailSetting = new MailSetting();

  languages: any;
  selectedLanguage: any;
  lstModule:any;
  lstElement: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Private
  private _unsubscribeAll: Subject<any>;
  lstApplication: any;
  lstParentId: any;
  lstGroupId: any;
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
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(51),
          this.globals.checkEmpty,
        ],
      ],
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(31),
          this.globals.checkExistSpace,
        ],
      ],
      subjectMail: [""],
      mailCC: [""],
      mailBCC: [""],
      body: [""],
      moduleId: [""],
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

    this.flagState$.subscribe(x => {
      let toolbarList: any[] = [];
      if (x === "view") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
        this.editForm.disable();
      }
      if (x === "new") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      if (x === "edit") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
        this.editForm.get("code")!.disable();
      }
      this.toolItems$.next(toolbarList)
    })
    async.waterfall(
      [
        (cb: any) => {
          if (this.paramId) {
            this._coreService
              .Get("hr/mailsetting/get?id=" + this.paramId)
              .subscribe((res: any) => {
                this.modelTemp = res.data;
                this.rteTool.value = res.data.body;
                cb();
              });
              this.getElement(this.paramId);
          } else {
            cb();
          }
        },
        (cb: any) => {
          this._coreService.Get("package/module/GetAll").subscribe((res: any) => {
            this.lstModule = res.data;
            cb();
          });
        }
      ],
      (err: any, ok: any) => {
        this.model = _.cloneDeep(this.modelTemp);
        //delete this.modelTemp;
      }
    );
  }
  drag(e: any) {
    e.dataTransfer.setData("text", e.target.id);
  }
  // // Build Toolbar
  // buildToolbar = () => {
  //   setTimeout(() => {
  //     let toolbarList: any[] = [];
  //     if (this.flagState === "view") {
  //       toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
  //     }
  //     if (this.flagState === "new") {
  //       toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
  //     }
  //     if (this.flagState === "edit") {
  //       toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
  //     }
  //     this.toolbar = this.globals.buildToolbar("mailsetting", toolbarList!);
  //   }, 200);
  // };

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
          this.router.navigate(["hrms/system/mailsetting"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState$.next("edit");
        this.flagePopup = true;
        this.editForm.enable();
        this.editForm.get("code")!.disable();
        // this.buildToolbar();
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
      this.notification.formInvalid();
      this.editForm.markAllAsTouched();
      return;
    }
    this.model.body = this.rteTool.getHtml();
    let param = this.convertModel(this.model);
    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/mailsetting/add", param).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/system/mailsetting"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/mailsetting/Update", param).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/system/mailsetting"]);
          }
        },
        (error: any) => {
          this.notification.editSuccess();
        }
      );
    }
  };
  getElement(id: string) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/mailsetting/GetListDtl?SeMailSettingId=" + id)
        .subscribe((res: any) => {
          this.lstElement = res.data;
          resolve(res.data);
          
        });
       
    });
  }
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    return model;
  }
  keypress(e: any) {
  }
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
          this.router.navigate(["/hrms/system/mailsetting"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/system/mailsetting"]);
    }
  };
  // filter type
  // change date
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
