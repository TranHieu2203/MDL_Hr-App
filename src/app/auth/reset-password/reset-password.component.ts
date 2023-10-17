import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { CoreService } from "src/app/_services/core.service";
import { Notification } from "src/app/common/notification";
import { ModalService } from "src/app/_services/modal.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ResetPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    username = "";
    public model: ForgotPass = new ForgotPass()
    passwordForm: FormGroup;
    confirmFlag = false;
    flagOldPassword = false;

    //eye
    tooglePassWord1 = false;
    tooglePassWord2 = false;
    tooglePassWord3 = false;
    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        public activatedRoute: ActivatedRoute,
        public router: Router,
        private _coreService: CoreService,
        private notification: Notification,
        private modalService: ModalService

    ) {
        this.forgotPasswordForm = this._formBuilder.group({
            otp: ["", Validators.required]
        });

        // form doi mat khau
        this.passwordForm = _formBuilder.group({
            ip_address: [""],
            channel_code: [],
            username: [""],
            password: ["", Validators.required],
            confirm_password: ["", Validators.required],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // lấy phone từ localStorage
        let username: any = localStorage.getItem('username')!;
        username = JSON.parse(username);
        this.username = username;
        // localStorage.removeItem('phone');
    }


    // Xác nhận đổi mật khẩu or không đổi mật khẩu
    confirmChoose(status: any) {
        if (status == "cancel") {
            this.modalService.close("open-change-pass");
        } else {
            if (!this.passwordForm.valid) {
                this.notification.warning("Lưu không thành công!");
                this.passwordForm.markAsUntouched();
                this.passwordForm.markAsPristine();
                this.passwordForm.markAllAsTouched();
        } else {
                if (this.model.password !== this.model.confirm_password) {
                    this.confirmFlag = true;
                } else {

                 
                    this.passwordForm.markAsUntouched();
                    this.passwordForm.markAsPristine();
                    this.modalService.close("open-change-pass");
                }
            }
        }
    }
    // Lưu dữ liệu
 
    // =============== END ===============
}
export class ForgotPass {
    id?: string;
    phone?: string;
    otp?: string;

    ip_address?: string;
    channel_code?: string;
    username?: string;
    old_password?: string;
    password?: string;
    confirm_password: any;
}
