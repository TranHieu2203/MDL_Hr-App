import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TrainingbeforeComponent } from "./trainingbefore.component";
import { CoreService } from "src/app/_services/core.service";
import { TrainingbeforeEditComponent } from "./edit/trainingbefore-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: TrainingbeforeComponent,
  },
  {
    path: ":id",
    component: TrainingbeforeEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [TrainingbeforeComponent, TrainingbeforeEditComponent],
  providers: [CoreService],
})
export class TrainingbeforeModule {}
