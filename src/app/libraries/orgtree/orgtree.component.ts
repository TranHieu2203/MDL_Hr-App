import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/_services/core.service';

@Component({
  selector: 'app-orgtree',
  templateUrl: './orgtree.component.html',
  styleUrls: ['./orgtree.component.scss']
})
export class OrgtreeComponent implements OnInit {

  constructor(
    private _coreService: CoreService,
  ) { }

  ngOnInit(): void {
    this._coreService
    .Get("hr/Organization/GetOrgPermission")
    .subscribe((x: any) => {
    })
  }

}
