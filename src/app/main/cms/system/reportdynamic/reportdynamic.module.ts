import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { ReportDynamicComponent } from './reportdynamic.component';
import { ReportDynamicEditComponent } from './edit/reportdynamic-edit.component';
import { LibrariesModule } from "src/app/libraries/libraries.module";
import { ReportDynamicConfigDataComponent } from './config/config-data.component';

const routes: Routes = [
  {
    path: '',
    component: ReportDynamicComponent
  },{
    path: ':id',
    component: ReportDynamicEditComponent 
  },
  {
    path: 'configdata/:id',
    component: ReportDynamicConfigDataComponent
  }
];

@NgModule({
    declarations: [ReportDynamicComponent, ReportDynamicEditComponent,ReportDynamicConfigDataComponent],
    providers: [CoreService],
    imports: [
        RouterModule.forChild(routes),
        TlaSharedModule,
        LibrariesModule
    ]
})
export class ReportDynamicModule {}
