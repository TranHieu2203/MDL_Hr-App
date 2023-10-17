import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { OtherListComponent } from "./otherlist.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { OtherListEditComponent } from "./edit/otherlist-edit.component";
const routes: Routes = [
  {
    path: "",
    component: OtherListComponent,
  },{
    path: ':id',
    component: OtherListEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, ],
  declarations: [OtherListComponent,OtherListEditComponent],
  providers: [CoreService],
})
export class OtherListModule {}
