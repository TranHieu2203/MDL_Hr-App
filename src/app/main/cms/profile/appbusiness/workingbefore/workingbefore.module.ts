import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WorkingbeforeComponent } from "./workingbefore.component";
import { CoreService } from "src/app/_services/core.service";
import { WorkingbeforeEditComponent } from "./edit/workingbefore-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: WorkingbeforeComponent,
  },
  {
    path: ":id",
    component: WorkingbeforeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [WorkingbeforeComponent, WorkingbeforeEditComponent],
  providers: [CoreService],
})
export class WorkingbeforeModule {}
