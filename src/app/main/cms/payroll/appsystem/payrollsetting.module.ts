import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PayrollSettingRoutes } from './payrollsetting.routing';


@NgModule({
  imports: [RouterModule.forChild(PayrollSettingRoutes)],
})
export class PayrollSettingModule {}
