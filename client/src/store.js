import React, { createContext, useReducer } from 'react';


export const Store = createContext();

const initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
    },
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'CART_ADD_ITEM':
            localStorage.setItem('cartItems',
                JSON.stringify([...state.cart.cartItems, action.payload]));
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItems: [...state.cart.cartItems, action.payload]
                }
            };

        case 'CART_REMOVE_ITEM':
            const cartItems = state.cart.cartItems.filter((item, index) =>
                index !== action.payload
            )
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return { ...state, cart: { ...state.cart, cartItems } };

        case 'CART_UPDATE_ITEM':
            const copy = state.cart.cartItems.slice();
            copy[action.payload.key].quantity = action.payload.newQuantity;
            localStorage.setItem('cartItems', JSON.stringify(copy));
            return { ...state, cart: { ...state.cart, cartItems: copy } };
        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItems: [] } };
        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };
        case 'USER_SIGNOUT':
            return {
                ...state,
                userInfo: null,
                cart: {
                    cartItems: []
                },
            };



        default: return state;
    }
}

export const StoreProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}