import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { StaffProfileChangeComponent } from "./staffprofile-change.component";
import { CoreService } from "src/app/_services/core.service";
import { StaffProfileChangeEditComponent } from "./edit/staffprofile-change-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
import { LibrariesModule } from "src/app/libraries/libraries.module";
const routes: Routes = [
  {
    path: "",
    component: StaffProfileChangeComponent,
  },
  {
    path: ":id",
    component: StaffProfileChangeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [StaffProfileChangeComponent, StaffProfileChangeEditComponent],
  providers: [CoreService, ExcelExportService],
})
export class StaffProfileChangeModule {}
