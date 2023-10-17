import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SysPackageComponent } from "./SysPackage.component";
import { CoreService } from "src/app/_services/core.service";
import { SysPackageEditComponent } from "./edit/SysPackage-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { CheckBoxSelectionService } from "@syncfusion/ej2-angular-dropdowns";

const routes: Routes = [
  {
    path: "",
    component: SysPackageComponent,
  },
  {
    path: ":id",
    component: SysPackageEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [SysPackageComponent, SysPackageEditComponent],
  providers: [CoreService, CheckBoxSelectionService],
})
export class SysPackageModule {}
