import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { CoreService } from 'src/app/_services/core.service';
import { UserEditComponent } from './edit/user-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: UserComponent
  },{
    path: ':id',
    component: UserEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [UserComponent, UserEditComponent],
  providers: [CoreService]
})
export class UserModule {}
