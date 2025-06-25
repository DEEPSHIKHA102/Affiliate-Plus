import { CLEAR_USER, SET_USER } from "./actions";

// Initial state can be null or an empty object depending on use case
const initialState = null;

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      // When user logs in or is authenticated
      return action.payload;

    case CLEAR_USER:
      // When user logs out
      return null;

    default:
      // Return current state for unrelated actions
      return state;
  }
};
