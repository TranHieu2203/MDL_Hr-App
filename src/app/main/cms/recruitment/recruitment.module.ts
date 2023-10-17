import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RecruitmentRoutes } from "./recruitment.routing";
import { Error404Module } from "../../errors/404/error-404.module";

@NgModule({
  imports: [RouterModule.forChild(RecruitmentRoutes), Error404Module],
})
export class RecruitmentModule {}
