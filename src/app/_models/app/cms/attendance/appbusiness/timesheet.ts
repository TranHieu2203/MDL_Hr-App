export class TimeSheet {
  yearId?: number;
  periodId?: number;
  orgId?: number;
  dateStart?: any;
  dateEnd?: any;
  isLock?: any;
  isQuit?: any;
  typeId?: any;
}
export class TimeSheetFormula {
  id?: any;
  colName?: string;
  formulaName?: string;
  working?: string;
  orders?: number;
  elements?: string;
  constructor() {
    this.formulaName = "";
  }
}
export class TimeSheetDetail {
  employeeId?: number;
  employeeCode?: string;
  employeeName?: string;
  positionName?: string;
  periodId?: any;
  dateStart?: any;
  dateEnd?: any;
  timeTypeId?: number;
  timeTypeCode?: string;
}
export class TimeSheetRoot {
  ID?: number;
  EMPLOYEE_CODE?: string;
  EMPLOYEE_NAME?: string;
  TIME_EDIT?: string;
  WORKINGDAY?:string;
  NOTE?: string;
  TYPE_EDIT?: string;
}

