export class InsInformation {
  id?: number;
  employeeId?: number;
  employeeName?: string;
  employeeCode?: string;
  orgName?: string;
  positionName?: string;

  bhxhNo?: string;
  bhxhDate?: Date;
  bhxhPlace?: string;
  bhxhStatusId?: number;
  
  bhxhNote?: string;
  bhytNo?: string;
  bhytEffectDate?: Date;
  bhytExpireDate?: Date;
  placeRegisId?: number;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  bhtnldBnnEffectDate?: Date;
  bhtnldBnnExpireDate?: Date;
  isBhxh?:boolean;
  isBhyt?:boolean;
  isBhtn?:boolean;
  isBhtnldBnn?:boolean;
  salaryBhxh?:number;
  salaryBhtn?:number;
  totalTimeInsBefore?:number;
  bhtnEffectDate?: Date;
  bhtnExpireDate?: Date;
}