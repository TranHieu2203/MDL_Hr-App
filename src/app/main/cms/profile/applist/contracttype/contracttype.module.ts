import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ContractTypeComponent } from "./contracttype.component";
import { CoreService } from "src/app/_services/core.service";
import { ContractTypeEditComponent } from "./edit/contracttype-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: ContractTypeComponent,
  },
  {
    path: ":id",
    component: ContractTypeEditComponent,
  },
];

@NgModule({
    declarations: [ContractTypeComponent, ContractTypeEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class ContractTypeModule {}
