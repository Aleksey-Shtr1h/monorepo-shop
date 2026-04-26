import { createActionGroup, props } from '@ngrx/store';
import { IUserCore } from '@front-lib/core';

export const UserActions = createActionGroup({
    source: 'UserOptions',
    events: {
        'Init User Store': props<IUserCore>(),
    },
});