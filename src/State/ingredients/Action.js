import { api } from "../../component/config/api";
import { CREATE_INGREDIENT_CATEGORY_SUCCESS, CREATE_INGREDIENT_SUCCESS, GET_INGREDIENTS, UPDATE_STOCK } from "./ActionType";

export const getIngredientsOfRestaurant = ({id, jwt}) => async(dispatch) => {
   try {
      const response = await api.get(`/api/admin/ingredients/restaurant/${id}`, {
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });
     
      console.log("get all ingredients: ", response.data)
      dispatch({type: GET_INGREDIENTS, payload: response.data})

      
   } catch (err) {
      console.log("error", err)
   }
}

export const createIngredient = ({data, jwt}) => async(dispatch) => {
   try {
      const response = await api.post(`/api/admin/ingredients`, data, {
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });
     
      console.log("create ingredients: ", response.data)
      dispatch({type: CREATE_INGREDIENT_SUCCESS, payload: response.data})

      
   } catch (err) {
      console.log("error", err)
   }
}

export const createIngredientCategory = ({data, jwt}) => {  
   console.log("data", data, "jwt", jwt);
   return async(dispatch) => {   
   try {
      const response = await api.post("/api/admin/ingredients/category", data, {
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });
      console.log("created ingredients category: ", response.data)
      dispatch({type: CREATE_INGREDIENT_CATEGORY_SUCCESS, payload: response.data})
      
   } catch (err) {
      console.log("error", err)
   }
}}

export const getIngredientCategory = ({id, jwt}) => async(dispatch) => {
   try {
      const response = await api.get(`/api/admin/ingredients/restaurant/${id}/category`, {
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });
     
      console.log("get ingredients category", response.data)
      dispatch({type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, payload: response.data})
   } catch (err) {
      console.log("error", err)
   }
}

export const updateStockOfIngredients = ({id, jwt})    => async(dispatch) => {
   dispatch({type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST})
   try {
      const {data} = await api.put(`/api/admin/ingredients/${id}/stoke`, {},
         {
         headers: {
            Authorization: `Bearer ${jwt}`
         }
      } )
      
      console.log("updated stock: ", data)
      dispatch({type: UPDATE_STOCK, payload: data})
   } catch (err) {
      console.log("error", err)
   }
}