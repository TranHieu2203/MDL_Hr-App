import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ListproductComponent } from "./listproduct.component";
import { CoreService } from "src/app/_services/core.service";
import { ListproductEditComponent } from "./edit/listproduct-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: ListproductComponent,
  },
  {
    path: ":id",
    component: ListproductEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [ListproductComponent, ListproductEditComponent],
  providers: [CoreService],
})
export class ListProductModule {}
