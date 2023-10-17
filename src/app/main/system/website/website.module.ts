import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WebsiteRoutes } from './website.routing';

@NgModule({
    imports: [
        RouterModule.forChild(WebsiteRoutes)
    ]
})
export class WebsiteModule {
}
