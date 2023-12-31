import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GroupUserComponent } from './groupuser.component';
import { CoreService } from 'src/app/_services/core.service';
import { GroupUserEditComponent } from './edit/groupuser-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from "../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: '',
    component: GroupUserComponent
  },{
    path: ':id',
    component: GroupUserEditComponent 
  }
];

@NgModule({
    declarations: [GroupUserComponent, GroupUserEditComponent],
    providers: [CoreService],
    imports: [
        RouterModule.forChild(routes),
        TlaSharedModule,
        LibrariesModule
    ]
})
export class GroupUserModule {}
