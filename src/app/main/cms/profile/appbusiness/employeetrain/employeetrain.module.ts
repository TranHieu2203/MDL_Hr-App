import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { EmployeetrainComponent } from "./employeetrain.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: EmployeetrainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [EmployeetrainComponent],
  providers: [CoreService],
})
export class EmployeeTrainModule {}
