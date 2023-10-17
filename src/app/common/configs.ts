import { Injectable } from "@angular/core";
import { EditSettingsModel } from "@syncfusion/ej2-angular-grids";
import { FilterSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ExcelQueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';

import * as moment from 'moment';
const $ = require("jquery");

@Injectable()
export class Configs {
  // Language
  currentLang = localStorage.getItem("lang")! || "en";
  height = (): number => {
    let groupFilter = $(".group-filter").outerHeight(); // from phia tren grid cong voi padding
    let gridheader = $(".e-gridheader").outerHeight(); // phần header của lưới
    let gridpager = $(".e-gridpager").outerHeight(); // phần footer của lưới
    let groupdroparea = $(".e-groupdroparea").outerHeight(); // Phần filtter
    let summaryrow = $(".e-summaryrow").outerHeight(); // Phần filtter
    let searchFrom = $(".searchFrom").outerHeight();// search form
    groupFilter = groupFilter ? groupFilter : 0;
    gridheader = gridheader ? gridheader : 0;
    gridpager = gridpager ? gridpager : 0;
    groupdroparea = groupdroparea ? groupdroparea : 0;
    summaryrow = summaryrow ? summaryrow : 0;
    searchFrom = searchFrom ? searchFrom : 0;
    const heightAppContent = $(".app-content").innerHeight();
    return (
      heightAppContent -
      gridpager -
      groupFilter -
      gridheader -
      groupdroparea -
      summaryrow -
      searchFrom
    );
  };
  heightTimeSheet = (): number => {
    let groupFilter = $(".group-filter").outerHeight(); // from phia tren grid cong voi padding
    let gridheader = $(".e-gridheader").outerHeight(); // phần header của lưới
    let gridpager = $(".e-gridpager").outerHeight(); // phần footer của lưới
    groupFilter = groupFilter ? groupFilter : 0;
    gridheader = gridheader ? gridheader : 0;
    gridpager = gridpager ? gridpager : 0;
    const heightAppContent = $(".app-content").innerHeight();
    return heightAppContent - gridpager - groupFilter - gridheader - 215;
  };
  heightLevelCompet = (): number => {
    let groupFilter = $(".group-filter").outerHeight(); // from phia tren grid cong voi padding
    let gridheader = $(".e-gridheader").outerHeight(); // phần header của lưới
    let gridpager = $(".e-gridpager").outerHeight(); // phần footer của lưới
    groupFilter = groupFilter ? groupFilter : 0;
    gridheader = gridheader ? gridheader : 0;
    gridpager = gridpager ? gridpager : 0;
    const heightAppContent = $(".app-content").innerHeight();

    return heightAppContent - gridpager - groupFilter - gridheader - 150;
  };
  getTooltip(str: string) {
    let arr = str?.split('/')
    let strReturn = "<div>"

    arr?.forEach((value, index) => {
      let specialCharacter = ""

      for (let i = 1; i <= index + 1; i++) {
        specialCharacter += "__"
      }
      strReturn += "<label style='font-weight:600'>" + "<span style=''>" + specialCharacter + "</span>" + value + "</label>" + "<br/>"
    })
    strReturn += "</div>"
    return strReturn;
  }

  exportQueryCellInfo(args: any) {
    let rootValue = args.value;


    let value = args.value;

    if (args.column?.format?.type! == 'date') {

      var data = moment(value).format('DD/MM/yyyy');
      
      args.value = data

      if(args.value=='Invalid date')args.value=rootValue
  }
  if (args.column?.format?.type! == 'boolean'){
    if(rootValue == true){
      args.value = "Có";
    }else if(rootValue == false){
      args.value = "Không";
    }
  }
 

    // if(rootValue == true){
    //   args.value = "Có"
    // }
    // else{
    //   args.value = "Không"
    // }
  }


  filterOption?: FilterSettingsModel = { mode: 'Immediate', immediateModeDelay: 500 };

  filterSettings = {
    type: "Menu",
    operators: {
      stringOperator: [{ value: "contains", text: "Bắt đầu bằng" }],
      numberOperator: [{ value: "Equal", text: "Bằng" }],
      dateOperator: [{ value: "Equal", text: "Bằng" }],
      booleanOperator: [{ value: "Equal", text: "Bằng" }],
    },
  };

  filterSettings2 = {
    type: "Menu",
    operators: {
      stringOperator: [
        { value: "startsWith", text: "Bắt đầu bằng" },
        { value: "endsWith", text: "Kết thúc bằng" },
        { value: "contains", text: "Chứa ký tự" },
      ],
      numberOperator: [
        { value: "Equal", text: "Bằng" },
        { value: "NotEqual", text: "Không bằng" },
        { value: "LessThan", text: "Nhỏ hơn" },
        { value: "LessThanOrEqual", text: "Nhỏ hơn hoặc bằng" },
        { value: "GreaterThan", text: "Lớn hơn" },
        { value: "GreaterThanOrEqual", text: "Lớn hơn hoặc bằng" },
      ],
      dateOperator: [
        { value: "Equal", text: "Bằng" },
        { value: "NotEqual", text: "Không bằng" },
        { value: "LessThan", text: "Nhỏ hơn" },
        { value: "LessThanOrEqual", text: "Nhỏ hơn hoặc bằng" },
        { value: "GreaterThan", text: "Lớn hơn" },
        { value: "GreaterThanOrEqual", text: "Lớn hơn hoặc bằng" },
      ],
      booleanOperator: [
        { value: "Equal", text: "Bằng" },
        { value: "NotEqual", text: "Không bằng" },
      ],
    },
  };

  public editSettings: EditSettingsModel = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: true,
    mode: "Dialog",
  };

  public editSettingsAllowAdd: EditSettingsModel = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Normal",
  };

  public wrapSettings = { wrapMode: "Header" };
  filter = { type: "CheckBox" };
  pageSettings: Object = {
    pageSizes: [10, 20, 50, 200],
    pageSize: 50,
    pageCount: 4,
  };
  treeGridPageSettings: Object = { pageSize: 20, pageCount: 4 };
  selectionSettings = {
    type: "Multiple",
    checkboxOnly: false,
    checkboxMode: 'ResetOnRowClick'
  };

  selectionSettingsNotCheck = {
    persistSelection: true,
    type: "Multiple",
    checkboxOnly: false,
  };

  selectionNonCheckSettings = {
    type: "Multiple",
  };

  selectionNonCheckSingle = {
    type: "Single",
    checkboxOnly: false,
  };

  editNumericParams = { params: { decimals: 0, min: 0 } };

  // Grid Translate
  languageGrid = {
    vi: {
      grid: {
        EmptyRecord: "Không có dữ liệu phù hợp.",
        EditOperationAlert: "Không chọn bản ghi nào để sửa!",
        Item: "Dòng bản ghi",
        Items: "Dòng bản ghi",
        FilterButton: "Tìm kiếm",
        ClearButton: "Hủy bỏ",
        EnterValue: "Tìm kiếm....",
        ChooseColumns: "Chọn cột hiển thị",
        SearchColumns: "Tìm kiếm cột",
        OKButton: "Đồng ý",
        CancelButton: "Hủy",
        SelectAll: "Chọn tất cả",
        Search: "Tìm kiếm",
        ChooseDate: "Chọn ngày",
        NoResult: "Không có dữ liệu phù hợp.",
        Matchs: "Không có dữ liệu phù hợp.",
      },
      listbox: {
        noRecordsTemplate: "Không có dữ liệu phù hợp.",
        selectAllText: "Chọn tất cả",
        unSelectAllText: "Bỏ chọn tất cả",
      },
      dropdowns: {
        noRecordsTemplate: "Không có dữ liệu phù hợp.",
        actionFailureTemplate: "Không tải được dữ liệu.",
      },
      pager: {
        currentPageInfo: "",
        pagerDropDown: "kết quả tìm kiếm",
        totalItemsInfo: "Tổng số bản ghi: {0}. Hiển thị",
        All: "Tất cả",
        pagerAllDropDown: "kết quả tìm kiếm",
      },
      datepicker: {
        today: "Hôm nay",
      },
      querybuilder: {
        AddGroup: 'Thêm nhóm',
        AddCondition: 'Thêm điều kiện',
        AddButton: "Thêm nút",
        DeleteRule: 'Xóa quy tắc',
        DeleteGroup: 'Xóa nhóm',
        Edit: 'Sửa',
        SelectField: 'Chọn cột',
        SelectOperator: 'Chọn toán tử',
        StartsWith: 'Bắt đầu bằng',
        EndsWith: 'Kết thúc bằng',
        Contains: 'Chứa',
        Equal: 'Bằng',
        NotEqual: 'Không bằng',
        LessThan: 'Nhỏ hơn',
        LessThanOrEqual: 'Nhỏ hơn hoặc bằng',
        GreaterThan: 'Lớn hơn',
        GreaterThanOrEqual: 'Lớn hơn hoặc bằng',
        Between: 'Giữa',
        NotBetween: 'Nằm ngoài khoảng',
        In: 'In',
        NotIn: 'NotIn',
        Remove: 'Loại bỏ',
        ValidationMessage: 'ValidationMessage',
        And: "Và",
        Or: "Hoặc"
      }
    },
    en: {
      grid: {
        EmptyRecord: "EmptyRecord.",
        EditOperationAlert: "Không chọn bản ghi nào để sửa!",
        Item: "Dòng bản ghi",
        Items: "Dòng bản ghi",
        FilterButton: "Tìm kiếm",
        ClearButton: "Hủy bỏ",
        EnterValue: "Tìm kiếm....",
        ChooseColumns: "Chọn cột hiển thị",
        SearchColumns: "Tìm kiếm cột",
        OKButton: "Đồng ý",
        CancelButton: "Hủy",
        SelectAll: "Chọn tất cả",
        Search: "Tìm kiếm",
        ChooseDate: "Chọn ngày",
        NoResult: "Không có dữ liệu phù hợp.",
        Matchs: "Không có dữ liệu phù hợp.",
      },
      listbox: {
        noRecordsTemplate: "Không có dữ liệu phù hợp.",
        selectAllText: "Chọn tất cả",
        unSelectAllText: "Bỏ chọn tất cả",
        NoResult: "Không có dữ liệu phù hợp.",
      },
      dropdowns: {
        noRecordsTemplate: "Không có dữ liệu phù hợp.",
        actionFailureTemplate: "Không tải được dữ liệu.",
      },
      pager: {
        currentPageInfo: "",
        pagerDropDown: "kết quả tìm kiếm",
        totalItemsInfo: "Tổng số bản ghi: {0}. Hiển thị",
        All: "Tất cả",
        pagerAllDropDown: "kết quả tìm kiếm",
      },
      datepicker: {
        today: "Hôm nay",
      },
      querybuilder: {
        AddGroup: 'Thêm nhóm',
        AddCondition: 'Thêm điều kiện',
        AddButton: "Thêm nút",
        DeleteRule: 'Xóa quy tắc',
        DeleteGroup: 'Xóa nhóm',
        Edit: 'Sửa',
        SelectField: 'Chọn cột',
        SelectOperator: 'Chọn toán tử',
        StartsWith: 'Bắt đầu bằng',
        EndsWith: 'Kết thúc bằng',
        Contains: 'Chứa',
        Equal: 'Bằng',
        NotEqual: 'Không bằng',
        LessThan: 'Nhỏ hơn',
        LessThanOrEqual: 'Nhỏ hơn hoặc bằng',
        GreaterThan: 'Lớn hơn',
        GreaterThanOrEqual: 'Lớn hơn hoặc bằng',
        Between: 'Giữa',
        NotBetween: 'Nằm ngoài khoảng',
        In: 'In',
        NotIn: 'NotIn',
        Remove: 'Loại bỏ',
        ValidationMessage: 'ValidationMessage',
        AND: "Và",
        OR: "Hoặc"

      }
    },
  };

  // Query builder Translate
  languageQueryBuilder = {
    vi: {
      querybuilder: {
        AddGroup: 'Thêm nhóm',
        AddCondition: 'Thêm điều kiện',
        AddButton: "Thêm nút",
        DeleteRule: 'Xóa quy tắc',
        DeleteGroup: 'Xóa nhóm',
        Edit: 'Sửa',
        SelectField: 'Chọn cột',
        SelectOperator: 'Chọn toán tử',
        StartsWith: 'Bắt đầu bằng',
        EndsWith: 'Kết thúc bằng',
        Contains: 'Chứa',
        Equal: 'Bằng',
        NotEqual: 'Không bằng',
        LessThan: 'Nhỏ hơn',
        LessThanOrEqual: 'Nhỏ hơn hoặc bằng',
        GreaterThan: 'Lớn hơn',
        GreaterThanOrEqual: 'Lớn hơn hoặc bằng',
        Between: 'Giữa',
        NotBetween: 'Nằm ngoài khoảng',
        In: 'In',
        NotIn: 'NotIn',
        Remove: 'Loại bỏ',
        ValidationMessage: 'ValidationMessage',
      }

    },
    en: {
      querybuilder: {
        AddGroup: 'Thêm nhóm',
        AddCondition: 'Thêm điều kiện',
        AddButton: "Thêm nút",
        DeleteRule: 'Xóa quy tắc',
        DeleteGroup: 'Xóa nhóm',
        Edit: 'Sửa',
        SelectField: 'Chọn cột',
        SelectOperator: 'Chọn toán tử',
        StartsWith: 'Bắt đầu bằng',
        EndsWith: 'Kết thúc bằng',
        Contains: 'Chứa',
        Equal: 'Bằng',
        NotEqual: 'Không bằng',
        LessThan: 'Nhỏ hơn',
        LessThanOrEqual: 'Nhỏ hơn hoặc bằng',
        GreaterThan: 'Lớn hơn',
        GreaterThanOrEqual: 'Lớn hơn hoặc bằng',
        Between: 'Giữa',
        NotBetween: 'Nằm ngoài khoảng',
        In: 'In',
        NotIn: 'NotIn',
        Remove: 'Loại bỏ',
        ValidationMessage: 'ValidationMessage',
      }
    },
  };
}
