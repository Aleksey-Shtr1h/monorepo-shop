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
import { UserActions } from '../../common/store/user/user-actions';

@Component({
    selector: 'root-header-app',
    imports: [
        Menubar,
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
        },
        {
            icon: 'pi pi-heart',
        },
        {
            icon: 'pi pi-user',
            routerLink: 'auth/login',
        },
        {
            icon: 'pi pi-shopping-cart',
        },
    ]);

    private readonly _store: Store<{ user: IUserCore }> = inject(Store);
    public user: Signal<IUserCore> = this._store.selectSignal((state) => state.user);

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

    public i() {
        this._store.dispatch(UserActions.initUserStore({id: 'myId', role: 'admin'}));
    }

    public i2() {
        console.log(this.user());
        console.log(this.baseUserMenuItems());
    }
}
