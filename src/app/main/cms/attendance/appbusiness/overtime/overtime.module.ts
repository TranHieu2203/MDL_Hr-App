import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { OvertimeComponent } from "./overtime.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: OvertimeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [OvertimeComponent],
  providers: [CoreService],
})
export class OvertimeModule {}
