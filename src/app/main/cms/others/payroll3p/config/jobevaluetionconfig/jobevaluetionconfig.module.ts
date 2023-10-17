import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { JobEvaluetionConfigComponent } from "./jobevaluetionconfig.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: JobEvaluetionConfigComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [JobEvaluetionConfigComponent],
  providers: [CoreService],
})
export class JobEvaluetionConfigModule {}
