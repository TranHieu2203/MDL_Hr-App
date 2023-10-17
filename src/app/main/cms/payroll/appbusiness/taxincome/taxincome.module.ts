import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TaxIncomeComponent } from "./taxincome.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: TaxIncomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [TaxIncomeComponent],
  providers: [CoreService],
})
export class TaxIncomeModule {}
