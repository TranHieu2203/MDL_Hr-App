export class Advance {
    id?: number;
    employeeCode?: string; //mã nhân viên
    employeeId?: number; //Id Nhân viên
    employeeName?: string;
    positionId?: number; //chức danh
    positionName?: any;
    orgId?: number;
    year?: number;
    orgName?: string;
    orgParentName?: string;
    advanceDate?: Date;
    periodId?:number;
    money?: number;
    signId?: number; //Người ký
    signerName?: string; //Tên người ký
    signerPosition?: string;
    signDate?: Date; //Ngày ký
    note?: string;
    statusId?: number;
  
  }