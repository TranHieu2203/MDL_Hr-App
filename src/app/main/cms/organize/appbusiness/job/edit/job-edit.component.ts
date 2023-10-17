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
  SaveEventArgs,
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
import { ToolbarItem, ToolbarInterface } from "src/app/_models/index";

import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
const async = require("async");
const $ = require("jquery");
import { Job } from "src/app/_models/app/cms/profile/applist/jobBand";

//grid
import { IEditCell } from "@syncfusion/ej2-angular-grids";
import { DropDownList } from "@syncfusion/ej2-dropdowns";
import { EditSettingsModel,TreeGridComponent,ToolbarItems } from "@syncfusion/ej2-angular-treegrid";

setCulture("en");

@Component({
  selector: "app-job-edit",
  templateUrl: "./job-edit.component.html",
  styleUrls: ["./job-edit.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class JobEditComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([

  ])
  public jobFuntion!: Object[];
  public editSettings!: EditSettingsModel;
  public toolbarOptions!: ToolbarItems[];
  //public tasks: Observable<DataStateChangeEventArgs>;

  public priorityData: { [key: string]: Object }[] = [
    { functionName: 1, functionID: 11 },
    { functionName: 2, functionID: 22 },
  ];
  public priorityParams!: IEditCell;
  public priorityElem!: HTMLElement;
  public priorityObj!: DropDownList;
  public durationObj!: DropDownList;

  public gridTree!: TreeGridComponent;
  //grid

  // Varriable Language
  flagState$ = new BehaviorSubject<string>('');
  // flag show popup toolbar Back
  flagePopup = true;
  paramId = "";

  model: Job = new Job();
  modelTemp: Job = new Job();
  languages: any;
  selectedLanguage: any;
  mode: any;
  editForm!: FormGroup;
  public query = new Query();

  // Toolbar Item
  public toolbar!: ToolbarInterface[];

  // Private
  private _unsubscribeAll: Subject<any>;
  lstSalaryScaleId: any;
  lstTypeId: any;

  public fields: FieldSettingsModel = { value: "id", text: "name" };

  public gridData = [];
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
    //this.tasks = TaskService;
    //grid
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
      nameVN: ["", [Validators.required, Validators.maxLength(100)]],
      nameEN: ["", [Validators.required, Validators.maxLength(100)]],
      levelFrom: [""],
      code: [
        "",
        [
          Validators.required,
          Validators.maxLength(31),
          this.globals.checkExistSpace,
        ],
      ],
      typeId: ["", [Validators.required]],
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
    const state: any = { skip: 0, take: 10 };
    //this.TaskService.execute(state);

    //grid
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
      } else {
        toolbarList = [ToolbarItem.BACK, ToolbarItem.SAVE];
      }
      this.toolItems$.next(toolbarList)
    })
    this.jobFuntion=[]
    async.waterfall(
      [
        (cb: any) => {
          if (this.paramId) {
            this._coreService.Get("hr/job/" + this.paramId).subscribe((res: any) => {
              this.modelTemp = res.data;
               //this.jobFuntion = res.data.child;
              //
              const table = res.data.child;
          
              const ids = table.map((x: any) => x.id);
              const result = table
                .map((parent: any) => {
                  const children = table.filter((child: any) => {
                    if (
                      child.id !== child.parentID &&
                      child.parentID === parent.id
                    ) {
                      return true;
                    }

                    return false;
                  });

                  if (children.length) {
                    parent.children = children;
                  }

                  return parent;
                })
                .filter((obj: any) => {
                  if (obj.id === obj.parentID || !ids.includes(obj.parentID)) {
                    return true;
                  }

                  return false;
                });

              this.jobFuntion = result;
            
              cb();
            });
          } else {
            cb();
          }
        },
        (cb: any) => {
          this._coreService.Get("hr/otherlist/GetAreas").subscribe((res: any) => {
      
            this.lstTypeId = res.data;
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
    this.priorityParams = {
      create: () => {
        this.priorityElem = document.createElement("input");
        return this.priorityElem;
      },
      read: () => {
        return this.priorityObj.text;
      },
      destroy: () => {
        this.priorityObj.destroy();
      },
      write: () => {
        this.priorityObj = new DropDownList({
          dataSource: new DataManager(this.priorityData),
          fields: { value: "functionID", text: "functionName" },
          placeholder: "Chọn thước đo",
          floatLabelType: "Never",
        });
        this.priorityObj.appendTo(this.priorityElem);
      },
    };
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Child', mode: 'Cell' };
    this.toolbarOptions = ["Add", "Edit", "Delete", "Update", "Cancel"];
  }

  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.BACK:
        if (this.editForm.dirty && this.editForm.touched) {
          this.flagePopup = false;
        }
        this.router.navigate(["hrms/organize/business/job"]);
        break;
      case ToolbarItem.EDIT:
        this.flagState$.next("edit")
        break;
      case ToolbarItem.SAVE:
        this.saveData();
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

    param.jobFunctionDTOs = this.gridData;
   
    this._coreService.Post("hr/job/update", param).subscribe(
      (res: any) => {
        //check error
        // 
        if (res.statusCode == 400) {
          this.notification.checkErrorMessage(res.message);
        } else {
          this.notification.editSuccess();
          this.router.navigate(["/hrms/organize/business/job"]);
        }
      },
      (error: any) => {
        this.notification.editError();
      }
    );
  };
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    return model;
  }

  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }

  // public dataStateChange(state: DataStateChangeEventArgs): void {

  //   this.TaskService.execute(state);
  // }

  contextMenuClick(args: any): void {
    const TaskName = args.args;
  }
  actionComplete(args: any) {
    if (args.requestType === "save") {
      const TaskName = args.rowData;
    }
    // if (args.requestType === "beginEdit" || args.requestType === "add") {
    // const dialog = args.dialog as Dialog;
    // const TaskName = 'TaskName';
    // dialog.height = 400;
    // // change the header of the dialog
    // dialog.header = args.requestType === 'beginEdit' ? 'Record of ' + args.rowData[TaskName] : 'New Customer';
    // }
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === "save") {
      // var gridDataitem = new JobFunction();

      //?????
      // gridDataitem.id = args.data.id;
      // gridDataitem.name = args.data.name;
      // gridDataitem.nameEN = args.data.nameEN;
      // gridDataitem.parentID = args.data.parentID;
      // gridDataitem.functionID = args.data.functionID;

      // this.gridData.push(gridDataitem);

      //       var persons = []; // initialize the array

      // persons.push({firstName:"John", lastName:"Doe", age:46}); // Add an object

      // persons.push({firstName:"Joanne", lastName:"Doe", age:43});
    }
  }
  
}
