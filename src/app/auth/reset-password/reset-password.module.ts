import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ResetPasswordComponent } from './reset-password.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes = [
    {
        path: ':id',
        component: ResetPasswordComponent
    }
];

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        TlaSharedModule
    ]
})
export class ResetPasswordModule {
}
