import { CLEAR_USER, SET_USER } from "./actions";

export const userReducer = (state = null, action) => {
    switch (action.type) {
        // This case will help in supporting login case
        case SET_USER:
            return action.payload

        // This case will help in supporting logout usecase.
        case CLEAR_USER:
            return null;
        // Handles case where other state update triggers
        // userDetails' reducer
        default:
            return state;
    }
};