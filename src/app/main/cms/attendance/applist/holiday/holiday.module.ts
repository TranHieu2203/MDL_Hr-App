import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HolidayComponent } from "./holiday.component";
import { CoreService } from "src/app/_services/core.service";
import { HolidayEditComponent } from "./edit/holiday-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: HolidayComponent,
  },
  {
    path: ":id",
    component: HolidayEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule,LibrariesModule],
  declarations: [HolidayComponent, HolidayEditComponent],
  providers: [CoreService],
})
export class HolidayModule {}
