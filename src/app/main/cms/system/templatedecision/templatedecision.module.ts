import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CoreService } from 'src/app/_services/core.service';

import { TlaSharedModule } from 'src/app/components/shared.module';
import { TemplateDecisionComponent } from './templatedecision.component';
import { TemplateDecisionEditComponent } from './edit/templatedecision-edit.component';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: TemplateDecisionComponent
  },{
    path: ':id',
    component: TemplateDecisionEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule, LibrariesModule
  ],
  declarations: [TemplateDecisionComponent, TemplateDecisionEditComponent],
  providers: [CoreService]
})
export class TemplateDecisionModule {}
