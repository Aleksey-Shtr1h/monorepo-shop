import { Component, inject, OnInit } from '@angular/core';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { HttpService } from '../../infrastructure/services';

@Component({
    selector: 'lib-front-core-auth',
    imports: [
        Card,
        FloatLabel,
        IconField,
        Message,
        Password,
        InputIcon,
        InputText,
        Button,
        ReactiveFormsModule,
    ],
    providers: [HttpService],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
})
export class AuthCoreComponent implements OnInit {
    protected formBuilder = inject(FormBuilder);
    protected httpService = inject(HttpService);
    protected formRegister: FormGroup | null = null;
    protected formLogin: FormGroup | null = null;

    public ngOnInit(): void {
        this.formRegister = this.formBuilder.group({
            name: ['Test', [Validators.required]],
            email: ['3@gmail.com', [Validators.required, Validators.email]],
            password: [
                '123456789',
                [Validators.required, Validators.minLength(8)],
            ],
        });

        this.formLogin = this.formBuilder.group({
            email: ['3@gmail.com', [Validators.required, Validators.email]],
            password: [
                '123456789',
                [Validators.required, Validators.minLength(8)],
            ],
        });
    }

    public register(): void {
        const isFormValid = !!this.formRegister?.valid;
        const newUser = this.formRegister?.getRawValue();

        if (isFormValid) {
            this.httpService
                .post('auth/register', newUser)
                .subscribe((user) => {
                    console.log(user);
                });
        }
    }

    public login(): void {
        const isFormValid = !!this.formLogin?.valid;
        const user = this.formLogin?.getRawValue();
        const postOptions = {
            withCredentials: true,
        };

        if (isFormValid) {
            this.httpService
                .post('auth/login', user, postOptions)
                .subscribe((user) => {
                    console.log(user);
                });
        }
    }
}
