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
import { Position, PositionDesc } from "src/app/_models/app/cms/organize/appbusiness";

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

@Component({
  selector: "app-position-editdirect",
  templateUrl: "./position-editdirect.component.html",
  styleUrls: ["./position-editdirect.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class PositionEditDirectComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";
  languages: any;
  selectedLanguage: any;

  model:Position = new Position();

  positionDesc:PositionDesc = new PositionDesc();

  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };
  public dataStatus: { [key: string]: Object }[] = [
    { id: -1, name: 'Áp dụng'},
    { id: 0, name: 'Ngừng áp dụng'},
];
  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstApplication: any;
  lstParentId: any;
  lstGroupId: any;
  lstJobId: any;
  lstWorkingTimeID: any;
  lstStatusID: any;
  lstTdcmID: any;
  lstLanguageID: any;
  lstComputerID: any;
  lstIdChange:any;
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
        if (paramUrl && paramUrl.ids) {
          this.paramId = paramUrl.id;
          this.lstIdChange = paramUrl.ids;
          this.flagState$.next(paramUrl.type);
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState$.next("new");
      }
    });
    this.loadDataCombobx();
    this.loadData();
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      model:this._formBuilder.group({            
 
      
      lm:["", []],
      lmposition:["", []],
      lmname:["", []],
      isowner:["", []],
      csm:["", []],
      csmposition:["", []],
      csmname:["", []],
      isQLTT:["", []],
      isQLGT:["", []],
    }),  
    positionDesc:this._formBuilder.group({          
      jobtarget1: ["", []],
      jobtarget2: ["", []],          
      jobtarget3: ["", []],
      jobtarget4: ["", []],          
      jobtarget5: ["", []],
      jobtarget6: ["", []],
      internal1: ["", []],          
      internal2: ["", []],
      internal3: ["", []],          
      responsibility1: ["", []],
      responsibility2: ["", []],          
      responsibility3: ["", []],
      responsibility4: ["", []],          
      responsibility5: ["", []],
      detailresponsibility1: ["", []],
      detailresponsibility2: ["", []],
      detailresponsibility3: ["", []],
      detailresponsibility4: ["", []],
      detailresponsibility5: ["", []],
      outresult1: ["", []],
      outresult2: ["", []],
      outresult3: ["", []],
      outresult4: ["", []],
      outresult5: ["", []],
      permission1: ["", []],
      permission2: ["", []],
      permission3: ["", []],
      permission4: ["", []],
      permission5: ["", []],
      permission6: ["", []],
      outside1: ["", []],
      outside2: ["", []],
      outside3: ["", []],
      tdcm: ["", []],
      major: ["", []],
      workexp: ["", []],
      language: ["", []],
      computer: ["", []],
      supportskill: ["", []],
    })
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
      // if (x === "view") {
      //   toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT,ToolbarItem.SWAP_POSITION];
      //   this.editForm.disable();
      // }
      // if (x === "new") {
      //   toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      //   Promise.all([this.getAutoGenCodePosition()]).then((res: any) => {     
      //     this.model.code = res[0].toString();
      //   });

      // }
      
      toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      
      this.toolItems$.next(toolbarList)
    })

    if (!!this.flagState$.value) {
      this.editForm.get("model.code")!.disable();
    }
  }
  loadDataCombobx() {
    Promise.all([this.getListJob(),this.getListWorking(),this.getListTDCM(),this.getListLanguage(),this.getListComputer()]).then((res: any) => {     
      this.lstJobId = res[0];
      this.lstWorkingTimeID = res[1];
      this.lstStatusID = this.dataStatus;
      this.lstTdcmID=res[2];
      this.lstLanguageID=res[3];
      this.lstComputerID=res[4];
    });
  }
  getListWorking() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetOtherListByType?code=OBJECT_ATTENDANT")
        .subscribe((res: any) => {
       
          resolve(res.data);
        });
    });
  }
  
  getListTDCM() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetOtherListByType?code=MAJOR")
        .subscribe((res: any) => {
       
          resolve(res.data);
        });
    });
  }
  
  getListLanguage() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetOtherListByType?code=LANGUAGE_LEVEL")
        .subscribe((res: any) => {
       
          resolve(res.data);
        });
    });
  }
  
  getListComputer() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetOtherListByType?code=RC_COMPUTER_LEVEL")
        .subscribe((res: any) => {
    
          resolve(res.data);
        });
    });
  }
  loadData() {
    Promise.all([this.getById()]).then((res: any) => {
      if (this.paramId != "") {
        this.model = res[0];
        this.positionDesc= res[0]["positionDesc"];

      }
    });
  }
  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/Position/get?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        //resolve(null);
      }
    });
  }

  getListGroup() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/groupposition/GetList")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getListJob() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/position/GetListJob")
        .subscribe((res: any) => {
   
          resolve(res.data);
        });
    });
  }
  getAutoGenCodePosition() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/position/AutoGenCodeHuTile?tableName=HU_POSITION&colName=CODE")
        .subscribe((res: any) => {
          resolve(res);
        });
    });
  }
  choiseOrg() {
    let param = {
      selected: this.model.orgid, //select orgid on MODAL
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      this.model.orgid = res.ID;
      this.model.orgname = res.NAME;
      x.unsubscribe();
    });
  }
  
  choiseQLGT() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.lm,
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.csmposition = res.positionName;
      this.model.csmname = res.employeeName;
      this.model.csm = res.employeeId;
      x.unsubscribe();
    });
  }
  choiseQLTT() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.lm,
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.lmposition = res.positionName;
      this.model.lmname = res.employeeName;
      this.model.lm = res.employeeId;
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
          this.router.navigate(["cms/organize/business/position"]);
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
        this.editForm.get("model.code")!.disable();
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
      this.notification.formInvalid();
      this.editForm.markAllAsTouched();
      return;
    }
    let paramEdit = this.convertModel(this.positionDesc);
    this.model._positionDesc=paramEdit;
    let param = this.convertModel(this.model);
    for(const item of this.lstIdChange){
      param.id = item;
      this._coreService.Post("hr/position/UpdateQL", param).subscribe(
        (res: any) => {
          if (res.statusCode == 200) {
            this.notification.checkErrorMessage(res.message);

          }
        },
        (error: any) => {
          this.notification.editError();
        }
      );
    }
    this.notification.editSuccess();
    this.router.navigate(["/hrms/organize/business/position"]);
      
    
  };
  convertModel(param: any) {
    let model = _.cloneDeep(param);
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
      this._coreService
        .Delete("app-item/delete-many?ids=" + this.model.id, {
          ip_address: "123456",
          channel_code: "W",
        })
        .subscribe((success: any) => {
          this.notification.deleteSuccess();
          this.modalService.close("confirm-delete-modal");
          this.router.navigate(["/hrms/organize/business/position"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/organize/business/position"]);
    }
  };
  // filter type
  // change date
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
