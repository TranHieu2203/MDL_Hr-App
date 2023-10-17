import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PersonCompetenceComponent } from "./personcompetence.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: PersonCompetenceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [PersonCompetenceComponent],
  providers: [CoreService],
})
export class PersonCompetenceModule {}
