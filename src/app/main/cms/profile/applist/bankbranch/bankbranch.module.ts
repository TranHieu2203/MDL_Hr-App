import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BankBranchComponent } from "./bankbranch.component";
import { CoreService } from "src/app/_services/core.service";
import { BankBranchEditComponent } from "./edit/bankbranch-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: BankBranchComponent,
  },
  {
    path: ":id",
    component: BankBranchEditComponent,
  },
];

@NgModule({
    declarations: [BankBranchComponent, BankBranchEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class BankBranchModule {}
