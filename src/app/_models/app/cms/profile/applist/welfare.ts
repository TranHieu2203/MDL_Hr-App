export class Welfare {
  id?: number;
  code?: string;
  name?: string;
  monney?: number;
  seniority?: number; // thâm niên tháng
  seniorityTo?: number;
  ageFrom?: number;
  ageTo?: number;
  dateStart?: Date; // Ngày hiệu lực
  dateEnd?: Date; // Ngày hết hiệu lực
  isActive?: boolean;
  note?: string;
  tenantId?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  contractTypes: Array<Number>;
  genders: Array<Number>;
    constructor() {
    this.contractTypes = [];
    this.genders = [];
  }
}
