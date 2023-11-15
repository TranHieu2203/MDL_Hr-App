import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Subject, BehaviorSubject, empty } from "rxjs";
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
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
const $ = require("jquery");
import { Campaign } from "src/app/_models/app/cms";
import { exit } from "process";
setCulture("en");

@Component({
  selector: "cms-profile-campaign-edit",
  templateUrl: "./campaign-edit.component.html",
  styleUrls: ["./campaign-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class CampaignEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  @ViewChild("overviewgrid", { static: true })
  public grid!: GridComponent;
  // Varriable Language
  flagState$ = new BehaviorSubject<string>('')
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: Campaign = new Campaign();
  languages: any;
  selectedLanguage: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;

  lstStatusId: any = [];
  lstPositionId: any = [];
  lstreasonId: any = [];
  lsthocvanId: any = [];
  lstchuyenmonId: any = [];
  lstngoainguId: any = [];
  lsttdNgoaiNguId: any = [];
  lsttinhocId: any = [];
  lstnguondtId: any = [];
  lstdonviId: any = [];


  lstplanId: any = [];
  lststatus: any = [];
  lstdeadlineId: any = [];
  lsthinhthucId: any = [];
  lstplaceId: any = [];
  lstmauId: any = [];
  disable: any;
  checked: number = 0;
    emptyArray: any = [];
    data: any = [];
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
          this.checked = 1;
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

      ptName: [{ value: "", disabled: true }, [Validators.required]],
      employeeName: [{ value: "", disable: this.disable }, []],
      //unit: [""], //Đơn vị
      positionId: ["", []], //Chức danh
      code: ["", []] ,
      name: ["", []],
      planId: ["", []],
      status: ["", []],
      deadlineId:["", []],

      chiPhiDk: ["", []],
      orgId: ["", []],

      chucVu: ["", []],
      hinhthucId: ["", []],

      placeId:["", []],

      salaryFrom: ["", []],
      salaryTo: ["", []],
      jd:["", []],
      mauId: ["", []],
      endDateTT:["", []],
      endDate:["", []],
      soLuongTuyen:["", []],
      soLuongHienCo:["", []],
      soLuongDinhBien:["", []]
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
        // this.editForm.disable();
      }
      if (x === "new") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      if (x === "edit") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];

      }
      this.toolItems$.next(toolbarList)
    })

    this.disable = true;
  }

  loadData() {
    Promise.all([
      this.getById(),
      this.getStatus(),
      this.GetListPlan(),
      this.getHanTuyenDung(),
      this.getHinhThuc(),
      this.getNoiLamViec(),
      this.getMau(),
      this.getlstnguonId()
    ]).then((res: any) => {
      this.lststatus = res[1];
      this.lstplanId = res[2];
      this.lstdeadlineId = res[3];
      this.lsthinhthucId = res[4];
      this.lstplaceId = res[5],
        this.lstmauId = res[6],
        this.lstnguondtId = res[7]
      if (this.paramId) {
        this.model = _.cloneDeep(_.omit(res[0],["positionId"]));
        this.loadDatalazy(res[0]);
      }
    });
  }

  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/plan/get?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
  }
  GetListPlan() {
    //đề xuất tuyển dụng
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/plan/GetList")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }


  getStatus() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GetListRecruitStatus")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    })
  }
  getHanTuyenDung() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GetListRecruitDeadline")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    })
  }
  getHinhThuc() {

    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetListRecruitType")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getNoiLamViec() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/PLACEWORK").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getMau() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/evaluation/getlist").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getlstnguonId() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GetListNguonTd").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  loadDatalazy(model: Campaign) {
    this.getPosition(model.orgId, 0)
      .then((res: any) => {
        this.lstPositionId = res;
      })
      .then((_x) => {
        this.model.positionId = model.positionId;
      });
      if(model.nguonDt){
        this.data = model.nguonDt;
      }
  }

 
  choiseEmp() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: -1,//this.model.employeeId, //select employee on grid
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      //
      this.model.ptId = res.employeeId;
      this.model.ptName = res.employeeCode;
      // this.model.positionName = res.positionName;
      // this.model.orgName = res.orgName;
      // this.model.orgId = res.orgId;
      // this.model.positionId = res.positionId;
      x.unsubscribe();
    });
  }

  choiseOrg() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.orgId, //select employee on grid
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      this.model.orgId = res.ID;
      this.model.orgName = res.NAME;
      this.model.positionId = undefined;
      this.lstPositionId = [];
      // if (this.model.orgId != null) {
      //   this.getPosition(this.model.orgId, this.model.employeeId!).then((res: any) => {
      //     this.lstPositionId = res;
      //   });
      // }
      x.unsubscribe();
    });
  }
  changeNguon(e: any) {
    if (e.e) {
      
      const foundItem = this.lstnguondtId.find((item: { id: any; }) => item.id === e.itemData.id);
      this.model.nguonDtName = foundItem.name;
    }
  }
  addNguon() {
    if (this.flagState$.value == "view") {
      return;
    };
    
    let hasError = false;

    this.emptyArray.nguonDtId =this.model.nguonDtId
    this.emptyArray.chiPhi = this.model.chiPhi
    if(this.data.length >0 ){
      this.data.forEach((_item1: { id: number | undefined; }) => {
        console.log(_item1.id,this.model.nguonDtId)
        if(_item1.id == this.model.nguonDtId){
          console.log("Không vào đây à")
          this.notification.warning("Đã tồn tại nguồn đăng tuyển");
          hasError = true;
          return;
        }
      });
    }
    if (hasError) {
      return; // Nếu có lỗi, thoát khỏi hàm addNguon()
    }
    this.data.push({
      id: this.model.nguonDtId,
      nguonDtName: this.model.nguonDtName,
      chiPhi: this.model.chiPhi
    });
    this.model.nguonDtName = undefined;
    this.model.chiPhi = undefined;
    this.model.nguonDt = this.data;
    this.grid.refresh();


  }
  // removeEmp() {
  //   if (this.flagState$.value == "view") {
  //     return;
  //   }
  //   this.data.splice(1, 1);

  //   this.grid.refresh();
  
  // }
  Remove(idToRemove: number) {
    // Sử dụng phương thức filter để xóa phần tử từ mảng
    if (this.flagState$.value == "view") {
          return;
         }
    this.data = this.data.filter((item: { id: number; }) => item.id !== idToRemove);
    this.model.nguonDt = this.data;
    // Cập nhật grid
    this.grid.refresh();
  }
  changePosition(e: any) {
    if (e.e) {
      let item = _.find(this.lstPositionId, { id: Number(e.itemData.id) });

      this.model.positionName = item.name;
      // this.model.directManagerName = "";
      // this.model.directManagerTitleName = "";
      //this.lstStaffRank = [];
      //this.getDirectManager(item.id).then((res: any) => {
      //let lmObj = res as PositionLM;
      // this.model.directManagerName = lmObj.direcManagerName;
      // this.model.directManagerTitleName = lmObj.direcManagerTitleName;
      //});
    }
  }
  getPosition(orgId?: number, empId?: number) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Position/positions/" + orgId + "/" + (empId == undefined ? 0 : empId)).subscribe((res: any) => {
        resolve(res.data);
      });
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
          this.router.navigate(["hrms/recruitment/business/campaign"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        break;
      case ToolbarItem.EDIT:
        if (this.model.status == 2 && !this.globals.isAdmin) {
          this.notification.warning("notify.APPROVED");
          return;
        }
        this.flagState$.next("edit");
        this.flagePopup = true;
        this.editForm.enable();
        this.editForm.get("employeeCode")!.disable();
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
      this._coreService.Post("hr/plan/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/recruitment/business/campaign"]);
          }
        },
        (_error: any) => {
          this.notification.addError();
        }
      );
    } else {
      this._coreService.Post("hr/plan/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/recruitment/business/campaign"]);
          }
        },
        (_error: any) => {
          this.notification.editError();
        }
      );
    }
  };
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    model.sendDate = param.sendDate
      ? moment(param.sendDate).format("YYYY-MM-DD")
      : null;
    model.expireDate = param.expireDate
      ? moment(param.expireDate).format("YYYY-MM-DD")
      : null;
    model.bdTuyenDate = param.bdTuyenDate
      ? moment(param.bdTuyenDate).format("YYYY-MM-DD")
      : null;
      model.ktDate = param.ktDate
      ? moment(param.ktDate).format("YYYY-MM-DD")
      : null;
      model.tgghDate = param.tgghDate
      ? moment(param.tgghDate).format("YYYY-MM-DD")
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

  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/recruitment/business/campaign"]);
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
