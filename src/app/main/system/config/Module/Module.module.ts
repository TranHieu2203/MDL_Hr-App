import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModuleComponent } from './Module.component';
import { CoreService } from 'src/app/_services/core.service';
import { ModuleEditComponent } from './edit/Module-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ModuleComponent
  },{
    path: ':id',
    component: ModuleEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [ModuleComponent, ModuleEditComponent],
  providers: [CoreService]
})
export class ModuleModule {}
