import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { GroupPosition3PComponent } from "./groupposition3p.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: GroupPosition3PComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule,LibrariesModule],
  declarations: [GroupPosition3PComponent],
  providers: [CoreService],
})
export class GroupPosition3PModule {}
