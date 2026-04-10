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
    protected formSignUp: FormGroup | null = null;

    public ngOnInit(): void {
        this.formSignUp = this.formBuilder.group({
            name: ['Test', [Validators.required]],
            email: ['1@gmail.com', [Validators.required, Validators.email]],
            password: [
                '123456789',
                [Validators.required, Validators.minLength(8)],
            ],
        });
    }

    public signUp(): void {
        const isFormValid = !!this.formSignUp?.valid;
        const newUser = this.formSignUp?.getRawValue();
        console.log(newUser);

        if (isFormValid) {
            this.httpService.post('auth/sign-up', newUser).subscribe((user) => {
                console.log(user);
            });
        }
    }
}
