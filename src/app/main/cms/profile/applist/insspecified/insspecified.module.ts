import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InsSpecifiedComponent } from './insspecified.component';
import { CoreService } from 'src/app/_services/core.service';
import { InsSpecifiedEditComponent } from './edit/insspecified-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: '',
    component: InsSpecifiedComponent
  },
  {
    path: ':id',
    component: InsSpecifiedEditComponent
  }
];

@NgModule({
    declarations: [InsSpecifiedComponent, InsSpecifiedEditComponent],
    providers: [CoreService],
    imports: [
        RouterModule.forChild(routes),
        TlaSharedModule,
        LibrariesModule
    ]
})
export class InsSpecifiedModule {}
