import { api } from "../../component/config/api";
import { ADD_ITEMS_TO_CART_FAILURE, ADD_ITEMS_TO_CART_REQUEST, ADD_ITEMS_TO_CART_SUCCESS, CLEARE_CART_FAILURE, CLEARE_CART_REQUEST, CLEARE_CART_SUCCESS, FIND_CART_FAILURE, FIND_CART_REQUEST, FIND_CART_SUCCESS, GET_ALL_CART_ITEMS_FAILURE, GET_ALL_CART_ITEMS_REQUEST, GET_ALL_CART_ITEMS_SUCCESS, REMOVE_CARTITEM_FAILURE, REMOVE_CARTITEM_REQUEST, REMOVE_CARTITEM_SUCCESS, UPDATE_CARTITEM_FAILURE, UPDATE_CARTITEM_REQUEST, UPDATE_CARTITEM_SUCCESS } from "./ActionType";

export const findCart = (jwt) => async(dispatch) => {
   dispatch({type: FIND_CART_REQUEST})
   try {
      const response = await api.get(`api/cart`, {
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });

      console.log("cart: ", response.data)
      dispatch({type: FIND_CART_SUCCESS, payload: response.data})
   } catch (err) {
      dispatch({type: FIND_CART_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const getAllCartItems = (reqData) => async(dispatch) => {
   dispatch({type: GET_ALL_CART_ITEMS_REQUEST})
   try {
      const response = await api.get(`api/carts/${reqData.cartId}/items`, {
         headers: {
            Authorization: `Bearer ${reqData.token}` 
         } 
      });
     
      dispatch({type: GET_ALL_CART_ITEMS_SUCCESS, payload: response.data})

      console.log("restaurant by id", response.data)
   } catch (err) {
      dispatch({type: GET_ALL_CART_ITEMS_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const addItemToCart = (reqData)  => async(dispatch) => {
   dispatch({type: ADD_ITEMS_TO_CART_REQUEST})
   try {
      const {data} = await api.put(`api/cart/add`, reqData.cartItem,
         {
         headers: {
            Authorization: `Bearer ${reqData.token}`
         }
      } )
      console.log("add item to cart:", data)
      dispatch({type: ADD_ITEMS_TO_CART_SUCCESS, payload: data})
   } catch (err) {
      dispatch({type: ADD_ITEMS_TO_CART_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const updateCartItem = (reqData)  => async(dispatch) => {
   dispatch({type: UPDATE_CARTITEM_REQUEST})
   try {
      const {data} = await api.put(`api/cart-item/update`, reqData.data,
         {
         headers: {
            Authorization: `Bearer ${reqData.jwt}`
         }
      } )
      console.log("updated cart item:", data)
      dispatch({type: UPDATE_CARTITEM_SUCCESS, payload: data})
   } catch (err) {
      dispatch({type: UPDATE_CARTITEM_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const removeCartItem = ({cartItemId, jwt})    => async(dispatch) => {
   dispatch({type: REMOVE_CARTITEM_REQUEST})
   try {
      const {data} = await api.delete(`/api/cart-item/${cartItemId}/remove`, 
         {
         headers: {
            Authorization: `Bearer ${jwt}`
         }
      })

      console.log("removed cart item: ", data);
      dispatch({type: REMOVE_CARTITEM_SUCCESS, payload: cartItemId})
   } catch (err) {
      console.log("error", err)
      dispatch({type: REMOVE_CARTITEM_FAILURE, payload: err.message})
   }
}

export const clearCartItem = (reqData)  => async(dispatch) => {
   dispatch({type: CLEARE_CART_REQUEST})
   try {
      const {data} = await api.put(`/api/cart/clear`, {},
         {
         headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
         }
      } )
      console.log("clear cart:", data)
      dispatch({type: CLEARE_CART_SUCCESS, payload: data})
   } catch (err) {
      dispatch({type: CLEARE_CART_FAILURE, payload: err})
      console.log("error", err.message)
   }
}
