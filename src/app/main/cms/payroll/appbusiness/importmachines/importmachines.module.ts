import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ImportMachinesComponent } from "./importmachines.component";
import { CoreService } from "src/app/_services/core.service";
import { ImportMachinesEditComponent } from "./edit/importmachines-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: ImportMachinesComponent,
  },
  {
    path: ":id",
    component: ImportMachinesEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [ImportMachinesComponent, ImportMachinesEditComponent],
  providers: [CoreService],
})
export class ImportMachinesModule {}
