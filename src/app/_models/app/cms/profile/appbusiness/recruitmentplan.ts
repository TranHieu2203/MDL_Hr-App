export class RecruitmentPlan {
  id?: number;
  employeeCode?: string; //mã nhân viên 
  employeeId?: number; //Id Nhân viên
  employeeName?: string;
  positionId?: number | null; //chức danh
  positionName?: any;
  orgId?: number;
  orgName?: string;
  isKh?: boolean;
  sendDate?: Date;
  reasonId?: number;
  reasonName?: string;
  hienCo?: number;
  dinhBien?: number;
  tangGiam?: number;
  reasonDetail?: string;
  hocVanId?: number;
  hocVanName?: string;
  tuoiFrom?: number;
  tuoiTo?: number;
  chuyenMonId?: number;
  chuyenMonName?: string;

  kyNang?: string;
  ngoaiNgu?: string;
  trinhDoNnId?: number;
  trinhDoNnName?: string;
  diemNgoaiNgu?: number;
  expireDate?: Date;
  soNamKn?: number;
  tinHocId?: number;
  tinHocName?: string;
  soLuong?: number;
  moTa?: string;
  nvChinh?: string;
  ycKinhNghiem?: string;
  ycKhac?: string;
  note?: string;
  bdTuyenDate?: Date;

  ktDate?: Date;
  tgghDate?: Date;
  statusId?: number;
  statusName?: string;
  nguonDtId?: number;
  nguonDtName?: string;
  donViId?: number;
  donViName?: string;
  chiPhi?: number;
  total?: number;
  nguonDt?: [];
}