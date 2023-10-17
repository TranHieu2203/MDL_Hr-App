
export class Terminals {
  id?: number | null;
  code?: string | null;
  name?: string | null;
  timePulldataEnd?: Date | null;
  record?: number | null;
  isCalculate?: boolean | null;
  ip?: string | null;
  port?: string | null;
  location?: string | null;
  note?: string | null;
  isActive?: boolean | null;
  orders?: number | null;
  constructor() {
    this.isActive = true;
    this.isCalculate = false;
  }
}
