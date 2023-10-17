import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListSysRoutes } from './listsys.routing';

@NgModule({
    imports: [
        RouterModule.forChild(ListSysRoutes)
    ]
})
export class ListSysModule {
}
