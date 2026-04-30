import {
    Component,
    inject,
    OnInit,
} from '@angular/core';
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
import {
    AuthService,
} from '@front-lib/core';
import { Store } from '@ngrx/store';
import { IRootStore } from '../../common/store/interface/store.interface';
import { UserActions } from '../../common/store/user/user-actions';

@Component({
    selector: 'root-auth',
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
    providers: [AuthService],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
})
export class AuthCoreComponent implements OnInit {
    public formRegister: FormGroup | null = null;
    public formLogin: FormGroup | null = null;
    
    private _formBuilder = inject(FormBuilder);
    private _authService = inject(AuthService);
    private _store: Store<IRootStore> = inject(Store);
    
    public ngOnInit(): void {
        this.formRegister = this._formBuilder.group({
            name: [
                'Test',
                [ Validators.required ],
            ],
            email: [
                '3@gmail.com',
                [
                    Validators.required,
                    Validators.email,
                ],
            ],
            password: [
                '123456789',
                [
                    Validators.required,
                    Validators.minLength(8),
                ],
            ],
        });
        
        this.formLogin = this._formBuilder.group({
            email: [
                '3@gmail.com',
                [
                    Validators.required,
                    Validators.email,
                ],
            ],
            password: [
                '123456789',
                [
                    Validators.required,
                    Validators.minLength(8),
                ],
            ],
        });
    }
    
    public register(): void {
        const isFormValid = !!this.formRegister?.valid;
        const newUser = this.formRegister?.getRawValue();
        
        if (isFormValid) {
            this._authService.register(newUser).subscribe();
        }
    }
    
    public login(): void {
        const isFormValid = !!this.formLogin?.valid;
        const user = this.formLogin?.getRawValue();
        
        if (isFormValid) {
            this._authService.login(user)
                .subscribe(
                    {
                        next: (user) => {
                            this._authService.updateIsAuthenticatedSignal(true);
                            this._store.dispatch(UserActions.initUserStore(user));
                        },
                        error: (error) => {
                            console.error(error);
                        }
                    }
                );
        }
    }
}
