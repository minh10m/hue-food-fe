// src/State/Order/Action.js
import { api } from "../../component/config/api";
import {
  CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE,
  GET_USERS_ORDERS_REQUEST, GET_USERS_ORDERS_SUCCESS, GET_USERS_ORDERS_FAILURE,
} from "./ActionType";

// Tạo đơn hàng (user) -> /api/order
export const createOrder = ({ order }) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST });
    try {
      const { data } = await api.post(`/api/order`, order);

      // server trả PaymentResponse, nếu có payment_url thì redirect
      if (data?.payment_url) {
        window.location.href = data.payment_url;
      }

      dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
    } catch (err) {
      console.log("createOrder error", err);
      dispatch({
        type: CREATE_ORDER_FAILURE,
        payload: err?.response?.data || err.message,
      });
    }
  };
};

// Lịch sử đơn của user -> /api/order/user
export const getUsersOrders = () => {
  return async (dispatch) => {
    dispatch({ type: GET_USERS_ORDERS_REQUEST });
    try {
      const { data } = await api.get(`/api/order/user`);
      dispatch({ type: GET_USERS_ORDERS_SUCCESS, payload: data });
    } catch (err) {
      console.log("getUsersOrders error", err);
      dispatch({
        type: GET_USERS_ORDERS_FAILURE,
        payload: err?.response?.data || err.message,
      });
    }
  };
};
