import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LeaveJobSettlementComponent } from "./leavejobsettlement.component";
import { CoreService } from "src/app/_services/core.service";
import { LeaveJobSettlementEditComponent } from "./edit/leavejobsettlement-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: LeaveJobSettlementComponent,
  },
  {
    path: ":id",
    component: LeaveJobSettlementEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [LeaveJobSettlementComponent, LeaveJobSettlementEditComponent],
  providers: [CoreService],
})
export class LeaveJobSettlementModule {}
