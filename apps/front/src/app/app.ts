import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
const { HttpService, AuthService} = await import('@front-lib/core');

@Component({
    imports: [RouterModule],
    providers: [
        HttpService,
        AuthService,
    ],
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    private _httpService = inject(HttpService);
    private _authService = inject(AuthService);

    public profile() {
        this._authService
            .getProfile()
            .subscribe(d => {
                console.log(d);
            })
    }

    public logout() {
        this._authService.logout().subscribe();
    }
}
