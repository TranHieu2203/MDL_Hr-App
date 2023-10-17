import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PayrollFormulaSysComponent } from "./payrollformulasys.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { PayrollFormulaSysEditComponent } from "./edit/payrollformulasys-edit.component";

const routes: Routes = [
  {
    path: "",
    component: PayrollFormulaSysComponent,
  },
  {
    path: ":id",
    component: PayrollFormulaSysEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [PayrollFormulaSysComponent, PayrollFormulaSysEditComponent],
  providers: [CoreService],
})
export class PayrollFormulaSysModule {}
