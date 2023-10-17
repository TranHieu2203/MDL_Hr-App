export class RecruitmentPlan {
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
  positionConcurentId?: number |null;
  positionConName?: string;
  orgParentName?: string;
  orgConParentName?: string;
  decisionNo?: string;
  effectDate?: Date;
  expireDate?: Date;
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
  reasonId?:number;
  hienco?:number;
  dinhbien?:number;
  tanggiam?:number;
  reasonDetail?:string;
  hocvanId?:number;
  tuoiFrom?:number;
  tuoiTo?:number;
  kynang?:string;
  diemNgoaiNgu?:number;
  sonamKn?:number;
  soluong?:number;
  chuyenmonId?:number;
  ngoainguId?:number;
  tdNgoaiNguId?:number;
  tinhocId?:number;
  mota?:string;
  nvchinh?:string;
  yckinhnghiem?:string;
  yckhac?:string;
  bdtuyenDate?: Date;
  giahan?:Date;
  nguondtId?: number;
  donviId?: number;
  chiphi?:number;
  total?:number;
}