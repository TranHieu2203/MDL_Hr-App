import { Injectable, NgZone } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import {
  ToastyService,
  ToastyConfig,
  ToastOptions,
  ToastData,
} from "ng2-toasty";

export enum NotificationType {
  INFO,
  SUCCESS,
  WARNING,
  DANGER,
}

@Injectable()
export class Notification {
  constructor(
    private translate: TranslateService,
    private zone: NgZone,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig
  ) {
    this.toastyConfig.theme = "bootstrap";
    this.toastyConfig.position = "bottom-right";
  }

  editSuccess = () => {
    this.success("notify.EDIT_SUCCESS");
  };
  editError = (err?: any) => {
    if (!err) {
      this.error("notify.SERVER_ERROR");
    } else if (typeof err === "string") {
      this.error(err, "notify.EDIT_ERROR");
    } else if (typeof err === "object") {
      this.error("errors." + err.message, "notify.EDIT_ERROR");
    } else {
      this.error("notify.EDIT_ERROR");
    }
  };
  addSuccess = () => {
    this.success("notify.ADD_SUCCESS");
  };
  approvedSuccess = () => {
    this.success("notify.APPROVED_SUCCESS");
  };
  deniedSuccess = () => {
    this.success("notify.DENIED_SUCCESS");
  };
  addSuccessPopup = () => {
    this.success("Lưu dữ liệu thành công");
  };
  addError = (err?: any) => {
    if (!err) {
      this.error("notify.SERVER_ERROR");
    } else if (typeof err === "string") {
      this.error(err, "notify.ADD_ERROR");
    } else if (typeof err === "object") {
      this.error("errors." + err.message, "notify.ADD_ERROR");
    } else {
      this.error("notify.ADD_ERROR");
    }
  };
  lockSuccess = () => {
    this.success("Khóa/Mở khóa thành công");
  };
  lockError = () => {
    this.warning("Khóa/Mở khóa thất bại");
  };
  noRecordSelect = () => {
    this.warning("notify.NO_RECORD_SELECT");
  };
  deleteSuccess = () => {
    this.success("notify.DELETE_SUCCESS");
  };
  deleteError = (err?: any) => {
    if (!err) {
      this.error("notify.SERVER_ERROR");
    } else if (typeof err === "string") {
      this.error(err, "notify.DELETE_ERROR");
    } else if (typeof err === "object") {
      this.error("errors." + err.message, "notify.DELETE_ERROR");
    } else {
      this.error("notify.DELETE_ERROR");
    }
  };
  formInvalid = () => {
    this.warning("Form chưa hợp lệ");
  };
  info = (message: string) => {
    this.translate.get(message).subscribe((data) => {
      this.show(NotificationType.INFO, data);
    });
  };
  warning = (message: string) => {
    this.translate.get(message).subscribe((data) => {
      this.show(NotificationType.WARNING, data);
    });
  };
  success = (message: string) => {
    this.translate.get(message).subscribe((data) => {
      this.show(NotificationType.SUCCESS, data);
    });
  };
  error = (err: any, title?: string, messageDefault?: string) => {
    let message = err || "notify.SERVER_ERROR";
    if (typeof err === "object" && err) {
      message = "errors." + err.message;
    }
    if (!messageDefault) {
      messageDefault = "notify.ERROR_UNDEFINED";
    }
    this.translate
      .get([message, messageDefault || ""])
      .subscribe((data: any) => {
        if (message === data[message] && messageDefault) {
          this.show(NotificationType.DANGER, data[messageDefault]);
        } else {
          this.show(NotificationType.DANGER, data[message]);
        }
      });
  };
  show = (notiType: NotificationType, message: string, title?: string) => {
    const types = ["info", "success", "warning", "danger"];
    const type: string = types[notiType];
    const toastOptions: ToastOptions = {
      title: "Thông báo",
      msg: message,
      showClose: true,
      timeout: 5000,
      theme: "bootstrap",
      onAdd: (toast: ToastData) => { },
    };
    this.zone.run(() => {
      if (type === "info") {
        this.toastyService.info(toastOptions);
      } else if (type === "success") {
        this.toastyService.success(toastOptions);
      } else if (type === "warning") {
        this.toastyService.warning(toastOptions);
      } else if (type === "danger") {
        this.toastyService.error(toastOptions);
      }
    });
  };
  checkErrorMessage(m: string) {
    switch (m) {
      case "TIME_SHEET_LOCKED":
        this.warning("notify.TIME_SHEET_LOCKED");
        break;
      case "INVALID_FORMULA":
        this.warning("notify.INVALID_FORMULA");
        break;
      case "TIME_SHEET_UNLOCKED":
        this.warning("notify.TIME_SHEET_UNLOCKED");
        break;
      case "DATA_EXIST":
        this.warning("notify.DATA_EXIST");
        break;
      case "CODE_EXISTS":
        this.warning("notify.CODE_EXISTS");
        break;
      case "CODE_EXIST":
        this.warning("notify.CODE_EXISTS");
        break;
      case "CODE_EXIST":
        this.warning("notify.CODE_EXISTS");
        break;
      case "APPROVED":
        this.warning("notify.APPROVED");
        break;
      case "DENIED":
        this.warning("notify.DENIED");
        break;
      case "ERROR_PASSWORD_INCORRECT":
        this.warning("Sai mật khẩu");
        break;
      case "ERROR_USERNAME_INCORRECT":
        this.warning("Sai tên đang nhập");
        break;
      case "STARTDATE_NOT_LESS_CURRENT":
        this.warning(
          "Ngày bắt đầu hợp đồng mới phái lớn hơn ngày hết hạn hợp đồng cũ"
        );
        break;
      case "EXIST_HDLD_KXDTH":
        this.warning("[Nhân viên đã ký HĐLĐ không xác định thời hạn]");
        break;
      case "TERMINATE":
        this.warning("[Nhân viên đã nghỉ việc]");
        break;
      case "ERROR_TENANT_DATE_EXPIRE":
        this.warning("Tài khoản hết hạn");
        break;
      case "RECORD_IS_APPROVED":
        this.warning("Đã phê duyệt");
        break;
      case "EFFECTDATE_NOT_LESS_CURRENT":
        this.warning("Ngày bắt dầu phải lớn hơn ngày bắt quyết định gần nhất");
        break;
      case "RECORD_EXISTS":
        this.warning("Bản ghi đã tồn tại");
        break;
      case "EMPLOYEE_HAVE_ACCOUNT":
        this.warning("Nhân viên đã có tài khoản");
        break;
      case "NOT_PERMISSION_IN_WEBAPP":
        this.warning("Không có quyền đăng nhập Web App");
        break;
      case "NOT_WORK_SIGN":
        this.warning("Chưa xếp ca làm việc");
        break;
      case "DATA_IS_EXISTS":
        this.warning("Dữ liệu đã tồn tại");
        break;
      case "DATA_IS_USED":
        this.warning("Dữ liệu đã được sử dụng");
        break;
      case "CONTRACT_EXITS":
        this.warning("Nhân viên đã được tạo hợp đồng");
        break;
      case "DECITION_EXITS":
        this.warning("Nhân viên đã được tạo quyết định");
        break;
      default:
        break;
    }
  }
}
