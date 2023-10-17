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
import { TalentSetting } from "src/app/_models/app/cms/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
import * as moment from "moment";
import { stringify } from "querystring";
const async = require("async");
const $ = require("jquery");
setCulture("en");

@Component({
  selector: "app-talentsetting-edit",
  templateUrl: "./talentsetting-edit.component.html",
  styleUrls: ["./talentsetting-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class TalentSettingEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([
    
  ])
  // Varriable Language
  // flagState = "";
  // flag show popup toolbar Back
  flagState$ = new BehaviorSubject<string>('');
  flagePopup = true;
  paramId = "";

  model: TalentSetting = new TalentSetting();
  modelTemp: TalentSetting = new TalentSetting();
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  public query = new Query();
  public fields: FieldSettingsModel = { value: "id", text: "name" };
  public showAdd:boolean=false;

  public counter:number=0;
  public counter1:number=0; // name
  public counter2:number=0; // positionId
  public counter3:number=0; // exepFrom
  public counter4:number=0; // exepTo
  public counter5:number=0;// positionList
  public counter6:number=0;// ageFrom
  public counter7:number=0;// ageTo
  public counter8:number=0;// gender
  public counter9:number=0;// seniorFrom
  public counter10:number=0;//  seniorTo
  public counter11:number=0;// learningLevelDk
  public counter12:number=0;// certificate
  public counter13:number=0;// trainingId
  public counter14:number=0;// year
  public counter15:number=0;// compentenceId1
  public counter16:number=0;// compentenceId2
  public counter17:number=0;// compentenceId3
  public counter18:number=0;// compentenceId4
  public counter19:number=0;// compentenceId5
  public counter20:number=0;// yearCommend
  public counter21:number=0;// isCommend
  public counter22:number=0;// isDiscipline

  public counternow1:number=0;
  public counternow2:number=0;
  public counternow3:number=0;
  public counternow4:number=0;
  public counternow5:number=0;
  public counternow6:number=0;
  public counternow7:number=0;
  public counternow8:number=0;
  public counternow9:number=0;
  public counternow10:number=0;
  public counternow11:number=0;
  public counternow12:number=0;
  public counternow13:number=0;
  public counternow14:number=0;
  public counternow15:number=0;
  public counternow16:number=0;
  public counternow17:number=0;
  public counternow18:number=0;
  public counternow19:number=0;
  public counternow20:number=0;
  public counternow21:number=0;
  public counternow22:number=0;
  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  // lstContractTypes: any;
  lstObjectTalent: any[] = [
    { id: 1, name: 'Tên tiêu chí tìm kiếm nhân tài' },
    { id: 2, name: 'Kinh nghiệm vị trí' },
    { id: 3, name: 'Số năm kinh nghiệm từ' },
    { id: 4, name: 'Số năm kinh nghiệm đến' },
    { id: 5, name: 'Đã từng công tác tại vị trí' },
    { id: 6, name: 'Tuổi từ' },
    { id: 7, name: 'Tuổi đến' },
    { id: 8, name: 'Giới tính' },
    { id: 9, name: 'Thâm niên từ (năm)' },
    { id: 10, name: 'Thâm niên tới(năm)' },
    { id: 11, name: 'Trình độ học vấn' },
    { id: 12, name: 'Bằng cấp, chứng chỉ' },
    { id: 13, name: 'Khóa đào tạo' },
    { id: 14, name: 'Kết quả đánh giá hiệu quả' },
    { id: 15, name: 'Đánh giá năng lực 1' },
    { id: 16, name: 'Đánh giá năng lực 2' },
    { id: 17, name: 'Đánh giá năng lực 3' },
    { id: 18, name: 'Đánh giá năng lực 4' },
    { id: 19, name: 'Đánh giá năng lực 5' },
    { id: 20, name: 'Năm khen thưởng' },
    { id: 21, name: 'Checkbox Có khen thưởng' },
    { id: 22, name: 'Checkbox Không kỷ luật' }
  ]
  lstPositionId:  any = [];
  lstPositionList:  any = [];
  lstGender:  any = [];
  lstLearningLevelDk: any[] = [
    { id: 1, name: '>' },
    { id: 2, name: '>=' },
    { id: 3, name: '<' },
    { id: 4, name: '<=' },
    { id: 5, name: '=' }
  ];
  lstLearningLevelId:  any = [];
  lstCertificate:  any = [];
  lstTrainingId:  any[] = [
    { id: 1, name: 'TOIC' },
    { id: 2, name: 'Photoshop' },
    { id: 3, name: 'PPMP' },
    { id: 4, name: 'MBI' }
  ];
  lstYear:  any[] = [
    { id: 1, name: '2020' },
    { id: 2, name: '2021' },
    { id: 3, name: '2022' },
    { id: 4, name: '2023' }
  ];
  lstPeriodId: any[] = [
    { id: 1, name: 'Kỳ đánh giá cuối tháng đầu năm' },
    { id: 2, name: 'Kỳ đánh giá cuối tháng cuối năm' }
  ];
  lstResultId:  any[] = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 3, name: 'C' },
    { id: 4, name: 'D' },
    { id: 5, name: 'E' }
  ];
  lstCompentenceId1:  any[] = [
    { id: 1, name: 'Năng lực cốt lõi' },
    { id: 2, name: 'Năng lực chuyên môn' },
    { id: 3, name: 'Năng lực thực thi vai trò' },
    { id: 4, name: 'Kỹ năng mềm' },
    { id: 5, name: 'Năng lực quản lý' }
  ];
  lstCompentenceDk1:  any[] = [
    { id: 1, name: '>' },
    { id: 2, name: '>=' },
    { id: 3, name: '<' },
    { id: 4, name: '<=' },
    { id: 5, name: '=' }
  ];
  lstCompentenceResult1:  any = [];
  lstCompentenceId2:  any[] = [
    { id: 1, name: 'Năng lực cốt lõi' },
    { id: 2, name: 'Năng lực chuyên môn' },
    { id: 3, name: 'Năng lực thực thi vai trò' },
    { id: 4, name: 'Kỹ năng mềm' },
    { id: 5, name: 'Năng lực quản lý' }
  ];
  lstCompentenceDk2:  any[] = [
    { id: 1, name: '>' },
    { id: 2, name: '>=' },
    { id: 3, name: '<' },
    { id: 4, name: '<=' },
    { id: 5, name: '=' }
  ];
  lstCompentenceResult2:  any = [];
  lstCompentenceId3:  any[] = [
    { id: 1, name: 'Năng lực cốt lõi' },
    { id: 2, name: 'Năng lực chuyên môn' },
    { id: 3, name: 'Năng lực thực thi vai trò' },
    { id: 4, name: 'Kỹ năng mềm' },
    { id: 5, name: 'Năng lực quản lý' }
  ];
  lstCompentenceDk3:  any[] = [
    { id: 1, name: '>' },
    { id: 2, name: '>=' },
    { id: 3, name: '<' },
    { id: 4, name: '<=' },
    { id: 5, name: '=' }
  ];
  lstCompentenceResult3:  any = [];
  lstCompentenceId4:  any[] = [
    { id: 1, name: 'Năng lực cốt lõi' },
    { id: 2, name: 'Năng lực chuyên môn' },
    { id: 3, name: 'Năng lực thực thi vai trò' },
    { id: 4, name: 'Kỹ năng mềm' },
    { id: 5, name: 'Năng lực quản lý' }
  ];
  lstCompentenceDk4:  any[] = [
    { id: 1, name: '>' },
    { id: 2, name: '>=' },
    { id: 3, name: '<' },
    { id: 4, name: '<=' },
    { id: 5, name: '=' }
  ];
  lstCompentenceResult4:  any = [];
  lstCompentenceId5:  any[] = [
    { id: 1, name: 'Năng lực cốt lõi' },
    { id: 2, name: 'Năng lực chuyên môn' },
    { id: 3, name: 'Năng lực thực thi vai trò' },
    { id: 4, name: 'Kỹ năng mềm' },
    { id: 5, name: 'Năng lực quản lý' }
  ];
  lstCompentenceDk5:  any[] = [
    { id: 1, name: '>' },
    { id: 2, name: '>=' },
    { id: 3, name: '<' },
    { id: 4, name: '<=' },
    { id: 5, name: '=' }
  ];
  lstCompentenceResult5:  any = [];
  lstYearCommend:  any[] = [
    { id: 1, name: '2020' },
    { id: 2, name: '2021' },
    { id: 3, name: '2022' },
    { id: 4, name: '2023' }
  ];


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

    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    this.editForm = this._formBuilder.group({
      objectTalent: [""],
      name: ["", [Validators.required, Validators.maxLength(51)]],
      positionId: [""],
      positionName: [""],
      exepFrom: [""],
      exepTo: [""],
      positionList: [""],
      ageFrom: [""],
      ageTo: [""],
      gender: [""],
      seniorFrom: [""],
      seniorTo: [""],
      learningLevelDk: [""],
      learningLevelId: [""],
      learningLevelNam: [""],
      certificate: [""],
      trainingId: [""],
      trainingNam: [""],
      year: [""],
      periodId: [""],
      periodNam: [""],
      resultId: [""],
      compentenceId1: [""],
      compentenceDk1: [""],
      compentenceResult1: [""],
      compentenceId2: [""],
      compentenceDk2: [""],
      compentenceResult2: [""],
      compentenceId3: [""],
      compentenceDk3: [""],
      compentenceResult3: [""],
      compentenceId4: [""],
      compentenceDk4: [""],
      compentenceResult4: [""],
      compentenceId5: [""],
      compentenceDk5: [""],
      compentenceResult5: [""],
      isCommend: [""],
      yearCommend: [""],
      isDiscipline: [""],
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

    // Build toolbar
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
    async.waterfall(
      [
        (cb: any) => {
          if (this.paramId) {
            this._coreService
              .Get("hr/talentsetting/get?id=" + this.paramId)
              .subscribe((res: any) => {
                
                this.modelTemp = res.data;
                if (!this.modelTemp.objectTalent) {
                  this.modelTemp.objectTalent = []; 
                }
                if(res.data.name != null && res.data.name != undefined){
                  this.counternow1 = 1;
                  this.modelTemp.objectTalent.push(1);
                  
                }
                if(res.data.positionId != null && res.data.positionId != undefined){
                  this.counternow2 = 1;
                  this.modelTemp.objectTalent.push(2);
                }
                if(res.data.exepFrom != null && res.data.exepFrom != undefined){
                  this.counternow3 = 1;
                  this.modelTemp.objectTalent.push(3);
                }
                if(res.data.exepTo != null && res.data.exepTo != undefined){
                  this.counternow4 = 1;
                  this.modelTemp.objectTalent.push(4);
                }
                if(res.data.positionList != null && res.data.positionList != undefined){
                  this.counternow5 = 1;
                  this.modelTemp.objectTalent.push(5);
                }
                if(res.data.ageFrom != null && res.data.ageFrom != undefined){
                  this.counternow6 = 1;
                  this.modelTemp.objectTalent.push(6);
                }
                if(res.data.ageTo != null && res.data.ageTo != undefined){
                  this.counternow7 = 1;
                  this.modelTemp.objectTalent.push(7);
                }
                if(res.data.gender != null && res.data.gender != undefined){
                  this.counternow8 = 1;
                  this.modelTemp.objectTalent.push(8);
                }
                if(res.data.seniorFrom != null && res.data.seniorFrom != undefined){
                  this.counternow9 = 1;
                  this.modelTemp.objectTalent.push(9);
                }
                if(res.data.seniorTo != null && res.data.seniorTo != undefined){
                  this.counternow10 = 1;
                  this.modelTemp.objectTalent.push(10);
                }
                if(res.data.learningLevelDk != null && res.data.learningLevelDk != undefined){
                  this.counternow11 = 1;
                  this.modelTemp.objectTalent.push(11);
                }
                if(res.data.certificate != null && res.data.certificate != undefined){
                  this.counternow12 = 1;
                  this.modelTemp.objectTalent.push(12);
                }
                if(res.data.trainingId != null && res.data.trainingId != undefined){
                  this.counternow13 = 1;
                  this.modelTemp.objectTalent.push(13);
                }
                if(res.data.year != null && res.data.year != undefined){
                  this.counternow14 = 1;
                  this.modelTemp.objectTalent.push(14);
                }
                if(res.data.compentenceId1 != null && res.data.compentenceId1 != undefined){
                  this.counternow15 = 1;
                  this.modelTemp.objectTalent.push(15);
                }
                if(res.data.compentenceId2 != null && res.data.compentenceId2 != undefined){
                  this.counternow16 = 1;
                  this.modelTemp.objectTalent.push(16);
                }
                if(res.data.compentenceId3 != null && res.data.compentenceId3 != undefined){
                  this.counternow17 = 1;
                  this.modelTemp.objectTalent.push(17);
                }
                if(res.data.compentenceId4 != null && res.data.compentenceId4 != undefined){
                  this.counternow18 = 1;
                  this.modelTemp.objectTalent.push(18);
                }
                if(res.data.compentenceId5 != null && res.data.compentenceId5 != undefined){
                  this.counternow19 = 1;
                  this.modelTemp.objectTalent.push(19);
                }
                if(res.data.yearCommend != null && res.data.yearCommend != undefined){
                  this.counternow20 = 1;
                  this.modelTemp.objectTalent.push(20);
                }
                if(res.data.isCommend != null && res.data.isCommend != undefined){
                  this.counternow21 = 1;
                  this.modelTemp.objectTalent.push(21);
                }
                if(res.data.isDiscipline != null && res.data.isDiscipline != undefined){
                  this.counternow22 = 1;
                  this.modelTemp.objectTalent.push(22);
                }
              
                this.modelTemp.gender = JSON.parse(res.data.gender)
                this.modelTemp.certificate = JSON.parse(res.data.certificate)
                this.modelTemp.positionList = JSON.parse(res.data.positionList)
                if(res.data.learningLevelDk != undefined){
                  this.modelTemp.learningLevelDk = JSON.parse(this.lstLearningLevelDk.find(item=>item.name === res.data.learningLevelDk).id)
                }
                
                
                this.modelTemp.trainingId = JSON.parse(res.data.trainingId)
                this.modelTemp.resultId = JSON.parse(res.data.resultId)
                if(res.data.compentenceDk1 != undefined){
                  this.modelTemp.compentenceDk1 = JSON.parse(this.lstCompentenceDk1.find(item=>item.name === res.data.compentenceDk1).id)
                }
                if(res.data.compentenceDk2 != undefined){
                  this.modelTemp.compentenceDk2 = JSON.parse(this.lstCompentenceDk2.find(item=>item.name === res.data.compentenceDk2).id)
                }
                if(res.data.compentenceDk3 != undefined){
                  this.modelTemp.compentenceDk3 = JSON.parse(this.lstCompentenceDk3.find(item=>item.name === res.data.compentenceDk3).id)
                }
                if(res.data.compentenceDk4 != undefined){
                  this.modelTemp.compentenceDk4 = JSON.parse(this.lstCompentenceDk4.find(item=>item.name === res.data.compentenceDk4).id)
                }
                if(res.data.compentenceDk5 != undefined){
                  this.modelTemp.compentenceDk5 = JSON.parse(this.lstCompentenceDk5.find(item=>item.name === res.data.compentenceDk5).id)
                }
                
                // this.modelTemp.ExepFrom = JSON.parse(res.data.exepFrom)
                cb();
              });
          } else {
            cb();
          }
        },
        // (cb: any) => {
        //   this._coreService.Get("hr/contracttype/GetList").subscribe((res: any) => {
        //     this.lstContractTypes = res.data;
        //     cb();
        //   });
        // },
        (cb: any) => {
          this._coreService.Get("hr/position/GetListJob").subscribe((res: any) => {
            this.lstPositionId = res.data;
            cb();
          });
        },
        (cb: any) => {
          this._coreService.Get("hr/position/GetListJob").subscribe((res: any) => {
            this.lstPositionList = res.data;
            cb();
          });
        },
        (cb: any) => {
          this._coreService.Get("hr/otherlist/GENDER").subscribe((res: any) => {
            this.lstGender = res.data;
            cb();
          });
        },
        (cb: any) => {
          this._coreService.Get("hr/otherlist/CERTIFICATE_TYPE").subscribe((res: any) => {
            this.lstCertificate = res.data;
            cb();
          });
        },
        (cb: any) => {
          this._coreService.Get("hr/otherlist/GetListLearningLevel").subscribe((res: any) => {
            this.lstLearningLevelId = res.data;
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

  // Build Toolbar
  

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
          this.router.navigate(["hrms/profile/business/talentsetting"]);
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
        // this.editForm.get("code")!.disable();
        
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

    let param = this.convertModel(this.model);
    // if (moment(param.dateStart).isSameOrAfter(param.dateEnd)) {
    //   this.notification.warning("Ngày hết hiệu lực phải lớn hơn ngày hiệu lực");
    //   return;
    // }
    
    if (this.flagState$.value === "new") {
      param.gender = JSON.stringify(param.gender);
      param.certificate = JSON.stringify(param.certificate);
      param.positionList = JSON.stringify(param.positionList);
      param.objectTalent = JSON.stringify(param.objectTalent);
      if(JSON.stringify(param.learningLevelDk)!=undefined){
        const name1  = JSON.stringify(this.lstLearningLevelDk.find(item=> item.id === param.learningLevelDk).name);
        param.learningLevelDk = name1;
   
      }
      
      param.trainingId = JSON.stringify(param.trainingId);
      param.resultId = JSON.stringify(param.resultId);
      if(JSON.stringify(param.compentenceDk1 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk1.find(item=> item.id === param.compentenceDk1).name);
        param.compentenceDk1 = name1
      }
      if(JSON.stringify(param.compentenceDk2 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk2.find(item=> item.id === param.compentenceDk2).name);
        param.compentenceDk2 = name1
      }
      if(JSON.stringify(param.compentenceDk3 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk3.find(item=> item.id === param.compentenceDk3).name);
        param.compentenceDk3 = name1
      }
      if(JSON.stringify(param.compentenceDk4 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk4.find(item=> item.id === param.compentenceDk4).name);
        param.compentenceDk4 = name1
      }
      if(JSON.stringify(param.compentenceDk5 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk5.find(item=> item.id === param.compentenceDk5).name);
        param.compentenceDk5 = name1
      }

      this._coreService.Post("hr/talentsetting/add", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            this.router.navigate(["/hrms/profile/business/talentsetting"]);
          }
        },
        (error: any) => {
          this.notification.addError();
        }
      );
    } else {
      param.gender = JSON.stringify(param.gender);
      param.certificate = JSON.stringify(param.certificate);
      param.positionList = JSON.stringify(param.positionList);
      param.objectTalent = JSON.stringify(param.objectTalent);
      if(JSON.stringify(param.learningLevelDk)!=undefined){
        const name1  = JSON.stringify(this.lstLearningLevelDk.find(item=> item.id === param.learningLevelDk).name);
        param.learningLevelDk = name1;
 
      }
      param.trainingId = JSON.stringify(param.trainingId);
      param.resultId = JSON.stringify(param.resultId);
      if(JSON.stringify(param.compentenceDk1 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk1.find(item=> item.id === param.compentenceDk1).name);
        param.compentenceDk1 = name1
      }
      if(JSON.stringify(param.compentenceDk2 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk2.find(item=> item.id === param.compentenceDk2).name);
        param.compentenceDk2 = name1
      }
      if(JSON.stringify(param.compentenceDk3 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk3.find(item=> item.id === param.compentenceDk3).name);
        param.compentenceDk3 = name1
      }
      if(JSON.stringify(param.compentenceDk4 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk4.find(item=> item.id === param.compentenceDk4).name);
        param.compentenceDk4 = name1
      }
      if(JSON.stringify(param.compentenceDk5 )!=undefined){
        const name1  = JSON.stringify(this.lstCompentenceDk5.find(item=> item.id === param.compentenceDk5).name);
        param.compentenceDk5 = name1
      }
      this._coreService.Post("hr/talentsetting/Update", param).subscribe(
        (res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.router.navigate(["/hrms/profile/business/talentsetting"]);
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
    // model.dateStart = moment(model.dateStart).format("YYYY-MM-DD").toString();
    // model.dateEnd = moment(model.dateEnd).format("YYYY-MM-DD").toString();
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
  changeDateNoRequire = (model: any) => {
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
      if(value)
      {
        let FindSpace = value.indexOf(" ");
         if (FindSpace != -1) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      } else 
      if (value.length > 0 && (patt.test(value.toLowerCase()) === true || patt1.test(value.toLowerCase()) === true)) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      } else if (value.length > 10) {
        this.editForm.get(model)!.setErrors({ incorrect: true });
        return;
      } else {
        this.editForm.get(model)!.setErrors(null);
      }
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
          this.router.navigate(["/hrms/profile/business/talentsetting"]);
        });
    }
  };
  confirmBack = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-back-modal");
    } else {
      this.modalService.close("confirm-back-modal");
      this.router.navigate(["/hrms/profile/business/talentsetting"]);
    }
  };
  // filter type
  // change date
  changelstObjectTalent(){
    let a = this.model.objectTalent;

    if(a!= undefined){
      for (let i = 0; i < a?.length; i++) {
        if(a[i]==1){
          this.counter1 = 1;
        }
        if(a[i]==2){
          this.counter2 = 1;
        }
        if(a[i]==3){
          this.counter3 = 1;
        }
        if(a[i]==4){
          this.counter4 = 1;
        }
        if(a[i]==5){
          this.counter5 = 1;
        }
        if(a[i]==6){
          this.counter6 = 1;
        }
        if(a[i]==7){
          this.counter7 = 1;
        }
        if(a[i]==8){
          this.counter8 = 1;
        }
        if(a[i]==9){
          this.counter9 = 1;
        }
        if(a[i]==10){
          this.counter10 = 1;
        }
        if(a[i]==11){
          this.counter11 = 1;
        }
        if(a[i]==12){
          this.counter12 = 1;
        }
        if(a[i]==13){
          this.counter13 = 1;
        }
        if(a[i]==14){
          this.counter14 = 1;
        }
        if(a[i]==15){
          this.counter15 = 1;
        }
        if(a[i]==16){
          this.counter16 = 1;
        }
        if(a[i]==17){
          this.counter17 = 1;
        }
        if(a[i]==18){
          this.counter18 = 1;
        }
        if(a[i]==19){
          this.counter19 = 1;
        }
        if(a[i]==20){
          this.counter20 = 1;
        }
        if(a[i]==21){
          this.counter21 = 1;
        }
        if(a[i]==22){
          this.counter22 = 1;
        }
      }
      //
      this.Loaddatafrom();
    }
    
  }
  Loaddatafrom(){
    this.counternow1 = this.counter1;
    this.counternow2 = this.counter2;
    this.counternow3 = this.counter3;
    this.counternow4 = this.counter4;
    this.counternow5 = this.counter5;
    this.counternow6 = this.counter6;
    this.counternow7 = this.counter7;
    
    this.counternow8 = this.counter8;
    this.counternow9 = this.counter9;
    this.counternow10 = this.counter10;
    this.counternow11 = this.counter11;
    this.counternow12 = this.counter12;
    this.counternow13 = this.counter13;
    this.counternow14 = this.counter14;
    this.counternow15 = this.counter15;
    this.counternow16 = this.counter16;
    this.counternow17 = this.counter17;
    this.counternow18 = this.counter18;
    this.counternow19 = this.counter19;
    this.counternow20 = this.counter20;
    this.counternow21 = this.counter21;
    this.counternow22 = this.counter12;

    this.counter1 =0;
    this.counter2 =0;
    this.counter3 =0;
    this.counter4 =0;
    this.counter5 =0;
    this.counter6 =0;
    this.counter7 =0;
    this.counter8 =0;
    this.counter9 =0;
    this.counter10 =0;
    this.counter11 =0;
    this.counter12 =0;
    this.counter13 =0;
    this.counter14 =0;
    this.counter15 =0;
    this.counter16 =0;
    this.counter17 =0;
    this.counter18 =0;
    this.counter19 =0;
    this.counter20 =0;
    this.counter21 =0;
    this.counter22 =0;
  }

  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
