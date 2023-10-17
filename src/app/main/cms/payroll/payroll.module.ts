import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PayrollRoutes } from "./payroll.routing";
import { Error404Module } from "../../errors/404/error-404.module";

@NgModule({
  imports: [RouterModule.forChild(PayrollRoutes), Error404Module],
})
export class PayrollModule {}
