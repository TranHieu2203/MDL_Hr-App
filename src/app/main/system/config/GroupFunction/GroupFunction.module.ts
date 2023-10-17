import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupFunctionComponent } from './GroupFunction.component';
import { CoreService } from 'src/app/_services/core.service';
import { GroupFunctionEditComponent } from './edit/GroupFunction-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

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
