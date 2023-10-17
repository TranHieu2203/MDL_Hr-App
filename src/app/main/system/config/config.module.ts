import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SystemConfigRoutes } from './config.routing';

@NgModule({
    imports: [
        RouterModule.forChild(SystemConfigRoutes)
    ]
})
export class SystemConfigModule {
}
