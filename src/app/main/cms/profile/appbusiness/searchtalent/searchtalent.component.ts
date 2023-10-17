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
  VirtualScrollService, ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { FormBuilder, FormGroup } from "@angular/forms";
const _ = require("lodash");
import { takeUntil } from 'rxjs/operators';
import { Splitter, SplitterComponent } from "@syncfusion/ej2-angular-layouts";
import { HttpResponse } from "@angular/common/http";
import { SearchTalent } from "src/app/_models/app/cms";
setCulture("en");

@Component({
  selector: "cms-profile-searchtalent",
  templateUrl: "./searchtalent.component.html",
  styleUrls: ["./searchtalent.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SearchTalentComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    ToolbarItem.SETTLEMENT,
    ToolbarItem.EXPORT_EXCEL
  ])
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  flagStatusEmp: any;
  searchFrom!: FormGroup;
  dataImport: any[] = [];
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  @ViewChild('splitterInstance', { static: false })
  splitterObj!: SplitterComponent;
  //private _formBuilder: any;
  model: SearchTalent = new SearchTalent();
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
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  lsttalentSettingId: any;
  pageIndex: number = 0;
  button: any;
  field: any;
  nodeSelected: any;
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
    private _formBuilder: FormBuilder,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    this.searchFrom = this._formBuilder.group({
      talentSettingId: [''],
    });
    this.loadData();
    this.data = _coreService;
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

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
    setTimeout(() => {
      this._coreService.organizationSelect.next(true);
    }, 100);
  }

  viewRecord = (event: any) => {
    this.modelAdd = event.rowData;
    const objParamAdd = { id: this.modelAdd.id, type: "view" };
    const paramAdd = window.btoa(JSON.stringify(objParamAdd));
    this.router.navigate(["/hrms/profile/business/searchtalent/", paramAdd]);

  };
  loadData() {
    Promise.all([
      this.getYear(),
    ]).then((res: any) => {
      this.lsttalentSettingId = res[0];
    });
  }
  getYear() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/talentsetting/GetList").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  search() {
    let param = {
      // orgId: this.model.orgId,
      talentSettingId: this.model.talentSettingId,

    }

  }
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
    if (this.model.talentSettingId) {
      extraParams.push({
        field: "talentSettingId",
        value: this.model.talentSettingId,
      });
    }

    this._coreService.execute(this.state, "hr/talentsetting/GetAllSearch", extraParams);
  };
  GetEmp = (e: any) => {
    this.flagStatusEmp = e.checked;
    this.getListData();
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    if (this.flagStatusEmp) {
      extraParams.push({
        field: "WorkStatusId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "hr/talentsetting/GetAllSearch", extraParams);
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
        this.router.navigate(["/hrms/profile/business/searchtalent/new"]);
        break;
      case ToolbarItem.SETTLEMENT:
        const selectRows = this.gridInstance.getSelectedRecords();
        if (selectRows && selectRows.length > 0) {
          for (let i = 0; i < selectRows.length; i++) {
            let param = this.convertModel(this.model);
            this.modelAdd = selectRows[i];

            param.employeeId = this.modelAdd.ID;
            param.talentSettingId = this.model.talentSettingId;
            param.positionListName = this.modelAdd.POSITION_LIST_NAME;
            param.age = this.modelAdd.AGE;
            param.seniority = this.modelAdd.SENIORITY;
            param.learningLevelName = this.modelAdd.LEARNING_LEVEL_NAME;
            param.certificateName = this.modelAdd.CERTIFICATE_NAME;

            this._coreService.Post("hr/talentsetting/AddMng", param).subscribe(
              (res: any) => {
                if (res.statusCode == 400) {
                  this.notification.checkErrorMessage(res.message);
                }
              },
              (error: any) => {
                this.notification.addError();
              }
            );
          }


        }
        else {
          this.notification.warning("notify.NO_RECORD_SELECT");
          return;
        }
        this.notification.addSuccess();
        this.router.navigate(["/hrms/profile/business/searchtalent"]);

        // if (selectRows && selectRows.length > 0) {
        //   this.modelAdd = selectRows[0];
        //   if (this.modelAdd.statusId == 2 && !this.globals.isAdmin) {
        //     this.notification.warning("notify.APPROVED");
        //     return;
        //   }
        //   const objParamAdd = { id: this.modelAdd.id, type: "edit" };
        //   const paramAdd = window.btoa(JSON.stringify(objParamAdd));
        //   this.router.navigate(["/hrms/profile/business/searchtalent/", paramAdd]);
        // } else {
        //   this.notification.warning("notify.NO_RECORD_SELECT");
        // }
        // let param = selectRows.;
        // this._coreService.Post("hr/talentsetting/Add", param).subscribe(
        //   (res: any) => {
        //     if (res.statusCode == 400) {
        //       this.notification.checkErrorMessage(res.message);
        //     } else {
        //       this.notification.editSuccess();
        //       this.router.navigate(["/hrms/profile/business/searchtalent"]);
        //     }
        //   },
        //   (error: any) => {
        //     this.notification.editError();
        //   }
        // );
        break;
      case ToolbarItem.PRINT:
        if (selectDeletes && selectDeletes.length > 0) {
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
            });
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }

        break;
      case ToolbarItem.DELETE:
        if (selectDeletes && selectDeletes.length > 0) {
          this.modelDelete = selectDeletes;
          let checkHieuLuc = false;
          for (let i = 0; i < this.modelDelete.length; i++) {
            if (this.modelDelete[i].statusId === 2) {
              checkHieuLuc = true;
            }
          }
          if (checkHieuLuc) {
            this.notification.warning(
              "Dữ liệu đã được phê duyệt, bạn không thể xóa!"
            );
            return;
          }
          this.modalService.open("confirm-delete-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.EXPORT_TEMPLATE:
        this._coreService
          .Download("hr/working/TemplateImport", this.nodeSelected)
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
        let extraParams: any[] = [];
        if (this.nodeSelected) {
          extraParams.push({
            field: "orgId",
            value: this.nodeSelected,
          });
        }
        if (this.flagStatusEmp) {
          extraParams.push({
            field: "WorkStatusId",
            value: this.nodeSelected,
          });
        }
        var data = this._coreService.ExecuteToExport('hr/talentsetting/GetAllSearch', extraParams, this.state).subscribe((res: any) => {
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
            fileName: "timkiemnhantai" + "-" + formattedDate + ".xlsx"
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
  convertModel(param: any) {
    let model = _.cloneDeep(param);

    // model.effectDate = param.effectDate
    //   ? moment(param.effectDate).format("MM/DD/YYYY")
    //   : null;
    // model.signDate = param.signDate
    //   ? moment(param.signDate).format("MM/DD/YYYY")
    //   : null;

    return model;
  }
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
            .Download("hr/working/ImportTemplateNew", param[0])
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
          .Post("hr/workingbefore/remove", ids)
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
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
