export class LeaveJob {
  id?: number;
  employeeId?: number;
  employeeName?: string;
  employeeCode?: string;
  positionName?: string;
  positionId?: number;
  orgName?: string;
  dateStart?: Date;
  dateEnd?: Date;

  effectDate?: Date;
  sendDate?: Date;
  lastDate?: Date; // ngày làm việc cuối cùng
  terReason?: string; // lý do nghỉ việc
  signId?: number;
  signerName?: string;
  signerPosition?: string;
  signDate?: Date;
  statusId?: number;
  decisionNo?: string;
  contractNo?: string;
  amountViolations?: number; // số tiền vi phạm thời hạn báo trước
  trainingCosts?: number; // số tiền chi phí đào tạo
  otherCompensation?: number; // bồi thương khác
  terReasonId?: number;// lý do
  salary6m?: number;
  remaingLeave?: number;
  remaingLeaveMoney?: number;
  allowanceLeaveTime?: number;
  allowanceLeaveMoney?: number;
  sumFinal?: number;
}
