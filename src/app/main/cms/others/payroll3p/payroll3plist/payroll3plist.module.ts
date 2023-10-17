import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Payroll3PListRoutes } from './payroll3plist.routing';
import { Error404Module } from '../../../../errors/404/error-404.module';

@NgModule({
    imports: [
        RouterModule.forChild(Payroll3PListRoutes),
        Error404Module
    ]
})
export class Payroll3PListModule {
}
