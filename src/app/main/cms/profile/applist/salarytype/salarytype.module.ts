import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SalaryTypeComponent } from './salarytype.component';
import { CoreService } from 'src/app/_services/core.service';
import { SalaryTypeEditComponent } from './edit/salarytype-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: SalaryTypeComponent
  },{
    path: ':id',
    component: SalaryTypeEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [SalaryTypeComponent, SalaryTypeEditComponent],
  providers: [CoreService]
})
export class SalaryTypeModule {}
