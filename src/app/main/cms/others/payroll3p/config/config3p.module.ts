import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Config3PRoutes } from './config3p.routing';
import { Error404Module } from '../../../../errors/404/error-404.module';

@NgModule({
    imports: [
        RouterModule.forChild(Config3PRoutes),
        Error404Module
    ]
})
export class Config3PModule {
}
