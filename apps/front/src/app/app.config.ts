import {
    ApplicationConfig,
    inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    provideStore,
    Store,
} from '@ngrx/store';
import { initReducers } from './common/store/constant/init-reducers';
import {
    AuthGuard,
    AuthInterceptor,
    AuthService,
    HttpService,
    RolesGuard,
} from '@front-lib/core';
import {
    catchError,
    of,
    tap,
} from 'rxjs';
import { IRootStore } from './common/store/interface/store.interface';
import { UserActions } from './common/store/user/user-actions';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideBrowserGlobalErrorListeners(),
        provideRouter(appRoutes),
        providePrimeNG({
            theme: {
                preset: Aura,
            },
        }),
        provideStore(initReducers),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        provideAppInitializer(() => {
            const authService = inject(AuthService);
            const store: Store<IRootStore> = inject(Store);

            return authService.getProfile()
                .pipe(
                    tap(user => {
                        authService.updateIsAuthenticatedSignal(true);
                        store.dispatch(UserActions.initUserStore(user));
                    }),
                    catchError(() => {
                        return of(null);
                    }),
                );
        }),
        RolesGuard,
        AuthGuard,
        AuthService,
        HttpService,
    ],
};
