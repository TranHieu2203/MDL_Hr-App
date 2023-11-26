import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
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
  VirtualScrollService,
} from "@syncfusion/ej2-angular-grids";
import {
  ToolbarItem,
  ToolbarInterface,
  Organization,
} from "src/app/_models/index";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
import { ModalService } from "src/app/_services/modal.service";
import { Query, Predicate, DataManager } from "@syncfusion/ej2-data";

const _ = require("lodash");
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
const $ = require("jquery");
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";
import { FieldSettingsModel } from "@syncfusion/ej2-dropdowns";
setCulture("en");

@Component({
  selector: "cms-app-organization",
  templateUrl: "./organization.component.html",
  styleUrls: ["./organization.component.scss"],
  providers: [FilterService, VirtualScrollService],
  encapsulation: ViewEncapsulation.None,
})
export class OrganizationComponent implements OnInit {
  toolItems$ = new BehaviorSubject<any[]>([ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.DELETE, ToolbarItem.LOCK, ToolbarItem.SYNC])


  // Varriable Language
  languages: any;
  selectedLanguage: any;
  @ViewChild("treeView", { static: false })
  public listTreeObj!: TreeViewComponent;
  public localData: any[] = [];
  // Toolbar Item
  public toolbar!: ToolbarInterface[];
  // query auto complete
  public query = new Query();
  // list filter
  public allowDragAndDrops: boolean = true;
  // Private
  private _unsubscribeAll: Subject<any>;

  model: Organization = new Organization();
  modelTemp: Organization = new Organization();
  editForm!: FormGroup;
  paramId!: string;
  nodeSelected: any;
  field: any;
  lstParentId: any;
  flagState!: string;
  flagState$ = new BehaviorSubject<string>('');
  public fields: FieldSettingsModel = { value: "id", text: "name" };

  lstOrgType: any;
  lsttypeId: any;


  private lockNode: any;

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
    this._translateService.use(this.languages);
    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.editForm = this._formBuilder.group({
      name: ["", [Validators.required, Validators.maxLength(51), this.globals.noWhitespaceValidator]],
      code: ["",
        [
          Validators.required,
          Validators.maxLength(31),
          // this.globals.checkExistSpace,
        ],
      ],
      //parentId: [""],
      mngName: [""],
      mngExtendName: [""],
      foundationDate: [""], // Ngày thành lập
      dissolveDate: [""],
      phone: ["", [this.globals.checkPhone]],
      fax: ["", [this.globals.checkExistSpace, Validators.maxLength(51)]],
      address: [""],
      businessNumber: ["", [this.globals.checkExistSpace]],
      businessDate: [],
      taxCode: ["", this.globals.checkExistSpace],
      note: [],
      parentName: [],
      posName: [],
      titleName: [],
      positionExtendName: [],
      titleExtendName: [],
      avatar: [],
      ordNo: [[], [Validators.required]],
      levelOrg: [[], []],
      orgType: [[], [Validators.required]],
      typeId: [[]],
      phapNhanId: [[]],
      isPhapNhan: [[]]
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

    this.flagState$.subscribe(x => {

      let toolbarList: any[] = [];
      if (!x) {
        toolbarList = [ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.DELETE, ToolbarItem.LOCK, ToolbarItem.SYNC];
        this.editForm.disable();
      }
      if (x === "new") {
        toolbarList = [ToolbarItem.CANCEL, ToolbarItem.SAVE];

      }
      if (x === "edit") {
        toolbarList = [ToolbarItem.CANCEL, ToolbarItem.SAVE];
      }

      this.toolItems$.next(toolbarList)

    })

    // this.buildToolbar();
    // Load List Data
    this.getLstOrgType();
    this.getLstTypeId();
    this.loadDataFromLocal();
    this.loadTreeView();
    //this.editForm.disable();
  }

  getById(id: any) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/Organization/get?id=" + id).subscribe((res: any) => {
        resolve(res.data);
      });
    });
  }
  getLstOrgType() {

    this._coreService.Get("hr/otherlist/GetListOrgType").subscribe((res: any) => {
      // resolve(res.data);
      this.lstOrgType = res.data;

    });
  }
  getLstTypeId() {

    this._coreService.Get("hr/otherlist/GetListTypeIdOrg").subscribe((res: any) => {
      // resolve(res.data);
      this.lsttypeId = res.data;

    });
  }

  loadDataFromLocal() {
    let orgId: any = localStorage.getItem("orgIds");
    this.localData = JSON.parse(orgId);
    //tìm phòng ban đầu tiên để focus vào
    if (this.model.id == undefined) {
      let FindIndex = this.localData.findIndex(x => x.PARENT_ID == null);
      this.localData[FindIndex].selected = true;
      this.getById(this.localData[FindIndex].ID).then((res: any) => {
        this.model = res;
        this.nodeSelected = this.localData[FindIndex].ID
      });

    }
  }
  loadTreeView() {
    const x = setInterval(() => {
      if (this.listTreeObj) {
        let orgId: any = localStorage.getItem("orgIds");
        this.localData = JSON.parse(orgId);
        this.listTreeObj.fields = {
          dataSource: this.localData,
          id: "ID",
          parentID: "PARENT_ID",
          text: "NAME",
          hasChildren: "HAS_CHILD",
          isChecked: "IS_CHECKED",
          expanded: "EXPAND",
          tooltip: "NAME",
        };
        clearInterval(x);
      }
    }, 100);

  }

  nodeSelecting(e: any) {

    if (this.flagState$.value !== "edit") {
      this.nodeSelected = e.nodeData.id;
      this.getById(this.nodeSelected).then((res: any) => {
        this.model = res;
      });
      this.editForm.disable();
    }

  }
  choiseEmp() {
    if (this.flagState == "edit" || this.flagState == "new") {
      let param = {
        selected: this.model.mngId,
        multiselect: false//select employee on grid
      };
      this.modalService.open("cms-app-modalsemp", param);
      const x = this.modalService.employee.subscribe((res: any) => {
        this.model.mngId = res.employeeId;
        this.model.mngName = res.employeeName;
        this.model.posName = res.positionName;
        this.model.avatar = res.avatar;
        this.model.titleName = res.titleName;
        x.unsubscribe();
      });
    }
  }
  choiseEmpExt() {
    if (this.flagState == "edit" || this.flagState == "new") {
      let param = {
        selected: this.model.mngId, //select employee on grid
      };
      this.modalService.open("cms-app-modalsemp", param);
      const x = this.modalService.employee.subscribe((res: any) => {
        this.model.mngExtendId = res.employeeId;
        this.model.mngExtendName = res.employeeName;
        this.model.positionExtendName = res.positionName;
        //this.model.avatar = res.avatar;
        this.model.titleExtendName = res.titleName;

        x.unsubscribe();
      });
    }
  }
  choiseOrg() {
    if (this.flagState$.value == "view") {
      return;
    }

    let param = {
      selected: this.model.phapNhanId, //select employee on grid
    };
    this.modalService.open("cms-app-modals-org", param);
    const x = this.modalService.organization.subscribe((res: any) => {
      this.model.phapNhanId = res.ID;
      this.model.phapNhanName = res.NAME;
      x.unsubscribe();
    });
  }
  // lưu data open popup
  saveData = () => {
    if (!this.editForm.valid) {
      this.notification.warning("Form chưa hợp lệ !");
      this.editForm.markAllAsTouched();
      return;
    }
    let param = this.convertModel(this.model);
    if (this.flagState === "new") {
      this._coreService
        .Post("hr/organization/add", param)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.addSuccess();
            // reload treeview
            this.refesh();
            setTimeout(() => {
              this.loadDataFromLocal();
              this.loadTreeView();
              this.editForm.disable();
              this.flagState$.next("");
            }, 300);
          }
        });
    } else {
      this._coreService
        .Post("hr/organization/Update", param)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.refesh();
            setTimeout(() => {
              this.loadDataFromLocal();
              this.loadTreeView();
              this.editForm.disable();
              this.flagState$.next("");
            }, 300);
          }
        });
    }

    this.router.navigate(["hrms/organize/business/organization"]);
  };
  // Refesh data when add  organization new
  refesh() {
    this._coreService
      .Get("hr/Organization/GetOrgPermission")
      .subscribe((res: any) => {
        // Xóa những parent Id node không có trong treeView
        if (res.data && res.data.length > 0) {
          var ids = res.data.map((item: any) => item.ID);
          res.data.forEach((element: any) => {
            if (!ids.includes(element.PARENT_ID)) {
              delete element.PARENT_ID;
            }
          });
          localStorage.setItem("orgIds", JSON.stringify(res.data));
          this.loadDataFromLocal();
          this.loadTreeView();
        }
      });
  }
  convertModel(param: any) {
    let model = _.cloneDeep(param);
    model.foundationDate = model.foundationDate
      ? moment(model.foundationDate).format("YYYY-MM-DD")
      : null;
    model.dissolveDate = model.dissolveDate
      ? moment(model.dissolveDate).format("YYYY-MM-DD")
      : null;
    model.businessDate = model.businessDate
      ? moment(model.businessDate).format("YYYY-MM-DD")
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
      var patt1 = new RegExp(
        /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.]/
      );
      // check nhập sai năm
      if (value && value.indexOf("/") != -1) {
        let valueArray = value.split("/");
        if (valueArray.length != 3) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        }
        if (valueArray[0].length != 2 || valueArray[1].length != 2 || valueArray[2].length != 4) {
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
      if (value && value.indexOf("/") != -1) {
        let valueArray = value.split("/");
        if (valueArray.length != 3) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        }
        if (valueArray[0].length != 2 || valueArray[1].length != 2 || valueArray[2].length != 4) {
          this.editForm.get(model)!.setErrors({ incorrect: true });
          return;
        }
      }
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
  // Build Toolbar
  buildToolbar = () => {
    let toolbarList: any[] = [];
    this.flagState = this.flagState$.value;
    if (!this.flagState) {
      toolbarList = [ToolbarItem.ADD, ToolbarItem.EDIT, ToolbarItem.DELETE, ToolbarItem.LOCK, ToolbarItem.SYNC];

    }
    if (this.flagState == 'new' || this.flagState == 'edit') {
      toolbarList = [ToolbarItem.CANCEL, ToolbarItem.SAVE];

    }
    this.toolItems$.next(toolbarList)

    this.toolbar = this.globals.buildToolbar("organization", toolbarList!);
  };
  // Event Click Toolbar
  clickToolbar = (itemButton: any): void => {
    const buttonId = itemButton.id;
    switch (buttonId) {
      case ToolbarItem.ADD:
        this.flagState$.next("new");
        let parentName = this.model.name;
        this.editForm.enable();
        this.editForm.reset();
        this.model = new Organization();

        setTimeout(() => {
          this.model.parentId = this.nodeSelected;
          this.model.parentName = parentName;
          this.model.orgType = 0;
        }, 200);

        this.buildToolbar();
        break;
      case ToolbarItem.EDIT:
        this.modelTemp = _.cloneDeep(this.model)
        this.flagState$.next("edit");
        this.editForm.enable();
        this.editForm.get("code")!.enable();
        this.buildToolbar();
        break;
      case ToolbarItem.DELETE:
        if (!this.nodeSelected) {
          this.notification.warning("Chưa chọn phòng ban");
        }
        if (this.model.status == "A") {
          this.notification.warning(
            "Hệ thống không cho phép xóa dữ liệu có trạng thái Hiệu lực!"
          );
          return;
        }
        this.modalService.open("confirm-delete-modal");
        break;
      case ToolbarItem.SYNC:
        if (!this.nodeSelected) {
          this.notification.warning("Chưa chọn phòng ban");
        }
        this._coreService
        .Get("hr/organization/PushErpOrg?id=" + this.nodeSelected)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.editSuccess();
            this.refesh();
            setTimeout(() => {
              this.loadDataFromLocal();
              this.loadTreeView();
            }, 300);
            this.router.navigateByUrl('/hrms/organize/business/organization', { skipLocationChange: true }).then(() => {
              this.router.navigate(['hrms/organize/business/organization']);
            });
          }
        });
        
        break;
      case ToolbarItem.SAVE:
        this.saveData();
        //this.reloadPageWithoutLosingParams();
        break;
      case ToolbarItem.LOCK:
        if (this.nodeSelected) {

          //let ids = this.model.id.map((i: any) => i.id);
          //let ids = selectDeletes.map((i: any) => i.id);
          //let ids = this.model.id;
          let ids: number[] = [];
          if (this.model.id != undefined) {
            ids.push(this.model.id);
          }
          else {
            this.notification.warning("notify.NO_RECORD_SELECT");
          }


          this._coreService
            .Post("hr/Organization/ChangeStatus", ids)
            .subscribe((res: any) => {
              if (res.statusCode == 200) {
                this.notification.lockSuccess();
                this.refesh();
                setTimeout(() => {
                  this.editForm.disable();
                  this.flagState$.next("");
                  this.nodeSelected = this.model.id
                }, 300);
              } else {
                this.notification.lockError();
              }
            });
        }
        else {
          this.notification.warning("notify.NO_RECORD_SELECT");
        }
        break;
      case ToolbarItem.CANCEL:
        if (this.flagState$.value == 'new') {
          this.model = new Organization();
          this.model = _.cloneDeep(this.modelTemp);
        }
        else {
          this.model = _.cloneDeep(this.modelTemp);

        }
        this.flagState$.next("");
        this.editForm.disable();
        this.getById(this.nodeSelected).then((res: any) => {
          this.model = res;
          this.nodeSelected = this.nodeSelected
        });

        break;
      default:
        break;
    }
  };
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }

  public onDragStop(args: any): void {
    if (args.droppedNodeData != null) {
      // return;
      var parentId = args.droppedNodeData.id;
      var id = args.draggedNodeData.id;
      if (parentId != id) {

        let param = new Organization();
        param.id = id;
        param.parentId = parentId;
        this._coreService
          .Post("hr/organization/Sort", param)
          .subscribe((res: any) => {
            if (res.statusCode == 400) {
              this.notification.checkErrorMessage(res.message);
            } else {
              this.notification.editSuccess();
              this.refesh();
              setTimeout(() => {
                this.editForm.disable();
                this.flagState = "";
                this.buildToolbar();
              }, 300);
            }
          });
      }
    }
  }

  confirmDelete = (status: any): void => {
    if (status === "cancel") {
      this.modalService.close("confirm-delete-modal");
    } else {
      this._coreService
        .Get("hr/organization/Delete?id=" + this.nodeSelected)
        .subscribe((res: any) => {
          if (res.statusCode == 400) {
            this.notification.checkErrorMessage(res.message);
          } else {
            this.notification.deleteSuccess();
            this.refesh();
            setTimeout(() => {
              this.loadDataFromLocal();
              this.loadTreeView();
            }, 300);
            this.modalService.close("confirm-delete-modal");
            // this.router.navigate(["cms/organize/business/organization"]);
            this.router.navigateByUrl('/hrms/organize/business/organization', { skipLocationChange: true }).then(() => {
              this.router.navigate(['hrms/organize/business/organization']);
            });

          }
        });
    }
  };
  reloadPageWithoutLosingParams() {
    const currentURL = window.location.href;
    window.location.href = currentURL;
  }
}
