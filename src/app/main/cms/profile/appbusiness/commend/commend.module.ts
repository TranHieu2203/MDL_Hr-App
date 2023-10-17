import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CommendComponent } from "./commend.component";
import { CoreService } from "src/app/_services/core.service";
import { CommendEditComponent } from "./edit/commend-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: CommendComponent,
  },
  {
    path: ":id",
    component: CommendEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [CommendComponent, CommendEditComponent],
  providers: [CoreService],
})
export class CommendModule {}
