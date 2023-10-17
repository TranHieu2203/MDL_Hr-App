export * from "./elementgroup";
export * from "./salaryelement";
export * from "./salarystructure";
export * from "./paycheck";

export class KpiGroup {
  id?: number;
  name?: string;
  orders?: number;
  isActive?: boolean;
  note?: string;
}
export class KpiTarget {
  id?: number;
  code?: string;
  name?: string;
  kpiGroupId?: number;
  unit?: string;
  maxValue?: number;
  isRealValue?: any = false;
  isPaySalary?: boolean = false;
  isImportKpi?: boolean = false;
  isActive?: boolean;
  orders?: number;
  note?: string;
  typeId?:any;
  colName?:string;
  colId?:number;
}
export class KpiFormula {
  id?: number;
  formula?: string;
  colName?: string;
  isActive?: boolean;
  orders?: number;
  note?: string;
  index?: number;
}

export class ListMachine {
  id?: number;
  code?: string;
  name?: string;
  unit_Price?: number;
}
export class ListProduct {
  id?: number;
  code?: string;
  cd?: number;
  machine_Code?: string;
  name?: string;
  cr?: number;
  dd?: number;
  kd?: number;
  lt?: number;
  qd?: number;
  kdk?: number;
  kdd?: number;
  kkd?: number;
  kbm?: number;
  kyc?: number;
  unit_Price?: number;
  unit_Price_L1?: number;
}
