import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  Input,
} from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
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
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { CoreService } from "src/app/_services/core.service";
import { ConfigService } from "src/app/_services/config.service";
const _ = require("lodash");
const $ = require("jquery");
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ModalService } from "src/app/_services/modal.service";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { DataManager, Query, Predicate } from "@syncfusion/ej2-data";
import * as moment from "moment";
import { TreeViewComponent } from "@syncfusion/ej2-angular-navigations";

setCulture("en");

@Component({
  selector: "cms-app-modalsshiftsort",
  templateUrl: "./modalsshiftsort.component.html",
  styleUrls: ["./modalsshiftsort.component.scss"],
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class ModalsShiftSortComponent implements OnInit {
  // Varriable Language
  languages: any;
  selectedLanguage: any;
  @Input() id!: string;

  @ViewChild("overviewgrid", { static: true })
  public gridInstance!: GridComponent;
  model: ShiftSortDetail = new ShiftSortDetail();
  public fields = { value: "id", text: "name" };
  public field = {};
  public showCheckBox: boolean = true;
  @ViewChild("listTreeObj", { static: true })
  public listTreeObj!: TreeViewComponent;

  // @ViewChild("maskObj", { static: true })
  // public maskObj!: MaskedTextBoxComponent;

  public state: DataStateChangeEventArgs = { skip: 0, take: 50 };

  // Khai báo data
  public data: Observable<DataStateChangeEventArgs>;
  editForm!: FormGroup;
  lstObjectId = [
    { id: 1, name: "Nhân viên" },
    { id: 0, name: "Phòng ban" },
  ];
  lstPeriodId: any[] = [];
  // Private
  private _unsubscribeAll: Subject<any>;
  pageIndex: number = 0;
  nodeSelected: any;
  element: any;
  localData: any = [];
  showMask = false;
  lstShift: any;
  query!: Query;
  empId: number = 0;
  /**
   * Constructor
   *
   */
  constructor(
    private _coreService: CoreService,
    private notification: Notification,
    private globals: Globals,
    public configs: Configs,
    public router: Router,
    private _translateService: TranslateService,
    private _configService: ConfigService,
    private _tlaTranslationLoaderService: TranslationLoaderService,
    private modalService: ModalService,
    private el: ElementRef,
    private _formBuilder: FormBuilder
  ) {
    // Set language
    this.languages = this.globals.currentLang;
    this.data = _coreService;
    this._configService._configSubject.next("true");
    // Load file language
    this._tlaTranslationLoaderService.loadTranslations(vietnam, english);
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    L10n.load(this.configs.languageGrid);
    this.element = el.nativeElement;
    this.editForm = this._formBuilder.group({
      yearId: ["", [Validators.required]],
      periodId: ["", [Validators.required]],
      shiftId: ["", [Validators.required]],
      dateStart: ["", [Validators.required]],
      dateEnd: ["", [Validators.required]],
      objectId: ["", [Validators.required]],
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
    // Load List Data
    this.modalService.add(this);
  }
  nodeSelecting(e: any) {
    this.nodeSelected = e.nodeData.id;
    this.getListData(this.nodeSelected);
  }
  choise() {
    let x = this.gridInstance.getSelectedRecords();
    this.modalService.employee.next(x);
    this.modalService.close("cms-app-modalsemp");
  }
  getTreeView() {
    return new Promise((resolve) => {
      //this._coreService.Get("hr/organization/GetList").subscribe((res: any) => {
      //  resolve(res.data);
      //});
      let orgId: any = localStorage.getItem("orgIds");
      resolve(JSON.parse(orgId));
    });
  }

  //Change the dataSource for TreeView
  public changeDataSource(data: any) {
    this.listTreeObj.fields = {
      dataSource: data,
      id: "id",
      text: "name",
      parentID: "pid",
      hasChildren: "hasChild",
    };
  }

  // open modal
  open(param: any): void {
    if (param.isAdd == 0) {
      this.empId = param.empIds[0];
    }
    else {
      this.empId = 0;
    }
    Promise.all([
      this.getListShiftPeriod(param.yearId),
      this.getListShift(param.type),
      this.getTreeView(),
    ]).then((res: any) => {
      this.localData = res[2];
      this.field = {
        dataSource: this.localData,
        id: "ID",
        parentID: "PARENT_ID",
        text: "NAME",
        hasChildren: "HAS_CHILD",
        isChecked: "IS_CHECKED",
        expanded: "EXPAND",
      };

      if (param.orgId) {
        setTimeout(() => {
          this.listTreeObj.selectedNodes = [param.orgId.toString()];
        }, 300);
      }
      this.getListData(param.orgId);
      this.model = _.cloneDeep(param);
      this.model.objectId = 1;
    });
    this.element.style.display = "block";
    document.body.classList.add("v2hrm-modal-open");
  }
  // close modal
  close(): void {
    this.gridInstance.clearSelection();
    this.gridInstance.clearFiltering();
    this.element.style.display = "none";
    document.body.classList.remove("v2hrm-modal-open");
    this.modalService.modalStatus.next("close");
  }
  maximize() {
  }
  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }
  save() {
    if (!this.editForm.valid) {
      this.notification.warning("Giá trị không hợp lệ");
      this.editForm.markAllAsTouched();
      return;
    }

    let x: any = this.gridInstance.getSelectedRecords();
    let y: any = this.listTreeObj.checkedNodes;
    if (this.model.objectId == 1) {
      if (x.length == 0) {
        this.notification.warning("Chưa chọn nhân viên");
        return;
      }
    } else {
      if (y.length == 0) {
        this.notification.warning("Chưa phòng ban");
        return;
      }
    }
    this.model.empIds = x.map((i: any) => Number(i.employeeId));
    this.model.orgIds = y.map((i: any) => Number(i));

    var model = _.cloneDeep(this.model);
    model.dateStart = model.dateStart
      ? moment(model.dateStart).format("YYYY-MM-DD")
      : null;
    model.dateEnd = model.dateEnd
      ? moment(model.dateEnd).format("YYYY-MM-DD")
      : null;
    this.modalService.loading.next(true);
    this._coreService.Post("hr/worksign/Add", model).subscribe((res: any) => {
      if (res.statusCode == 200) {
        this.notification.success("Xếp ca thành công");
        this.editForm.reset();
        this.modalService.shiftsort.next(res);
        this.modalService.close("cms-app-modalsshiftsort");
      } else {
        this.notification.warning("Thất bại");
      }
      this.modalService.loading.next(false);
    });
  }
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
  // GetListData
  getListData = (id?: any): void => {
    // const state = { skip: 0, take: 1000 };
    var extraParams: any = [];
    if (this.empId != 0) {
      extraParams.push({
        field: "employeeId",
        value: this.empId,
      });
    }
    if (id) {
      extraParams.push({
        field: "orgId",
        value: id,
      });
    }
    this._coreService.execute(this.state, "hr/Employee/GetPopup", extraParams);
    // this._coreService
    //   .GetAll(state, "hr/Employee/GetPopup", extraParams)
    //   .subscribe((res: any) => {
    //     this.data = res.result;
    //     this.gridInstance.pageSettings.totalRecordsCount = res.count;
    //   });
  };

  dataBound() {
    if (this.model.empIds && this.model.empIds.length > 0 && this.empId != 0) {
      let y = this.gridInstance.getCurrentViewRecords();
      let x = this.model.empIds.map((item: any) => {
        let index = _.findIndex(y, (i: any) => {
          return i.employeeId == item;
        });
        return index;
      });

      this.gridInstance.selectionModule.selectRows(x);
    }
  }
  getListShift(type: any) {
    return new Promise((resolve) => {
      this._coreService.Get("hr/shift/getlist?type=" + type).subscribe((res: any) => {
        this.lstShift = res.data;
        resolve(false);
      });
    });
  }
  changeYear(e: any) {
    if (e.isInteracted) {
      this.getListShiftPeriod(e.value).then((res: any) => {
        this.lstPeriodId = res;
      });
    }
  }

  getListShiftPeriod(id: any) {
    return new Promise((resolve) => {
      this._coreService
        .Get("hr/SalaryPeriod/getlist?Id=" + id)
        .subscribe((res: any) => {
          this.lstPeriodId = res.data;
          resolve(res.data);
        });
    });
  }
  changePeriod(e: any) {
    if (e.e) {
      var item = _.find(this.lstPeriodId, { id: e.itemData.id });
      if (item) {
        this.model.dateStart = item.dateStart;
        this.model.dateEnd = item.dateEnd;
      }
    }
  }
  public dataStateChange(state: DataStateChangeEventArgs): void {
    this.state = state;
    this.state = state;
    this.pageIndex = Math.floor(state.skip! / state.take!);
    let extraParams: any[] = [];
    if (this.empId != 0) {
      extraParams.push({
        field: "employeeId",
        value: this.empId,
      });
    }
    if (this.nodeSelected) {
      extraParams.push({
        field: "orgId",
        value: this.nodeSelected,
      });
    }
    this._coreService.execute(this.state, "hr/Employee/GetPopup", extraParams);
    // this._coreService
    //   .GetAll(state, "hr/Employee/GetPopup", extraParams)
    //   .subscribe((res: any) => {
    //     this.data = res.result;
    //     this.gridInstance.pageSettings.totalRecordsCount = res.count;
    //   });
  }
  // change date
  public onFiltering(e: any, a: any) {
    e.preventDefaultAction = true;
    const predicate = new Predicate("name", "contains", e.text, true, true);
    this.query = new Query();
    this.query = e.text !== "" ? this.query.where(predicate) : this.query;
    e.updateData(a, this.query);
  }
}
export class ShiftSortDetail {
  yearId?: number;
  periodId?: number;
  empIds?: Array<any>;
  orgIds?: Array<any>;
  shiftId?: number;
  objectId?: number; // 1 : xếp ca cho nhân viên được chọn 0: xếp ca cho phòng ban được chọn
  orgId?: string;
  dateStart?: any;
  dateEnd?: any;
  isAdd?: boolean;
}
