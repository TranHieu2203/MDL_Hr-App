import {
  Component,
  OnInit,
  ViewChild,
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
  GridComponent,
} from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";
import { Candidate, Family, PosPage } from "src/app/_models/app/cms";

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
import * as moment from "moment";
import { Consts } from "src/app/common/const";
import { ListEmployeeComponent } from "src/app/components/listemployee/listemployee.component";
const $ = require("jquery");
const async = require("async");
setCulture("en");

interface PositionLM {
  id: number;
  direcManagerTitleName: string;
  direcManagerName: string;
}
@Component({
  selector: "cms-recruitment-candidate-edit",
  templateUrl: "./candidate-edit.component.html",
  styleUrls: ["./candidate-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class CandidateEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])

  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  flagView = "profile";
  paramId = "";
  @ViewChild("listemployee")
  listEmployee!: ListEmployeeComponent;
  dataHistory = [];
  
  model: Candidate = new Candidate();
  modelTemp: Candidate = new Candidate();

  situation: Family = new Family();
  posPage: PosPage = new PosPage();
  filePaper: string = "";
  fileHostUrl!: string;
  // View child Grid
  //@ViewChild("overviewgridPage", { static: false })
  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  removeId: any;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstOrgId: any = [];
  lstPositionId: any = [];
  lstStaffRank: any = [];
  lstDirectManagerId: any = [];
  lstGenderId: any = [];
  lstReligionId: any = [];
  lstNativeId: any = [];
  lstNationalityId: any = [];
  lstWorkStatusId: any = [];
  lstProvinceId: any = [];
  lstDistrictId: any = [];
  lstWardId: any = [];

  lsthomeProvinceId: any = [];
  lsthomeDistrictId: any = [];
  lsthomeWardId: any = [];
  lstExperienceId: any = [];
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
  lstInsRegionId: any = [];
  lstPaperId: any = [];
  lstPlaceId: any = [];
  lstsourceCvId: any = [];
  lststatusCv: any = [];
  lstphanLoaiCv: any = [];
  tab: any;
  data: any;
  dataPage: any;
  demo = new Subject();
  chkExists = 0;
  chkBackPopUp = 0;
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
      this.fileHostUrl = this.globals.apiUrlFileManager.toString().replace('/api', '')
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
        orgManager: ["", []], //
        salTotal: ["", []],
        lstPeriod: [""],
      }),
      infor: this._formBuilder.group({
        birthDate: [""],
        genderId: [""],
        birthPlace: [""],
        idNo: ["", [Validators.required]], //CMND
        idNoOld: [""],
        idDate: [""], //Ngày cấp
        idPlace: [""], //Nơi cấp
        nationalityId: [""], //Quốc tịch
        nativeId: [""], //Dân tộc
        religionId: [""], //Tôn giáo
        maritalStatusId: [""], //Tình trạng hôn nhân
        resident: [""],
      }),
      homeAddress: this._formBuilder.group({
        homeAddress: [""],
        homeProvinceId: [""],
        homeDistrictId: [""],
        homeWardId: [""],
      }),
      address: this._formBuilder.group({
        address: [""],
        provinceId: [""],
        districtId: [""],
        wardId: [""],
      }),
      curAddress: this._formBuilder.group({
        curAddress: [""],
        curProvinceId: [""],
        curDistrictId: [""],
        curWardId: [""],
      }),
      contact: this._formBuilder.group({
        mobilePhone: [""],
        email: [""],
        workEmail: [""],
        contactPer: [""], //Người liên hệ khi cần
        contactPerPhone: [""],
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
        isTechcombank: [""],
        bankId: [{ value: "", disabled: true }, []],
        bankBranch: [{ value: "", disabled: true }, []],
        bankNo: [{ value: "", disabled: true }, []],
      }),
      education: this._formBuilder.group({
        schoolId: [""],
        qualificationId: [""], //Trình độ chuyên môn
        trainingFormId: [""], //Hình thức đào tạo
        learningLevelId: [""], //trình độ học vấn
        languageMark: ["", []], //điểm số
        language: ["", []], //ngoại ngữ,
        year: [""],
        certificateOther: [""]

      }),
      situation: this._formBuilder.group({
        name: ["", [Validators.required]],
        birth: ["", []],
        no: [""], // CMND
        taxNo: [""], // CMND
        familyNo: [""], // CMND
        familyName: [""], // CMND
        address: [""], // CMND
        relationshipId: ["", [Validators.required]],
        dateStart: ["", []],
        dateEnd: ["", []],
      }),
      ttkhac: this._formBuilder.group({
        submitDate: ["", []],
        idHr: ["", []],
        salaryDesire: ["", []],
        sourceCvId: ["", []],
        employeeIdPre: ["", []],
        statusCv: ["", []],
        phanLoaiCv: ["", []],
        ghiChu: ["", []],
      }),
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
      let toolbarList: any[] = [];
      if (x === "view") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT, ToolbarItem.PRINT];
        this.editForm.disable();
      }
      if (x === "new") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      if (x === "edit") {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
        this.flagePopup = true;
        this.editForm.enable();


        var xx = this.editForm.controls['currentinfor']
        var OrgIdStatus = xx.get('orgId')
        var PositionStatus = xx.get('positionId')
        if (this.model.contractId != null) {
          OrgIdStatus!.disable()
          if (this.model.positionId != null) {
            PositionStatus!.disable()
          }

        }

      }
      this.toolItems$.next(toolbarList)
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
      this.getEmpSituation(),
      this.getlstTrainingFormId(),
      this.GetListLearningLevel(),
      this.getlstBankId(),
      this.getlstResident(),
      this.getlstStaffRank(),
      this.getlstInsRegionId(),
      this.getlstPaperId(),
      this.getlstPlaceId(),
      this.getListExperience(),
      this.getlstSchoolId(),
      this.getlstqualificationId(),
      this.getlstsourceCvId(),
      this.getlststatusCvId(),
      this.getlstphanLoaiCv()

    ]).then((res: any) => {
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
      this.lstStaffRank = res[13];
      this.lstInsRegionId = res[14];
      this.lstPaperId = res[15];
      this.lstPlaceId = res[16];
      this.lstExperienceId = res[17];
      this.lstSchoolId = res[18];
      this.lstQualificationId = res[19],
        this.lstsourceCvId = res[20],
        this.lststatusCv = res[21],
        this.lstphanLoaiCv = res[22]
      if (this.paramId) {
        const x = setInterval(() => {
          if (this.listEmployee) {
            
            var arrEmps = res[0].employees;
            this.listEmployee.pushData(arrEmps);
            clearInterval(x);
          }
        }, 100);
        this.model = _.cloneDeep(_.omit(res[0],["employees"],["districtId", "wardId", "positionId", "directManagerId", "directManagerName", "directManagerTitleName"], ["curDistrictId", "curWardId"], ["homeDistrictId", "homeWardId"], ["bankBranch"]));

        this.loadDatalazy(res[0]);
        this.getListSituation();
        this.getListPaper();
        
      }
    });
  }

  getById() {
    return new Promise((resolve) => {
      if (this.paramId) {
        this._coreService
          .Get("hr/candidate/get?id=" + this.paramId)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
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
  getPosition(orgId?: number, empId?: number) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Position/positions/" + orgId + "/" + (empId == undefined ? 0 : empId)).subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getDirectManagerByOrg(orgId?: number) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Employee/GetDirectManagerInfo?orgId=" + orgId).subscribe((res: any) => {
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
  getlstStaffRank() {
    //đối tượng thường trú
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/job-band/cbo-job-bands")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getlstInsRegionId() {
    //vùng bảo hiểm
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/INSREGION")
        .subscribe((res: any) => {
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
  getlstPaperId() {
    //đối tượng thường trú
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/otherlist/PAPER")
        .subscribe((res: any) => {
          resolve(res.data);
        });
    });
  }
  getListExperience() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GetListExperience").subscribe((res: any) => {
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
  getlstsourceCvId() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/SOURCECV").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getlststatusCvId() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GetStatusCv").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getlstphanLoaiCv() {
    return new Promise((resolve) => {
      this._coreService.Get("hr/otherlist/GetPhanLoaiCv").subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  loadDatalazy(model: Candidate) {
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
    if (model && model.bankId) {
      this.getBankBranch(model.bankId)
        .then((res: any) => {
          this.lstBankBranchId = res;
        })
        .then((x) => {
          this.model.bankBranch = model.bankBranch;
        });

    }
    if (model && model.orgId) {
      this.getPosition(model.orgId, model.id)
        .then((res: any) => {
          this.lstPositionId = res;
        })
        .then((x) => {
          this.model.positionId = model.positionId;
          this.model.directManagerName = model.directManagerName;
          this.model.directManagerTitleName = model.directManagerTitleName;
        });
    }
    if (model && model.idHr) {
      this.model.idHrName = model.idHrName;
    }
    if (model && model.employeeIdPre) {
      this.model.employeeIdPreName = model.employeeIdPreName;
    }
    if (model && model.isTechcombank == true) {
      this.editForm.get("user")!.get("bankId")!.enable();
      this.editForm.get("user")!.get("bankNo")!.enable();
      this.editForm.get("user")!.get("bankBranch")!.enable();
    }
  }
  choiseEmp() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      multiselect: true,
      state: "candidate"
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.orgId = res[0].orgId;
      this.model.employeeId = res[0].employeeId;
      this.listEmployee.pushData(res);
      x.unsubscribe();
    });
    this.model.orgId = undefined;
  }
  removeEmp() {
    this.listEmployee.remove();
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
  changeCurDistrict(e: any) {
    if (e.e) {
      this.model.curWardId = undefined;
      this.lstCurWardId = [];
      this.getWard(e.itemData.id).then((res: any) => {
        this.lstCurWardId = res;
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
  changeBank(e: any) {
    if (e.e) {
      this.lstBankBranchId = [];
      this.getBankBranch(e.itemData.id).then((res: any) => {
        this.lstBankBranchId = res;
      });
    }
  }
  changeIsTech(e: any) {

    if (e.checked) {
      this.editForm.get("user")!.get("bankId")!.enable();
      this.editForm.get("user")!.get("bankNo")!.enable();
      this.editForm.get("user")!.get("bankBranch")!.enable();
      this.model.bankId = 9; //Techcombank
      this.getBankBranch(this.model.bankId).then((res: any) => {
        this.lstBankBranchId = res.body.data;
      });
    }
    else {
      this.model.bankId = undefined;
      this.model.bankNo = undefined;
      this.model.bankBranch = undefined;
      this.editForm.get("user")!.get("bankId")!.disable();
      this.editForm.get("user")!.get("bankNo")!.disable();
      this.editForm.get("user")!.get("bankBranch")!.disable();
    }

  }
  getBankBranch(id: number) {
    return new Promise((resolve) => {
      if (id) {
        this._coreService
          .Get("hr/bank/GetListBankBranch?bankId=" + id)
          .subscribe((res: any) => {
            resolve(res.data);
          });
      } else {
        resolve(false);
      }
    });
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
  getDirectManager(positionId: number) {
    return new Promise((resolve) => {
      if (positionId) {
        this._coreService
          .Get("hr/Position/direct-manager/" + positionId)
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
  onFileChange(files: FileList | null) {
    setTimeout(() => {
      if (files!.length > 0) {
        let data = new FormData();
        // for (let i = 0; i < files!.length; i++) {
        //   data.append("files", files![i]);
        // }
        data.append("files", "profile");
        data.append("files", files![0]);
        this._coreService.uploadFileToGroupV2Hrm(data, Consts.profile, "hososcan", this.model.code?.toString()).subscribe((res: any) => {
          var url = res.data;
          this.filePaper = url;
          let arr = url.split('/')
          // this.posPage.url = arr[arr.length-1]
          // let x: any = document.getElementById("file");
          // x.value = null;
        });
      }
    }, 200);
  }
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.BACK:
        if (this.chkBackPopUp = 1) {
          this.chkBackPopUp = 0;
          this.router.navigate(["hrms/recruitment/business/candidate"]);
        }
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
          this.router.navigate(["hrms/recruitment/business/candidate"]);
        }
        break;
      case ToolbarItem.ADD:
        break;
      case ToolbarItem.SAVE:
        if (this.tab == 6) {
          this.saveSituation();
        }
        else {
          if (this.model.idNo != undefined) {
            if (this.model.idNo.length != 9 && this.model.idNo.length != 12) {
              this.notification.warning("CMND phải là 9 hoặc 12 chữ số!")
              return;
            }
          }
          if (this.model.idNoOld != undefined) {
            if (this.model.idNoOld.length != 9 && this.model.idNoOld.length != 12) {
              this.notification.warning("CMND cũ phải là 9 hoặc 12 chữ số!")
              return;
            }
          }
          this.saveData();
        }
        break;
      case ToolbarItem.EDIT:
        this.chkBackPopUp = 0;
        this.flagState$.next("edit");
        break;
      case ToolbarItem.DELETE:
        break;
      case ToolbarItem.PRINT:
        this._coreService
          .Get("hr/FormList/PrintFormProfile?id=" + this.model.id)
          .subscribe(
            (res: any) => {
              //check error
              if (res.statusCode == "400") {
                this.notification.warning(res.message);
              } else {
                // xử lý bất đồng bộ : đợi replace dữ liệu vào rồi mới print
                if (res.data && res.data[1] && res.data[0] && res.data[0][0]) {
                  let data = res.data[1];
                  let form = res.data[0][0]["TEXT"];
                  let decision = res.data[2];
                  let contract = res.data[3];
                  let comment = res.data[4];
                  let discipline = res.data[5];
                  let inschange = res.data[6];
                  let workingbefore = res.data[7];
                  let trainingbefore = res.data[8];
                  var div = document.createElement("div");
                  div.innerHTML = form;
                  // replace thông tin cơ bản nhân viên
                  async.waterfall([
                    (cb: any) => {
                      let name = Object.getOwnPropertyNames(data[0]);
                      for (let i = 0; i < name.length; i++) {
                        while (form.indexOf(name[i]) > -1) {
                          if (name[i] == "AVATAR") {
                            form = form.replace("[" + name[i] + "]", `<img src="` + data[0][name[i]] + `" style="width: 166px; height: 166px"/>`);
                          }
                          else if (data[0][name[i]] == null) {
                            form = form.replace("[" + name[i] + "]", "");
                          }
                          else {
                            form = form.replace("[" + name[i] + "]", data[0][name[i]]);
                          }
                        }
                      }
                      div.innerHTML = form;
                      return cb();
                    },
                    (cb1: any) => {
                      // xử lý render các bảng quá trình công tác
                      let trsDecision: any[] = [];
                      let trsContract: any[] = [];
                      let trsComment: any[] = [];
                      let trsDiscipline: any[] = [];
                      let trsInschange: any[] = [];
                      let trsWorkingBefore: any[] = [];
                      let trsTrainingBefore: any[] = [];
                      let listTr = div.querySelectorAll("tr");
                      listTr.forEach((ele) => {
                        let a = $(ele).html();
                        if (a.indexOf("D_TYPE_NAME") > -1) {
                          trsDecision.push(ele);
                        }
                        if (a.indexOf("C_TYPE_NAME") > -1) {
                          trsContract.push(ele);
                        }
                        if (a.indexOf("CM_TYPE_NAME") > -1) {
                          trsComment.push(ele);
                        }
                        if (a.indexOf("DIS_TYPE_NAME") > -1) {
                          trsDiscipline.push(ele);
                        }
                        if (a.indexOf("TYPE_CHANGE") > -1) {
                          trsInschange.push(ele);
                        }
                        if (a.indexOf("WORK_TYPE_NAME") > -1) {
                          trsWorkingBefore.push(ele);
                        }
                        if (a.indexOf("TRAIN_TYPE_NAME") > -1) {
                          trsTrainingBefore.push(ele);
                        }
                      })
                      if (decision.length != 0) {
                        // quyêt định thay đổi
                        let decisionName = Object.getOwnPropertyNames(decision[0]);
                        //fill dữ liệu
                        trsDecision.forEach((tr) => {
                          let tbody = $(tr).parent();
                          let td = $(tr).html();
                          decision.forEach((item: any) => {
                            let s = td;
                            for (let i = 0; i < decisionName.length; i++) {
                              while (s.indexOf(decisionName[i]) > -1) {
                                s = s.replace("[" + decisionName[i] + "]", item[decisionName[i]]);
                              }
                            }
                            let newTr = tr.cloneNode();
                            $(newTr).html(s);
                            tbody.append(newTr);
                          });
                          tr.remove();
                        });
                      }
                      if (contract.length != 0) {
                        // hợp đồng
                        let contractName = Object.getOwnPropertyNames(contract[0]);
                        trsContract.forEach((tr) => {
                          let tbody = $(tr).parent();
                          let td = $(tr).html();
                          contract.forEach((item: any) => {
                            let s = td;
                            for (let i = 0; i < contractName.length; i++) {
                              while (s.indexOf(contractName[i]) > -1) {
                                s = s.replace("[" + contractName[i] + "]", item[contractName[i]]);
                              }
                            }
                            let newTr = tr.cloneNode();
                            $(newTr).html(s);
                            tbody.append(newTr);
                          });
                          tr.remove();
                        });
                      }
                      if (comment.length != 0) {
                        // khen thưởng
                        let commentName = Object.getOwnPropertyNames(comment[0]);
                        trsComment.forEach((tr) => {
                          let tbody = $(tr).parent();
                          let td = $(tr).html();
                          comment.forEach((item: any) => {
                            let s = td;
                            for (let i = 0; i < commentName.length; i++) {
                              while (s.indexOf(commentName[i]) > -1) {
                                s = s.replace("[" + commentName[i] + "]", item[commentName[i]]);
                              }
                            }
                            let newTr = tr.cloneNode();
                            $(newTr).html(s);
                            tbody.append(newTr);
                          });
                          tr.remove();
                        });
                      }
                      if (discipline.length != 0) {
                        // kỷ luật
                        let disciplineName = Object.getOwnPropertyNames(discipline[0]);
                        trsDiscipline.forEach((tr) => {
                          let tbody = $(tr).parent();
                          let td = $(tr).html();
                          discipline.forEach((item: any) => {
                            let s = td;
                            for (let i = 0; i < disciplineName.length; i++) {
                              while (s.indexOf(disciplineName[i]) > -1) {
                                s = s.replace("[" + disciplineName[i] + "]", item[disciplineName[i]]);
                              }
                            }
                            let newTr = tr.cloneNode();
                            $(newTr).html(s);
                            tbody.append(newTr);
                          });
                          tr.remove();
                        });
                      }
                      if (inschange.length != 0) {
                        // biến động bảo hiểm
                        let inschangeName = Object.getOwnPropertyNames(inschange[0]);
                        trsInschange.forEach((tr) => {
                          let tbody = $(tr).parent();
                          let td = $(tr).html();
                          inschange.forEach((item: any) => {
                            let s = td;
                            for (let i = 0; i < inschangeName.length; i++) {
                              while (s.indexOf(inschangeName[i]) > -1) {
                                s = s.replace("[" + inschangeName[i] + "]", item[inschangeName[i]]);
                              }
                            }
                            let newTr = tr.cloneNode();
                            $(newTr).html(s);
                            tbody.append(newTr);
                          });
                          tr.remove();
                        });
                      }
                      if (workingbefore.length != 0) {
                        // biến động bảo hiểm
                        let workingbeforeName = Object.getOwnPropertyNames(workingbefore[0]);
                        trsWorkingBefore.forEach((tr) => {
                          let tbody = $(tr).parent();
                          let td = $(tr).html();
                          workingbefore.forEach((item: any) => {
                            let s = td;
                            for (let i = 0; i < workingbeforeName.length; i++) {
                              while (s.indexOf(workingbeforeName[i]) > -1) {
                                s = s.replace("[" + workingbeforeName[i] + "]", item[workingbeforeName[i]]);
                              }
                            }
                            let newTr = tr.cloneNode();
                            $(newTr).html(s);
                            tbody.append(newTr);
                          });
                          tr.remove();
                        });
                      }
                      if (trainingbefore.length != 0) {
                        // biến động bảo hiểm
                        let trainingbeforeName = Object.getOwnPropertyNames(trainingbefore[0]);
                        trsTrainingBefore.forEach((tr) => {
                          let tbody = $(tr).parent();
                          let td = $(tr).html();
                          trainingbefore.forEach((item: any) => {
                            let s = td;
                            for (let i = 0; i < trainingbeforeName.length; i++) {
                              while (s.indexOf(trainingbeforeName[i]) > -1) {
                                s = s.replace("[" + trainingbeforeName[i] + "]", item[trainingbeforeName[i]]);
                              }
                            }
                            let newTr = tr.cloneNode();
                            $(newTr).html(s);
                            tbody.append(newTr);
                          });
                          tr.remove();
                        });
                      }
                      return cb1();

                    }
                  ], (err: any, result: any) => {
                    //print
                    setTimeout(() => {
                      print($(div).html());
                      function print(text: any) {
                        let popupWin = window.open(
                          "",
                          "_blank",
                          "top=0,left=0,height='100%',width=auto"
                        );
                        popupWin!.document.write(text);
                        popupWin!.document.close();
                        popupWin!.print();
                        popupWin!.onafterprint = function () {
                          popupWin!.close();
                        };
                      }
                    }, 500);
                  })




                }
                else if (res.data[0].length == 0) {
                  this.notification.warning("Bạn chưa thiết lập mẫu sơ yếu lý lịch !")
                }
                // let data = res.data.FORM;
                // let popupWin = window.open(
                //   "",
                //   "_blank",
                //   "top=0,left=0,height='100%',width=auto"
                // );
                // popupWin!.document.write(data);
                // popupWin!.document.close();
                // popupWin!.print();
                // popupWin!.onafterprint = function () {
                //   popupWin!.close();
                // };
              }
            });
        break;
      default:
        break;
    }
  };
  choiseOrg() {
    if (this.flagState$.value == "view") {
      return;
    }
    if (this.flagState$.value == "edit") {
      if (this.model.contractId != null) {
        this.notification.warning('Hồ sơ đã tồn tại quyết định, bạn không thể thay đổi đơn vị !');
        return;
      }
    }
    let param = {
      selected: this.model.orgId, //select employee on grid
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      this.model.orgId = res.ID;
      this.model.orgName = res.NAME;
      // this.model.orgManager = res.MANAGER_NAME;
      this.model.positionId = undefined;
      this.lstPositionId = [];
      if (this.model.orgId != null) {
        this.getPosition(this.model.orgId, this.model.id).then((res: any) => {
          this.lstPositionId = res;
        });
        this.getDirectManagerByOrg(this.model.orgId).then((res: any) => {
          this.model.directManagerId = res.employeeId;
          this.model.directManagerName = res.employeeName;
          this.model.directManagerTitleName = res.positionName;
        });
      }
      x.unsubscribe();
    });
  }
  changeName() {
    this.model.fullname = this.model.firstName + " " + this.model.lastName;
    this.demo.next(this.model.firstName);
  }
  changeCode() {
    if (this.model.code) {
      const numbersOnly: string = this.model.code.replace(/[^\d]/g, ''); // Loại bỏ tất cả ký tự không phải số
      const nonZeroNumbers: string = numbersOnly.replace(/^0+/, ''); // Loại bỏ số 0 ở đầu text
      this.model.itimeCode = nonZeroNumbers;
    }

  }
  // update avtar
  uploadAvatar(files: FileList | null) {
    setTimeout(() => {
      if (files!.length > 0) {
        let data = new FormData();
        // for (let i = 0; i < files!.length; i++) {
        //   data.append("files", files![i]);
        // }
        data.append("files", "profile");
        data.append("files", files![0]);
        this._coreService.uploadFileV2Hrm(data, Consts.profile, "avatarcv").subscribe((res: any) => {
          var url = this.globals.apiUrlFileManager.toString().replace("api/", "") + res.data;
          this.model.avatar = url;
          let x: any = document.getElementById("avatarcv");
          x.value = null;
        });
      }
    }, 200);
  }
  changePosition(e: any) {
    if (e.e) {
      let item = _.find(this.lstPositionId, { id: Number(e.itemData.id) });

      this.model.positionName = item.name;
      this.model.titleName = item.titleName;
      this.model.groupTitleName = item.groupTitleName;
      this.model.directManagerName = "";
      this.model.directManagerTitleName = "";
      // this.lstStaffRank = [];
      this.getDirectManager(item.id).then((res: any) => {
        let lmObj = res as PositionLM;
        this.model.directManagerName = lmObj.direcManagerName;
        this.model.directManagerTitleName = lmObj.direcManagerTitleName;
      });
    }
  }
  changeStaffRank(e: any) {
    if (e.e) {
      let item = _.find(this.lstStaffRank, { id: Number(e.itemData.id) });

      this.model.staffRankName = item.name;
    }
  }
  rowSelecting(e: any) {
    this.situation = e.data;
  }

  rowSelectingPage(e: any) {
    // this.posPage = e.data;
    // var file = this.posPage.file?.split('/');
    // this.posPage.url = file![file!.length-1];
  }
  changeTab(e: any) {
    this.tab = e;
  }

  RemoveRelation(id: any) {
    this.removeId = id;
    this.modalService.open("confirm-back-modal1");
    // this.modalService.open("confirm-delete-modal1");
  }

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal1");
    } else {
      this._coreService.Post("hr/candidate/RemoveRelation", this.removeId).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
            this.modalService.close("confirm-back-modal1");
          } else {
            this.notification.addSuccess();
            this.getListSituation();
            this.modalService.close("confirm-back-modal1");
          }
        },
        (error: any) => {
          this.notification.addError();
          this.modalService.close("confirm-back-modal1");
        }
      );
    }
  };
  // lưu data open popup
  saveData = () => {
    // if (!this.editForm.valid) {
    //   this.notification.warning("Form chưa hợp lệ !");
    //   this.editForm.markAllAsTouched();
    //   return;
    // }
    if (!this.editForm.get('currentinfor')?.valid || !this.editForm.get('infor')?.valid
      || !this.editForm.get('homeAddress')?.valid || !this.editForm.get('address')?.valid
      || !this.editForm.get('curAddress')?.valid || !this.editForm.get('contact')?.valid) {
      this.notification.warning('Form sơ yếu lý lịch chưa hợp lệ !');
      // this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }
    let emp = this.listEmployee.getData();
    if (!emp.length) {
      return this.notification.warning("Chọn Hr theo dõi");
    }
    this.model.emps = this.listEmployee.getData().map((i: any) => i.employeeId);
    let param = this.convertModel(this.model);

    if (this.flagState$.value === "new") {
      this._coreService.Post("hr/candidate/add", param).subscribe(
        (res: any) => {
          //check error
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.paramId = res.data.id.toString();
            this.loadData();
            let toolbarList: any[] = [];
            toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT, ToolbarItem.PRINT];
            this.toolItems$.next(toolbarList)
            this.editForm.disable();
            this.chkBackPopUp = 1;

            // this.router.navigate(["/hrms/profile/business/staffprofile"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {

      this._coreService.Post("hr/candidate/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.paramId = res.data.id.toString();
            this.loadData();
            let toolbarList: any[] = [];
            toolbarList = [ToolbarItem.BACK, ToolbarItem.EDIT, ToolbarItem.PRINT];
            this.toolItems$.next(toolbarList)
            this.editForm.disable();
            this.chkBackPopUp = 1;
            // this.router.navigate(["/hrms/profile/business/staffprofile"]);
          }
        },
        (error: any) => {
          this.notification.editError();
        }
      );
    }
  };
  getListSituation() {
    this._coreService
      .Get("hr/candidate/ListFamilyProfile?empId=" + this.model.id)
      .subscribe((res: any) => {
        this.data = res.data;
        this.gridInstance.refresh();
      });
  }
  saveSituation() {
    if (!this.editForm.get('situation')?.valid) {
      this.notification.warning('Form chưa hợp lệ !');
      // this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }
    this.situation.candidateId = this.model.id;

    let model = _.cloneDeep(this.situation);
    model.birth = model.birth ? moment(model.birth).format("YYYY-MM-DD") : null;
    model.dateStart = model.dateStart
      ? moment(model.dateStart).format("YYYY-MM-DD")
      : null;
    model.dateEnd = model.dateEnd
      ? moment(model.dateEnd).format("YYYY-MM-DD")
      : null;

    this._coreService
      .Post("hr/candidate/AddFamily", model)

      .subscribe((res: any) => {
        //check error
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.addSuccess();
          this.editForm.controls["situation"].reset();
          this.getListSituation();
        }
      });
  }
  savePosPage() {
    // this.posPage.empId = this.model.id;
    // let model = _.cloneDeep(this.posPage);

    // model.dateInput = model.dateInput ? moment(model.dateInput).format("YYYY-MM-DD") : null;
    // model.file = this.filePaper;
    // this._coreService
    //   .Post("hr/Employee/CreatePaper", model)
    //   .subscribe((res: any) => {
    //     //check error
    //     if (res.statusCode == 400) {
    //       this.notification.checkErrorMessage(res.message);
    //     } else {
    //       this.notification.addSuccess();
    //       this.editForm.controls["page"].reset();
    //       this.getListPaper();
    //     }
    //   });
  }
  getListPaper() {
    this._coreService
      .Get("hr/Employee/GetListPaper?empId=" + this.model.id)
      .subscribe((res: any) => {
        this.dataPage = res.data;
        this.gridInstance.refresh();
      });
  }
  choiseSigner() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.idHr,
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.idHr = res.employeeId;
      this.model.idHrName = res.employeeName;
      x.unsubscribe();
    });
  }
  choiseSigner1() {
    if (this.flagState$.value == "view") {
      return;
    }
    let param = {
      selected: this.model.employeeIdPre,
    };
    this.modalService.open("cms-app-modalsemp", param);
    const x = this.modalService.employee.subscribe((res: any) => {
      this.model.employeeIdPre = res.employeeId;
      this.model.employeeIdPreName = res.employeeName;
      x.unsubscribe();
    });
  }
  public curentProcess: string = "";
  ViewHistory(param: any) {
    this.flagView = param;
    this.curentProcess = param;
    if (param == "decision") {
      this._coreService
        .Get("hr/working/GetAll?PageNo=1&PageSize=500&orgId=1&IsShow=1&employeeCode=" + this.model.code) //" + this.model.orgId + "
        .subscribe((res: any) => {
          this.dataHistory = res.data
        });
    }
    if (param == "contract") {
      this._coreService
        .Get("hr/contract/GetAll?PageNo=1&PageSize=500&orgId=1&IsShow=1&employeeCode=" + this.model.code)
        .subscribe((res: any) => {
          this.dataHistory = res.data
        });
    }
    if (param == "commend") {
      this._coreService
        .Get("hr/commend/GetAll?PageNo=1&PageSize=500&orgId=1&employeeCode=" + this.model.code)
        .subscribe((res: any) => {
          this.dataHistory = res.data
        });
    }
    if (param == "discipline") {
      this._coreService
        .Get("hr/discipline/GetAll?PageNo=1&PageSize=500&orgId=1&employeeCode=" + this.model.code)
        .subscribe((res: any) => {
          this.dataHistory = res.data
        });
    }
    if (param == "inschange") {
      this._coreService
        .Get("hr/inschange/GetAll?PageNo=1&PageSize=500&orgId=1&employeeCode=" + this.model.code)
        .subscribe((res: any) => {
          this.dataHistory = res.data
        });
    }
    if (param == "workingbefore") {
      this._coreService
        .Get("hr/workingbefore/GetAll?PageNo=1&PageSize=500&orgId=1&employeeCode=" + this.model.code)
        .subscribe((res: any) => {
          this.dataHistory = res.data
        });
    }
    if (param == "trainingbefore") {
      this._coreService
        .Get("hr/trainingbefore/GetAll?PageNo=1&PageSize=500&orgId=1&employeeCode=" + this.model.code)
        .subscribe((res: any) => {
          this.dataHistory = res.data
        });
    }

  }
  convertModel(param: any) {
    let model = _.cloneDeep(param);

    model.birthDate = model.birthDate
      ? moment(model.birthDate).format("YYYY-MM-DD")
      : null;
    model.idDate = model.idDate
      ? moment(model.idDate).format("YYYY-MM-DD")
      : null;
    model.joinDate = model.joinDate
      ? moment(model.joinDate).format("YYYY-MM-DD")
      : null;
    model.terEffectDate = model.terEffectDate
      ? moment(model.terEffectDate).format("YYYY-MM-DD")
      : null;
    model.passDate = model.passDate
      ? moment(model.passDate).format("YYYY-MM-DD")
      : null;
    model.passExpire = model.passExpire
      ? moment(model.passExpire).format("YYYY-MM-DD")
      : null;
    model.visaDate = model.visaDate
      ? moment(model.visaDate).format("YYYY-MM-DD")
      : null;
    model.visaExpire = model.visaExpire
      ? moment(model.visaExpire).format("YYYY-MM-DD")
      : null;
    model.workPermitDate = model.workPermitDate
      ? moment(model.workPermitDate).format("YYYY-MM-DD")
      : null;
    model.workPermitExpire = model.workPermitExpireconfirmBack
      ? moment(model.workPermitExpire).format("YYYY-MM-DD")
      : null;

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
      this.router.navigate(["/hrms/recruitment/business/candidate"]);
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
  changeIdNo() {
    if (this.model.idNo != null) {

      this._coreService
        .Get("hr/candidate/GetByIdNo?id=" + this.model.idNo)
        .subscribe((res: any) => {

          this.modelTemp = res.data
          if (this.modelTemp.workStatusId != null) {
            this.chkExists = this.modelTemp.workStatusId;
          }
          this.modalService.open("confirm-add");
        });

    }
  }
  viewProfile = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-add");
    } else {
      if (this.chkExists == 2) {
        this.model = this.modelTemp;
        this.changeCode();
        this.model.id = undefined;
        this.model.orgId = undefined;
        this.model.orgName = undefined;
        this.model.positionId = undefined;
        this.model.saveIdNo = 1; // nếu là nhân viên cũ quay lại làm cho phép lưu trùng mã cũ, id mới
        this.model.workStatusId = undefined;
        this.model.joinDate = undefined;
        this.model.joinDateState = undefined;
        this.model.contractCode = undefined;
        this.model.classifyName = undefined;
        this.model.contractDateEffect = undefined;
        this.model.contractDateExpire = undefined;
        this.model.contractId = undefined;
      }
      this.modalService.close("confirm-add");

    }
  };

}
