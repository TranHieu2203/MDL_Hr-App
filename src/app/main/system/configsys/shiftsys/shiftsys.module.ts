import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ShiftSysComponent } from "./shiftsys.component";
import { CoreService } from "src/app/_services/core.service";
import { ShiftSysEditComponent } from "./edit/shiftsys-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: ShiftSysComponent,
  },
  {
    path: ":id",
    component: ShiftSysEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [ShiftSysComponent, ShiftSysEditComponent],
  providers: [CoreService],
})
export class ShiftSysModule {}
