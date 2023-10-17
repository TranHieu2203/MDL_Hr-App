import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { Subject } from "rxjs";
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
  VirtualScrollService,ExcelExportProperties
} from "@syncfusion/ej2-angular-grids";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);
import { IpServiceService } from "src/app/_services/ip-service.service";
import {
  FilterSettingsModel,
  IFilter,
  Filter,
} from "@syncfusion/ej2-angular-grids";
import { DropDownList } from "@syncfusion/ej2-angular-dropdowns";
import { createElement } from "@syncfusion/ej2-base";

const _ = require("lodash");
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
setCulture("en");

@Component({
  selector: "cms-app-salarysample",
  templateUrl: "./salarysample.component.html",
  styleUrls: ["./salarysample.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class SalarySampleComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  lstData: any[] = [];
  salaryLevelNum = 0;
  salaryRankNum = 0;
  lstSalaryLevel: any[] = [];
  lstSalaryRanks: any[] = [];
  lstSalarySale: any[] = [];
  lstSalaryScaleId: any[] = [];
  lstSalaryRankId: any[] = [];
  flagCheck = 0;
  scaleForm: FormGroup;
  rankForm: FormGroup;
  levelForm: FormGroup;
  public dropInstance!: DropDownList;
  // View child Grid
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;

  // View child filter
  @ViewChild("filterMenu", { static: false })
  public filterMenu!: ListBoxComponent;

  public fields: FieldSettingsModel = { text: "name", value: "id" };
  public fieldsCode: FieldSettingsModel = { text: "name", value: "code" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // Khai báo data
  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };
  public modelAdd: any;
  public modelDelete: Array<any> = [];
  public scaleModel: ScaleModel = new ScaleModel();
  public rankModel: RankModel = new RankModel();
  public levelModel: LevelModel = new LevelModel();
  // query auto complete
  public query = new Query();
  // list filter

  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  button: any;

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
    private _formBuilder: FormBuilder,
    private ip: IpServiceService,
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    this.scaleForm = this._formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(51), this.globals.noWhitespaceValidator]],
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(31),
          this.globals.checkExistSpace,
        ]
      ],
      note: [""],
      order: [""],
    })
    this.rankForm = this._formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(51), this.globals.noWhitespaceValidator]],
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(31),
          this.globals.checkExistSpace,
        ],
      ],
      salaryScaleId: ["", [Validators.required]],
      orders: [""],
      note: [""],
    });
    this.levelForm = this._formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(51), this.globals.noWhitespaceValidator]],
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(31),
          this.globals.checkExistSpace,
        ],
      ],
      salaryRankId: ["", [Validators.required]],
      salaryScaleId: ["", [Validators.required]],
      monney: ["", [Validators.required]],
      orders: [""],
      note: [""],
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

    // Load List Data
    this.getListData();
  }


  // filter checkbox

  // GetListData
  getListData = (): void => {
    
    // bậc lương
    this._coreService.Get("hr/salarylevel/GetAll").subscribe((res: any) => {
      this.lstData = res.data;
    })
    // ngạch lương
    this._coreService.Get("hr/SalaryRank/GetRankList").subscribe((res: any) => {
      let stt = 0;
      this.lstSalarySale = res.data;
      this.lstSalarySale.forEach((item: any) => {
        item.stt = stt + 1;
        stt += 1
        if (item.lstRank.length == 0) {
          item.lstRank.push({
            id: 0,
            name: " ",
            nameScale: item.name,
            idScale: item.id,
            noteScale: item.note,
            orders: item.orders,
            code: item.code
          })
        }
        this.lstSalaryRanks = this.lstSalaryRanks.concat(item.lstRank);
      });
      this.lstSalaryRanks.forEach((element: any) => {
        if (element.countLevel > this.salaryLevelNum) {
          this.salaryLevelNum = element.countLevel;
          this.lstSalaryLevel = element.lstlevel;
        }
        if (this.flagCheck != element.idScale) {
          this.flagCheck = element.idScale
          element.isShow = true;
        }
      });
    })

    this._coreService.Get("hr/SalaryScale/GetList").subscribe((res: any) => {
      this.lstSalaryScaleId = res.data;
    });
  };
  AddRecord = (status: any) => {
    if (status == "scale") {
      this.modalService.open("add-scale")
    }
    if (status == "rank") {
      this.modalService.open("add-rank")
    }
    if (status == "level") {
      this.modalService.open("add-level")
    }
  }
  confirmAddScale = (status: any) => {
    if (status == 'cancel') {
      this.modalService.close("add-scale");
      this.scaleForm.reset();
    }
    else {
      this._coreService.Post("hr/salaryscale/add", this.scaleModel).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            setTimeout(() => {
              window.location.reload();
              this.scaleModel = new ScaleModel();
            }, 200)
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    }
  }
  confirmAddRank = (status: any) => {
    if (status == 'cancel') {
      this.modalService.close("add-rank");
      this.rankModel = new RankModel();
    }
    else {
      this._coreService.Post("hr/salaryrank/add", this.rankModel).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            setTimeout(() => {
              window.location.reload();
              this.rankForm.reset();
            }, 200)
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    }
  }
  EditRecord = (status: any, data: any) => {
    if (status == "scale") {
      this.modalService.open("edit-scale");
      this.scaleModel.id = data.idScale ? data.idScale : data.id;
      this.scaleModel.name = data.nameScale ? data.nameScale : data.name;
      this.scaleModel.note = data.noteScale ? data.noteScale : data.note;
      this.scaleModel.orders = data.orderScale ? data.orderScale : data.orders;
      this.scaleModel.code = data.codeScale ? data.codeScale : data.code;
    }
    if (status == "rank") {
      this.modalService.open("edit-rank");
      this.rankModel.id = data.id;
      this.rankModel.code = data.code;
      this.rankModel.name = data.name;
      this.rankModel.salaryScaleId = data.salaryScaleId;
      this.rankModel.orders = data.orders;
      this.rankModel.note = data.note
    }
    if (status == "level") {

      this.modalService.open("edit-level");
      this._coreService
        .Get("hr/SalaryLevel/get?id=" + data.id)
        .subscribe((res: any) => {
          this.levelModel = res.data;
        });
    }
  }
  confirmEdit = (status: any, type: any) => {
    if (type == "scale") {
      if (status == 'cancel') {
        this.modalService.close("edit-scale");
        this.scaleForm.reset();
      }
      else {
        this._coreService.Post("hr/salaryscale/Update", this.scaleModel).subscribe(
          (res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              setTimeout(() => {
                this.notification.editSuccess();
                window.location.reload();
                this.scaleForm.reset();
              }, 200)
            }
          },
          (error: any) => {
            this.notification.editError();
          }
        );
      }
    }
    else if (type == "rank") {
      if (status == 'cancel') {
        this.modalService.close("edit-rank");
        this.rankForm.reset();
      }
      else {
        this._coreService.Post("hr/salaryrank/Update", this.rankModel).subscribe(
          (res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              setTimeout(() => {
                this.notification.editSuccess();
                window.location.reload();
                this.rankForm.reset();
              }, 200)
            }
          },
          (error: any) => {
            this.notification.editError();
          }
        );
      }
    }
    else if (type == "level") {
      if (status == 'cancel') {
        this.modalService.close("edit-level");
        this.levelForm.reset();
      }
      else {
        this._coreService.Post("hr/salarylevel/Update", this.levelModel).subscribe(
          (res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              setTimeout(() => {
                this.notification.editSuccess();
                window.location.reload();
                this.levelForm.reset();
              }, 200)
            }
          },
          (error: any) => {
            this.notification.editError();
          }
        );
      }
    }
  }
  confirmAddLevel = (status: any) => {
    if (status == 'cancel') {
      this.modalService.close("add-level");
      this.levelForm.reset();
    }
    else {
      this._coreService.Post("hr/salarylevel/add", this.levelModel).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            setTimeout(() => {
              window.location.reload();
              this.levelForm.reset();
            }, 200)
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    }
  }
  changeSalaryScale(e: any) {
    if (e.e) {
      this._coreService
        .Get("hr/Salaryrank/GetList?scaleId=" + e.itemData.id)
        .subscribe((res: any) => {
          this.lstSalaryRankId = res.data;
        });
    }
  }
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}

class ScaleModel {
  id?: number;
  code?: string;
  name?: string;
  orders?: number;
  dateEffect?: Date;
  isActive?: boolean;
  note?: string;
  tenantId?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
}
class RankModel {
  id?: number;
  code?: string;
  name?: string;
  orders?: number;
  salaryScaleId?: number;
  isActive?: boolean;
  note?: string;
  tenantId?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
}
class LevelModel {
  id?: number;
  code?: string;
  name?: string;
  orders?: number;
  salaryRankId?: number;
  salaryScaleId?: number;
  monney?: number;
  isActive?: boolean;
  note?: string;
  tenantId?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
}
