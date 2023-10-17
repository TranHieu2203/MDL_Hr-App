import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class TimeSheetService {
  organization: Subject<any> = new Subject<any>();
}
