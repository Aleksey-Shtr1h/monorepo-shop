import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'auth',
        loadComponent: () =>
            import(
                '@front-lib/core'
            ).then((m) => m.AuthCoreComponent),
    },
];
