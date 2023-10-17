import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BookingComponent } from "./booking.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: BookingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [BookingComponent],
  providers: [CoreService],
})
export class BookingModule {}
