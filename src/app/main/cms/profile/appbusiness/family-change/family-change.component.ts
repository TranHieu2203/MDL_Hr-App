import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  OnDestroy,
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
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  FilterService,
  GridComponent, ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface, Situation } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import { Splitter, SplitterComponent } from '@syncfusion/ej2-angular-layouts';
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { takeUntil } from "rxjs/operators";
import { ExcelService } from "src/app/_services/excel.service";
import { FormGroup, FormBuilder } from "@angular/forms";
setCulture("en");
interface ModelDeleteItem {
  id?: number;
  reason?: string;
}
@Component({
  selector: "cms-profile-family-change",
  templateUrl: "./family-change.component.html",
  styleUrls: ["./family-change.component.scss"],
  providers: [FilterService],
  encapsulation: ViewEncapsulation.None,
})
export class FamilyChangeComponent implements OnInit, OnDestroy {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.APPROVED,
    ToolbarItem.DENIED,
    ToolbarItem.EXPORT_EXCEL,
  ])

  // Varriable Language
  languages: any;
  selectedLanguage: any;
  flagStatusEmp: any;
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild('splitterInstance', { static: false })
  splitterObj!: SplitterComponent;

  public onCreated() {
    let splitterObj1 = new Splitter({
      height: '100%',
      paneSettings: [
        { size: '94%', min: '20%' },
        { size: '6%', min: '6%' }
      ],
      orientation: 'Vertical'
    });
    splitterObj1.appendTo('#vertical_splitter');
  }

  public fields: FieldSettingsModel = { text: "name", value: "id" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];

  reasonname: any | null;
  reasonForm!: FormGroup;
  model!: Situation;
  // query auto complete
  public query = new Query();
  // variable
  dataImport: any[] = [];


  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  type: number = 0;
  nodeSelected: any;
  isDisso: any;
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
    this.reasonForm = this._formBuilder.group({
      reason: ["", []]
    });
    this.model = new Situation();
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
    // Load List Data
    this._coreService.organization
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((model: any) => {
        this.nodeSelected = model.id;
        this.getListData();
      });
    this._coreService.isDisso
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((checked: any) => {

        this.isDisso = checked;
        this.getListData();

      });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
  }
  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, idFamily: this.modelAdd.idFamily, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/profile/business/family-change/", paramAdd]);
  };

  // GetListData
  getListData = (): void => {
    var extraParams: any = [];
    if (this.flagStatusEmp) {
      extraParams.push({
        field: "WorkStatusId",
        value: 1,
      });
    }
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }

    if (this.isDisso != undefined) {
      extraParams.push({
        field: "IsDissolve",
        value: this.isDisso,
      });
    }
    this._coreService.execute(this.state, "hr/Employee/GetAllFamilyAdd", extraParams);
  };
  GetEmp = (e: any) => {
    this.flagStatusEmp = e.checked;
    this.getListData();
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.flagStatusEmp) {
      extraParams.push({
        field: "WorkStatusId",
        value: this.nodeSelected,
      });
    }
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }

    if (this.isDisso != undefined) {
      extraParams.push({
        field: "IsDissolve",
        value: this.isDisso,
      });
    }
    this._coreService.execute(this.state, "hr/Employee/GetAllFamilyAdd", extraParams);
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;

    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.APPROVED:
        this.type = 2;
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          this.modalService.open("confirm-approved-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;

      case ToolbarItem.DENIED:
        this.type = 3;

        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          this.modalService.open("confirm-unapproved-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.EXPORT_EXCEL:
        let extraParams: any[] = [];
        if (this.flagStatusEmp) {
          extraParams.push({
            field: "WorkStatusId",
            value: 1,
          });
        }
        if (this.nodeSelected) {
          extraParams.push({
            field: "orgId",
            value: this.nodeSelected,
          });
        }

        if (this.isDisso != undefined) {
          extraParams.push({
            field: "IsDissolve",
            value: this.isDisso,
          });
        }
        var data = this._coreService.ExecuteToExport('hr/Employee/GetAllFamilyAdd', extraParams, this.state).subscribe((res: any) => {
          // Lấy ngày hiện tại
          const currentDate: Date = new Date();

          // Lấy ngày, tháng và năm
          const year: number = currentDate.getFullYear();
          const month: number = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
          const day: number = currentDate.getDate();
          // Chuyển đổi thành chuỗi "yyyyMMdd"
          const formattedDate: string = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
          const exportProperties: ExcelExportProperties = {
            dataSource: res.data,
            columns: [],
            fileName: "pheduyetthongtingiacanh" + "-" + formattedDate + ".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      default:
        break;
    }
  };

  confirmApproved = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-approved-modal");
    } else {
      let lstDeleteIds = _.map(this.modelDelete, "status");

      for (var item of lstDeleteIds) {
        if (item == '3' || item == '2') {
          this.notification.warning("Không thể phê duyệt bản ghi đã phê duyệt/từ chối");
          this.reasonname = null;
          this.modalService.close("confirm-approved-modal");
          return;
        }
      }
      let lstDeleteInfo: Array<ModelDeleteItem> = this.modelDelete.map((item) => {
        return {
          id: item.id,
          reason: this.reasonname,
        };
      });
      if (lstDeleteInfo.length > 0) {
        this._coreService
          .Post("hr/Employee/ApproveFamilyEdit", lstDeleteInfo)
          .subscribe((success: any) => {
            if (success.statusCode == "200") {
              this.notification.approvedSuccess();
              this.reasonname = null;
              this.modalService.close("confirm-approved-modal");
              this.gridInstance.clearSelection();
              this.gridInstance.refresh();

            }
            else {
              this.notification.error("Lỗi");
              this.reasonname = null;
              this.modalService.close("confirm-approved-modal");
            }

          });
      }
    }
  };
  confirmUnApproved = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-unapproved-modal");
    } else {
      if (this.reasonname == null) {
        this.notification.warning("Từ chối bắt buộc phải nhập lý do");
        return;
      }
      let lstDeleteIds = _.map(this.modelDelete, "status");

      for (var item of lstDeleteIds) {
        if (item == '3' || item == '2') {
          this.notification.warning("Không thể phê duyệt bản ghi đã phê duyệt/từ chối");
          this.reasonname = null;
          this.modalService.close("confirm-unapproved-modal");
          return;
        }
      }
      let lstDeleteInfo: Array<ModelDeleteItem> = this.modelDelete.map((item) => {
        return {
          id: item.id,
          reason: this.reasonname,
        };
      });

      if (lstDeleteInfo.length > 0) {
        this._coreService
          .Post("hr/Employee/RejectFamilyEdit", lstDeleteInfo)
          .subscribe((success: any) => {
            if (success.statusCode == "200") {
              this.notification.deniedSuccess();
              this.reasonname = null;
              this.modalService.close("confirm-unapproved-modal");
              this.gridInstance.clearSelection();
              this.gridInstance.refresh();

            }
            else {
              this.notification.error("Lỗi");
              this.reasonname = null;
              this.modalService.close("confirm-unapproved-modal");
            }

          });
      }
    }
  };
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next(true);
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
}
