
export class ShiftSys {
  id?: number;
  code?: string;
  name?: string;
  hoursStart?: Date;
  hoursStop?: Date;
  breaksFrom?: Date;
  breaksTo?: Date;
  timeLate?: number;
  timeEarly?: number;
  timeTypeId?: number;
  timeTypeName?: string;
  isNoon?: boolean;
  isBreak?: boolean;
  isSkip?: boolean;
  note?: string;
  areaId?:number;
  isActive?: boolean;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  constructor() {
    this.isNoon = false;
    this.isBreak = false;
    this.isSkip = false;
  }
}
