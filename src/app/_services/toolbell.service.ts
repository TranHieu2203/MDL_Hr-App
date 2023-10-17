import { Injectable, OnInit } from '@angular/core';
import { CoreService } from './core.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbellService implements OnInit {

  // toolbellData: BehaviorSubject<any> = new BehaviorSubject<any>([])

  private toolbellData = new BehaviorSubject<any>([]);
  toolbellData$ = this.toolbellData.asObservable();


  constructor(private _coreService: CoreService,
  ) {
    this._coreService.Get("hr/FormList/getRemind").subscribe((res: any) => {
      setTimeout(() => {
        this.toolbellData.next(res)
      }, 200);
    })
  }
  ngOnInit(): void {

  }

}
