import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreService } from 'src/app/_services/core.service';
import { TlaSharedModule } from 'src/app/components/shared.module';
import { LibrariesModule } from 'src/app/libraries/libraries.module';
import { PageService, SortService, FilterService,EditService,ToolbarService } from '@syncfusion/ej2-angular-treegrid';
import { DashboardComponent } from './dashboard.component';
import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { FunnelSeriesService, BarSeriesService, AccumulationTooltipService, CategoryService, DateTimeService, ScrollBarService, ColumnSeriesService, LineSeriesService, 
  ChartAnnotationService, RangeColumnSeriesService, StackingColumnSeriesService,LegendService, TooltipService, AccumulationDataLabelService,StackingBarSeriesService,
  AreaSeriesService,  ExportService,
   StackingAreaSeriesService, ScatterSeriesService, PolarSeriesService,RadarSeriesService, ILoadedEventArgs, SplineSeriesService } from '@syncfusion/ej2-angular-charts';
import { ChartModule } from '@syncfusion/ej2-angular-charts';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    LibrariesModule,
    AccumulationChartModule,
    ChartModule
  ],
  declarations: [DashboardComponent],
  providers: [CoreService,PageService,
    FunnelSeriesService, BarSeriesService, AccumulationTooltipService, CategoryService, DateTimeService, ScrollBarService, ColumnSeriesService, LineSeriesService, 
    ChartAnnotationService, RangeColumnSeriesService, StackingColumnSeriesService,LegendService, TooltipService, AccumulationDataLabelService,StackingBarSeriesService,
    AreaSeriesService,  ExportService,
   StackingAreaSeriesService, ScatterSeriesService, PolarSeriesService,RadarSeriesService, SplineSeriesService]
})

export class DashboardModule {}
