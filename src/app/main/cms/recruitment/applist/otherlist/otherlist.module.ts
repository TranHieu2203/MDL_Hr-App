//import { OtherListEditComponent } from './edit/otherlist-edit.component';

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { OtherlistComponent } from "./otherlist.component";
import { CoreService } from "src/app/_services/core.service";
//import { OtherListEditComponent } from "./edit/ortherlist-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from 'src/app/libraries/libraries.module';

const routes: Routes = [
  {
    path: "",
    component: OtherlistComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [OtherlistComponent],
  providers: [CoreService],
})
export class OtherlistModule {}
