import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipComponent } from './tooltip/tooltip.component';
import { CommonToolsComponent } from './common-tools/common-tools.component';
import { OrgtreeComponent } from './orgtree/orgtree.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    TooltipComponent,
    CommonToolsComponent,
    OrgtreeComponent,
  ],
  exports: [
    TooltipComponent,
    CommonToolsComponent,
    OrgtreeComponent,
  ]
})
export class LibrariesModule { }