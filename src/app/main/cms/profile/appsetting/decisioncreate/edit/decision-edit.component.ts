import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
  AfterViewInit,
  ElementRef,
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
import { SysDecision } from "src/app/_models/app/cms/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import { ListOrgComponent } from "src/app/components/listorg/listorg.component";
import * as moment from "moment";
const async = require("async");
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "app-decision-edit",
  templateUrl: "./decision-edit.component.html",
  styleUrls: ["./decision-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class DecisionEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    
  ])
  // Varriable Language
  // flagState = "";
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: SysDecision = new SysDecision();
  modelTemp: SysDecision = new SysDecision();
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "code", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  public watermark: string = "Chọn thời gian";
  // sets the format property to display the time value in 24 hours format.
  public formatString: string = "HH:mm";
  public interval: number = 60;
  lstTimeTypeId: unknown;

  lstTypeDecisionCode: any = [];
  lstDecisionCode1: any = [];
  lstDecisionCode2: any = [];
  lstDecisionCode3: any = [];
  @ViewChild("listemployee", { static: false })
  listEmployee!: ListOrgComponent;

  isRequired = true;

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
          this.flagState$.next(paramUrl.type);
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState$.next("new");
      }
    });
    this.loadData();
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      typeDecision: ["", [Validators.required]],
      type1: ["", []],
      isOrg:  ["", []],
      type2: ["", [Validators.required]],
      type3: ["", [Validators.required]],
      character1:  ["", [Validators.required]],
      character2:  ["", [Validators.required]],
      // orgid:["", [Validators.required]],

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
        this.editForm.get("code")!.disable();
      }
      this.toolItems$.next(toolbarList)
    })
    // Build toolbar
    

    if (this.flagState$.value === "view") {
      this.editForm.disable();
    }
    //this.loadData();
    this.mode = "CheckBox";
    // this.editForm.get("isORg").ch;
    // this.editForm.get("type1").enable();
  }
  loadData() {
    Promise.all([this.loadTyeDecision(),this.loadCode1Decision(),this.loadCode2Decision(),this.loadCode3Decision(),this.getById()]).then((res: any) => {

      this.lstTypeDecisionCode = res[0];
    
      this.lstDecisionCode1 = res[1];
      this.lstDecisionCode2 = res[2];
      this.lstDecisionCode3 = res[3];
      if (this.paramId) {
        this.model = res[4];
      };

      
      return new Promise((resolve) => {
        // this._coreService.Get("hr/sysdecision/getorgid?id=" +  this.paramId).subscribe((res: any) => {
        this._coreService.Get("hr/sysdecision/get?id=" +  this.paramId).subscribe((res: any) => {
          resolve(res.data);
        
      
          this.listEmployee.pushData(res.data.orgs);
        });
      });

    });
   
  }
  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/sysdecision/get?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(null);
      }
    });
  }
  loadTyeDecision() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/type_decisioncreate").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  loadCode1Decision() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/code1_decision").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  loadCode2Decision() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/code2_decision").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  loadCode3Decision() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/code3_decision").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    return model;
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
          this.router.navigate(["hrms/profile/setting/decisioncreate"]);
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
        if(this.editForm.get("isOrg")!.valid){
          this.editForm.get("type1")!.disable();
        }else{
          this.editForm.get("type1")!.enable();
        }
        this.editForm.get("typeDecision")!.disable();
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
    
    let param: SysDecision = this.convertModel(this.model);

  
    if (this.flagState$.value === "new" ) {
      
      let x = this.listEmployee.getData();
      if (x.length == 0) {
        this.notification.warning("Chưa chọn nhân viên!");
        return;
      }

      x.forEach((item: any) => {
        param.orgs!.push({
          orgid: item.ID,
        });
    
      });

      this._coreService.Post("hr/sysdecision/add", param).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == "400") {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/setting/decisioncreate"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } 

    else  // Edit
    {
      let x = this.listEmployee.getData();
      if (x.length == 0) {
        this.notification.warning("Chưa chọn nhân viên!");
        return;
      }
      

      x.forEach((item: any) => {
        param.orgs!.push({
          orgid: item.orgId != null ? item.orgId : item.ID,
        });

      });


      this._coreService.Post("hr/sysdecision/Update", param).subscribe(
        (res: any) => {
   
          if (res.statusCode == "200") {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/setting/decisioncreate"]);
          } else if (res.statusCode == "400") {
            this.notification.editError();
          }
        },
        (error: any) => {
         
          this.notification.editError();
        }
      );
    
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
        var patt1 = new RegExp(
          /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.]/
        );
        // check nhập sai năm
        if(value && value.indexOf("/") != -1)
        {
          let valueArray = value.split("/");
          if(valueArray.length != 3)
          {
            this.editForm.get(model)!.setErrors({ incorrect: true });
            return;
          }
          if(valueArray[0].length != 2 || valueArray[1].length != 2 || valueArray[2].length != 4)
          {
            this.editForm.get(model)!.setErrors({ incorrect: true });
            return;
          }
        }
        let FindSpace = value.indexOf(" ");
        if (FindSpace != -1) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        } else
        if (value.length === 0) {
          this.editForm.get(model)!.setErrors({ required: true });
          return;
        } else if (value.length > 0 && (patt.test(value.toLowerCase()) === true || patt1.test(value.toLowerCase()) === true)) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        } else if (value.length > 10) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        } else {
          this.editForm.get(model)!.setErrors(null);
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
          this.router.navigate(["/hrms/profile/setting/decisioncreate"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/setting/decisioncreate"]);
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
  
  checkOrg = (e: any) => {

    if(e.checked){
      this.isRequired = !this.isRequired
      this.editForm.get("type1")!.disable();
    }else{
      this.isRequired = !this.isRequired
      this.editForm.get("type1")!.enable();
    }
  }

  choiseEmp() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      multiselect: true,
      state: "allowanceemp",
    };
    //  this.modalService.open("cms-app-modalsemp", param);
   this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
    
      this.listEmployee.pushData(res);
      x.unsubscribe();
    });
  }

  removeEmp() {
      this.listEmployee.remove();
  }

}
