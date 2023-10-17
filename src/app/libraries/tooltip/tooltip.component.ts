import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TooltipComponent implements OnInit {

  tooltip: string = '';
  left: number = 0;
  top: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
