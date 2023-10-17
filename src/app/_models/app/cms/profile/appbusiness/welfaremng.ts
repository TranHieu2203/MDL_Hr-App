export class WelfareMng {
  id?: number;
  employeeId?: number;
  welfareListId?: number;
  money?: number;
  isTax?: boolean;
  periodId?: number; //Kỳ lương tính thuế
  periodName?: string;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  year?: number;
  emps?: Array<number>;
  constructor() {
    this.emps = [];
    this.isTax = false;
  }
}
