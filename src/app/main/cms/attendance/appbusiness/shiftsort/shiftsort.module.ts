import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ShiftSortComponent } from "./shiftsort.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: ShiftSortComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [ShiftSortComponent],
  providers: [CoreService],
})
export class ShiftSortModule {}
