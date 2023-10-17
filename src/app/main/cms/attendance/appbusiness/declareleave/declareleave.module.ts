import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LibrariesModule } from "src/app/libraries/libraries.module";

import { DeclareleaveComponent } from "./declareleave.component";
import { CoreService } from "src/app/_services/core.service";
import { DeclareleaveEditComponent } from "./edit/declareleave-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";

const routes: Routes = [
  {
    path: "",
    component: DeclareleaveComponent,
  },
  {
    path: ":id",
    component: DeclareleaveEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [DeclareleaveComponent, DeclareleaveEditComponent],
  providers: [CoreService],
})
export class DeclareleaveModule {}
