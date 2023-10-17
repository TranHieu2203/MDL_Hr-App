export class User {
  id?: string;
  groupId?: number;
  code?:string;
  userName?: string;
  fullName?: string;
  employeeId?: any;
  employeeCode?: string;
  employeeName?: string;
  groupName?: string;
  email?: string;
  avatar?: string;
  password?: string;
  rePassword?: string;
  lock?: boolean = false;
  isWebapp?: boolean = false;
  isPortal?: boolean = false;
  fmcToken?: string;
}
