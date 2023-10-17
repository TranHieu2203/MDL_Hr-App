import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CompeSetPositionComponent } from "./compesetposition.component";
import { CoreService } from "src/app/_services/core.service";
import { CompeSetPositionEditComponent } from "./edit/compesetposition-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: CompeSetPositionComponent,
  },
  {
    path: ":id",
    component: CompeSetPositionEditComponent,
  },
];

@NgModule({
    declarations: [CompeSetPositionComponent, CompeSetPositionEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class CompeSetPositionModule {}
