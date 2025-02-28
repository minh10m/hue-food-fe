import { api } from "../../component/config/api";
import { CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, GET_USERS_ORDERS_FAILURE, GET_USERS_ORDERS_REQUEST, GET_USERS_ORDERS_SUCCESS } from "./ActionType";

export const createOrder = (reqData) => {
   return async(dispatch) => {
   dispatch({type: CREATE_ORDER_REQUEST})
   try {
      const {data} = await api.post("api/order", reqData.order, {
         headers: {
            Authorization: `Bearer ${reqData.jwt}` 
         } 
      });
      console.log("created order: ", data)
      dispatch({type: CREATE_ORDER_SUCCESS, payload: data})
      
   } catch (err) {
      console.log("error", err)
      dispatch({type: CREATE_ORDER_FAILURE, payload: err})
   }
}}

export const getUsersOrders = (jwt) => async(dispatch) => {
   dispatch({type: GET_USERS_ORDERS_REQUEST})
   try {
      const {data} = await api.get("api/order/user", {
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });
     
      console.log("users orders: ", data)
      dispatch({type: GET_USERS_ORDERS_SUCCESS, payload: data})      
   } catch (err) {
      dispatch({type: GET_USERS_ORDERS_FAILURE, payload: err})
      console.log("error", err)
   }
}