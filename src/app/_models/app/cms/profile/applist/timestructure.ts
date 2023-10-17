export class TimeStructure {
  id?: number;
  code?: string;
  name?: string;
  hoursStart?: Date;
  hoursStop?: Date;
  breaksForm?: Date;
  breaksTo?: Date;
  timeTypeId?: number;
  timeTypeName?: string;
  morningId?: any;
  afternoonId?: any;
  orders?: any;
  isNoon?: boolean;
  note?: string;
  isActive?: boolean;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
}
