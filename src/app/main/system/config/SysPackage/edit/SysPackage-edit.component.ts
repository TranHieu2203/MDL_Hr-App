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
  GridComponent,
  DataStateChangeEventArgs,
  IFilter,
} from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { SysPackage } from "src/app/_models/app/list/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
const async = require("async");
import { createElement } from "highcharts";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { Filter } from "@syncfusion/ej2-angular-grids";
setCulture("en");

@Component({
  selector: "app-SysPackage-edit",
  templateUrl: "./SysPackage-edit.component.html",
  styleUrls: ["./SysPackage-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SysPackageEditComponent implements OnInit {
  // Varriable Language
  flagState = "";
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  model: SysPackage = new SysPackage();
  modelTemp: SysPackage = new SysPackage();
  languages: any;
  selectedLanguage: any;

  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };
  moduleSelected: any = [];
  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstApplication: any;
  pageIndex: number = 0;
  mode: string = "CheckBox";
  lstModule: any;
  lstModuleClone: any;
  data: any = [];
  public filterStatus!: IFilter;
  dropInstance!: DropDownList;
  lstStatus = [
    { id: true, name: "Hiệu lực" },
    { id: false, name: "Khhông hiệu lực" },
  ];

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
      applicationId: ["", Validators.maxLength(500)],
      note: ["", Validators.maxLength(500)],
      price: [""],
      trialperiod: [""],
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
    }
    async.waterfall(
      [
        (cb: any) => {
          if (this.paramId) {
            this._coreService
              .Get("package/package/get?id=" + this.paramId)
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
            .Get("package/otherlist/getApplication")
            .subscribe((res: any) => {
              this.lstApplication = res.data;
              cb();
            });
        },
        (cb: any) => {
          this._coreService.Get("package/Module/getall").subscribe((res: any) => {
            this.lstModule = res.data;
            cb();
          });
        },
      ],
      (err: any, ok: any) => {
        
       if(this.flagState != "new")
       {
         this.model = _.cloneDeep(this.modelTemp);
         this.moduleSelected = this.model.moduleIds;
         this.data = _.filter(this.lstModule, (item: any) => {
          return this.moduleSelected.includes(item.id);
        });
       }
      }
    );

    this.filterStatus = {
      ui: {
        create: (args: { target: Element; column: object }) => {
          const flValInput: HTMLElement = createElement("input", {
            className: "flm-input",
          });
          args.target.appendChild(flValInput);
          this.dropInstance = new DropDownList({
            dataSource: this.lstStatus,
            fields: { text: "name", value: "code" },
            placeholder: "",
            popupHeight: "200px",
          });
          this.dropInstance.appendTo(flValInput);
        },
        write: (args: {
          column: object;
          target: Element;
          parent: any;
          filteredValue: string;
        }) => {
          this.dropInstance.value = args.filteredValue;
        },
        read: (args: {
          target: Element;
          column: any;
          operator: string;
          fltrObj: Filter;
        }) => {
          args.fltrObj.filterByColumn(
            "isActive",
            args.operator,
            this.dropInstance.value
          );
        },
      },
    };
  }
  //save module selected to grid
  // saveModule() {
  //   if (this.moduleSelected.length > 0) {
  //     this.moduleSelected.forEach((id) => {
  //       this.data.unshift(_.find(this.lstModule, { id: id }));
  //       _.remove(this.lstModule, { id: id });
  //     });
  //     this.moduleSelected = [];
  //     this.gridInstance.refresh();
  //     this.lstModule = _.cloneDeep(this.lstModule);
  //   }
  // }
  //save module selected to grid
  // removeModule() {
  //   let x = this.gridInstance.getSelectedRecords();
  //   if (x.length > 0) {
  //     x.forEach((item: any) => {
  //       this.lstModule.push(item);
  //       _.remove(this.data, { id: item.id });
  //     });
  //     this.moduleSelected = [];
  //     this.gridInstance.refresh();
  //     this.lstModule = _.cloneDeep(this.lstModule);
  //   }
  // }
  // Build Toolbart
  buildToolbar = () => {
    setTimeout(() => {
      let toolbarList: any[] = [];
      if (this.flagState === "view") {
        toolbarList = [
          ToolbarItem.BACK,
          ToolbarItem.EDIT,
          //ToolbarItem.DELETE
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
          ToolbarItem.SAVE
        ];
      }
      this.toolbar = this.globals.buildToolbar(
        "app-SysPackage-edit",
        toolbarList
      );
    }, 200);
  };
 
  // Số thứ tự
  formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
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
          this.router.navigate(["sys/config/syspackage"]);
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
      this.model.moduleIds = this.data.map((i: any) => Number(i.id));

      if (this.flagState === "new") {
        this._coreService.Post("package/package/add", this.model).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.notification.addSuccess();
              this.router.navigate(["/sys/config/syspackage"]);
            } else {
              this.notification.addError();
            }
          },
          (error: any) => {
            this.notification.addError();
          }
        );
      } else {
        this._coreService.Post("package/package/update", this.model).subscribe(
          (res: any) => {
            if (res.statusCode == 200) {
              this.notification.editSuccess();
              this.router.navigate(["/sys/config/syspackage"]);
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
  // chọn modules
  ChangeModules =()=>{
    this.data = _.filter(this.lstModule, (item: any) => {
      return this.moduleSelected.includes(item.id);
    });
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
          this.router.navigate(["/sys/config/syspackage"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/sys/config/syspackage"]);
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
