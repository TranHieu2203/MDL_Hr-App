import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { InsRegimeTypeComponent } from "./insregimetype.component";
import { CoreService } from "src/app/_services/core.service";
import { InsRegimeTypeEditComponent } from "./edit/insregimetype-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "../../../../../libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: InsRegimeTypeComponent,
  },
  {
    path: ":id",
    component: InsRegimeTypeEditComponent,
  },
];

@NgModule({
    declarations: [InsRegimeTypeComponent, InsRegimeTypeEditComponent],
    providers: [CoreService],
    imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule]
})
export class InsRegimeTypeModule {}
