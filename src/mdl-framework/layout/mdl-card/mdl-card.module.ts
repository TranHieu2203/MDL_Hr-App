import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlCardComponent } from './mdl-card.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule
  ],
  declarations: [MdlCardComponent],
  exports: [MdlCardComponent]
})
export class MdlCardModule { }
