// src/State/Order/AdminAction.js
import { api } from "../../component/config/api";
import {
  GET_RESTAURANT_ORDER_REQUEST,
  GET_RESTAURANT_ORDER_SUCCESS,
  GET_RESTAURANT_ORDER_FAILURE,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
} from "./ActionType";

// GET /api/admin/order/restaurant/{id}?orderStatus=...
export const getRestaurantOrders = ({ restaurantId, orderStatus }) => {
  return async (dispatch) => {
    dispatch({ type: GET_RESTAURANT_ORDER_REQUEST, meta: { restaurantId, orderStatus } });
    try {
      const { data } = await api.get(`/api/admin/order/restaurant/${restaurantId}`, {
        params: { orderStatus: orderStatus || undefined },
      });
      dispatch({ type: GET_RESTAURANT_ORDER_SUCCESS, payload: data, meta: { restaurantId, orderStatus } });
    } catch (err) {
      dispatch({
        type: GET_RESTAURANT_ORDER_FAILURE,
        payload: err?.response?.data || err.message,
        error: true,
        meta: { restaurantId, orderStatus },
      });
    }
  };
};

// PUT /api/admin/order/{orderId}/{orderStatus}
export const updateOrderStatus = ({ orderId, orderStatus }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST, meta: { orderId, orderStatus } });
    try {
      const { data } = await api.put(`/api/admin/order/${orderId}/${encodeURIComponent(orderStatus)}`);
      dispatch({ type: UPDATE_ORDER_STATUS_SUCCESS, payload: data, meta: { orderId, orderStatus } });
    } catch (err) {
      dispatch({
        type: UPDATE_ORDER_STATUS_FAILURE,
        payload: err?.response?.data || err.message,
        error: true,
        meta: { orderId, orderStatus },
      });
    }
  };
};
