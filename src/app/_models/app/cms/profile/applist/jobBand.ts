export class JobBand {
  id?: number;
  nameVN?: string;
  nameEN?: string;
  levelFrom?: string;
  status?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
}
export class Job {
  id?: number;
  typeId?: number;
  nameVN?: string;
  nameEN?: string;
  code?: string;
  isActive?: boolean;
  note?: string;
  request?: string;
  purpose?: string;
  jobFamilyID?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
}
export class JobFunction {
  id?: number;
  jobID!: number;
  name?: string;
  nameEN?: string;
  parentID?: number;
  functionID?: number;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: Date;
  modifedDate?: Date;
}
