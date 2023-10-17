import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class OrgTooltipService {
  constructor() {

  }
  getOrgTree(orgId: number) {

    var localData = localStorage.getItem("orgIds")
    return '22'
  }
}
