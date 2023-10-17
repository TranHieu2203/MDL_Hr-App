import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";
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
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import {
  ListBoxComponent,
  CheckBoxSelection,
} from "@syncfusion/ej2-angular-dropdowns";
ListBoxComponent.Inject(CheckBoxSelection);

const _ = require("lodash");
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {ExchangeList, ListBgColor, UnitPrice } from "src/app/_models/index";
setCulture("en");

@Component({
  selector: "cms-app-ranksystem",
  templateUrl: "./ranksystem.component.html",
  styleUrls: ["./ranksystem.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class RankSystemComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;

  @ViewChild("overviewgrid", { static: false })
  public gridInstance!: GridComponent;
  // Array
  public lstData:any = [];
  public lstKeys: any[] = [];
  public levelStart!: any;
  public lstRule = [];
  

  // Private
  private _unsubscribeAll: Subject<any>;

  field: any;
  flagState: string = "view";
  model: ExchangeList = new ExchangeList();
  unitPriceModel: UnitPrice = new UnitPrice();
  lvlStartModel = {
    code: null,
    levelStart: null
  }
  editForm!: FormGroup;
  pageIndex: number = 0;

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
    private _tlaTranslationLoaderService: TranslationLoaderService
  ) {
    // Set language
    this.languages = this.globals.currentLang;

    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);

    this.editForm = this._formBuilder.group({
      name: [""],
      mark: [""],
      from: [""],
      to: [""],
      typeId: [""],
    });
  
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
    // Load List Data
    this.GetListData();
  }

  GetListData = ()=>{
    this._coreService
        .Get("hr/classifyPostition/RankMatrix")
        .subscribe((res: any) => {
          this.lstData = res.data;
          this.lstKeys = Object.keys(this.lstData[0]);
          this.lstKeys.splice(0,3);
          let lstColor = ListBgColor
          this.lstData.forEach((item: any) => {
            let a = Object.keys(item).map( key => ({type: key, value: item[key]}))
            item.lstRank = a.splice(3, a.length);
            for (let j = 0; j < item.lstRank.length; j++) {
              if(item.lstRank[j].value != null)
              {
                item.lstRank[j].bgColor = lstColor[j].bgColor;
                item.lstRank[j].color = lstColor[j].color;
              }
              
            }
          });
        });
  }
  ClickAdd = (status: any,index: any) =>{
    if(status == "HE_SO")
    {
      
      this._coreService.Get("hr/ExchangeList/GetListRule").subscribe((res:any)=>{
        this.lstRule = res.data;
        this.modalService.open("modal-coefficient");
        this.editForm.disable();
        this.flagState = "view";
    })
     
    }
    else if(status == "LUONG")
    {
      this.modalService.open("modal-basicSalary")
    }
    else{
      this.lvlStartModel.code = status;
      this.modalService.open("modal-levelstart")
    }
  }
  close(){
    this.modalService.close("modal-coefficient");
    this.editForm.reset();
  }
  Add (){
    this.flagState = "new";
    this.editForm.enable();
  }
  Edit(){
    this.flagState = "edit";
    this.editForm.enable();
  }
  SelectRecord = (event: any)=> {
    this.model = event.data;
  }
  Confirm = (status:any, type:any) =>{
    if(type == "HE_SO")
    {
      if(status == "cancel")
      {
        this.modalService.close("modal-coefficient");
        this.flagState = "view";
      }
      else{
        if (this.flagState === "new") {
          this._coreService.Post("hr/ExchangeList/Add", this.model).subscribe(
            (res: any) => {
              if (res.statusCode == 200) {
                this.notification.addSuccess();
                setTimeout(()=>{
                  //window.location.reload();
                  this.GetListData();
                },200)

              } else {
                this.notification.addError();
              }
            },
            (error: any) => {
              this.notification.addError();
            }
          );
        } else {
          this._coreService.Post("hr/ExchangeList/update", this.model).subscribe(
            (res: any) => {
              if (res.statusCode == 200) {
                this.notification.editSuccess();
                setTimeout(()=>{
                 // window.location.reload();
                 this.GetListData();
                },200)
              } else {
                this.notification.addError();
              }
            },
            (error: any) => {
              this.notification.editSuccess();
            }
          );
        }
      
        
      }
    }
    else if(type == "LUONG")
    {
      if(status == "cancel")
      {
        this.modalService.close("modal-basicSalary")
      }
      else{
        this._coreService.Post("hr/UnitPrice/Update",this.unitPriceModel).subscribe((res: any)=>{
          if(res.statusCode == "200")
          {
            this.modalService.close("modal-basicSalary")
            this.notification.editSuccess();
            setTimeout(()=>{
              //window.location.reload();
              this.GetListData();
            },300)
          }
          else
          {
            this.notification.editError();
          }
        });
        
      }
    }
    else{
      if(status == "cancel")
      {
        this.modalService.close("modal-levelstart")
      }
      else{
        this._coreService.Post("hr/SalaryRank/UpdateLevelStart",this.lvlStartModel).subscribe((res: any)=>{
          if(res.statusCode == "200")
          {
            this.modalService.close("modal-levelstart")
            this.notification.editSuccess();
            setTimeout(()=>{
              //window.location.reload();
              this.GetListData();
            },300)
          }
          else
          {
            this.notification.editError();
          }
        });
        
      }
    }
  }
   // Số thứ tự
   formatStt = (index: string) => {
    return (
      this.pageIndex * this.gridInstance.pageSettings.pageSize! +
      parseInt(index, 0) +
      1
    );
  };
}
