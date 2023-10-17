import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BlogComponent } from "./blog.component";
import { CoreService } from "src/app/_services/core.service";
import { BlogEditComponent } from "./edit/blog-edit.component";
import { TlaSharedModule } from "src/app/components/shared.module";
import { RichTextEditorAllModule } from "@syncfusion/ej2-angular-richtexteditor";
const routes: Routes = [
  {
    path: "",
    component: BlogComponent,
  },
  {
    path: ":id",
    component: BlogEditComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule,
    RichTextEditorAllModule,
  ],
  declarations: [BlogComponent, BlogEditComponent],
  providers: [CoreService],
})
export class BlogModule {}
