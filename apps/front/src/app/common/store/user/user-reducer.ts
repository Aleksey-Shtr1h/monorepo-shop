import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user-actions';
import { IUserCore } from '@front-lib/core';

export const initialState: Readonly<IUserCore> = {
    id: null,
    role: null,
};

export const userReducer = createReducer(
    initialState,
    on(UserActions.initUserStore, (state, { id, role }) => {
        console.log(id, role);

        return { ...state, role, id };
    }),
);
