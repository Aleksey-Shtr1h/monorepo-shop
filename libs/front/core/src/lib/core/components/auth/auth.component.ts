import { Component } from '@angular/core';
import {Card} from "primeng/card";
import {FloatLabel} from "primeng/floatlabel";
import {IconField} from "primeng/iconfield";
import {Message} from "primeng/message";
import {Password} from "primeng/password";
import {InputIcon} from "primeng/inputicon";
import {InputText} from "primeng/inputtext";

@Component({
  selector: 'lib-front-core-auth',
    imports: [
        Card,
        FloatLabel,
        IconField,
        Message,
        Password,
        InputIcon,
        InputText
    ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthCoreComponent {

}
