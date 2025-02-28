import { api } from "../../component/config/api";
import { UPDATE_CARTITEM_FAILURE } from "../Cart/ActionType";
import { GET_RESTAURANT_ORDER_FAILURE, GET_RESTAURANT_ORDER_REQUEST, GET_RESTAURANT_ORDER_SUCCESS, UPDATE_ORDER_STATUS_REQUEST, UPDATE_ORDER_STATUS_SUCCESS } from "./ActionType";

export const updateOrderStatus = ({orderId, orderStatus, jwt})  => async(dispatch) => {
   dispatch({type: UPDATE_ORDER_STATUS_REQUEST})
   try {
      const response = await api.put(`/api/admin/orders/${orderId}/${orderStatus}`, {},
         {
         headers: {
            Authorization: `Bearer ${jwt}`
         }
      } )
      console.log("updated order:", response.data)
      dispatch({type: UPDATE_ORDER_STATUS_SUCCESS, payload: response.data})
   } catch (err) {
      dispatch({type: UPDATE_CARTITEM_FAILURE, payload: err})
      console.log("error", err)
   }
}


export const fetchRestaurantOrder = ({restaurantId, orderStatus, jwt}) => async(dispatch) => {
   dispatch({type: GET_RESTAURANT_ORDER_REQUEST})
   try {
      const {data} = await api.get(`/api/admin/order/restaurant/${restaurantId}`, {
         params: {order_status: orderStatus},
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });
     
      dispatch({type: GET_RESTAURANT_ORDER_SUCCESS, payload: data})
      console.log("restaurant order: ", data)
   } catch (err) {
      dispatch({type: GET_RESTAURANT_ORDER_FAILURE, payload: err})
      console.log("error", err)
   }
}