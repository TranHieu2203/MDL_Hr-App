import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalaryPeriodComponent } from "./salaryperiod.component";
import { CoreService } from "src/app/_services/core.service";
import { SalaryPeriodEditComponent } from "./edit/salaryperiod-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: SalaryPeriodComponent,
  },
  {
    path: ":id",
    component: SalaryPeriodEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [SalaryPeriodComponent, SalaryPeriodEditComponent],
  providers: [CoreService],
})
export class SalaryPeriodModule {}
