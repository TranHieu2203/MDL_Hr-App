import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RecruitmentPlanComponent } from "./recruitmentplan.component";
import { CoreService } from "src/app/_services/core.service";
import { RecruitmentPlanEditComponent } from "./edit/recruitmentplan-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: RecruitmentPlanComponent,
  },
  {
    path: ":id",
    component: RecruitmentPlanEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [RecruitmentPlanComponent, RecruitmentPlanEditComponent],
  providers: [CoreService],
})
export class RecruitmentPlanModule {}
