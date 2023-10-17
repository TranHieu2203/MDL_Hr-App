export class Tenant {
  id?: number;
  code?: string; // Địa chỉ truy cập
  tenancyName?: string;
  ownerName?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  areaId?:number;
  connectionString?: string;
  userRefName?: string;
  dateExpire?: Date;
  userRef?: string;
  isActive?: boolean;
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  userName?: string;
  password?: string;
  passwordConfirm?: string;
  packageId?: number;
  codeEmp?:string;
}
