import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TitleComponent } from './title.component';
import { CoreService } from 'src/app/_services/core.service';
import { TitleEditComponent } from './edit/title-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: '',
    component: TitleComponent
  },{
    path: ':id',
    component: TitleEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule
  ],
  declarations: [TitleComponent, TitleEditComponent],
  providers: [CoreService]
})
export class TitleModule {}
