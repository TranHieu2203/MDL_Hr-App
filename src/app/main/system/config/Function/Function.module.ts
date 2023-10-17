import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FunctionComponent } from './Function.component';
import { CoreService } from 'src/app/_services/core.service';
import { FunctionEditComponent } from './edit/Function-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes: Routes = [
  {
    path: '',
    component: FunctionComponent
  },{
    path: ':id',
    component: FunctionEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [FunctionComponent, FunctionEditComponent],
  providers: [CoreService]
})
export class FunctionModule {}
