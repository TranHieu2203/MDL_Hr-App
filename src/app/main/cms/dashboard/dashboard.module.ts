import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Routes } from "@angular/router";
import { AppDashboardComponent } from "./dashboard.component";

import { CoreService } from "src/app/_services/core.service";

// High chart
import { AppDashTechEmployeeComponent } from "./components/techemployee/techemployee.component";
import { AppDashTechManagerComponent } from "./components/techmanager/techmanager.component";

import { AppDashPurchaseEmployeeComponent } from "./components/purchaseemployee/purchaseemployee.component";
import { AppDashPurchaseManagerComponent } from "./components/purchasemanager/purchasemanager.component";

import { AppDashSaleEmployeeComponent } from "./components/saleemployee/saleemployee.component";
import { AppDashSaleManagerComponent } from "./components/salemanager/salemanager.component";

import { AppDashInventoryEmployeeComponent } from "./components/inventoryemployee/inventoryemployee.component";
import { AppDashInventoryManagerComponent } from './components/inventorymanager/inventorymanager.component';

import { AppDashStaffEmployeeComponent } from "./components/staffemployee/staffemployee.component";
import { AppDashStaffManagerComponent } from "./components/staffmanager/staffmanager.component";

import { AppDashOwnerComponent } from "./components/owner/owner.component";

import { ChartModule } from "angular-highcharts";
import { Ng5SliderModule } from "ng5-slider";
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes: Routes = [
  {
    path: "",
    component: AppDashboardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    // HighChart
    ChartModule,
    // Slider
    Ng5SliderModule
  ],
  declarations: [
    AppDashboardComponent,
    AppDashTechEmployeeComponent,
    AppDashTechManagerComponent,
    AppDashPurchaseEmployeeComponent,
    AppDashPurchaseManagerComponent,
    AppDashSaleEmployeeComponent,
    AppDashSaleManagerComponent,
    AppDashInventoryEmployeeComponent,
    AppDashInventoryManagerComponent,
    AppDashStaffEmployeeComponent,
    AppDashStaffManagerComponent,
    AppDashOwnerComponent
  ],
  exports: [
    AppDashTechEmployeeComponent,
    AppDashTechManagerComponent,
    AppDashPurchaseEmployeeComponent,
    AppDashPurchaseManagerComponent,
    AppDashSaleEmployeeComponent,
    AppDashSaleManagerComponent,
    AppDashInventoryEmployeeComponent,
    AppDashInventoryManagerComponent,
    AppDashStaffEmployeeComponent,
    AppDashStaffManagerComponent,
    AppDashOwnerComponent
  ],
  providers: [CoreService]
})
export class AppDashboardModule {}
