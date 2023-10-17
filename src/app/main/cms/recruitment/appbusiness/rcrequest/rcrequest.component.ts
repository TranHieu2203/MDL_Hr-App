import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
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
  VirtualScrollService,
  RowSelectEventArgs,ExcelExportProperties
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
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";

const _ = require("lodash");
import { takeUntil } from 'rxjs/operators';
import { Splitter, SplitterComponent } from "@syncfusion/ej2-angular-layouts";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SearchModel } from "src/app/_models/app/cms/common/searchmodel";
import * as moment from "moment";
setCulture("en");
const $ = require("jquery");
@Component({
  selector: "cms-recruitment-rcrequest",
  templateUrl: "./rcrequest.component.html",
  styleUrls: ["./rcrequest.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class RcRequestComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.ADD,
    ToolbarItem.EDIT,
    ToolbarItem.DELETE,
    ToolbarItem.EXPORT_EXCEL,
    //ToolbarItem.PRINT
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  flagStatusEmp: any;
  dataImport: any[] = [];
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
  //public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  searchFrom!: FormGroup;
  model!: SearchModel;
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
  disable: any;
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
    private _formBuilder: FormBuilder,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private ip: IpServiceService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    this.searchFrom = this._formBuilder.group({
      fromDate: ["", [Validators.required]],
      toDate: ["", [Validators.required]]
    });
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.model = new SearchModel();
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

  rowSelected(args: RowSelectEventArgs) {
    const selectedrowindex: number[] = (this.gridInstance as any).getSelectedRowIndexes();
    const selectedrecords: any[] = (this.gridInstance as any).getSelectedRecords();

  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/recruitment/business/rcrequest/", paramAdd]);
  };

  // GetListData
  getListData = (): void => {
    
    var extraParams: any = [];
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
    this._coreService.execute(this.state, "hr/rcrequest/GetAll", extraParams);
  };
  GetEmp = (e: any) => {
    this.flagStatusEmp = e.checked;
    this.getListData();
  }
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
  public dataStateChange(state: DataStateChangeEventArgs): void {
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
    this._coreService.execute(this.state, "hr/rcrequest/GetAll", extraParams);
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
        localStorage.removeItem("modelTemp1");
        this.router.navigate(["/hrms/recruitment/business/rcrequest/new"]);
        break;
      case ToolbarItem.EDIT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          this.modelAdd = selectRows[0];
          if (this.modelAdd.statusId == 2 && !this.globals.isAdmin) {
            this.notification.warning("notify.APPROVED");
            return;
          }
          const objParamAdd = { id: this.modelAdd.id, type: "edit" };
          const paramAdd = window.btoa(JSON.stringify(objParamAdd));
          this.router.navigate(["/hrms/recruitment/business/rcrequest/", paramAdd]);
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.PRINT:
        if (selectDeletes && selectDeletes.length > 0) {
          let ids = JSON.stringify(selectDeletes.map((i: any) => i.id));
          let typeid = JSON.stringify(selectDeletes.map((i: any) => i.typeId));
          let paramExport = {
            sid: JSON.stringify(ids),
            typeId: typeid
          }
          this._coreService
            .templateImportV2Hrm("PrintWorking", paramExport)
            .subscribe((res: any) => {

              if (res.statusCode == 200) {
                var host = (this.globals.apiUrlReport + res.data).replace("api/", "")
                window.open(host, "_blank")
              }
            });
          /*if (selectDeletes && selectDeletes.length > 0) {
            let ids = selectDeletes.map((i: any) => i.id);
  
            this._coreService
              .Get("hr/FormList/PrintForm?typeId=2&id=" + ids[0])
              .subscribe((res: any) => {
                //check error
                if (res.statusCode == 400) {
                  this.notification.checkErrorMessage(res.message);
                } else {
                  let data = res.data.FORM;
                  let popupWin = window.open(
                    "",
                    "_blank",
                    "top=0,left=0,height='100%',width=auto"
                  );
  
                  popupWin!.document.write(data);
                  popupWin!.document.close();
                  popupWin!.print();
                  popupWin!.onafterprint = function () {
                    popupWin!.close();
                  };
                }
              });*/
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
      case ToolbarItem.EXPORT_TEMPLATE:
        this._coreService
          .Download("hr/recruitment/TemplateImport", this.nodeSelected)
          .subscribe((response: HttpResponse<Blob>) => {
            let filename: string = "TempWorking.xlsx";
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
      case ToolbarItem.EXPORT_EXCEL:
        var extraParams: any = [];
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
      var data = this._coreService.ExecuteToExport('hr/rcrequest/GetAll', extraParams,this.state).subscribe((res: any) => {
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
          fileName: "request" + "-" + formattedDate +".xlsx"
        };
        this.gridInstance.excelExport(exportProperties)

      })
      break;
      default:
        break;
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
            .Download("hr/recruitment/ImportTemplateNew", param[0])
            .subscribe((response: HttpResponse<Blob>) => {
              this.modalService.loading.next(false);
              this.modalService.close("confirm-import-modal");

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
                    let filename: string = "TempWorkingError.xlsx";
                    let downloadLink = document.createElement("a");
                    downloadLink.href = window.URL.createObjectURL(
                      new Blob(binaryData as BlobPart[], { type: "blob" }));
                    downloadLink.setAttribute("download", filename);
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    this.notification.warning("Import không thành công! bạn vui lòng kiểm tra lại file TempWorkingError.xlsx!");
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
  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      if (this.modelDelete.length > 0) {
        let ids = this.modelDelete.map((i: any) => i.id);
        this._coreService
          .Post("hr/rcrequest/remove", ids)
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
  ngOnDestroy() {
    clearTimeout(this.button);
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
