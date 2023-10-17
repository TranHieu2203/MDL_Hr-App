import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobComponent } from './job.component';
import { CoreService } from 'src/app/_services/core.service';
import { JobEditComponent } from './edit/job-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';
import { PageService, SortService, FilterService,EditService,ToolbarService } from '@syncfusion/ej2-angular-treegrid';

const routes: Routes = [
  {
    path: '',
    component: JobComponent
  }
  ,{
    path: ':id',
    component: JobEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [JobComponent, JobEditComponent],
  providers: [CoreService,PageService, SortService, FilterService, EditService, ToolbarService]
})
export class JobModule {}
