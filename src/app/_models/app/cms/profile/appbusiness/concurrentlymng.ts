export class ConcurrentlyMng {
  id?: number;
  employeeCode?: string; //mã nhân viên 
  employeeId?: number; //Id Nhân viên
  employeeName?: string;
  positionId?: number |null; //chức danh
  positionName?: any;
  orgId?: number;
  orgName?: string;
  orgConId?: number;
  orgConName?: string;
  positionConId?: number |null;
  positionConName?: string;
  orgParentName?: string;
  orgConParentName?: string;
  decisionNo?: string;
  effectDate?: Date;
  expireDate?: Date;
  fromDate?: Date;
  toDate?: Date;
  endDateAllow?: Date;
  startDateAllow?: Date;
  moneyAllow?: number;
  isAllow?: boolean;
  isNewEmp?: boolean;
  signId?: number; //Người ký
  signName?: string; //Tên người ký
  signTitle?: string;
  signDate?: Date; //Ngày ký
  note?: string;
  statusId?: number;

}