export class Campaign {
  id?: number;
  code?: string; 
  name?: string;
  planId?: number; 
  planName?: string;
  status?: number; 
  statusName?: string;
  deadlineId?: number; 
  deadlineName?: string;
  chiPhiDk?: number; 
  ptId?: number; 
  ptName?: string;
  orgId?: number; 
  orgName?: string;
  positionId?: number; 
  positionName?: string;
  chucVu?: string;
  hinhthucId?: number; 
  hinhthucName?: string;
  placeId?: number; 
  placeName?: string;
  salaryFrom?: number; 
  salaryTo?: number; 
  jd?:string;
  mauId?: number; 
  mauName?: string;
  nguonDt?: [];
  nguonDtId?: number;
  nguonDtName?: string;
  chiPhi?: number;
  endDateTT?:Date;
  endDate?:Date;
  soLuongTuyen?:number;
  soLuongHienCo?:number;
  soLuongDinhBien?:number;
}