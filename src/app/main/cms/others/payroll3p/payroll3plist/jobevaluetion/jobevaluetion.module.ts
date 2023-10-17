import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { JobEvaluetionComponent } from "./jobevaluetion.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: JobEvaluetionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [JobEvaluetionComponent],
  providers: [CoreService],
})
export class JobEvaluetionModule {}
