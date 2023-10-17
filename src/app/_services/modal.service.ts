import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ModalService {
  private modals: any[] = [];

  modalStatus: Subject<any> = new Subject<any>();
  employee: Subject<any> = new Subject<any>();
  organization: Subject<any> = new Subject<any>();
  decision: Subject<any> = new Subject<any>();
  timesheet: Subject<any> = new Subject<any>();
  timesheetRoot: Subject<any> = new Subject<any>();
  registeroff: Subject<any> = new Subject<any>();
  shiftsort: Subject<any> = new Subject<any>();
  overtime: Subject<any> = new Subject<any>();
  directive: Subject<any> = new Subject<any>();
  position: Subject<any> = new Subject<any>();
  public loading: Subject<any> = new Subject<boolean>();

  add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string) {
    // remove modal from array of active modals
    this.modals = this.modals.filter((x) => x.id !== id);
  }

  open(id: string, param?: any) {
    // open modal specified by id
    let modal: any = this.modals.filter((x) => x.id === id)[0];
    modal.open(param);
  }

  close(id: string) {
    // close modal specified by id
    let modal: any = this.modals.filter((x) => x.id === id)[0];
    modal.close();
  }
}
