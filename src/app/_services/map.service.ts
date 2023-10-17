import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class MapService {
  map: Subject<any> = new Subject<any>();
}
