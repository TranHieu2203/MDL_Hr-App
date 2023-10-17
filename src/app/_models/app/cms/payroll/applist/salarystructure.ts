export class SalaryStructure {
  // cau truc bang luong
  id?: number;
  salaryTypeId?: number;
  elementId?: number;
  groupId?: any;
  isVisible?: boolean;
  isCalculate?: boolean;
  isImport?: boolean;
  isSum?: boolean;
  isChange?: boolean;
  orders?: number;
  constructor() {
    this.isVisible = false;
    this.isCalculate = false;
    this.isImport = false;
  }
}
