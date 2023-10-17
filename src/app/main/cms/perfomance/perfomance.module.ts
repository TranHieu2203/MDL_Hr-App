import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PerformanceRoutes } from "./perfomance.routing";
import { Error404Module } from "../../errors/404/error-404.module";

@NgModule({
  imports: [RouterModule.forChild(PerformanceRoutes), Error404Module],
})
export class PerformanceModule {}
