
export class Shift {
  id?: number | null;
  code?: string | null;
  name?: string | null;
  hoursStart?: Date | null;
  hoursStop?: Date | null;
  breaksFrom?: Date | null;
  breaksTo?: Date | null;
  timeLate?: number | null;
  timeEarly?: number | null;
  timeTypeId?: number | null;
  timeTypeName?: string | null;
  shiftIn?: Date | null;
  shiftOut?: Date | null;
  isNoon?: boolean | null;
  isBreak?: boolean | null;
  isSkip?: boolean | null;
  note?: string | null;
  isActive?: boolean | null;
  coefficient?: number | null;
  timeStandard?: number | null;
  monId?: number | null;
  tueId?: number | null;
  wedId?: number | null;
  thuId?: number | null;
  friId?: number | null;
  satId?: number | null;
  sunId?: number | null;
  orders?: number | null;
  constructor() {
    this.isNoon = false;
    this.isBreak = false;
    this.isSkip = false;
  }
}
