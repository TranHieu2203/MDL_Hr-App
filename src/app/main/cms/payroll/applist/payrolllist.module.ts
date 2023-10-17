import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PayrollListRoutes } from './payrolllist.routing';


@NgModule({
  imports: [RouterModule.forChild(PayrollListRoutes)],
})
export class PayrollListModule {}
