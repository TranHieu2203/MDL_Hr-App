import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  AfterViewInit,
} from "@angular/core";
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
import {
  FilterService,
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { Situation } from "src/app/_models/app/cms/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const async = require("async");
const $ = require("jquery");
setCulture("en");
interface ModelDeleteItem {
  id?: number;
  reason?: string;
}

@Component({
  selector: "app-family-change-edit",
  templateUrl: "./family-change-edit.component.html",
  styleUrls: ["./family-change-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class FamilyChangeEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([]);
  // Varriable Language
  // flagState = "";
  flagState$ = new BehaviorSubject<string>("");
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";
  paramIdFamily = "";
  reasonname: any | null;
  model: Situation = new Situation();
  modelTemp: Situation = new Situation();
  modelCompare: Situation = new Situation();
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstTypeId: any;
  lstEmpSituation: any;
  public modelDelete: Array<any> = [];
  public statusId: string | undefined;

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
          this.paramIdFamily = paramUrl.idFamily;

          // this.flagState = paramUrl.type;
          this.flagState$.next(paramUrl.type);
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        // this.flagState = "new";
        this.flagState$.next("new");
      }
    });

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      name: ["", Validators.required],
      birth: ["", []],
      no: ["", Validators.required], // CMND
      taxNo: ["", []], // CMND
      familyNo: ["", []], // CMND
      familyName: ["", []], // CMND
      address: ["", []], // CMND
      relationshipId: ["", Validators.required],
      dateStart: ["", []],
      dateEnd: ["", []],
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


    this.flagState$.subscribe((x) => {
      let toolbarList: any[] = [];
      if (x === "view") {
        toolbarList = [ToolbarItem.APPROVED, ToolbarItem.DENIED, ToolbarItem.BACK];
        this.editForm.disable();
      }
      if (x === "new") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      if (x === "edit") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];

      }
      this.toolItems$.next(toolbarList);
    });
    async.waterfall(
      [
        (cb: any) => {
          if (this.paramId) {
            this._coreService
              .Get("hr/Employee/GetSituationEditById?id=" + this.paramId)
              .subscribe((res: any) => {
                this.modelTemp = res.data;
                this.statusId = res.data.status
                cb();
              });
          } else {
            cb();
          }
        },
        (cb: any) => {
          if (this.paramIdFamily) {
            this._coreService
              .Get("hr/Employee/GetSituationById?id=" + this.paramIdFamily)
              .subscribe((res: any) => {
                this.modelCompare = res.data;

                cb();
              });
          } else {
            cb();
          }
        },
        (cb: any) => {
          this._coreService
            .Get("hr/otherlist/EmpSituation")
            .subscribe((res: any) => {
              this.lstEmpSituation = res.data;
              cb();
            });
        },
      ],
      (err: any, ok: any) => {
        this.model = _.cloneDeep(this.modelTemp);


        //delete this.modelTemp;
      }
    );

    this.mode = "CheckBox";
  }


  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    let selectDeletes = parseInt(this.paramId);
    switch (buttonId) {

      case ToolbarItem.APPROVED:
        if (selectDeletes) {
          this.modelDelete.push(selectDeletes);

          this.modalService.open("confirm-approved-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.DENIED:
        if (selectDeletes) {
          this.modelDelete.push(selectDeletes);

          this.modalService.open("confirm-unapproved-modal");
        } else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
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
          this.router.navigate(["hrms/profile/business/family-change"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        this.flagState$.next("edit");
        this.flagePopup = true;
        this.editForm.enable();

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

    let param = this.convertModel(this.model);

    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/family-change/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/business/family-change"]);
            return;
          } else if (res.message == "ELEMENT_CODE_EXISTS") {
            this.notification.warning("Mã đã tồn tại!");
          } else {
            if (res.message && res.message.length > 0) {
              this.notification.warning("Thêm không thành công");
            } else {
              this.notification.addError();
            }
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/family-change/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/business/family-change"]);
          } else if (res.statusCode == 400) {
            this.notification.warning("Sửa không thành công");
          }
        },
        (error: any) => {
          this.notification.editError();
        }
      );
    }
  };
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    model.dateStart = param.dateStart
      ? moment(param.dateStart).format("YYYY-MM-DD")
      : null;
    model.dateEnd = param.dateEnd
      ? moment(param.dateEnd).format("YYYY-MM-DD")
      : null;
    return model;
  }
  // change date
  changeDate = (model: any) => {
    setTimeout(() => {
      const idDate = "#" + model + "_input";
      const value = $(idDate).val();
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      if (value.length === 0) {
        this.editForm.get(model)!.setErrors({ required: true });
        return;
      } else if (value.length > 0 && patt.test(value.toLowerCase()) === true) {
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
  // confirm delete
  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      // this._coreService
      //   .Delete("app-item/delete-many?ids=" + this.model.id, {
      //     ip_address: "123456",
      //     channel_code: "W",
      //   })
      //   .subscribe((success: any) => {
      //     this.notification.deleteSuccess();
      //     this.modalService.close("confirm-delete-modal");
      //     this.router.navigate(["/hrms/profile/business/family-change"]);
      //   });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/family-change"]);
    }
  };
  compareText(str1: string = "", str2: string = "") {
    if (str1?.trim().toLocaleLowerCase() != str2?.trim().toLocaleLowerCase()) return false;
    return true
  }
  // filter type
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
  confirmApproved = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-approved-modal");
    } else {



      if (this.statusId == '3' || this.statusId == '2') {
        this.notification.warning("Không thể phê duyệt bản ghi đã phê duyệt/từ chối");
        this.reasonname = null;
        this.modalService.close("confirm-approved-modal");
        return;
      }


      let lstDeleteInfo: Array<ModelDeleteItem> = this.modelDelete.map(item => {
        return {
          id: item,
          reason: this.reasonname
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
              this.router.navigate(["hrms/profile/business/family-change"]);
            }
            else {
              this.notification.error("Lỗi");
              this.reasonname = null;
              this.modalService.close("confirm-approved-modal");
              this.router.navigate(["hrms/profile/business/family-change"]);
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
      if (this.statusId == '3' || this.statusId == '2') {
        this.notification.warning("Không thể phê duyệt bản ghi đã phê duyệt/từ chối");
        this.reasonname = null;
        this.modalService.close("confirm-unapproved-modal");
        return;
      }
      let lstDeleteInfo: Array<ModelDeleteItem> = this.modelDelete.map(item => {
        return {
          id: item,
          reason: this.reasonname
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
              this.router.navigate(["hrms/profile/business/family-change"]);
            }
            else {
              this.notification.error("Lỗi");
              this.reasonname = null;
              this.modalService.close("confirm-unapproved-modal");
              this.router.navigate(["hrms/profile/business/family-change"]);
            }

          });
      }
    }
  };
}
