import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SalaryTypeSysComponent } from './salarytypesys.component';
import { CoreService } from 'src/app/_services/core.service';
import { SalaryTypeSysEditComponent } from './edit/salarytypesys-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SalaryTypeSysComponent
  },{
    path: ':id',
    component: SalaryTypeSysEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SalaryTypeSysComponent, SalaryTypeSysEditComponent],
  providers: [CoreService]
})
export class SalaryTypeSysModule {}
