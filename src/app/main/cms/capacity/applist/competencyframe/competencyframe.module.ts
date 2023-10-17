import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CompetencyFrameComponent } from "./competencyframe.component";
import { CoreService } from "src/app/_services/core.service";
import { CompetencyFrameEditComponent } from "./edit/competencyframe-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: CompetencyFrameComponent,
  },
  {
    path: ":id",
    component: CompetencyFrameEditComponent,
  },
];

@NgModule({
    declarations: [CompetencyFrameComponent, CompetencyFrameEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class CompetencyFrameModule {}
