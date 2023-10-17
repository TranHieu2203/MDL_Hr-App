import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FamilyChangeComponent } from "./family-change.component";
import { CoreService } from "src/app/_services/core.service";
import { FamilyChangeEditComponent } from "./edit/family-change-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { ExcelExportService } from "@syncfusion/ej2-angular-grids";
import { LibrariesModule } from "src/app/libraries/libraries.module";
const routes: Routes = [
  {
    path: "",
    component: FamilyChangeComponent,
  },
  {
    path: ":id",
    component: FamilyChangeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [FamilyChangeComponent, FamilyChangeEditComponent],
  providers: [CoreService, ExcelExportService],
})
export class FamilyChangeModule {}
