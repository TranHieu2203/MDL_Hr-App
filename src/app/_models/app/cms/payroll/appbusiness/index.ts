export * from "./calculatepayroll";
export * from "./advance";
export * from "./competence";
export * from "./leveldetails";
export * from "./jobevaluation";
export * from "./jedtl";
export * from "./exchangelist";
export * from "./unitprice";

export class KpiEmployee {
  yearId?: number;
  periodId?: number;
  orgId?: number;
  typeId?: number;
  employeeId?: number;
  kpiTargetId?: number;
  realValue?: number;
  startValue?: number;
  equalValue?: number;
  kpiSalary?: number;
  isPaySalary?: boolean;
  note?: string;
  isLock?: boolean;
}
