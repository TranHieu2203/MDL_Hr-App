import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobBandComponent } from './job-band.component';
import { CoreService } from 'src/app/_services/core.service';
import { JobBandEditComponent } from './edit/job-band-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: '',
    component: JobBandComponent
  },
  {
    path: ':id',
    component: JobBandEditComponent
  }
];

@NgModule({
    declarations: [JobBandComponent, JobBandEditComponent],
    providers: [CoreService],
    imports: [
        RouterModule.forChild(routes),
        TlaSharedModule,
        LibrariesModule
    ]
})
export class JobBandModule {}
