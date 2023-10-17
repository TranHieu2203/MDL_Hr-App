import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SystemRoutes } from './system.routing';
import { Error404Module } from '../errors/404/error-404.module';

@NgModule({
    imports: [
        RouterModule.forChild(SystemRoutes),
        Error404Module
    ],
})
export class SystemModule {
}
