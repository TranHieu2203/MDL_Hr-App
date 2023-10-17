import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { GroupFunctionComponent } from './groupfunction.component';
import { GroupFunctionEditComponent } from './edit/groupfunction-edit.component';

const routes: Routes = [
  {
    path: '',
    component: GroupFunctionComponent
  },{
    path: ':id',
    component: GroupFunctionEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [GroupFunctionComponent, GroupFunctionEditComponent],
  providers: [CoreService]
})
export class GroupFunctionModule {}
