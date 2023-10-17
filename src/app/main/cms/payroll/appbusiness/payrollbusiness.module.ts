import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PayrollBusinessRoutes } from "./payrollbusiness.routing";

@NgModule({
  imports: [RouterModule.forChild(PayrollBusinessRoutes)],
})
export class PayrollBusinessModule {}
