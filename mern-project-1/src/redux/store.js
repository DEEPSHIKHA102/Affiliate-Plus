import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from './user/reducer';



export const store = configureStore({
    reducer: {
        
        userDetails: userReducer,
        
    }
});

// {
//     type: "SET_USER",
//     payload: newValue
// }