import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";
import { SysDashboardComponent } from "./sdashboard.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from 'src/app/components/shared.module';
const routes: Routes = [
  {
    path: "",
    component: SysDashboardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [SysDashboardComponent],
  providers: [CoreService]
})
export class SystemDashboardModule {}
