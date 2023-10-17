import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GroupPositionSysComponent } from "./grouppositionsys.component";
import { CoreService } from "src/app/_services/core.service";
import { GroupPositionSysEditComponent } from "./edit/grouppositionsys-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: GroupPositionSysComponent,
  },
  {
    path: ":id",
    component: GroupPositionSysEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [GroupPositionSysComponent, GroupPositionSysEditComponent],
  providers: [CoreService],
})
export class GroupPositionSysModule {}
