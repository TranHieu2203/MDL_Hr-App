import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RoomComponent } from "./room.component";
import { CoreService } from "src/app/_services/core.service";
import { RoomEditComponent } from "./edit/room-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";

const routes: Routes = [
  {
    path: "",
    component: RoomComponent,
  },
  {
    path: ":id",
    component: RoomEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TlaSharedModule],
  declarations: [RoomComponent, RoomEditComponent],
  providers: [CoreService],
})
export class RoomModule {}
