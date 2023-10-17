import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
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
  GridComponent,
  ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
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
import { HttpResponse } from "@angular/common/http";
import { GRID_ROW_HEIGHT } from 'src/app/constants'
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SearchModel } from "src/app/_models/app/cms/common/searchmodel";
import * as moment from "moment";

import { TooltipComponent, TooltipEventArgs, TooltipModule } from '@syncfusion/ej2-angular-popups';
import { OrgTooltipService } from "src/app/_services/orgTooltip.service";
import { FilterSettingsModel } from '@syncfusion/ej2-angular-grids';

setCulture("en");
const $ = require("jquery");
@Component({
  selector: "cms-profile-staffprofile",
  templateUrl: "./staffprofile.component.html",
  styleUrls: ["./staffprofile.component.scss"],
  providers: [FilterService],
  encapsulation: ViewEncapsulation.None,
})
export class StaffProfileComponent implements OnInit, OnDestroy {

  gridRowHeight = GRID_ROW_HEIGHT;
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  flagStatusEmp: any;
  searchFrom!: FormGroup;
  model!: SearchModel;
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild('splitterInstance', { static: false })
  splitterObj!: SplitterComponent;



  @ViewChild('tooltip')
  public tooltipControl: TooltipComponent | any;


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
  // query auto complete
  public query = new Query();
  // variable
  dataImport: any[] = [];

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  isDisso: any;
  disable: any;
  public selectionMode;


  toolItems$ = new BehaviorSubject<ToolbarItem[]>([
    ToolbarItem.ADD,
    ToolbarItem.EDIT,
    //ToolbarItem.EXPORT_TEMPLATE,
    ToolbarItem.EXPORT_EXCEL,
    ToolbarItem.DELETE,
    ToolbarItem.SYNC
  ]);


  constructor(
    private _coreService: CoreService,
    private modalService: ModalService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _formBuilder: FormBuilder,
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private orgTooltipService: OrgTooltipService
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
    this.gridInstance = (window as any).gridData;

    this.selectionMode = { selectionMode: ["row"], allowDragSelection: true };
    this.model = new SearchModel();

  }

  ngOnInit(): void {
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {
      id: this._translateService.currentLang,
    });
    this._translateService.use(this.languages);
    // Build toolbar
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
    this.searchFrom = this._formBuilder.group({
      fromDate: ["", [Validators.required]],
      toDate: ["", [Validators.required]]
    });
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
  }



  onBeforeRender(str: string) {
    return str;
  }


  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/profile/business/staffprofile/", paramAdd]);
  };


  // filter checkbox

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
    if (this.model.fromDate != null) {
      extraParams.push({
        field: "fromDate",
        value: moment(this.model.fromDate).format("YYYY-MM-DD"),
      })
    }
    if (this.model.toDate != null) {
      extraParams.push({
        field: "toDate",
        value: moment(this.model.toDate).format("YYYY-MM-DD"),
      })
    }
    this._coreService.execute(this.state, "hr/Employee/GetAll", extraParams);
  };
  changeDate = (model: any) => {
    setTimeout(() => {
      const idDate = "#" + model + "_input";
      const value = $(idDate).val();
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      var patt1 = new RegExp(
        /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.]/
      );
      // check nhập sai năm
      if (value && value.indexOf("/") != -1) {
        let valueArray = value.split("/");
        if (valueArray.length != 3) {
          this.searchFrom.get(model)!.setErrors({ incorrect: true });
          return;
        }
        if (valueArray[0].length != 2 || valueArray[1].length != 2 || valueArray[2].length != 4) {
          this.searchFrom.get(model)!.setErrors({ incorrect: true });
          return;
        }
      }
      let FindSpace = value.indexOf(" ");
      if (FindSpace != -1) {
        this.searchFrom.get(model)!.setErrors({ incorrect: true });
        return;
      } else
        if (value.length === 0) {
          this.searchFrom.get(model)!.setErrors({ required: true });
          return;
        } else if (value.length > 0 && (patt.test(value.toLowerCase()) === true || patt1.test(value.toLowerCase()) === true)) {
          this.searchFrom.get(model)!.setErrors({ incorrect: true });
          return;
        } else if (value.length > 10) {
          this.searchFrom.get(model)!.setErrors({ incorrect: true });
          return;
        } else {
          this.searchFrom.get(model)!.setErrors(null);
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
            this.searchFrom.get(model)!.clearValidators();
          }
        }
      }
    }, 200);
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
    if (this.model.fromDate != null) {
      extraParams.push({
        field: "fromDate",
        value: moment(this.model.fromDate).format("YYYY-MM-DD"),
      })
    }
    if (this.model.toDate != null) {
      extraParams.push({
        field: "toDate",
        value: moment(this.model.toDate).format("YYYY-MM-DD"),
      })
    }
    this._coreService.execute(this.state, "hr/Employee/GetAll", extraParams);
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = this.gridInstance.getSelectedRecords();
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.router.navigate(["/hrms/profile/business/staffprofile/new"]);
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
          const objParamAdd = { id: this.modelAdd.id, type: "edit" };
          const paramAdd = window.btoa(JSON.stringify(objParamAdd));
          this.router.navigate([
            "/hrms/profile/business/staffprofile/",
            paramAdd,
          ]);
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.EXPORT_EXCEL:
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
        if (this.model.fromDate != null) {
          extraParams.push({
            field: "fromDate",
            value: moment(this.model.fromDate).format("YYYY-MM-DD"),
          })
        }
        if (this.model.toDate != null) {
          extraParams.push({
            field: "toDate",
            value: moment(this.model.toDate).format("YYYY-MM-DD"),
          })
        }
        var data = this._coreService.ExecuteToExport('hr/Employee/GetAll', extraParams, this.state).subscribe((res: any) => {
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
            fileName: "hosonhanvien" + "-" + formattedDate + ".xlsx"
          };
          this.gridInstance.excelExport(exportProperties)

        })
        break;
      case ToolbarItem.EXPORT_TEMPLATE:

        window.open('/assets/template/profileImport.xls', "_blank")

        return;
        // this._excelService.generateExcelProfile();
        this._coreService
          .Download("hr/Employee/TemplateImport", null)
          .subscribe((response: HttpResponse<Blob>) => {
            let filename: string = "TemplateProfile.xlsx";
            let binaryData = [];
            binaryData.push(response.body);
            if (binaryData.length > 0) {
              let downloadLink = document.createElement("a");
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData as BlobPart[], { type: "blob" }));
              downloadLink.setAttribute("download", filename);
              document.body.appendChild(downloadLink);
              downloadLink.click();
            }
          });
        break;
      case ToolbarItem.IMPORT:
        document.getElementById("file")!.click();
        break;
      case ToolbarItem.SYNC:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          let lstDeleteIds = _.map(this.modelDelete, "id");
          if (lstDeleteIds.length > 0) {
            this._coreService
              .Post("hr/Employee/PushErpEmployee", lstDeleteIds)
              .subscribe((success: any) => {
                if (success.statusCode == "200") {
                  this.notification.editSuccess();
                  this.gridInstance.clearSelection();
                  this.gridInstance.refresh();
                }
                else {
                  this.notification.checkErrorMessage(success.message);
                }

              });
          }
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      default:
        break;
    }
  };

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      let lstDeleteIds = _.map(this.modelDelete, "id");
      if (lstDeleteIds.length > 0) {
        this._coreService
          .Post("hr/Employee/Delete", lstDeleteIds)
          .subscribe((success: any) => {
            if (success.statusCode == "200") {
              this.notification.deleteSuccess();
              this.modalService.close("confirm-delete-modal");
              this.gridInstance.clearSelection();
              this.gridInstance.refresh();
            }
            else {
              this.notification.checkErrorMessage(success.message);
              this.modalService.close("confirm-delete-modal");
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

  inputFile = async (e: any) => {
    var files = e.target.files;
    var file = files[0];
    var data = await this._coreService.readExcel(file);
    this.dataImport = data;
    let x: any = document.getElementById("file");
    x.value = null;
    this.modalService.open("confirm-import-modal");
  };


  confirmImport = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-import-modal");
    } else {
      if (this.dataImport) {
        if (this.dataImport.length > 0 && this.dataImport.length < 10000) {
          let param = [{
            data: this.dataImport
          }]
          this.modalService.loading.next(true);
          this._coreService
            .Download("hr/Employee/ImportProfile", param[0])
            .subscribe((response: HttpResponse<Blob>) => {
              this.modalService.close("confirm-import-modal");
              this.modalService.loading.next(false);
              if (response.status == 204) {
                this.notification.error("Import không thành công! bạn vui lòng kiểm tra lại!");
              }
              else {
                if (response.body!.type == "application/json") {
                  this.notification.success("Import thành công");
                  this.gridInstance.clearSelection();
                  this.gridInstance.refresh();
                }
                else {
                  let binaryData = [];
                  binaryData.push(response.body);
                  if (binaryData.length > 0) {
                    let filename: string = "TemplateProfileError.xlsx";
                    let downloadLink = document.createElement("a");
                    downloadLink.href = window.URL.createObjectURL(
                      new Blob(binaryData as BlobPart[], { type: "blob" }));
                    downloadLink.setAttribute("download", filename);
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    this.notification.warning("Import không thành công! bạn vui lòng kiểm tra lại file TemplateProfileError.xlsx!");
                  }
                }
              }
            });
        }
      }
      else {
        this.modalService.close("confirm-import-modal");
      }

    }
  };

}
