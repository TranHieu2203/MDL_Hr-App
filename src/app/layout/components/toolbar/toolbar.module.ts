import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";

import { ToolbarComponent } from "./toolbar.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { CoreService } from "src/app/_services/core.service";
import { ToolbellComponent } from "../toolbell/toolbell.component";
import { ClickOutsideDirective } from 'src/app/common/clickOutSide';
import { BarComponent } from './bar.component';

@NgModule({
  declarations: [ToolbarComponent, BarComponent, ToolbellComponent, ClickOutsideDirective],
  imports: [RouterModule, TlaSharedModule, BsDropdownModule.forRoot()],
  exports: [ToolbarComponent, BarComponent],
  providers: [CoreService],
})
export class ToolbarModule { }
