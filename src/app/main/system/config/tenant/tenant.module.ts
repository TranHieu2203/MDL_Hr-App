import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TenantComponent } from './tenant.component';
import { CoreService } from 'src/app/_services/core.service';
import { TenantEditComponent } from './edit/tenant-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: TenantComponent
  },{
    path: ':id',
    component: TenantEditComponent 
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [TenantComponent, TenantEditComponent],
  providers: [CoreService]
})
export class TenantModule {}
