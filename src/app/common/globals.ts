import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Consts } from "./const";
import { HttpHeaders as Headers } from "@angular/common/http";
import { Sorts } from "@syncfusion/ej2-angular-grids";

import { TranslateService } from "@ngx-translate/core";
import { locale as commonEnglish } from "./i18n/en";
import { locale as commonVietNam } from "./i18n/vi";
import { TranslationLoaderService } from "./translation-loader.service";

import { ExtraParams, ToolbarItem } from "../_models/index";
import { Chart } from "angular-highcharts";
import { FormControl, AbstractControl } from "@angular/forms";
const _ = require("lodash");

export const NORMAL_COLOR_LIST: string[] = [
  "#F37540",
  "#AA572D",
  "#F3A640",
  "#F34059",
  "#AA2D3E",
  "#17852E",
  "#36A2EB",
  "#009E21",
  "#FC7212",
];


import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
@Injectable()
export class Globals {

  RequestOptions = {
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    url: null,
    body: {}
  };

  // Token
  token = localStorage.getItem("token");
  public isAdmin = localStorage.getItem("isAdmin") == "true" ? true : false;
  urlDefault = [
    "/sys/sdashboard",
    "/hrms/dashboard",
    "/error/404",
    "/nopermission",
    "/auth/login",
    "/auth/forgot-password",
    "/",
  ];
  urlPermission: any[] = [];
  // Language
  currentLang = localStorage.getItem("lang");

  // Store Code + Pathname
  storeCode: string = window.location.host
    .replace(/^www\./, "")
    .toLowerCase()
    .split(".")[0];
  pathName = window.location.pathname;

  // BACKEND + API URL
  isProduction = environment.production;
  backendURL = environment.production
    ? Consts.BACKEND_URL_PRODUCTION
    : Consts.BACKEND_URL_LOCAL;

  apiURL = environment.production
    ? Consts.API_URL_SERVICE_PRODUCTION
    : Consts.API_URL_SERVICE;
  // Url đên node service quản lý cms website
  apiUrlNode = environment.production
    ? Consts.API_URL_NODE_SERVICE_PRODUCTION
    : Consts.API_URL_NODE_SERVICE;
  // url file manager, report

  apiUrlFileManager = environment.production
    ? Consts.API_FILE_MANAGER_SERVICE_PRODUCTION
    : Consts.API_FILE_MANAGER_SERVICE;

  apiUrlReport = environment.production
    ? Consts.API_REPORT_SERVICE_PRODUCTION
    : Consts.API_REPORT_SERVICE;

  // Languages
  languages = [
    {
      id: "vi",
      title: "Việt Nam",
      flag: "vi",
    },
    {
      id: "en",
      title: "English",
      flag: "us",
    },
  ];

  // Paging
  pageSize = 20;

  // Imgur Config
  imgurReq = {
    url: "https://api.imgur.com/3/image",
    headers: {
      Authorization: "Client-ID cbf67f777e7c372",
    },
  };

  lstColorProcess = ["#E3E3E7", "#29D28E", "#14618C", "#F09393", "#E94949"];
  lstColorNormal = NORMAL_COLOR_LIST;


  /**
   * Constructor
   *
   * @param {TranslationLoaderService} _translationLoaderService
   * @param {TranslateService} _translateService
   */
  constructor(
    private _translationLoaderService: TranslationLoaderService,
    private _translateService: TranslateService,

  ) {
    _translationLoaderService.loadTranslations(commonVietNam, commonEnglish);
    let x = JSON.parse(localStorage.getItem("permission")!);
    if (x && x.length > 0) {
      this.urlPermission = x.map((i: any) => i.url);
    }

  }

  // Function get Common Options Imgurl
  getCommonOptionImage = (url: any, body?: any) => {
    const options = this.RequestOptions;
    options.url = url;
    if (body) {
      options.body = body;
    } else {
      options.body = {};
    }
    const header = new Headers();
    header.append("Authorization", "Client-ID cbf67f777e7c372");
    options.headers = header;

    return options;
  };

  // Function get Common Options
  getCommonOptions = (url: any, body?: any) => {
    const options = this.RequestOptions;
    options.url = url;
    if (body) {
      options.body = body;
    } else {
      options.body = {};
    }
    options.headers = this.getCommonHeader();

    return options;
  };

  getCommonOptionsWithAuth = (url: any, body?: any) => {
    const options = this.RequestOptions;
    options.url = url;
    if (body) {
      options.body = body;
    } else {
      options.body = {};
    }
    options.headers = this.getCommonHeaderWithAuth();

    return options;
  };

  // Function get Common Header
  getCommonHeader = () => {
    const header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Accept", "application/json");
    header.append("Access-Control-Allow-Credentials", "true");
    header.append("Access-Control-Allow-Origin", "*");
    header.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    header.append(
      "Access-Control-Allow-Methods",
      "POST, GET, OPTIONS, DELETE, PUT"
    );

    return header;
  };

  // Function get Common Header With Authorization
  getCommonHeaderWithAuth = () => {
    const header = new Headers();
    header.append("Content-Type", "application/json");
    header.append("Accept", "application/json");
    header.append("Access-Control-Allow-Origin", "*");
    header.append(
      "Access-Control-Allow-Methods",
      "POST, GET, OPTIONS, DELETE, PUT"
    );
    header.append("Authorization", "Bearer " + localStorage.getItem("token"));

    return header;
  };

  // Function get Common URL Get All
  getCommonURLGetAll = (
    state: DataStateChangeEventArgs,
    url_core: string,
    extraParams?: Array<ExtraParams>
  ): string => {
    let url_get_all = "";
    const pageSize = state.take;
    const pageNo = Math.floor(state.skip! / state.take! + 1);
    if (url_core.includes("tenant/approvetemplate/getapprovetemplatedetail?templateId=")) {
      url_get_all = this.apiURL + url_core + "&PageNo=" + pageNo + "&PageSize=" + pageSize;
    } else {
      url_get_all = this.apiURL + url_core + "?PageNo=" + pageNo + "&PageSize=" + pageSize;
    }
    let sortQuery = "";
    let filterQuery = "";
    let extraQuery = "";

    // Sorted
    if ((state.sorted || []).length) {
      sortQuery =
        `&sort=` +
        state.sorted!
          .map((obj: Sorts) => {
            return obj.direction === "descending" ? `-${obj.name}` : obj.name;
          })
          .reverse()
          .join(",");
      url_get_all += sortQuery;
    }

    // Query
    if ((state.where || []).length) {
      if ((state.where![0]['predicates'] || []).length) {
        for (let i = 0; i < state.where![0]['predicates']!.length; i++) {
          filterQuery +=
            "&" +
            state.where![0]['predicates']![i].field +
            "=" +
            state.where![0]['predicates']![i].value;
        }
      }
      url_get_all += filterQuery;
    }

    // Extra Params
    if (extraParams && extraParams.length > 0) {
      for (let i = 0; i < extraParams.length; i++) {
        extraQuery += "&" + extraParams[i].field + "=" + extraParams[i].value;
      }
      url_get_all += extraQuery;
    }
    return url_get_all;
  };

  // Function get Common Body Get All
  getCommonBodyGetAll = (
    state: DataStateChangeEventArgs,
    extraParams?: Array<ExtraParams>
  ) => {
    let body = {};
    // Query
    if ((state.where || []).length) {
      if ((state.where![0]['predicates'] || []).length) {
        for (let i = 0; i < state.where![0]['predicates']!.length; i++) {
          (body as any)[state.where![0]['predicates']![i].field] =
            state.where![0]['predicates']![i].value;
        }
      }
    }
    if (extraParams && extraParams.length > 0) {
      for (let i = 0; i < extraParams.length; i++) {
        (body as any)[extraParams[i].field] = extraParams[i].value;
      }
    }
    return body;
  };

  // Build toolbar from Permission
  buildToolbar = (
    state_url: string,
    toolbarList: Array<any>,
    extraParams?: Array<any>
  ): Array<any> => {
    let toolbar_item: any[] = [];


    // Check toolbar Permission
    let permission_check = [];
    if (this.isAdmin == false && this.storeCode != "admin") {
      let per: any = localStorage.getItem("permission");

      let x = _.find(JSON.parse(per), { functionCode: state_url });


      let permission = [];
      if (x.permissionString) {
        permission = x.permissionString.split(",");
      }

      if (permission.indexOf("ADD") > -1 || permission.indexOf("EDIT") > -1) {
        permission.push("save");
      }
      if (permission.indexOf("EXPORT") > -1) {
        permission.concat([
          "print",
          "export_excel",
          "export_pdf",
          "export_template",
          "export_bc"
        ]);
      }
      if (permission.indexOf("AT_SUM") > -1) {
        permission.concat(["sum_work"]);
      }
      if (permission.indexOf("PA_CAL") > -1) {
        permission.concat(["payroll_cal"]);
      }

      permission_check = permission.map((item: string) => item.toLowerCase());

    }

    // Back
    if (toolbarList.indexOf(ToolbarItem.BACK) > -1) {
      this._translateService.get("BUTTONS.BACK").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-reply",
          iconColorClass: "btn-orange",
          id: ToolbarItem.BACK,
        });
      });
    }

    // Add
    if (
      toolbarList.indexOf(ToolbarItem.ADD) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.ADD) > -1)
    ) {
      this._translateService.get("BUTTONS.ADD").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-plus",
          iconColorClass: "btn-orange",
          id: ToolbarItem.ADD,
        });
      });
    }

    // Add request
    if (
      toolbarList.indexOf(ToolbarItem.ADD_REQUEST) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.ADD) > -1)
    ) {
      this._translateService.get("BUTTONS.ADD_REQUEST").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-plus-square-o",
          iconColorClass: "btn-orange-sky",
          id: ToolbarItem.ADD_REQUEST,
          isDisable: false,
        });
      });
    }
    // Add order
    if (
      toolbarList.indexOf(ToolbarItem.ADD_ORDER) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.ADD) > -1)
    ) {
      this._translateService.get("BUTTONS.ADD_ORDER").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa fa-plus-circle",
          iconColorClass: "btn-orange-sky",
          id: ToolbarItem.ADD_ORDER,
          isDisable: false,
        });
      });
    }

    // Add ban quyen
    if (
      toolbarList.indexOf(ToolbarItem.SEARCH) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.ADD) > -1)
    ) {
      this._translateService.get("BUTTONS.SEARCH").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa fa-search",
          iconColorClass: "btn-orange",
          id: ToolbarItem.SEARCH,
          isDisable: false,
        });
      });
    }

    // COPY
    if (
      toolbarList.indexOf(ToolbarItem.COPY) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.COPY) > -1)
    ) {
      this._translateService.get("BUTTONS.COPY").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-copy",
          iconColorClass: "btn-orange-sky",
          id: ToolbarItem.COPY,
          isDisable: false,
        });
      });
    }

    // Edit
    if (
      toolbarList.indexOf(ToolbarItem.EDIT) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.EDIT) > -1)
    ) {
      this._translateService.get("BUTTONS.EDIT").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-edit",
          iconColorClass: "btn-orange",
          id: ToolbarItem.EDIT,
          isDisable: false,
        });
      });
    }

    // VIEW
    if (
      toolbarList.indexOf(ToolbarItem.VIEW) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.VIEW) > -1)
    ) {
      this._translateService.get("BUTTONS.VIEW").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-eye",
          id: ToolbarItem.VIEW,
          isDisable: false,
        });
      });
    }

    // VIEW DIARY
    if (
      toolbarList.indexOf(ToolbarItem.VIEW_DIARY) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.VIEW_DIARY) > -1)
    ) {
      this._translateService.get("BUTTONS.VIEW_DIARY").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-eye",
          id: ToolbarItem.VIEW_DIARY,
          isDisable: false,
        });
      });
    }
    // Save
    if (
      toolbarList.indexOf(ToolbarItem.SAVE) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.SAVE) > -1)
    ) {
      this._translateService.get("BUTTONS.SAVE").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-save",
          iconColorClass: "btn-red",
          id: ToolbarItem.SAVE,
          isDisable: false,
        });
      });
    }
    // Tạo mới bản quyền
    if (
      toolbarList.indexOf(ToolbarItem.APPROVED) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.APPROVED) > -1)
    ) {
      this._translateService.get("BUTTONS.APPROVED").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-check-circle-o",
          id: ToolbarItem.APPROVED,
          isDisable: false,
        });
      });
    }

    // finish
    if (
      toolbarList.indexOf(ToolbarItem.DENIED) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.APPROVED) > -1)
    ) {
      this._translateService.get("BUTTONS.DENIED").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-minus-square",
          iconColorClass: "btn-green",
          id: ToolbarItem.DENIED,
          isDisable: false,
        });
      });
    }

    // Export Excel
    if (
      toolbarList.indexOf(ToolbarItem.EXPORT_EXCEL) > -1
    ) {
      this._translateService.get("BUTTONS.EXPORT_EXCEL").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-file-excel-o",
          id: ToolbarItem.EXPORT_EXCEL,
          isDisable: false,
        });
      });
    }

    if (
      toolbarList.indexOf(ToolbarItem.EXPORT_BC) > -1
    ) {
      this._translateService.get("BUTTONS.EXPORT_BC").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-file-excel-o",
          id: ToolbarItem.EXPORT_BC,
          isDisable: false,
        });
      });
    }

    // Export PDF
    if (
      toolbarList.indexOf(ToolbarItem.EXPORT_PDF) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.EXPORT_PDF) > -1)
    ) {
      this._translateService.get("BUTTONS.EXPORT_PDF").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "e-pdfexport",
          id: ToolbarItem.EXPORT_PDF,
          isDisable: false,
        });
      });
    }

    // Import
    if (
      toolbarList.indexOf(ToolbarItem.IMPORT) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.IMPORT) > -1)
    ) {
      this._translateService.get("BUTTONS.IMPORT").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "feather-share",
          iconColorClass: "btn-violet",
          id: "import",
          isDisable: false,
        });
      });
    }

    // export TEMPLATE
    if (
      toolbarList.indexOf(ToolbarItem.EXPORT_TEMPLATE) > -1
    ) {
      this._translateService
        .get("BUTTONS.EXPORT_TEMPLATE")
        .subscribe((data) => {
          toolbar_item.push({
            text: data,
            tooltipText: data,
            prefixIcon: "fa-file-excel-o",
            iconColorClass: "btn-violet",
            id: "export_template",
            isDisable: false,
          });
        });
    }


    // Print
    if (
      toolbarList.indexOf(ToolbarItem.PRINT) > -1) {
      this._translateService.get("BUTTONS.PRINT").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-print",
          iconColorClass: "btn-orange-sky",
          id: ToolbarItem.PRINT,
          isDisable: false,
        });
      });
    }
    //Position
    // PRINT_JD_POSITION
    if (
      toolbarList.indexOf(ToolbarItem.PRINT_JD_POSITION) > -1) {
      this._translateService.get("BUTTONS.PRINT_JD_POSITION").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-print",
          iconColorClass: "btn-orange-sky",
          id: ToolbarItem.PRINT_JD_POSITION,
          isDisable: false,
        });
      });
    }
    // SYNC_LIST_MANAGER_POSITION
    if (
      toolbarList.indexOf(ToolbarItem.SYNC_LIST_MANAGER_POSITION) > -1) {
      this._translateService.get("BUTTONS.SYNC_LIST_MANAGER_POSITION").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa fa-refresh",
          iconColorClass: "btn-orange",
          id: ToolbarItem.SYNC_LIST_MANAGER_POSITION,
          isDisable: false,
        });
      });
    }
    // SEARCH_VACANT_POSITION
    if (
      toolbarList.indexOf(ToolbarItem.SEARCH_VACANT_POSITION) > -1) {
      this._translateService.get("BUTTONS.SEARCH_VACANT_POSITION").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "",
          iconColorClass: "btn-orange",
          id: ToolbarItem.SEARCH_VACANT_POSITION,
          isDisable: false,
        });
      });
    }
    // SWAP_POSITION
    if (
      toolbarList.indexOf(ToolbarItem.SWAP_POSITION) > -1) {
      this._translateService.get("BUTTONS.SWAP_POSITION").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa fa-refresh",
          iconColorClass: "btn-orange",
          id: ToolbarItem.SWAP_POSITION,
          isDisable: false,
        });
      });
    }
    // RESET
    if (
      toolbarList.indexOf(ToolbarItem.RESET) > -1) {
      this._translateService.get("BUTTONS.RESET").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa fa-refresh",
          iconColorClass: "btn-orange",
          id: ToolbarItem.RESET,
          isDisable: false,
        });
      });
    }
    // CONFIRM
    if (
      toolbarList.indexOf(ToolbarItem.CONFIRM) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.CONFIRM) > -1)
    ) {
      this._translateService.get("BUTTONS.CONFIRM").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-check",
          iconColorClass: "btn-orange",
          id: ToolbarItem.CONFIRM,
          isDisable: false,
        });
      });
    }

    // Khóa/Mở khóa
    if (
      toolbarList.indexOf(ToolbarItem.LOCK) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.LOCK) > -1)
    ) {
      this._translateService.get("BUTTONS.LOCK").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-lock",
          iconColorClass: "btn-yellow",
          id: ToolbarItem.LOCK,
          isDisable: false,
        });
      });
    }
    // Khóa/Mở khóa
    if (
      toolbarList.indexOf(ToolbarItem.LOCK_WORK) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.LOCK) > -1)
    ) {
      this._translateService.get("BUTTONS.LOCK_WORK").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-lock",
          iconColorClass: "btn-yellow",
          id: ToolbarItem.LOCK_WORK,
          isDisable: false,
        });
      });
    }

    // Đóng
    if (toolbarList.indexOf(ToolbarItem.CLOSE) > -1) {
      this._translateService.get("BUTTONS.CLOSE").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-times-circle",
          iconColorClass: "btn-red",
          id: ToolbarItem.CLOSE,
          isDisable: false,
        });
      });
    }

    // Hủy
    if (toolbarList.indexOf(ToolbarItem.CANCEL) > -1) {
      this._translateService.get("BUTTONS.CANCEL").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-window-close-o",
          iconColorClass: "btn-red",
          id: ToolbarItem.CANCEL,
          isDisable: false,
        });
      });
    }
    // Đồng bộ
    if (
      toolbarList.indexOf(ToolbarItem.SYNC) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.SYNC) > -1)
    ) {
      this._translateService.get("BUTTONS.SYNC").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-cloud",
          iconColorClass: "btn-cloud",
          id: ToolbarItem.SYNC,
          isDisable: false,
        });
      });
    }
    // cập nhật trạng thái ứng viên

    if (
      toolbarList.indexOf(ToolbarItem.UPDATESTATUSCV) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.UPDATESTATUSCV) > -1)
    ) {
      this._translateService.get("BUTTONS.UPDATESTATUSCV").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-cloud",
          iconColorClass: "btn-cloud",
          id: ToolbarItem.UPDATESTATUSCV,
          isDisable: false,
        });
      });
    }
    // Di chuyển cây
    if (
      toolbarList.indexOf(ToolbarItem.MOVETREE) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.MOVETREE) > -1)
    ) {
      this._translateService.get("BUTTONS.MOVETREE").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-arrows-alt",
          iconColorClass: "btn-orange",
          id: ToolbarItem.MOVETREE,
          isDisable: false,
        });
      });
    }
    // Xuất bán
    if (
      toolbarList.indexOf(ToolbarItem.EXPORT_SALE) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.EXPORT_SALE) > -1)
    ) {
      this._translateService.get("BUTTONS.EXPORT_SALE").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-certificate",
          iconColorClass: "btn-orange",
          id: ToolbarItem.EXPORT_SALE,
          isDisable: false,
        });
      });
    }
    // Quyết toán
    if (
      toolbarList.indexOf(ToolbarItem.SETTLEMENT) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.SETTLEMENT) > -1)
    ) {
      this._translateService.get("BUTTONS.SETTLEMENT").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-calculator",
          iconColorClass: "btn-orange",
          id: ToolbarItem.SETTLEMENT,
          isDisable: false,
        });
      });
    }
    if (
      toolbarList.indexOf(ToolbarItem.SENDMAIL) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.SENDMAIL) > -1)
    ) {
      this._translateService.get("BUTTONS.SENDMAIL").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-envelope",
          iconColorClass: "btn-orange",
          id: ToolbarItem.SENDMAIL,
          isDisable: false,
        });
      });
    }
    // Khung năng lực
    if (
      toolbarList.indexOf(ToolbarItem.CREATECOMPENTENCY) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.CREATECOMPENTENCY) > -1)
    ) {
      this._translateService.get("BUTTONS.CREATECOMPENTENCY").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-plus",
          iconColorClass: "btn-orange",
          id: ToolbarItem.CREATECOMPENTENCY,
          isDisable: false,
        });
      });
    }
    if (
      toolbarList.indexOf(ToolbarItem.SEND) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.SEND) > -1)
    ) {
      this._translateService.get("BUTTONS.SEND").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-edit",
          iconColorClass: "btn-orange",
          id: ToolbarItem.SEND,
          isDisable: false,
        });
      });
    }
    if (
      toolbarList.indexOf(ToolbarItem.CACULATECOMPENTENCY) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.CACULATECOMPENTENCY) > -1)
    ) {
      this._translateService.get("BUTTONS.CACULATECOMPENTENCY").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "fa-calculator",
          iconColorClass: "btn-orange",
          id: ToolbarItem.CACULATECOMPENTENCY,
          isDisable: false,
        });
      });
    }
    // Xuất bán
    if (
      toolbarList.indexOf(ToolbarItem.REGISTER) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.REGISTER) > -1)
    ) {
      this._translateService.get("BUTTONS.REGISTER").subscribe((data) => {
        toolbar_item.push({
          text: "Đăng ký",
          tooltipText: "Đăng ký",
          prefixIcon: "fa-edit",
          id: ToolbarItem.REGISTER,
          isDisable: false,
          no_role: true,
        });
      });
    }
    // tông hợp công
    if (
      toolbarList.indexOf(ToolbarItem.SUM_WORK) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.SUM_WORK) > -1)
    ) {
      this._translateService.get("BUTTONS.SUM_WORK").subscribe((data) => {
        toolbar_item.push({
          text: "Tổng hợp",
          tooltipText: "Tổng hợp",
          prefixIcon: "fa-edit",
          id: ToolbarItem.SUM_WORK,
          isDisable: false,
          no_role: true,
        });
      });
    }
    // tông hợp công
    if (
      toolbarList.indexOf(ToolbarItem.PAYROLL_CAL) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.PAYROLL_CAL) > -1)
    ) {
      this._translateService.get("BUTTONS.PAYROLL_CAL").subscribe((data) => {
        toolbar_item.push({
          text: "Tính lương",
          tooltipText: "Tính lương",
          prefixIcon: "fa-edit",
          id: ToolbarItem.PAYROLL_CAL,
          isDisable: false,
          no_role: true,
        });
      });
    }
    // Delete
    if (
      toolbarList.indexOf(ToolbarItem.DELETE) > -1 &&
      (this.isAdmin || permission_check.indexOf(ToolbarItem.DELETE) > -1)
    ) {
      this._translateService.get("BUTTONS.DELETE").subscribe((data) => {
        toolbar_item.push({
          text: data,
          tooltipText: data,
          prefixIcon: "feather-trash-2",
          iconColorClass: "btn-red",
          id: ToolbarItem.DELETE,
          align: "right",
          isDisable: false,
        });
      });
    }



    // Custom toolbar
    if (extraParams && extraParams.length > 0) {
      for (let i = 0; i < extraParams.length; i++) {
        if (extraParams[i].no_role) {
          this._translateService
            .get("BUTTONS." + extraParams[i].id.toString().toUpperCase())
            .subscribe((data) => {
              toolbar_item.push({
                text: data,
                tooltipText: data,
                prefixIcon: extraParams[i].icon,
                iconColorClass: extraParams[i].iconColorClass,
                id: extraParams[i].id.toString(),
                isDisable: false,
              });
            });
        } else {
          if (permission_check.indexOf(extraParams[i].id) > -1) {
            this._translateService
              .get("BUTTONS." + extraParams[i].id.toString().toUpperCase())
              .subscribe((data) => {
                toolbar_item.push({
                  text: data,
                  tooltipText: data,
                  prefixIcon: extraParams[i].icon,
                  iconColorClass: extraParams[i].iconColorClass,
                  id: extraParams[i].id.toString(),
                  isDisable: false,
                });
              });
          }
        }


      }
    }

    return toolbar_item;
  };

  // Get User Info
  getUserInfo = () => {
    const userInfo = {
      username: localStorage.getItem("username"),
      fullname: localStorage.getItem("fullname"),
      avatar: localStorage.getItem("avatar"),
    };
    return userInfo;
  };

  // Replace date
  replaceDate = (date: string): string => {
    date = date.toLowerCase();
    var patt = new RegExp(
      "q|w|e|r|t|y|u|i|o|p|a|s|d|f|g|h|j|k|l|z|x|c|v|b|n|m"
    );
    let returnDate = "";
    if (
      date.indexOf("-") === -1 &&
      date.indexOf("/") === -1 &&
      patt.test(date) === false
    ) {
      let day: any;
      let month: any;
      let year: any;
      if (date.length === 8) {
        day = date.substr(0, 2);
        month = date.substr(2, 2);
        year = date.substr(4, 4);
      } else if (date.length === 6) {
        day = date.substr(0, 2);
        month = date.substr(2, 2);
        year = date.substr(4, 2);
        if (parseInt(year, 0) < 50) {
          year = parseInt("20" + year, 0);
        } else {
          year = parseInt("19" + year, 0);
        }
      }

      if (parseInt(day, 0) > 31) {
        day = 30;
      }

      if (parseInt(month, 0) > 12) {
        month = 12;
      }
      if (parseInt(year, 0) > 3000) {
        year = 2020;
      }
      returnDate = day + "/" + month + "/" + year;
    } else if (
      date.indexOf("/") > -1 &&
      patt.test(date) === false &&
      date.length === 8
    ) {
      let day: any;
      let month: any;
      let year: any;
      if (date.length === 8) {
        day = date.substr(0, 2);
        month = date.substr(3, 2);
        year = date.substr(6, 2);
      }

      if (parseInt(day, 0) > 31) {
        day = 30;
      }

      if (parseInt(month, 0) > 12) {
        month = 12;
      }
      if (parseInt(year, 0) > 50) {
        year = parseInt("19" + year);
      } else {
        year = parseInt("20" + year);
      }
      returnDate = day + "/" + month + "/" + year;
    } else {
      returnDate = date;
    }
    return returnDate;
  };

  // check website
  checkUrl = (url: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + //port
      "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return pattern.test(url);
  };
  // check khoản trăng giữa các từ sai định dạng
  public checkExistSpace(control: FormControl) {
    if (control.value) {
      const NoWhiteSpace = control.value.indexOf(" ");
      if (NoWhiteSpace > -1) {
        return { incorrect: true };
      }
    }
    return null;
  }
  public checkEmpty(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { required: true };
  }
  // Check  SDT
  checkPhone = (control: any) => {
    let Valid = null;
    if (control.value) {
      if (control.value !== undefined && control.value.length === 10) {
        const match = control.value.match(/0[1-9]{1,}[0-9]{8,}/);
        if (!match) {
          Valid = { incorrect: true };
        }
      } else if (control.value !== undefined && control.value.length === 11) {
        const match = control.value.match(/0[1-9]{1,}[0-9]{9,}/);
        if (!match) {
          Valid = { incorrect: true };
        }
      } else {
        Valid = { incorrect: true };
      }
    }
    return Valid;
  };

  // validate mã số thuế
  checkMST = (mst: any[]) => {
    // Nếu không đủ 10 số return false
    if (!mst || (mst && mst.length !== 10 && mst.length !== 14)) {
      return false;
    }
    // Kiểm tra logic
    let mst_check =
      Number(mst[0] * 31) +
      Number(mst[1] * 29) +
      Number(mst[2] * 23) +
      Number(mst[3] * 19) +
      Number(mst[4] * 17) +
      Number(mst[5] * 13) +
      Number(mst[6] * 7) +
      Number(mst[7] * 5) +
      Number(mst[8] * 3);
    // kiểm tra số thứ tự 11 12 13 ko phải là số
    if (
      Number.isInteger(Number([mst[11]])) === false ||
      Number.isInteger(Number([mst[12]])) === false ||
      Number.isInteger(Number([mst[13]])) === false
    ) {
      return false;
    }
    if (mst[10] && mst[10] !== "-") {
      return false;
    }
    if (10 - (mst_check % 11) === Number(mst[9])) {
      return true;
    } else {
      return false;
    }
  };

  public customValidatorFn: (args: {
    [key: string]: string;
  }) => boolean = (args: { [key: string]: string }) => {
    if (args && args['value']) {
      const element: any = args['element'];
      if (element.className.indexOf("e-numeric-hidden") > -1) {
        return args['value'].length > 0 && parseInt(args['value'], 0) >= 0;
      } else if (
        element.className.indexOf("e-input") > -1 &&
        element.className.indexOf("e-defaultcell") > -1
      ) {
        return args['value'].length > 0;
      } else if (element.className.indexOf("e-ddl-hidden") > -1) {
        return args['value'].length > 0;
      } else if (element.className.indexOf("e-datepicker") > -1) {
        return args['value'].length > 0;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  public ageRangeValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (control.value !== undefined) {
      return { ageRange: true };
    }
    return null;
  }
  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { required: true };
  }
}
