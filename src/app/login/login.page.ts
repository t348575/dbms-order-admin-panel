import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {ToastService} from '../services/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    form: FormGroup;
    constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
        this.form = formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/home']).then().catch();
        }
    }
    ngOnInit() {
    }
    login() {
        if (this.form.valid) {
            try {
                const temp = parseInt(this.form.get('username').value, 10);
                if (isNaN(temp)) {
                    throw new Error('');
                }
            } catch (e) {
                if (this.form.get('username').value.indexOf('@toolshed.com') === -1) {
                    this.form.get('username').setValue(this.form.get('username').value + '@toolshed.com');
                }
            }
            this.auth.login(this.form.get('username').value, this.form.get('password').value).subscribe((data: boolean) => {
                if (data) {
                    this.router.navigate(['/home']).then().catch();
                    this.form.reset();
                } else {
                    ToastService.toast('Improper login or password', 3000, 'danger');
                }
            });
        } else {
            ToastService.toast('Fill in the details correctly!', 3000, 'danger');
        }
    }
}
