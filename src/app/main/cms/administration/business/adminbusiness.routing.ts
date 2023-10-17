import { Routes } from "@angular/router";

export const AdminBusinessRoutes: Routes = [
  {
    path: "",
    redirectTo: "./groupposition/groupposition.module#GroupPositionModule",
    pathMatch: "full",
  },
  {
    path: "booking",
    //loadChildren: "./booking/booking.module#BookingModule",
    loadChildren: () => import("./booking/booking.module").then(m => m.BookingModule),
  },
];
