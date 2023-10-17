export class SalaryStructure {
  // cau truc bang luong
  id?: number;
  salaryTypeId?: number;
  elementId?: number;
  groupId?: any;
  areaId?: number;
  isVisible?: boolean;
  isCalculate?: boolean;
  isImport?: boolean;
  orders?: number;
  createBy?: string;
  updatedBy?: string;
  constructor() {
    this.isVisible = false;
    this.isCalculate = false;
    this.isImport = false;
  }
}
