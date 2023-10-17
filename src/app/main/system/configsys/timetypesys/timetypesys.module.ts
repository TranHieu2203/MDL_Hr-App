import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TimeTypeSysComponent } from "./timetypesys.component";
import { CoreService } from "src/app/_services/core.service";
import { TimeTypeSysEditComponent } from "./edit/timetypesys-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: TimeTypeSysComponent,
  },
  {
    path: ":id",
    component: TimeTypeSysEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [TimeTypeSysComponent, TimeTypeSysEditComponent],
  providers: [CoreService],
})
export class TimeTypeSysModule {}
