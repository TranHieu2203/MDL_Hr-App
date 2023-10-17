import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CmsRoutes } from './cms.routing';
//import { AutoformsModule } from "src/app/main/cms/autoforms/autoforms.module"
import { Error404Module } from '../errors/404/error-404.module';

@NgModule({
    imports: [
        //AutoformsModule,
        RouterModule.forChild(CmsRoutes),
        Error404Module
    ]
})
export class CmsModule {
}
