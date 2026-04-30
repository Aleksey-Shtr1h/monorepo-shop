import {
    ChangeDetectionStrategy,
    Component,
    effect,
    inject,
    signal,
    Signal,
    untracked,
    WritableSignal,
} from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { Store } from '@ngrx/store';
import { IUserCore } from '@front-lib/core';
import { NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
import { InputIcon } from 'primeng/inputicon';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'root-header-app',
    imports: [
        Menubar,
        NgOptimizedImage,
        InputIcon,
        Tooltip,
    ],
    templateUrl: './header-app.component.html',
    styleUrl: './header-app.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderAppComponent {
    public baseUserMenuItems: WritableSignal<MenuItem[]> = signal([
        {
            icon: 'pi pi-wrench',
            visible: false,
            id: 'admin-room',
            routerLink: '/admin',
            tooltip: 'Админка',
        },
        {
            icon: 'pi pi-heart',
            tooltip: 'Избранное',
        },
        {
            icon: 'pi pi-user',
            routerLink: 'auth/login',
            tooltip: 'Данные пользователя',
        },
        {
            icon: 'pi pi-shopping-cart',
            tooltip: 'Корзина',
        },
    ]);

    private readonly _store: Store<{ user: IUserCore }> = inject(Store);
    public user: Signal<IUserCore> = this._store.selectSignal((state) => state.user);
    
    private _router = inject(Router);

    constructor() {
        effect(() => {
            const role = this.user()?.role;

            untracked(() => {
                const foundAdminRoomIdx = this.baseUserMenuItems()
                    .findIndex(manuItem => {
                        return manuItem.id === 'admin-room';
                    });

                if (foundAdminRoomIdx >= 0) {
                    this.baseUserMenuItems.update(items => {
                        items[foundAdminRoomIdx].visible = role === 'admin';

                        return items.slice();
                    });
                }
            });
        });
    }
    
    public async goToRoute(path: string): Promise<void> {
        if (path) {
            await this._router.navigate([ path ]);
        }
    }
}
