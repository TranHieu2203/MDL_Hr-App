export class Employee {
  id?: number;

  code?: string;
  fullname?: string;
  lastName?: string;
  firstName?: string;
  avatar?: string;
  reason?: string;
  contractCode?: string; // ma hop dong
  classifyName?: string;
  contractDateEffect?: Date;
  contractDateExpire?: Date;
  //   sơ yếu lý lịch
  image?: string;
  orgId?: number;
  orgName?: string;
  orgManager?: string;
  positionId?: number; //chức danh
  positionName?: number; //chức danh
  staffRankId?: number; //Cấp bậc
  experienceId?: number;
  staffRankName?: string; //Tên cấp bậc
  directManagerId?: number; // Quản lý trực tiếp
  directManagerTitleName?: string; // Vị trí quản lý trực tiếp
  directManagerName?: string; // Tên quản lý trực tiếp
  genderId?: number;
  birthDate?: Date;
  idNo?: string; //CMND
  idDate?: Date; //Ngày cấp
  idPlace?: string; //Nơi cấp
  religionId?: number; //Tôn giáo
  insRegionId?:number;
  nativeId?: number; // Dân tộc
  nationalityId?: number; //Quốc tịch
  address?: string; //Địa chỉ
  curAddress?: string; //Địa chỉ hiện tại
  birthPlace?: string; //Nơi sinh
  joinDate?: Date;
  joinDateState?: Date;
  fromDate?: Date;
  toDate?: Date;
  workStatusId?: number;
  homeAddress?: string; //Địa chỉ
  homeProvinceId?: number;
  homeDistrictId?: number;
  homeWardId?: number;
  provinceId?: number;
  districtId?: number;
  wardId?: number;
  curProvinceId?: number;
  curDistrictId?: number;
  curWardId?: number;
  placeId?: number;
  placeName?: string;
  //Thông tin hợp đồng
  contractId?: number; //Loại hợp đồng
  lastWorkingId?: number; //Quyết định mới nhất
  terEffectDate?: Date; //Ngày nghị việc
  itimeCode?: string; //Mã chấm công
  objectSalaryId?: number; //Bảng lương
  taxCode?: string; //Mã số thuế cá nhân
  //Thông tin phụ
  mobilePhone?: string;
  workEmail?: string;
  email?: string;
  maritalStatusId?: number; //Tình trạng hôn nhân
  passNo?: string; //Số hộ chiếu
  passDate?: Date;
  passExpire?: Date;
  passPlace?: string;
  visaNo?: string; //Số visa
  visaDate?: Date;
  visaExpire?: Date;
  visaPlace?: string;
  workPermit?: string; //Giấy phép lao động
  workPermitDate?: Date;
  workPermitExpire?: Date;
  workPermitPlace?: string;
  workNo?: string;
  workDate?: Date;
  workPlace?: string;
  workScope?: string;



  contactPer?: string; //Người liên hệ khi cần
  contactPerPhone?: string;
  //Tài khoản
  bankId?: number; //Ngân hàng
  // bankBranchId?: number; 
  bankBranch?: number; //Chi nhánh Ngân hàng
  bankNo?: string; //Số tài khoản
  //Trình độ
  schoolId?: number; //Tên trường
  qualificationId?: number; //Trình độ chuyên môn
  trainingFormId?: number; //Hình thức đào tạo
  learningLevelId?: number; //Trình độ học vấn
  language?: any; //Ngoại ngữ
  languageMark?: any; //Điểm số xếp loại
  createBy?: string;
  updatedBy?: string;
  createDate?: Date;
  updatedDate?: Date;
  residentId?:number;
  salTotal?: number;
  titleName?: string;
  groupTitleName?: string;
  year?: number;
  certificateOther?:string;
  idNoOld?:string;
  seniorityText?:string;
  saveIdNo?:number;
  isTechcombank?:boolean;
  constructor() {
    this.firstName = "";
    this.lastName = "";
  }
}
export class Situation {
  id?: number;
  relationshipId?: number;
  employeeId?: number;
  name?: string;
  no?: string;
  taxNo?: string;
  familyNo?: string;
  familyName?: string;
  address?: string;
  birth?: any;
  dateStart?: any;
  dateEnd?: any;
  reason?: string;
}

export class PosPage {
  id?: number;
  empId?: number;
  paperId?: number;
  url?: string;
  note?: string;
  statusId?: boolean;
  dateInput?: Date;
  file?: string;
  pageName?: string;
}
