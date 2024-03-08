import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'mdl-expansion',
  templateUrl: './mdl-expansion.component.html',
  styleUrls: ['./mdl-expansion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MdlExpansionComponent implements OnInit {
  @Input() header: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() image: string = '';
  @Input() expanded: boolean = true;
  @Input() disabled: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
