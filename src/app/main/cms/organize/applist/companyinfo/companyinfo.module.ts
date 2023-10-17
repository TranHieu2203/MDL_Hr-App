import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CompanyInfoComponent } from "./companyinfo.component";
import { CompanyInfoEditComponent } from "./edit/companyinfo-edit.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";
const routes: Routes = [
  {
    path: "",
    component: CompanyInfoComponent,
  },
  {
    path: ":id",
    component: CompanyInfoEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [CompanyInfoComponent, CompanyInfoEditComponent],
  providers: [CoreService],
})
export class CompanyInfoModule {}
