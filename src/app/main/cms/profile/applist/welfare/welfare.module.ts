import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { WelfareComponent } from "./welfare.component";
import { CoreService } from "src/app/_services/core.service";
import { WelfareEditComponent } from "./edit/welfare-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: WelfareComponent,
  },
  {
    path: ":id",
    component: WelfareEditComponent,
  },
];

@NgModule({
    declarations: [WelfareComponent, WelfareEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class WelfareModule {}
