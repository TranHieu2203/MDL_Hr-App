import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ExchangeListComponent } from "./exchangelist.component";
import { ExchangeListEditComponent } from "./edit/exchangelist-edit.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";;
const routes: Routes = [
  {
    path: "",
    component: ExchangeListComponent,
  },
  {
    path: ':id',
    component: ExchangeListEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, ],
  declarations: [ExchangeListComponent,ExchangeListEditComponent],
  providers: [CoreService],
})
export class ExchangeListModule {}
