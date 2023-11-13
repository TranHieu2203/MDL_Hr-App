import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
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

import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { Blog } from "src/app/_models/app/system";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";

import {
  ToolbarService,
  LinkService,
  ImageService,
  HtmlEditorService,
  QuickToolbarService,
} from "@syncfusion/ej2-angular-richtexteditor";
import { Consts } from "src/app/common/const";
const async = require("async");
setCulture("en");

@Component({
  selector: "app-internalblog-edit",
  templateUrl: "./internalblog-edit.component.html",
  styleUrls: ["./internalblog-edit.component.scss"],
  providers: [
    ToolbarService,
    LinkService,
    ImageService,
    HtmlEditorService,
    QuickToolbarService,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class InternalBlogEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  // flag show popup toolbar Back
  flagePopup = true;
  flagState$ = new BehaviorSubject<string>('');
  flagTheme = false;
  flagPopupTheme = false;
  // end flag

  // Khai báo biến
  backgroundTheme!: string;
  lstthemeId: any = [];
  paramId = "";
  linkImgChange: string = "/assets/images/them/change-theme.png";
  model: Blog = new Blog();
  modelTemp: Blog = new Blog();
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "_id", text: "title" };
  public fields1: FieldSettingsModel = { value: "id", text: "name" };
  // Khai báo data
  public lstTheme: any[] = [];
  public lstThemeOrigin: any[] = []
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
      themeId: [""],
      create_by: [
        "",
        [
          // Validators.required,
          // Validators.maxLength(31),
          // this.globals.checkExistSpace,
        ],
      ],
      description: [""],
      meta_description: [""],
      orders: [""],
      content: [""],
      imgUrl: [""],
      videoUrl: [""],
      videoUrlTemp: [""]
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
      } else {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      this.toolItems$.next(toolbarList)

    })

    if (this.flagState$.value === "view") {
      this.editForm.disable();
    }

    let modelInt: any;
    async.waterfall([
      (cb: any) => {
        if (this.paramId) {
          this._coreService.Get("hr/BlogInternal/Get?id=" + this.paramId).subscribe((res: any) => {
            if (res.statusCode == "200") {
              modelInt = res.data;
              return cb();
            }
            else {
              this.notification.warning(res.message);
              return cb();
            }
          })
        }
        else return cb();
      },
      (cb1: any) => {
        this._coreService.Get("hr/OtherList/TitleNews").subscribe((res: any) => {
          if (res.statusCode == "200") {
            this.lstthemeId = res.data
          }
          else {
            this.notification.warning(res.message);
          }
          return cb1();
        });
      }

    ], (error: any, result: any) => {
      // this.lstTheme = this.lstTheme.splice(0,8);
      if (this.flagState$.value != "new") {
        this.model = modelInt;
        var url = this.globals.apiUrlFileManager.toString().replace("api/", "") + this.model.imgUrl;
        document.getElementById("preview")!.style.backgroundImage = "url('" + url + "'";
        var videoUrl = this.globals.apiUrlFileManager.toString().replace("api/", "") + this.model.videoUrl;
        // document.getElementById("preview1")!.style.backgroundImage = "url('" +  videoUrl +"'";
        this.model.videoUrlTemp = videoUrl;
        //   this.rteTool.value = this.model.content;
        // let finditem = this.lstThemeOrigin.find(x => x.id == this.model.themeId);
        // if(finditem)
        // {
        //   this. ChangeTheme(finditem)
        // }
      }
      else {
        // let item = this.lstTheme[0];
        // document.getElementById("backgroundTitle")!.style.backgroundImage = "url('" + item.imgUrl + "')"; 
        // document.getElementById("textPreview")!.style.color = item.color;
      }
    })
  }
  ChangeIcon() {
    if (this.linkImgChange == "/assets/images/them/change-theme.png") {
      this.linkImgChange = "/assets/images/them/back.png";
      this.flagTheme = true;
    }
    else {
      this.linkImgChange = "/assets/images/them/change-theme.png";
      this.flagTheme = false;
    }
  }
  ChooseBackground() {
    document.getElementById("file")!.click();
  }
  ChooseBackground1() {
    document.getElementById("file1")!.click();
  }

  ChangeTheme(item: any) {
    document.getElementById("backgroundTitle")!.style.backgroundImage = "url('" + item.imgUrl + "')";
    document.getElementById("textPreview")!.style.color = item.color;
    this.model.themeId = item.id;
    if (this.flagPopupTheme) {
      this.modalService.close("many-theme");
      this.flagPopupTheme = false;
    }
  }
  ManyTheme = () => {
    this.modalService.open("many-theme");
    this.flagPopupTheme = true;
  }
  imageSelected(e: any) {
  }
  onClick() {
    document.getElementById("uploadImg")!.click();
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

  uploadImg(files: FileList | null) {
    setTimeout(() => {
      if (files!.length > 0) {
        let data = new FormData();
        data.append("files", "profile");
        data.append("files", files![0]);
        this._coreService.uploadFileV2Hrm(data, Consts.profile, "portalimage").subscribe((res: any) => {
          var url = this.globals.apiUrlFileManager.toString().replace("api/", "") + res.data;
          var url1 = res.data;
          this.model.imgUrl = url1;
          document.getElementById("preview")!.style.backgroundImage = "url('" + url + "'";
          let x: any = document.getElementById("portalimage");
          x.value = null;
        });
      }
    }, 200);
  }

  uploadVideo(files: FileList | null) {

    if (files!.length > 0) {
      let data1 = new FormData();
      data1.append("files", "profile");
      data1.append("files", files![0]);
      this._coreService.uploadFileV2Hrm(data1, Consts.profile, "portalvideo").subscribe((res: any) => {
        var url = this.globals.apiUrlFileManager.toString().replace("api/", "") + res.data;
        var url1 = res.data;
        this.model.videoUrl = url1;
        // document.getElementById("preview1")!.style.backgroundImage = "url('" +  url +"'";
        this.model.videoUrlTemp = url;
        let x: any = document.getElementById("portalvideo");
        x.value = null;
      });
    }

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
          this.router.navigate(["/hrms/media/business/internalblog"]);
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
      // this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }

    //this.model.content = this.rteTool.getHtml();

    if (this.flagState$.value === "new") {
      this._coreService
        .Post("hr/BlogInternal/add", this.model)
        .subscribe((res: any) => {
          if (res.statusCode == "400") {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/media/business/internalblog"]);
          }
        });
    } else {
      this._coreService
        .Post("hr/BlogInternal/update", this.model)
        .subscribe((res: any) => {
          if (res.statusCode == "400") {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/media/business/internalblog"]);
          }
        });
    }
  };

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/media/business/internalblog"]);
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
