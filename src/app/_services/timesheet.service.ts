import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class TimeSheetService {
  timesheetstandard: Subject<any> = new Subject<any>();
  timesheetstandardedit: Subject<any> = new Subject<any>();
  timesheetstandardsumwork: Subject<any> = new Subject<any>();
  timesheetroot: Subject<any> = new Subject<any>();
  timesheetmonthly: Subject<any> = new Subject<any>();
}
