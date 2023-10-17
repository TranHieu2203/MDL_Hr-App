import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LibrariesModule } from "src/app/libraries/libraries.module";

import { StaffProfileComponent } from "./staffprofile.component";
import { CoreService } from "src/app/_services/core.service";
import { StaffProfileEditComponent } from "./edit/staffprofile-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
const routes: Routes = [
  {
    path: "",
    component: StaffProfileComponent,
  },
  {
    path: ":id",
    component: StaffProfileEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [StaffProfileComponent, StaffProfileEditComponent],
  providers: [CoreService, ExcelExportService],
})
export class StaffProfileModule { }
