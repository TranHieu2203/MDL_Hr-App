export class AllowanceEmployee {
  id?: number;
  employeeId?: number;
  employeeName?: string;
  allowanceId?: number;
  monney?: number;
  dateStart?: Date;
  dateEnd?: Date;
  isActive?: boolean;
  note?: string;
  tenantId?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  emps?: Array<any>;
  constructor() {
    this.emps = [];
  }
  
}
