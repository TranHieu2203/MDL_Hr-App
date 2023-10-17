import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Payroll3PRoutes } from './payroll3p.routing';
import { Error404Module } from '../../../errors/404/error-404.module';

@NgModule({
    imports: [
        RouterModule.forChild(Payroll3PRoutes),
        Error404Module
    ]
})
export class Payroll3PModule {
}
