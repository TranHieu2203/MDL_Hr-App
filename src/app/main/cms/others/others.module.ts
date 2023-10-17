import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OthersRoutes } from './others.routing';
import { Error404Module } from '../../errors/404/error-404.module';

@NgModule({
    imports: [
        RouterModule.forChild(OthersRoutes),
        Error404Module
    ]
})
export class OthersModule {
}
