import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserHiddenComponent } from './userhidden.component';
import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: UserHiddenComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [UserHiddenComponent],
  providers: [CoreService]
})
export class UserHiddenModule {}
