import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GroupPositionComponent } from "./groupposition.component";
import { CoreService } from "src/app/_services/core.service";
import { GroupPositionEditComponent } from "./edit/groupposition-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: GroupPositionComponent,
  },
  {
    path: ":id",
    component: GroupPositionEditComponent,
  },
];

@NgModule({
    declarations: [GroupPositionComponent, GroupPositionEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class GroupPositionModule {}
