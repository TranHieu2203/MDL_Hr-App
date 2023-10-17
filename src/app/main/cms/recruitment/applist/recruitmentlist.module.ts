import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RecruitmentListRoutes } from "./recruitmentlist.routing";

@NgModule({
  imports: [RouterModule.forChild(RecruitmentListRoutes)],
})
export class RecruitmentListModule {}
