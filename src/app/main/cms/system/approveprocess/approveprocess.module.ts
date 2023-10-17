import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApproveProcessComponent } from './approveprocess.component';
import { CoreService } from 'src/app/_services/core.service';
import { ApproveProcessEditComponent } from './edit/approveprocess-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ApproveProcessComponent
  },{
    path: ':id',
    component: ApproveProcessEditComponent 
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [ApproveProcessComponent, ApproveProcessEditComponent],
  providers: [CoreService]
})
export class ApproveProcessModule {}
