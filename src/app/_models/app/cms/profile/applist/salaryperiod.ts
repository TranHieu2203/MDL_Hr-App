export class SalaryPeriod {
  id?: number;
  name?: string;
  year?: number;
  month?: number;
  dateStart?: Date;
  dateEnd?: Date;
  standardWorking?: number;
  standardTime?: number;
  note?: string;
  isActive?: boolean;
}

export class SalaryPeriodDtl {
  id?: number;
  orgId?: string;
  empId?: number;
  standardWorking?: number;
}
