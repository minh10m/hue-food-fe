// actions/cart/Action.js (sửa)
import { api } from "../../component/config/api";
import {
  FIND_CART_REQUEST, FIND_CART_SUCCESS, FIND_CART_FAILURE,
  ADD_ITEMS_TO_CART_REQUEST, ADD_ITEMS_TO_CART_SUCCESS, ADD_ITEMS_TO_CART_FAILURE,
  UPDATE_CARTITEM_REQUEST, UPDATE_CARTITEM_SUCCESS, UPDATE_CARTITEM_FAILURE,
  REMOVE_CARTITEM_REQUEST, REMOVE_CARTITEM_SUCCESS, REMOVE_CARTITEM_FAILURE,
  CLEARE_CART_REQUEST, CLEARE_CART_SUCCESS, CLEARE_CART_FAILURE,
  // GET_ALL_CART_ITEMS_REQUEST, GET_ALL_CART_ITEMS_SUCCESS, GET_ALL_CART_ITEMS_FAILURE, // <- bỏ nếu BE không có
} from "./ActionType";

// helper chuẩn hoá lỗi
const normErr = (err) =>
  err?.response?.data?.message || err?.message || "Request failed";

// LẤY GIỎ HÀNG CỦA USER
export const findCart = () => async (dispatch) => {
  dispatch({ type: FIND_CART_REQUEST });
  try {
    const { data } = await api.get(`/api/cart`);      // interceptor sẽ gắn Authorization
    dispatch({ type: FIND_CART_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: FIND_CART_FAILURE, payload: normErr(err) });
  }
};

// THÊM MÓN VÀO GIỎ
// reqData = { cartItem: AddCartItemRequest }
export const addItemToCart = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_ITEMS_TO_CART_REQUEST });
  try {
    const { data } = await api.put(`/api/cart/add`, reqData.cartItem);
    dispatch({ type: ADD_ITEMS_TO_CART_SUCCESS, payload: data });
    // Optionally refresh cart:
    // dispatch(findCart());
  } catch (err) {
    dispatch({ type: ADD_ITEMS_TO_CART_FAILURE, payload: normErr(err) });
  }
};

// CẬP NHẬT SỐ LƯỢNG 1 CART ITEM
// reqData = { cartItemId, quantity }
export const updateCartItem = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_CARTITEM_REQUEST });
  try {
    const body = { cartItemId: reqData.cartItemId, quantity: reqData.quantity };
    const { data } = await api.put(`/api/cart-item/update`, body);
    dispatch({ type: UPDATE_CARTITEM_SUCCESS, payload: data });
    // dispatch(findCart());
  } catch (err) {
    dispatch({ type: UPDATE_CARTITEM_FAILURE, payload: normErr(err) });
  }
};

// XOÁ 1 CART ITEM
export const removeCartItem = (cartItemId) => async (dispatch) => {
  dispatch({ type: REMOVE_CARTITEM_REQUEST });
  try {
    await api.delete(`/api/cart-item/${cartItemId}/remove`);
    dispatch({ type: REMOVE_CARTITEM_SUCCESS, payload: cartItemId });
    // dispatch(findCart());
  } catch (err) {
    dispatch({ type: REMOVE_CARTITEM_FAILURE, payload: normErr(err) });
  }
};

// XOÁ TOÀN BỘ GIỎ
export const clearCartItem = () => async (dispatch) => {
  dispatch({ type: CLEARE_CART_REQUEST });
  try {
    const { data } = await api.put(`/api/cart/clear`, {});
    dispatch({ type: CLEARE_CART_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: CLEARE_CART_FAILURE, payload: normErr(err) });
  }
};
