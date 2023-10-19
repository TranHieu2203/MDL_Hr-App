import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GroupCriteriaComponent } from "./groupcriteria.component";
import { CoreService } from "src/app/_services/core.service";
import { GroupCriteriaEditComponent } from "./edit/groupcriteria-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: GroupCriteriaComponent,
  },
  {
    path: ":id",
    component: GroupCriteriaEditComponent,
  },
];

@NgModule({
    declarations: [GroupCriteriaComponent, GroupCriteriaEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class GroupCriteriaModule {}
