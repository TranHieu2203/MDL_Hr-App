export class Commend {
  id?: number;
  effectDate?: Date;
  no?: string;
  signDate?: Date;
  signId?: number;
  signerName?: string;
  signerPosition?: string;
  commendObjId?: number; //Đối tượng
  commendObjName?: string;
  commendObjCode?: string;
  sourceCostId?: number;
  sourceCostName?: number;
  commendType?: string;
  reason?: string;
  statusId?: number;
  statusName?: number;
  money?: number;
  isTax?: boolean;
  periodId?: number; //Kỳ lương tính thuế
  periodName?: string;
  fromDate?: Date;
  toDate?: Date;
  year?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  employeeId?: number;
  emps?: Array<number>;
  orgId?: number;
  orgName?: string;
  constructor() {
    this.emps = [];
    this.isTax = false;
  }
}
