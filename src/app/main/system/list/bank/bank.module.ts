import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BankComponent } from "./bank.component";
import { CoreService } from "src/app/_services/core.service";
import { BankEditComponent } from "./edit/bank-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: BankComponent,
  },
  {
    path: ":id",
    component: BankEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [BankComponent, BankEditComponent],
  providers: [CoreService],
})
export class BankModule {}
