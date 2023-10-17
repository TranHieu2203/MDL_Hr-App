import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MapCoreComponent } from "src/app/components/map/map.component";
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

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query } from "@syncfusion/ej2-data";
setCulture("en");

@Component({
  selector: "cms-settingmap-edit",
  templateUrl: "./settingmap-edit.component.html",
  styleUrls: ["./settingmap-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SettingmapEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    
  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: SettingMap = new SettingMap();
  languages: any;
  selectedLanguage: any;

  editForm!: FormGroup;
  public query = new Query();
  @ViewChild("mapcore", { static: false })
  public mapcore!: MapCoreComponent;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstApplication: any;
  lstParentId: any;
  lstGroupId: any;

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
      const objParam = window.atob(paramId);
      const paramUrl = JSON.parse(objParam);
      this.paramId = paramUrl.id;
      this.flagState$.next(paramUrl.type);
      if (paramUrl.type !== "new") {
        if (paramUrl && paramUrl.id) {
        
          this._coreService
            .Get("SettingMap/Get?id=" + this.paramId)
            .subscribe((res: any) => {
              this.model = res.data;
              let param = {
                lat: this.model.lat,
                long: this.model.lng,
                radius: this.model.radius,
                center: this.model.center,
                zoom: 6
              }
              this.mapcore.setValue(param);
            });
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState$.next("new");
        this.model.orgId = paramUrl.id;
      }
    });

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      lat: [""],
      lng: [""],
      name: ["", [Validators.required]],
      ip: [""],
      address: ["", [Validators.required]],
      radius: [""],
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
      }
      this.toolItems$.next(toolbarList);
    })
  }

  ChangeMap() {
    this.model.center = "{\"lat\":" + this.model.lat + ",\"lng\":" + this.model.lng + "}";
    let param = {
      lat: this.model.lat,
      long: this.model.lng,
      radius: Number(this.model.radius),
      center: this.model.center,
      zoom: 6
    }
    this.mapcore.setValue(param);
  }
  //chọn đơn vị
  choiseOrg() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.orgId, //select employee on grid
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      this.model.orgId = res.ID;
      this.model.orgName = res.NAME;
      // this.model.orgManager = res.MANAGER_NAME;
      x.unsubscribe();
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
          this.router.navigate(["hrms/system/settingmap"]);
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
      this.notification.formInvalid();
      this.editForm.markAllAsTouched();
      return;
    }
    this.model.center = "{\"lat\":" + this.model.lat + ",\"lng\":" + this.model.lng + "}";
    let param = this.convertModel(this.model);
    if (this.flagState$.value === "new") {
      this._coreService.Post("SettingMap/Add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/system/settingmap"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("SettingMap/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/system/settingmap"]);
          }
        },
        (error: any) => {
          this.notification.editSuccess();
        }
      );
    }
  };
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    return model;
  }
  // change date

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/system/settingmap"]);
    }
  };
}

class SettingMap {
  id?: any;
  address?: any;
  lat?: any;
  lng?: any;
  radius?: any;
  zoom?: any;
  center?: any;
  ip?: any;
  orgId?: any;
  name?: any;
  orgName?: string;
}
