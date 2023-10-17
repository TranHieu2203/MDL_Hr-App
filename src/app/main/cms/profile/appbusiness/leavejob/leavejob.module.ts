import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LeaveJobComponent } from "./leavejob.component";
import { CoreService } from "src/app/_services/core.service";
import { LeaveJobEditComponent } from "./edit/leavejob-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: LeaveJobComponent,
  },
  {
    path: ":id",
    component: LeaveJobEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [LeaveJobComponent, LeaveJobEditComponent],
  providers: [CoreService],
})
export class LeaveJobModule {}
