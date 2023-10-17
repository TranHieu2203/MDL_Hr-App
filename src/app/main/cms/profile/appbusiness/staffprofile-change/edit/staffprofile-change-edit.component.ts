import {
  Component,
  OnInit,
  ViewEncapsulation
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
import { Employee } from "src/app/_models/app/cms";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
const $ = require("jquery");
setCulture("en");
interface ModelDeleteItem {
  id?: number;
  reason?: string;
}
@Component({
  selector: "cms-profile-staffprofile-change-edit",
  templateUrl: "./staffprofile-change-edit.component.html",
  styleUrls: ["./staffprofile-change-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class StaffProfileChangeEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    
  ])

  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";
  model: Employee = new Employee();
  modelCompare: Employee = new Employee();
  paramEmployeeId = "";
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
  lstGenderId: any = [];
  lstReligionId: any = [];
  lstNativeId: any = [];
  lstNationalityId: any = [];
  lstWorkStatusId: any = [];
  lstProvinceId: any = [];
  lstDistrictId: any = [];
  lstWardId: any = [];
  lstCurProvinceId: any = [];
  lstCurDistrictId: any = [];
  lstCurWardId: any = [];
  lstContractId: any = [];
  lstLastWorkingId: any = [];
  lstObjectSalaryId: any = [];
  lstMaritalStatusId: any = [];
  lstBankId: any = [];
  lstBankBranchId: any = [];
  lstSchoolId: any = [];
  lstQualificationId: any = [];
  lstTrainingFormId: any = [];
  lstLearningLevelId: any = [];
  lstEmpSituation: any;
  lstResident: any = [];
  lsthomeProvinceId: any = [];
  lsthomeDistrictId: any = [];
  lsthomeWardId: any = [];
  lstExperienceId: any =[];
  lstPlaceId: any = [];
  tab: any;
  demo = new Subject();
  public modelDelete: Array<any> = [];
  public statusId: string | undefined;
  reasonname: any|null;
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
          this.paramEmployeeId = paramUrl.employeeId;

          this.flagState$.next(paramUrl.type);
        } else {
          // Xu ly redirect
          this.router.navigate(["/errors/404"]);
        }
      } else {
        this.flagState$.next("new");
      }
    });

    // Set language
    this.languages = this.globals.currentLang;
    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      currentinfor: this._formBuilder.group({
        code: [
          { value: null, disabled: false },
          [Validators.required, this.globals.noWhitespaceValidator],
        ],
        firstName: [
          "",
          [Validators.required, this.globals.noWhitespaceValidator],
        ],
        lastName: [
          "",
          [Validators.required, this.globals.noWhitespaceValidator],
        ],
        itimeCode: ["", []], //Mã chấp công
        orgManager: ["", []], //
        taxCode: [[]], //Mã sô thuế
        salTotal: ["", []],
        lstPeriod: [""],
        contractCode: [{ value: null, disabled: true }, []], //Loại hợp đồng
        dateEffect: [{ value: null, disabled: true }, []], //Ngày nghỉ việc
        dateExpire: [{ value: null, disabled: true }, []], //Bảng lương,
        orgName: ["",[]],
        positionName: ["",[]],
        experienceId: ["",[]],
        placeId: ["", []],
      }),
      infor: this._formBuilder.group({
        birthDate: ["", []],
        genderId: [""],
        birthPlace: ["", []],
        idNo: ["", []], //CMND
        idNoOld: [""],
        isTechcombank: [""],
        idDate: [""], //Ngày cấp
        idPlace: ["", []], //Nơi cấp
        passPlace: ["", []],
        nationalityId: ["", []], //Quốc tịch
        nativeId: ["", []], //Dân tộc
        religionId: ["", []], //Tôn giáo
        maritalStatusId: ["", []], //Tình trạng hôn nhân
        resident: [""]
      }),
      homeAddress: this._formBuilder.group({
        homeAddress: ["", []],
        homeProvinceId: ["", []],
        homeDistrictId: ["", []],
        homeWardId: ["", []],
      }),
      address: this._formBuilder.group({
        address: ["", []],
        provinceId: ["", []],
        districtId: ["", []],
        wardId: ["", []],
        directManagerId: ["", []],
        curAddress: [""],
        joinDate: ["", []],
        workStatusId: ["", []],
      }),
      curAddress: this._formBuilder.group({
        curAddress: ["", []],
        curProvinceId: ["", []],
        curDistrictId: ["", []],
        curWardId: ["", []],
      }),
      contact: this._formBuilder.group({
        mobilePhone: ["", []],
        email: ["", []],
        workEmail: ["", []],
        contactPer: ["", []], //Người liên hệ khi cần
        contactPerPhone: ["", []],
      }),
      addinfo: this._formBuilder.group({
        passNo: ["", []], //Hộ chiếu
        passDate: ["", []], //Ngày cấp
        passExpire: ["", []],
        passPlace: ["", []],
        visaNo: ["", []],
        visaDate: ["", []],
        visaExpire: ["", []],
        visaPlace: ["", []],
        workPermit: ["", []], //Giấy phép lao động
        workPermitDate: ["", []],
        workPermitExpire: ["", []],
        workPermitPlace: ["", []],
        workNo: ["", []],
        workDate: ["", []],
        workScope: ["", []],
        workPlace: ["", []],
      }),
      user: this._formBuilder.group({
        bankId: ["", []],
        bankBranch: ["", []],
        bankNo: ["", []],
      }),
      education: this._formBuilder.group({
        schoolId: ["", []],
        qualificationId: ["", []], //Trình độ chuyên môn
        trainingFormId: ["", []], //Hình thức đào tạo
        learningLevelId: ["", []], //trình độ học vấn
        languageMark: ["", []], //điểm số
        language: ["", []], //ngoại ngữ
        year: [""],
        certificateOther: [""]
      }),
      situation: this._formBuilder.group({
        name: ["", []],
        birth: ["", []],
        no: ["", []], // CMND
        taxNo: ["", []], // CMND
        familyNo: ["", []], // CMND
        familyName: ["", []], // CMND
        address: ["", []], // CMND
        relationshipId: ["", []],
        dateStart: ["", []],
        dateEnd: ["", []],
      }),
      page: this._formBuilder.group({
        pageName: ["", []],
        dateInput: ["", []],
        note: ["", []], // CMND
        statusId: ["", []], // CMND
      }),
      reason:["",[]]
    });

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.loadData();
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
      if (x == "edit") {
        let toolbarList: any[] = [ToolbarItem.BACK];
        this.toolItems$.next(toolbarList)
      }
      else {
        let toolbarList = [ToolbarItem.APPROVED, ToolbarItem.DENIED, ToolbarItem.BACK];
        this.toolItems$.next(toolbarList);
        this.editForm.disable();
      }
  
    })
  }

  loadData() {
    Promise.all([
      this.getById(), //0
      this.getGender(), //1
      this.getNation(), //2
      this.getNationality(), //3
      this.getReligion(), //4
      this.getListStatusEmp(), //5
      this.getProvince(), //6
      this.getListFamilyStatus(), //7
      this.getEmpSituation(),//8
      this.getlstTrainingFormId(),//9
      this.GetListLearningLevel(),//10
      this.getlstBankId(),//11
      this.getlstResident(),//12
      this.getListExperience(),//13
      this.getlstSchoolId(),//14
      this.getlstqualificationId(),//15
      this.getlstPlaceId(),//16
      this.getById1()//17
    ]).then((res: any) => {
      
      if(res[0] == null){
          this.notification.warning("Dữ liệu đã bị thay đổi");
          this.router.navigate(["hrms/profile/business/staffprofile-change"]);
          return;
      }
      this.lstGenderId = res[1];
      this.lstNativeId = res[2];
      this.lstNationalityId = res[3];
      this.lstReligionId = res[4];
      this.lstWorkStatusId = res[5];
      this.lstProvinceId = res[6];
      this.lsthomeProvinceId = res[6];
      this.lstCurProvinceId = res[6];
      this.lstMaritalStatusId = res[7];
      this.lstEmpSituation = res[8];
      this.lstTrainingFormId = res[9];
      this.lstLearningLevelId = res[10];
      this.lstBankId = res[11];
      this.lstResident = res[12];
      this.lstExperienceId = res[13];
      this.lstSchoolId = res[14];
      this.lstQualificationId = res[15];
      this.lstPlaceId = res[16];
      if (this.paramId) {
        this.model = _.cloneDeep(_.omit(res[0], ["districtId", "wardId"], ["curDistrictId", "curWardId"],["homeDistrictId", "homeWardId"]));
        this.modelCompare = res[17];
        this.loadDatalazy(res[0]);
      }
    });
  }

  compareText(str1: string="", str2:string=""){
    if(str1?.trim().toLocaleLowerCase()!= str2?.trim().toLocaleLowerCase())return false;
    return true
  }

  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/Employee/EditInfomationBy?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
            this.statusId = res.data.status
          });

      } else {

        resolve(false);
      }
    });
  }
  getById1() {
    return new Promise((resolve) => {
      if (this.paramEmployeeId) {
        this._coreService
          .Get("hr/Employee/InfomationBy?id=" + this.paramEmployeeId)
          .subscribe((res: any) => {
            resolve(res.data);

          });
          
      } else {
        resolve(false);
      }
    });
  }
  getListExperience() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GetListExperience").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getGender() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GENDER").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getEmpSituation() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/EmpSituation").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getNation() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/NATION").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getNationality() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/NATIONALITY").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getReligion() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/RELIGION").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getListFamilyStatus() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetListFamilyStatus")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getListStatusEmp() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/STATUSEMPLOYEE").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getProvince() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/province/getListProvince").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getlstTrainingFormId() {
    //hình thức đào tạo
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetListTrainingForm")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  GetListLearningLevel() {
    //trình độ học vấn
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetListLearningLevel")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getlstBankId() {
    //hình thức đào tạo
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/bank/GetList")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getlstResident() {
    //đối tượng thường trú
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/GetResident")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getlstSchoolId() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GetListSchool").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getlstqualificationId() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/SPECIALIZED_TRAIN").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getlstPlaceId() {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/PLACEWORK")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  loadDatalazy(model: Employee) {
    if (model && model.homeProvinceId) {
      this.getDistrict(model.homeProvinceId)
        .then((res: any) => {
          this.lsthomeDistrictId = res;
        })
        .then((x) => {
          this.model.homeDistrictId = model.homeDistrictId;
        });
      this.getWard(model.homeDistrictId)
        .then((res: any) => {
          this.lsthomeWardId = res;
        })
        .then((x) => {
          this.model.homeWardId = model.homeWardId;
        });
    }
    if (model && model.provinceId) {
      this.getDistrict(model.provinceId)
        .then((res: any) => {
          this.lstDistrictId = res;
        })
        .then((x) => {
          this.model.districtId = model.districtId;
        });
      this.getWard(model.districtId)
        .then((res: any) => {
          this.lstWardId = res;
        })
        .then((x) => {
          this.model.wardId = model.wardId;
        });
    }
    if (model && model.curProvinceId) {
      this.getDistrict(model.curProvinceId)
        .then((res: any) => {
          this.lstCurDistrictId = res;
        })
        .then((x) => {
          this.model.curDistrictId = model.curDistrictId;
        });
      this.getWard(model.curDistrictId)
        .then((res: any) => {
          this.lstCurWardId = res;
        })
        .then((x) => {
          this.model.curWardId = model.curWardId;
        });
    }
  }
  changeProvince(e: any) {
    if (e.e) {
      this.model.districtId = undefined;
      this.lstDistrictId = [];
      this.model.wardId = undefined;
      this.lstWardId = [];
      this.getDistrict(e.itemData.id).then((res: any) => {
        this.lstDistrictId = res;
      });
    }
  }
  changeCurProvince(e: any) {
    if (e.e) {
      this.model.curDistrictId = undefined;
      this.lstCurDistrictId = [];
      this.model.curWardId = undefined;
      this.lstCurWardId = [];
      this.getDistrict(e.itemData.id).then((res: any) => {
        this.lstCurDistrictId = res;
      });
    }
  }
  changehomeProvince(e: any) {
    if (e.e) {
      this.model.homeDistrictId = undefined;
      this.lsthomeDistrictId = [];
      this.model.homeWardId = undefined;
      this.lsthomeWardId = [];
      this.getDistrict(e.itemData.id).then((res: any) => {
        this.lsthomeDistrictId = res;
      });
    }
  }
  changehomeDistrict(e: any) {
    if (e.e) {
      this.model.homeWardId = undefined;
      this.lsthomeWardId = [];
      this.getWard(e.itemData.id).then((res: any) => {
        this.lsthomeWardId = res;
      });
    }
  }
  changeDistrict(e: any) {
    if (e.e) {
      this.model.wardId = undefined;
      this.lstWardId = [];
      this.getWard(e.itemData.id).then((res: any) => {
        this.lstWardId = res;
      });
    }
  }
  changeCurDistrict(e: any) {
    if (e.e) {
      this.model.curWardId = undefined;
      this.lstCurWardId = [];
      this.getWard(e.itemData.id).then((res: any) => {
        this.lstCurWardId = res;
      });
    }
  }
  getDistrict(id: number) {
    return new Promise((resolve) => {
      if (id) {
        this._coreService
          .Get("hr/province/getListDistrict?provinceId=" + id)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
  }
  getWard(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/province/getListWard?districtid=" + id)
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    let selectDeletes = parseInt(this.paramId);
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
          this.router.navigate(["hrms/profile/business/staffprofile-change"]);
        }
        break;
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
      default:
        break;
    }
  };

  changeName() {
    this.model.fullname = this.model.firstName + " " + this.model.lastName;
    this.demo.next(this.model.firstName);
  }

  changeTab(e: any) {
    this.tab = e;
  }

  // lưu data open popup
  saveData = () => {
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }
    let param = this.convertModel(this.model);

    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/employee/add", param).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/business/staffprofile-change"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {

    }
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
      //get form group of control
      let form: any;
      for (let field in this.editForm.controls) {
        if (this.editForm.controls[field].get(model)) {
          form = this.editForm.controls[field].get(model);
        }
      }
      var patt = new RegExp(
        "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
      );
      if (value.length === 0) {
        form.setErrors({ required: true });
        return;
      } else if (value.length > 0 && patt.test(value.toLowerCase()) === true) {
        form.setErrors({ incorrect: true });
        return;
      } else if (value.length > 10) {
        form.setErrors({ incorrect: true });
        return;
      } else {
        form.clearValidators();
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
            form.clearValidators();
          }
        }
      }
    }, 200);
  };
  coppyAddress() {
    if (this.model.provinceId != null) {
      this.model.curProvinceId = this.model.provinceId;
      this.getDistrict(this.model.curProvinceId).then((res: any) => {
        this.lstCurDistrictId = res;
        this.model.curDistrictId = this.model.districtId;
        this.getWard(this.model.curDistrictId).then((res: any) => {
          this.lstCurWardId = res;
          this.model.curWardId = this.model.wardId;
        });
      });
      this.model.curAddress = this.model.address;
    }
  }
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/staffprofile-change"]);
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
          reason: this.reasonname,
        };
      });
      if (lstDeleteInfo.length > 0) {
        this._coreService
          .Post("hr/Employee/ApproveProfileEdit", lstDeleteInfo)
          .subscribe((success: any) => {
            if (success.statusCode == "200") {
              this.notification.approvedSuccess();
              this.reasonname = null;
              this.modalService.close("confirm-approved-modal");
              this.router.navigate(["/hrms/profile/business/staffprofile-change"]);
              
            }
            else {
              this.notification.deleteError();
              this.reasonname = null;
              this.modalService.close("confirm-approved-modal");
              this.router.navigate(["/hrms/profile/business/staffprofile-change"]);
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
          reason: this.reasonname,
        };
      });
      if (lstDeleteInfo.length > 0) {
        this._coreService
          .Post("hr/Employee/RejectProfileEdit", lstDeleteInfo)
          .subscribe((success: any) => {
            if (success.statusCode == "200") {
              this.notification.deniedSuccess();
              this.reasonname = null;
              this.modalService.close("confirm-unapproved-modal");
              this.router.navigate(["/hrms/profile/business/staffprofile-change"]);
            }
            else {
              this.notification.deleteError();
              this.reasonname = null;
              this.modalService.close("confirm-unapproved-modal");
              this.router.navigate(["/hrms/profile/business/staffprofile-change"]);
            }

          });
      }
    }
  };
}
