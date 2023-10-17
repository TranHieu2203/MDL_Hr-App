import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SymbolSysComponent } from './symbolsys.component';
import { CoreService } from 'src/app/_services/core.service';
import { SymbolSysEditComponent } from './edit/symbolsys-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SymbolSysComponent
  },{
    path: ':id',
    component: SymbolSysEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SymbolSysComponent, SymbolSysEditComponent],
  providers: [CoreService]
})
export class SymbolSysModule {}
