import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TenantContractComponent } from './tenantcontract.component';
import { CoreService } from 'src/app/_services/core.service';
import { TenantContractEditComponent } from './edit/tenantcontract-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: TenantContractComponent
  },{
    path: ':id',
    component: TenantContractEditComponent 
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [TenantContractComponent, TenantContractEditComponent],
  providers: [CoreService]
})
export class TenantContractModule {}
