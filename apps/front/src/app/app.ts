import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderAppComponent } from './modules/header-app/header-app.component';
import { AuthService } from '@front-lib/core';

@Component({
    imports: [
        RouterModule,
        HeaderAppComponent,
    ],
    providers: [AuthService],
    selector: 'root-app',
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    
    
    
    
    
    
    
    
    
    
    // ТЕСТЫ
    // public selectedFile: File | null = null;
    // private _httpService = inject(HttpService);
    // private _authService = inject(AuthService);
    // private _router = inject(Router);
    // private readonly store: Store<{ user: any }> = inject(Store);
    // public user: Signal<any> = this.store.selectSignal((state) => state.user);
    // constructor() {
    //     this._router.navigate(['dash']);
    // }
    //
    // public onFileSelected(event: any): void {
    //     this.selectedFile = event.target.files[0];
    // }
    //
    // public onUpload(): void {
    //     if (this.selectedFile) {
    //         this.uploadFile(this.selectedFile, 'slider-images').subscribe(file => {
    //             console.log(file);
    //         });
    //     }
    // }
    //
    // public uploadFile(file: File, folder: string) {
    //     const formData = new FormData();
    //     formData.append('image', file);
    //     formData.append('folder', folder);
    //
    //     return this._httpService.post('upload-files/upload-image', formData);
    // }
    //
    // public profile() {
    //     this._authService
    //         .getProfile()
    //         .subscribe(d => {
    //             console.log(d);
    //         });
    // }
    //
    // public logout() {
    //     this._authService.logout().subscribe();
    // }
    // //
    // public change() {
    //     this.store.dispatch(UserActions.initUserStore({id: 'myId', role: 'muRole'}));
    // }
    //
    // public info() {
    //     console.info(123);
    // }
}
