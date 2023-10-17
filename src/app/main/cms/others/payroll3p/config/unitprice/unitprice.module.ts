import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { UnitPriceComponent } from "./unitprice.component";
import { CoreService } from "src/app/_services/core.service";
import { UnitPriceEditComponent } from "./edit/unitprice-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: UnitPriceComponent,
  },
  {
    path: ":id",
    component: UnitPriceEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [UnitPriceComponent, UnitPriceEditComponent],
  providers: [CoreService],
})
export class UnitPriceModule {}
