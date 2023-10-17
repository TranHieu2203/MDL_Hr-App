import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MediaBusinessRoutes } from "./mediabusiness.routing";


@NgModule({
  imports: [RouterModule.forChild(MediaBusinessRoutes)],
})
export class MediaBusinessModule {}
