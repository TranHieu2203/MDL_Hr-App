import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { InternalBlogComponent } from "./internalblog.component";
import { CoreService } from "src/app/_services/core.service";
import { InternalBlogEditComponent } from "./edit/internalblog-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { LibrariesModule } from "src/app/libraries/libraries.module";
import { RichTextEditorAllModule } from "@syncfusion/ej2-angular-richtexteditor";
const routes: Routes = [
  {
    path: "",
    component: InternalBlogComponent,
  },
  {
    path: ":id",
    component: InternalBlogEditComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    RichTextEditorAllModule,
    LibrariesModule
  ],
  declarations: [InternalBlogComponent, InternalBlogEditComponent],
  providers: [CoreService],
})
export class InternalBlogModule {}
