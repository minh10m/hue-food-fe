// src/State/MenuItem/Action.js
import { api } from "../../component/config/api";
import {
  CREATE_MENU_ITEM_REQUEST, CREATE_MENU_ITEM_SUCCESS, CREATE_MENU_ITEM_FAILURE,
  GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST, GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE,
  SEARCH_MENU_ITEM_REQUEST, SEARCH_MENU_ITEM_SUCCESS, SEARCH_MENU_ITEM_FAILURE,
  UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST, UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
  DELETE_MENU_ITEM_REQUEST, DELETE_MENU_ITEM_SUCCESS, DELETE_MENU_ITEM_FAILURE,
} from "./ActionType";

// Tạo món (Admin)
export const createMenuItem = (menu) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_MENU_ITEM_REQUEST });
    try {
      // POST /api/admin/food
      const { data } = await api.post(`/api/admin/food`, menu);
      dispatch({ type: CREATE_MENU_ITEM_SUCCESS, payload: data });
    } catch (err) {
      console.log("createMenuItem error", err);
      dispatch({ type: CREATE_MENU_ITEM_FAILURE, payload: err?.response?.data || err.message });
    }
  };
};

// Lấy danh sách món theo nhà hàng (public/private tùy backend)
export const getMenuItemsByRestaurantId = ({ restaurantId, vegetarian = false, nonVeg = false, seasonal = false, foodCategory = "" }) => {
  return async (dispatch) => {
    dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST });
    try {
      // GET /api/restaurant/{restaurantId}/food
      // Dùng params để truyền "food-category" đúng key @RequestParam(name="food-category")
      const { data } = await api.get(`/api/restaurant/${restaurantId}/food`, {
        params: {
          vegetarian,
          nonVeg,
          seasonal,
          "food-category": foodCategory || undefined,
        },
      });
      dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, payload: data });
    } catch (err) {
      console.log("getMenuItemsByRestaurantId error", err);
      dispatch({ type: GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, payload: err?.response?.data || err.message });
    }
  };
};

// Tìm kiếm món
export const searchMenuItem = (keyword) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
    try {
      // GET /api/food/search?name=...
      const { data } = await api.get(`/api/food/search`, { params: { name: keyword } });
      // Nếu muốn public:
      // const { data } = await api.get(`/api/food/search`, { params: { name: keyword }, meta: { isPublic: true } });
      dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
    } catch (err) {
      console.log("searchMenuItem error", err);
      dispatch({ type: SEARCH_MENU_ITEM_FAILURE, payload: err?.response?.data || err.message });
    }
  };
};

// Toggle availability (Admin)
export const updateMenuItemsAvailability = ({ foodId }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST });
    try {
      // PUT /api/admin/food/{id}
      const { data } = await api.put(`/api/admin/food/${foodId}`, {});
      dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload: data });
    } catch (err) {
      console.log("updateMenuItemsAvailability error", err);
      dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE, payload: err?.response?.data || err.message });
    }
  };
};

// Xoá món (Admin)
export const deleteFoodAction = ({ foodId }) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_MENU_ITEM_REQUEST });
    try {
      // DELETE /api/admin/food/{id}
      await api.delete(`/api/admin/food/${foodId}`);
      dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: foodId });
    } catch (err) {
      console.log("deleteFoodAction error", err);
      dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: err?.response?.data || err.message });
    }
  };
};
