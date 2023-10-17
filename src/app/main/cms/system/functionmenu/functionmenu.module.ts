import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CoreService } from 'src/app/_services/core.service';

import { TlaSharedModule } from 'src/app/components/shared.module';
import { FunctionMenuComponent } from './functionmenu.component';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: FunctionMenuComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule, LibrariesModule
  ],
  declarations: [FunctionMenuComponent],
  providers: [CoreService]
})
export class FunctionMenuModule {}
