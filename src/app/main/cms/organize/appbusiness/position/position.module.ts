import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PositionComponent } from './position.component';
import { CoreService } from 'src/app/_services/core.service';
import { PositionEditComponent } from './edit/position-edit.component';
import { PositionEditDirectComponent } from './editdirect/position-editdirect.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: PositionComponent
  },{
    path: ':id',
    component: PositionEditComponent
  },
  {
    path: 'editdirect/:id',
    component: PositionEditDirectComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [PositionComponent, PositionEditComponent,PositionEditDirectComponent],
  providers: [CoreService]
})
export class PositionModule {}
