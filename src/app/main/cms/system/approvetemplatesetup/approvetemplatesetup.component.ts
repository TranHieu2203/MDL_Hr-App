import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
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
import { L10n, disableBlazorMode, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  GridComponent,
  VirtualScrollService,ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface, GroupPosition } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query } from "@syncfusion/ej2-data";
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
const $ = require("jquery");
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Consts } from "src/app/common/const";
import { ApproveTemplateSetup } from "src/app/_models/app/list/ApproveTemplateSetup";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
const async = require("async");
const _ = require("lodash");
setCulture("en");

@Component({
  selector: "cms-app-approvetemplatesetup",
  templateUrl: "./approvetemplatesetup.component.html",
  styleUrls: ["./approvetemplatesetup.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class ApproveTemplateSetupComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD,
    ToolbarItem.EDIT,
    ToolbarItem.DELETE,
  ]);
  toolItemsEdit$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  @ViewChild('defaultDialog')
  public defaultDialog!: DialogComponent;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  lstTemplateType: any;
  lstTemplate: any;
  nodeSelected: any;
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  public dialogHeader!: string;
  public animationSettings: Object = { effect: 'Zoom' };

  // edit
  model: ApproveTemplateSetup = new ApproveTemplateSetup();
  modelTemp: ApproveTemplateSetup = new ApproveTemplateSetup();
  editForm!: FormGroup;
  flagState$ = new BehaviorSubject<string>('');
  public fields: FieldSettingsModel = { value: "id", text: "name" };

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
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private ip: IpServiceService,
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private _formBuilder: FormBuilder,
  ) {
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.editForm = this._formBuilder.group({
      seProcessTypeId: ["", [Validators.required]],
      seProcessTemplateId: ["", [Validators.required]],
      effectDate: ["", [Validators.required]],
      expireDate: ["", []],
      dayFrom: ["", []],
      dayTo: ["", []],
      orgId: ["", []],
    });

    this.flagState$.subscribe(x => {
      let toolbarList: any[] = [];
      if (x === Consts.view) {
        toolbarList = [ToolbarItem.EDIT];
        this.editForm.disable();
      }
      if (x === Consts.add) {
        toolbarList = [ToolbarItem.SAVE];

      }
      if (x === Consts.edit) {
        toolbarList = [ToolbarItem.SAVE];

      }
      this.toolItemsEdit$.next(toolbarList)
    })
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
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id;
        this.getListData();
      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
    this.modalService.employee.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.getListData();
      });
    // Build toolbar
    this.buildToolbar();
    // Load List Data
    this.getListData();
    async.waterfall(
      [
        (cb: any) => {
          this._coreService
            .Get("tenant/approveprocess/GetList")
            .subscribe((res: any) => {
              this.lstTemplateType = res.data;
              cb();
            });
        },
        (cb: any) => {
          this._coreService
            .Get("tenant/approvetemplate/GetListTemplate")
            .subscribe((res: any) => {
              this.lstTemplate = res.data;
              cb();
            });
        },
      ],
      (err: any, ok: any) => {
        this.model = _.cloneDeep(this.modelTemp);

        //delete this.modelTemp;
      }

    );
    this.model.orgId = this.nodeSelected;
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/system/approvetemplatesetup/", paramAdd]);
  };

  // Build Toolbar
  buildToolbar = () => {
    const toolbarList = [ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.LOCK];
    this.toolbar = this.globals.buildToolbar("approvetemplatesetup", toolbarList!);
  };
  // filter checkbox

  // GetListData
  getListData = (): void => {
    
    var extraParams: any = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    extraParams.push({
      field: "typeId",
      value: 1,
    });

    this._coreService.execute(this.state, "tenant/approvetemplate/GetApproveTemplateSetup", extraParams);
  };

  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    var extraParams: any = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    extraParams.push({
      field: "typeId",
      value: 1,
    });

    this._coreService.execute(this.state, "tenant/approvetemplate/GetApproveTemplateSetup", extraParams);
  }
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
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.dialogHeader = "Thiết lập template phê duyệt cho đơn vị";
        this.flagState$.next(Consts.add)
        this.model = new GroupPosition();
        this.defaultDialog.show();
        break;
      case ToolbarItem.EDIT:

        this.flagState$.next(Consts.edit)
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
          break;
        }
        this.getById(this.modelAdd.id);

        this.defaultDialog.show();

        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          let checkHieuLuc = false;
          for (let i = 0; i < this.modelDelete.length; i++) {
            if (this.modelDelete[i].isActiveText === "Hiệu lực") {
              checkHieuLuc = true;
            }
          }
          if (checkHieuLuc) {
            this.notification.warning(
              "Hệ thống không cho phép xóa dữ liệu có trạng thái Hiệu lực!"
            );
            return;
          }
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.SAVE:
        this.saveData()
        break;
      default:
        break;
    }
  };

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      if (this.modelDelete.length > 0) {
        let ids = this.modelDelete.map((i: any) => i.id);
        this._coreService
          .Post("tenant/approvetemplate/DeleteApproveTemplateSetup", ids)
          .subscribe((res: any) => {
            if (res.statusCode == 200) {
              this.notification.deleteSuccess();
              this.gridInstance.clearSelection();
              this.gridInstance.refresh();
            } else {
              this.notification.deleteError();
            }
            this.modalService.close("confirm-delete-modal");
          });
      }
    }
  };
  // change date
  changeDate = (model: any) => {
    setTimeout(() => {
      const idDate = "#" + model + "_input";
      const value = $(idDate).val();
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      if (value.length > 0 && patt.test(value.toLowerCase()) === true) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      } else if (value.length > 10) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      } else {
        this.editForm.get(model)!.clearValidators();
      }
      if (
        value &&
        ((value.length === 8 && value.indexOf("/") === -1) ||
          (value.length === 6 && value.indexOf("/") === -1) ||
          (value.length === 10 && value.indexOf("/") > -1))
      ) {
        if (value.indexOf("-") === -1) {
          const returnDate = this.globals.replaceDate(value);
          // (this.model as any)[model] = returnDate;
          if (returnDate && returnDate.length > 0) {
            $(idDate).val(returnDate);
            const dateParts: any = returnDate.split("/");
            (this.model as any)[model] = new Date(
              +dateParts[2],
              dateParts[1] - 1,
              +dateParts[0]
            );
            this.editForm.get(model)!.clearValidators();
          }
        }
      }
    }, 200);
  };
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  // disbale button chon nhieu ban ghi
  setButtonStatus = (event: any) => {
    if (!this.button) {
      this.button = setTimeout(() => {
        // đếm số bản ghi select
        const rowSelects = this.gridInstance.getSelectedRecords();
        const rowSelectCounts = rowSelects.length;
        // Nếu count > 1 thì disable toolbar
        if (rowSelectCounts > 1) {
          for (let i = 0; i < this.toolbar.length; i++) {
            //disable sửa
            if (this.toolbar[i].id === ToolbarItem.EDIT) {
              this.toolbar[i].isDisable = true;
            }
          }
        } else {
          for (let i = 0; i < this.toolbar.length; i++) {
            // enabled sửa
            if (this.toolbar[i].id === ToolbarItem.EDIT) {
              this.toolbar[i].isDisable = false;
            }
          }
        }
      }, 200);
    }
  };
  /**
   * getbyid
   * @returns 
   */
  getById(id: any) {

    // Lấy dữ liệu 
    if (id) {
      this._coreService
        .Get("tenant/approvetemplate/GetApproveTemplateSetupById?id=" + id)
        .subscribe((res: any) => {
          this.modelTemp = res.data;
          this.model = _.cloneDeep(this.modelTemp);
          this.dialogHeader = "Sửa thiết lập template cho bộ phận";

        });
    } else {
    }

  }
  saveData = () => {
    this.model.orgId = this.nodeSelected;
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }

    if (this.flagState$.value === Consts.add) {
      this._coreService.Post("tenant/approvetemplate/CreateApproveTemplateSetup", this.model).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.defaultDialog.hide();
            this.getListData();
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("tenant/approvetemplate/UpdateApproveTemplateSetup", this.model).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.defaultDialog.hide();
            this.getListData();
          }
        },
        (error: any) => {
          this.notification.editError();
        }
      );
    }
  };

}
