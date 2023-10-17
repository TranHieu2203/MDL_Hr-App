import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ContractComponent } from "./contract.component";
import { CoreService } from "src/app/_services/core.service";
import { TlaSharedModule } from "src/app/components/shared.module";
import { RichTextEditorAllModule } from "@syncfusion/ej2-angular-richtexteditor";
import {
  ToolbarService,
  HtmlEditorService,
  ImageService,
  LinkService,
  QuickToolbarService,
} from "@syncfusion/ej2-angular-richtexteditor";
const routes: Routes = [
  {
    path: "",
    component: ContractComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    RichTextEditorAllModule,
  ],
  declarations: [ContractComponent],
  providers: [CoreService],
})
export class ContractModule {}
