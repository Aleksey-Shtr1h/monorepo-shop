import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

const { AuthGuard, AuthInterceptor, AuthService, HttpService } = await import('@front-lib/core');

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(
            withInterceptorsFromDi(),
        ),
        provideBrowserGlobalErrorListeners(),
        provideRouter(appRoutes),
        providePrimeNG({
            theme: {
                preset: Aura,
            },
        }),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        // AuthInterceptor,
        AuthGuard,
        AuthService,
        HttpService,
    ],
};
