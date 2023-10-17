import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ContractTypeSysComponent } from "./contracttypesys.component";
import { CoreService } from "src/app/_services/core.service";
import { ContractTypeSysEditComponent } from "./edit/contracttypesys-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: ContractTypeSysComponent,
  },
  {
    path: ":id",
    component: ContractTypeSysEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [ContractTypeSysComponent, ContractTypeSysEditComponent],
  providers: [CoreService],
})
export class ContractTypeSysModule {}
