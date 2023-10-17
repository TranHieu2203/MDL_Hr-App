import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { SalarySampleComponent } from "./salarysample.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: SalarySampleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [SalarySampleComponent],
  providers: [CoreService],
})
export class SalarySampleModule {}
