// src/State/Ingredients/Reducer.js
import {
   GET_INGREDIENTS_REQUEST, GET_INGREDIENTS_SUCCESS, GET_INGREDIENTS_FAILURE,
   GET_INGREDIENT_CATEGORY_REQUEST, GET_INGREDIENT_CATEGORY_SUCCESS, GET_INGREDIENT_CATEGORY_FAILURE,
   CREATE_INGREDIENT_REQUEST, CREATE_INGREDIENT_SUCCESS, CREATE_INGREDIENT_FAILURE,
   CREATE_INGREDIENT_CATEGORY_REQUEST, CREATE_INGREDIENT_CATEGORY_SUCCESS, CREATE_INGREDIENT_CATEGORY_FAILURE,
   UPDATE_INGREDIENT_STOCK_REQUEST, UPDATE_INGREDIENT_STOCK_SUCCESS, UPDATE_INGREDIENT_STOCK_FAILURE
 } from "./ActionType";
 
 const initialState = {
   loading: false,
   error: null,
   ingredients: [],
   category: [],
   update: null
 };
 
 export const ingredientsReducer = (state = initialState, action) => {
   switch (action.type) {
     case GET_INGREDIENTS_REQUEST:
     case GET_INGREDIENT_CATEGORY_REQUEST:
     case CREATE_INGREDIENT_REQUEST:
     case CREATE_INGREDIENT_CATEGORY_REQUEST:
     case UPDATE_INGREDIENT_STOCK_REQUEST:
       return { ...state, loading: true, error: null };
 
     case GET_INGREDIENTS_SUCCESS:
       return { ...state, loading: false, ingredients: action.payload };
 
     case GET_INGREDIENT_CATEGORY_SUCCESS:
       return { ...state, loading: false, category: action.payload };
 
     case CREATE_INGREDIENT_SUCCESS:
       return { ...state, loading: false, ingredients: [...state.ingredients, action.payload] };
 
     case CREATE_INGREDIENT_CATEGORY_SUCCESS:
       return { ...state, loading: false, category: [...state.category, action.payload] };
 
     case UPDATE_INGREDIENT_STOCK_SUCCESS:
       return {
         ...state,
         loading: false,
         update: action.payload,
         ingredients: state.ingredients.map((ing) =>
           ing.id === action.payload.id ? action.payload : ing
         )
       };
 
     case GET_INGREDIENTS_FAILURE:
     case GET_INGREDIENT_CATEGORY_FAILURE:
     case CREATE_INGREDIENT_FAILURE:
     case CREATE_INGREDIENT_CATEGORY_FAILURE:
     case UPDATE_INGREDIENT_STOCK_FAILURE:
       return { ...state, loading: false, error: action.payload };
 
     default:
       return state;
   }
 };
