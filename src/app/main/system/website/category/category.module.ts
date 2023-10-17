import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryComponent } from './category.component';
import { CoreService } from 'src/app/_services/core.service';
import { CategoryEditComponent } from './edit/category-edit.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent
  },{
    path: ':id',
    component: CategoryEditComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TlaSharedModule
  ],
  declarations: [CategoryComponent, CategoryEditComponent],
  providers: [CoreService]
})
export class CategoryModule {}
