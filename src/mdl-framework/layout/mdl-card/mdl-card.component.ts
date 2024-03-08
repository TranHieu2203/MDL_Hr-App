import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mdl-card',
  templateUrl: './mdl-card.component.html',
  styleUrls: ['./mdl-card.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class MdlCardComponent implements OnInit {
  @Input() header: string = '';
  @Input() description: string = '';
  @Input() expanded: boolean = false;
  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
