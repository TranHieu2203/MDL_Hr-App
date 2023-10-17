export class SysPackage {
  id?: number;
  applicationId?: number;
  name?: string;
  code?: string;
  note?: string;
  orders?: number;
  price?: number;
  trialPeriod?: number; // dùng thử
  isActive?: boolean;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  moduleIds: Array<any>;
  constructor() {
    this.moduleIds = [];
  }
}
export class PackageModule {
  id?: number;
  packageId?: number;
  moduleId?: number;
  isActive?: boolean;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
}
