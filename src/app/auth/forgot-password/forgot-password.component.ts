import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Notification } from "src/app/common/notification";
import { ModalService } from "src/app/_services/modal.service";
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    phone: any;
    public model: ForgotPass = new ForgotPass();

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        public router: Router,
        private notification: Notification,
    ) {
        this.forgotPasswordForm = this._formBuilder.group({
            username: ['', [Validators.required]]
        });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

    }
    changePass() {
        if (!this.forgotPasswordForm.valid) {
            this.forgotPasswordForm.markAllAsTouched();
            return;
        }
        localStorage.setItem('username', JSON.stringify(this.model));
        this.router.navigate(['/auth/reset-password']);
    }
}
export class ForgotPass {
    id?: string;
    phone?: string;
    username?: string;
    otp?: string;
}

