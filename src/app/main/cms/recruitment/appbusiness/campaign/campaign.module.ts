import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { CampaignComponent } from "./campaign.component";
import { CoreService } from "src/app/_services/core.service";
import { CampaignEditComponent } from "./edit/campaign-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { AccordionModule } from "@syncfusion/ej2-angular-navigations";
import { LibrariesModule } from "src/app/libraries/libraries.module";


const routes: Routes = [
  {
    path: "",
    component: CampaignComponent,
  },
  {
    path: ":id",
    component: CampaignEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, AccordionModule, LibrariesModule],
  declarations: [CampaignComponent, CampaignEditComponent],
  providers: [CoreService],
})
export class CampaignModule {}
