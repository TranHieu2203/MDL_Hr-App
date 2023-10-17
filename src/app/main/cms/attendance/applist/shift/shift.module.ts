import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ShiftComponent } from "./shift.component";
import { CoreService } from "src/app/_services/core.service";
import { ShiftEditComponent } from "./edit/shift-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: ShiftComponent,
  },
  {
    path: ":id",
    component: ShiftEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [ShiftComponent, ShiftEditComponent],
  providers: [CoreService],
})
export class ShiftModule {}
