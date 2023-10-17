import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SysConfigRoutes } from './configsys.routing';

@NgModule({
    imports: [
        RouterModule.forChild(SysConfigRoutes)
    ]
})
export class SysConfigModule {
}
