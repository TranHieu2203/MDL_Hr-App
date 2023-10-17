import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ListmachineComponent } from "./listmachine.component";
import { CoreService } from "src/app/_services/core.service";
import { ListMachineEditComponent } from "./edit/listmachine-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: ListmachineComponent,
  },
  {
    path: ":id",
    component: ListMachineEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [ListmachineComponent, ListMachineEditComponent],
  providers: [CoreService],
})
export class ListmachineModule {}
