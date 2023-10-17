import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CompetencyLevelComponent } from "./competencylevel.component";
import { CoreService } from "src/app/_services/core.service";
import { CompetencyLevelEditComponent } from "./edit/competencylevel-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: CompetencyLevelComponent,
  },
  {
    path: ":id",
    component: CompetencyLevelEditComponent,
  },
];

@NgModule({
    declarations: [CompetencyLevelComponent, CompetencyLevelEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class CompetencyLevelModule {}
