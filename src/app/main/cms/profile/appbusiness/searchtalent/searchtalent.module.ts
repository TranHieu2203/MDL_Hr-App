import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SearchTalentComponent } from "./searchtalent.component";
import { CoreService } from "src/app/_services/core.service";
import { SearchTalentEditComponent } from "./edit/searchtalent-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: SearchTalentComponent,
  },
  {
    path: ":id",
    component: SearchTalentEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [SearchTalentComponent, SearchTalentEditComponent],
  providers: [CoreService],
})
export class SearchTalentModule {}
