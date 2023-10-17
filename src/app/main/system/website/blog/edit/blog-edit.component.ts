import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
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

import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { Blog } from "src/app/_models/app/system";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";

import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  QuickToolbarService,
} from "@syncfusion/ej2-angular-richtexteditor";
import { RichTextEditorComponent } from "@syncfusion/ej2-angular-richtexteditor";
setCulture("en");

@Component({
  selector: "app-blog-edit",
  templateUrl: "./blog-edit.component.html",
  styleUrls: ["./blog-edit.component.scss"],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class BlogEditComponent implements OnInit {
  // Varriable Language
  flagState = "";
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: Blog = new Blog();
  modelTemp: Blog = new Blog();
  languages: any;
  selectedLanguage: any;

  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "_id", text: "title" };
  @ViewChild("rteTool", { static: false })
  public rteTool!: RichTextEditorComponent;
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
      {
        tooltipText: "Insert Symbol",
        undo: true,
        click: this.onClick.bind(this),
        template:
          '<button class="e-tbar-btn e-btn" tabindex="-1" id="custom_tbar"  style="width:100%">' +
          '<div class="e-tbar-btn-text" style="font-weight: 500;"><i class="fa fa-picture-o" aria-hidden="true"></i></div></button>',
      },
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

      "CreateTable",
      "|",
      "ClearFormat",
      "Print",
      "SourceCode",
      "|",
      "FullScreen",
    ],
  };
  public quickTools = {
    image: [
      "Replace",
      "Align",
      "Caption",
      "Remove",
      "InsertLink",
      "-",
      "Display",
      "AltText",
      "Dimension",
    ],
  };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstApplication: any;
  lstParentId: any;
  lstGroupId: any;
  lstCategory: any = [];

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
          this.flagState = paramUrl.type;
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState = "new";
      }
    });
    this.loadData();
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      title: ["", [Validators.required, Validators.maxLength(51)]],
      create_by: [
        "",
        [
          // Validators.required,
          // Validators.maxLength(31),
          // this.globals.checkExistSpace,
        ],
      ],
      description: ["", [Validators.required]],
      meta_description: ["", [Validators.required]],
      orders: [""],
      tag: ["", [Validators.required]],
      ckeditor: [""],
      category_id: ["", [Validators.required]],
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
  }

  imageSelected(e: any) {
  }
  onClick() {
    document.getElementById("uploadImg")!.click();
  }
  loadData() {
    Promise.all([this.getById(), this.getListCategory()]).then((res: any) => {
      if (this.paramId) {
        this.model = res[0];
      }
      this.lstCategory = res[1];
    });
  }
  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .PostNode("blog/GetById", { _id: this.paramId })
          .subscribe((res: any) => {
            this.rteTool.value = res.data.ckeditor;
            resolve(res.data);
          });
      } else {
        resolve(null);
      }
    });
  }
  getListCategory() {
    return new Promise((resolve) => {
      this._coreService.GetNode("lstCategory").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  // update avtar
  uploadAvatar(files: FileList) {
    setTimeout(() => {
      if (files.length > 0) {
        let data = new FormData();
        for (let i = 0; i < files.length; i++) {
          data.append("files", files[i]);
        }
        this._coreService.uploadFile(data, "v2hrm").subscribe((res: any) => {
          if (res.status == 200) {
            this.model.img = res.data[0].url;
            let x: any = document.getElementById("avatar");
            x.value = null;
          }
        });
      }
    }, 200);
  }
  // update avtar
  uploadImg(files: FileList) {
    setTimeout(() => {
      if (files.length > 0) {
        let data = new FormData();
        for (let i = 0; i < files.length; i++) {
          data.append("files", files[i]);
        }
        this._coreService.uploadFile(data, "v2hrm").subscribe((res: any) => {
          if (res.status == 200) {
            this.rteTool.executeCommand("insertImage", {
              url: res.data[0].url,
              cssClass: "rte-img",
            });
            let x: any = document.getElementById("uploadImg");
            x.value = null;
          } else {
            this.notification.warning("Thất bại");
          }
        });
      }
    }, 200);
  }
  // Build Toolbar
  buildToolbar = () => {
    setTimeout(() => {
      let toolbarList: any[] = [];
      if (this.flagState === "view") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT];
      }
      if (this.flagState === "new") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.ADD, ToolbarItem.SAVE];
      }
      if (this.flagState === "edit") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.ADD, ToolbarItem.SAVE];
      }
      this.toolbar = this.globals.buildToolbar("app-Blog-edit", toolbarList!);
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
          this.router.navigate(["sys/website/blog/"]);
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
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }

    this.model.ckeditor = this.rteTool.getHtml();

    if (this.flagState === "new") {
      this._coreService
        .PostNode("blog/createBlog", this.model)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/sys/website/blog/"]);
          }
        });
    } else {
      this._coreService
        .PostNode("blog/editBlog", this.model)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/sys/website/blog/"]);
          }
        });
    }
  };

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/sys/website/blog/"]);
    }
  };
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
