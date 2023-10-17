import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Globals } from 'src/app/common/globals';
import { ToolbarInterface, ToolbarItem } from 'src/app/_models';

@Component({
  selector: 'app-common-tools',
  templateUrl: './common-tools.component.html',
  styleUrls: ['./common-tools.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommonToolsComponent implements OnInit {

  @Input() name!: string;
  @Input() items$!: BehaviorSubject<ToolbarItem[]>;
  @Output() toolItemClicked = new EventEmitter<string>;

  public toolbar!: ToolbarInterface[];

  constructor(private globals: Globals,) { }

  ngOnInit(): void {
    this.items$.subscribe(_ => this.buildToolbar());
  }

  clickToolbar(item: any) {
    this.toolItemClicked.emit(item)
  }

  buildToolbar = () => {
    this.toolbar = this.globals.buildToolbar(this.name, this.items$.value);
  };

}
