import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { KpiEmployeeComponent } from "./kpiemployee.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";


const routes: Routes = [
  {
    path: "",
    component: KpiEmployeeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [KpiEmployeeComponent],
  providers: [CoreService],
})
export class KpiEmployeeModule {}
