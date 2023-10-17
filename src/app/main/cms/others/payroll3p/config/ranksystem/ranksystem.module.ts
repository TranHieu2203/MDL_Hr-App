import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RankSystemComponent } from "./ranksystem.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: RankSystemComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [RankSystemComponent],
  providers: [CoreService],
})
export class RankSystemModule {}
