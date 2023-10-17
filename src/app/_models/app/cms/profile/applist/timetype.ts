export class TimeType {
  id?: number;
  code?: string;
  name?: string;
  morningId?: number;
  afternoonId?: number;
  isOff?: boolean;
  note?: string;
  orders?: any;
  isActive?: boolean;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  constructor() {
    this.isOff = false;
  }
}
