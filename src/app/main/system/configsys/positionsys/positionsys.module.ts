import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PositionSysComponent } from './positionsys.component';
import { CoreService } from 'src/app/_services/core.service';
import { PositionSysEditComponent } from './edit/positionsys-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PositionSysComponent
  },{
    path: ':id',
    component: PositionSysEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [PositionSysComponent, PositionSysEditComponent],
  providers: [CoreService]
})
export class PositionSysModule {}
