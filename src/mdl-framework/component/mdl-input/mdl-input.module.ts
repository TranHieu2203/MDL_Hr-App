import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlInputComponent } from './mdl-input.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' })
  ],
  declarations: [MdlInputComponent],
  exports: [MdlInputComponent]
})
export class MdlInputModule { }
