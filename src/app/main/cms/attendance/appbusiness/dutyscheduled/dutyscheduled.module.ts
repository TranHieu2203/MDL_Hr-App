import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DutyScheduledComponent } from "./dutyscheduled.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";


const routes: Routes = [
  {
    path: "",
    component: DutyScheduledComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [DutyScheduledComponent],
  providers: [CoreService],
})
export class DutyScheduledModule {}
