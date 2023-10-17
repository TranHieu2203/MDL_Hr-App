import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password.component';
import { TlaSharedModule } from 'src/app/components/shared.module';

const routes = [
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    }
];

@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        TlaSharedModule

    ]
})
export class ForgotPasswordModule {
}
