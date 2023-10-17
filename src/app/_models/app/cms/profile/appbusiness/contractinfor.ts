export class ContractInfor {
  id?: number;
  employeeCode?: string; //mã nhân viên
  employeeId?: number; //Id Nhân viên
  employeeName?: string;
  positionId?: number; //chức danh
  positionName?: any;
  orgId?: number;
  orgName?: string;
  orgParentName?: string;
  contractTypeId?: number; //Loại hợp đồng
  contractNo?: string;
  startDate?: Date;
  expireDate?: Date | null;
  fromDate?: Date;
  toDate?: Date;

  signId?: number; //Người ký
  signerName?: string; //Tên người ký
  signerPosition?: string;
  signDate?: Date; //Ngày ký
  note?: string;
  statusId?: number;

  workingId?: number; //Quyết định
  workingNo?: string; //Quyết định

  salBasic?: any;
  salPercent?: any;
  stateId?: number;
  stateName?: string;
  periodMonth?:number;
}
export class SalaryInfo {
  salaryType?: string;
  salaryScale?: string;
  salaryRank?: string;

  salaryLevel?: string;
  salBasic?: string;
  salPercent?: any;
  salTotal?: string;
  salaryP2?: string; //Thưởng HQCV(p2)
  salaryP3?: string; // Thưởng SP-DV(p3)
  salaryIns?: string; // Lương đóng BH
  salaryKpi?: string; // lương KPI
  salaryRankName?: string;
  salaryScaleName?: string;
  salaryLevelName?: string;
  salaryTypeName?: string;
  workingNo?: string;
}
export class ParamGenCode{
  TypeId?: number;
  DecisionType?: number;
  dEffectDate?: string;
  EmployeeId?:number;
}