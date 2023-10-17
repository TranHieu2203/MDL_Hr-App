import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginModule } from './login/login.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@NgModule({
    imports: [
        // Authentication
        LoginModule,
        ForgotPasswordModule,
        ResetPasswordModule,
    ]
})
export class AuthModule {

}
