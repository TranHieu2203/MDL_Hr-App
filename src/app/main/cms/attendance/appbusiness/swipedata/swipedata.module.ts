import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { swipedataComponent } from "./swipedata.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";

const routes: Routes = [
  {
    path: "",
    component: swipedataComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule, LibrariesModule],
  declarations: [swipedataComponent],
  providers: [CoreService],
})
export class SwipeDataModule {}
