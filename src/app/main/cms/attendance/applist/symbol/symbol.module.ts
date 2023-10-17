import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SymbolComponent } from './symbol.component';
import { CoreService } from 'src/app/_services/core.service';
import { SymbolEditComponent } from './edit/symbol-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: '',
    component: SymbolComponent
  },{
    path: ':id',
    component: SymbolEditComponent
  }
];

@NgModule({
    declarations: [SymbolComponent, SymbolEditComponent],
    providers: [CoreService],
    imports: [
        RouterModule.forChild(routes),
        TlaSharedModule,
        LibrariesModule
    ]
})
export class SymbolModule {}
