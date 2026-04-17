import { Route } from '@angular/router';
import { DashComponent } from './modules/dash/dash.component';
import { AuthGuard } from '@front-lib/core';

export const appRoutes: Route[] = [
    {
        path: 'dash',
        component: DashComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'auth',
        children: [
            {
                path: 'sign-in',
                loadComponent: () =>
                    import('@front-lib/core').then((m) => m.AuthCoreComponent),
            },
            {
                path: 'sign-up',
                loadComponent: () =>
                    import('@front-lib/core').then((m) => m.AuthCoreComponent),
            },
        ],
    },
];
