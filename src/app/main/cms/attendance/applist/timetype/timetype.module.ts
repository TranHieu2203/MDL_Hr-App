import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TimeTypeComponent } from "./timetype.component";
import { CoreService } from "src/app/_services/core.service";
import { TimeTypeEditComponent } from "./edit/timetype-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: TimeTypeComponent,
  },
  {
    path: ":id",
    component: TimeTypeEditComponent,
  },
];

@NgModule({
    declarations: [TimeTypeComponent, TimeTypeEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class TimeTypeModule {}
