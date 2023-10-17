import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TrainingDemandComponent } from "./trainingdemand.component";
import { CoreService } from "src/app/_services/core.service";
import { TrainingDemandEditComponent } from "./edit/trainingdemand-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: TrainingDemandComponent,
  },
  {
    path: ":id",
    component: TrainingDemandEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [TrainingDemandComponent, TrainingDemandEditComponent],
  providers: [CoreService],
})
export class TrainingDemandModule {}
