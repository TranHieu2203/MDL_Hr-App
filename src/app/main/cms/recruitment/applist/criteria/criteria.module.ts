import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CriteriaComponent } from './criteria.component';
import { CoreService } from 'src/app/_services/core.service';
import { CriteriaEditComponent } from './edit/criteria-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: CriteriaComponent
  },{
    path: ':id',
    component: CriteriaEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [CriteriaComponent, CriteriaEditComponent],
  providers: [CoreService]
})
export class CriteriaModule {}
