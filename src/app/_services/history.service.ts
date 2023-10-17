import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class HistoryService {
    dataHistory: Subject<any> = new Subject<any>();
}
