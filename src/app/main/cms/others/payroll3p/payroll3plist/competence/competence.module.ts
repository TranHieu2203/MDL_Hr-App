import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CompetenceComponent } from "./competence.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: CompetenceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [CompetenceComponent],
  providers: [CoreService],
})
export class CompetenceModule {}
