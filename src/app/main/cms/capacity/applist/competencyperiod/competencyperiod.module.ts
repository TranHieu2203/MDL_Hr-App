import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CompetencyPeriodComponent } from "./competencyperiod.component";
import { CoreService } from "src/app/_services/core.service";
import { CompetencyPeriodEditComponent } from "./edit/competencyperiod-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: CompetencyPeriodComponent,
  },
  {
    path: ":id",
    component: CompetencyPeriodEditComponent,
  },
];

@NgModule({
    declarations: [CompetencyPeriodComponent, CompetencyPeriodEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class CompetencyPeriodModule {}
