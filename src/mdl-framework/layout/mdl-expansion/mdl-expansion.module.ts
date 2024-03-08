import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlExpansionComponent } from './mdl-expansion.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule
  ],
  declarations: [MdlExpansionComponent],
  exports: [MdlExpansionComponent]
})
export class MdlExpansionModule { }
