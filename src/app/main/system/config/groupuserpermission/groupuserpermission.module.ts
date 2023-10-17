import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GroupUserPermissionComponent } from "./groupuserpermission.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
const routes: Routes = [
  {
    path: "",
    component: GroupUserPermissionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, ],
  declarations: [GroupUserPermissionComponent],
  providers: [CoreService],
})
export class GroupUserPermissionModule {}
