import { Route } from '@angular/router';
import {AuthCoreComponent} from "../../../../libs/front/core/src/lib/core/auth/auth.component";

export const appRoutes: Route[] = [
    {
        path: 'auth',
        loadComponent: () => import('../../../../libs/front/core/src/lib/core/auth/auth.component')
            .then(m => m.AuthCoreComponent),
    }
];
