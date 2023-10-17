import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UserPermissionComponent } from "./userpermission.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
const routes: Routes = [
  {
    path: "",
    component: UserPermissionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [UserPermissionComponent],
  providers: [CoreService],
})
export class UserPermissionModule {}
