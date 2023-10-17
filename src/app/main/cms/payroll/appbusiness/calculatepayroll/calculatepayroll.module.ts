import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CalculatePayrollComponent } from "./calculatepayroll.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: CalculatePayrollComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [CalculatePayrollComponent],
  providers: [CoreService],
})
export class CalculatePayrollModule {}
