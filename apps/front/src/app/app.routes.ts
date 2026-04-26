import { Route } from '@angular/router';
import { DashComponent } from './modules/dash/dash.component';
import { AuthGuard } from '@front-lib/core';

export const appRoutes: Route[] = [
    {
        path: 'admin',
        component: DashComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'auth',
        children: [
            {
                path: 'register',
                loadComponent: () =>
                    import('./modules/auth/auth.component').then((m) => m.AuthCoreComponent),
            },
            {
                path: 'login',
                loadComponent: () =>
                    import('./modules/auth/auth.component').then((m) => m.AuthCoreComponent),
            },
        ],
    },
];
