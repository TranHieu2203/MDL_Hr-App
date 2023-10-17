export class SalaryElement {
  id?: number;
  code?: string;
  name?: string;
  groupId?: number;
  isSystem?: boolean;
  isActive?: boolean;
  orders?: number;
  dataType?: number; // 0: Kiểu số; 1 kiểu TEXT
  constructor() {
    this.isSystem = true;
    this.isActive = true;
    this.dataType = 0 ;
  }
}
