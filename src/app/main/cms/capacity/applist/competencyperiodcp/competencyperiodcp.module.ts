import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CompetencyPeriodCpComponent } from "./competencyperiodcp.component";
import { CoreService } from "src/app/_services/core.service";
import { CompetencyPeriodCpEditComponent } from "./edit/competencyperiodcp-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: CompetencyPeriodCpComponent,
  },
  {
    path: ":id",
    component: CompetencyPeriodCpEditComponent,
  },
];

@NgModule({
    declarations: [CompetencyPeriodCpComponent, CompetencyPeriodCpEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class CompetencyPeriodCpModule {}
