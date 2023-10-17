import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ElementGroupComponent } from "./elementgroup.component";
import { CoreService } from "src/app/_services/core.service";
import { ElementGroupEditComponent } from "./edit/elementgroup-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: ElementGroupComponent,
  },
  {
    path: ":id",
    component: ElementGroupEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [ElementGroupComponent, ElementGroupEditComponent],
  providers: [CoreService],
})
export class ElementGroupModule {}
