import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DisciplineComponent } from "./discipline.component";
import { CoreService } from "src/app/_services/core.service";
import { DisciplineEditComponent } from "./edit/discipline-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: DisciplineComponent,
  },
  {
    path: ":id",
    component: DisciplineEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [DisciplineComponent, DisciplineEditComponent],
  providers: [CoreService],
})
export class DisciplineModule {}
