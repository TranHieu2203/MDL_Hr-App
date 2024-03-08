import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlPipe } from './formControl.pipe';

@NgModule({
    declarations: [FormControlPipe],
    imports: [
        CommonModule
    ],
    entryComponents: [FormControlPipe],
    exports: [FormControlPipe]
})
export class PipesModule { }
