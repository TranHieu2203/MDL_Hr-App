import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DecisionCreateComponent } from "./decisioncreate.component";
import { CoreService } from "src/app/_services/core.service";
import { DecisionEditComponent } from "./edit/decision-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: DecisionCreateComponent,
  },
  {
    path: ":id",
    component: DecisionEditComponent,
  },
];

@NgModule({
    declarations: [DecisionCreateComponent, DecisionEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class DecisionCreateModule {}
