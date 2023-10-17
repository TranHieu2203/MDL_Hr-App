import { Routes } from "@angular/router";

export const AdminListRoutes: Routes = [
  {
    path: "",
    redirectTo: "./groupposition/groupposition.module#GroupPositionModule",
    pathMatch: "full",
  },
  {
    path: "room",
    //loadChildren: "./room/room.module#RoomModule",
    loadChildren: () => import("./room/room.module").then(m => m.RoomModule),
  },
];
