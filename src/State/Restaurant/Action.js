// src/State/Restaurant/Action.js
import { api } from "../../component/config/api";
import {
  CREATE_RESTAURANT_REQUEST, CREATE_RESTAURANT_SUCCESS, CREATE_RESTAURANT_FAILURE,
  GET_ALL_RESTAURANTS_REQUEST, GET_ALL_RESTAURANTS_SUCCESS, GET_ALL_RESTAURANTS_FAILURE,
  DELETE_RESTAURANT_REQUEST, DELETE_RESTAURANT_SUCCESS, DELETE_RESTAURANT_FAILURE,
  UPDATE_RESTAURANT_REQUEST, UPDATE_RESTAURANT_SUCCESS, UPDATE_RESTAURANT_FAILURE,
  GET_RESTAURANT_BY_ID_REQUEST, GET_RESTAURANT_BY_ID_SUCCESS, GET_RESTAURANT_BY_ID_FAILURE,
  GET_RESTAURANT_BY_USER_ID_REQUEST, GET_RESTAURANT_BY_USER_ID_SUCCESS, GET_RESTAURANT_BY_USER_ID_FAILURE,
  UPDATE_RESTAURANT_STATUS_REQUEST, UPDATE_RESTAURANT_STATUS_SUCCESS, UPDATE_RESTAURANT_STATUS_FAILURE,
  CREATE_EVENTS_REQUEST, CREATE_EVENTS_SUCCESS, CREATE_EVENTS_FAILURE,
  GET_ALL_EVENTS_REQUEST, GET_ALL_EVENTS_SUCCESS, GET_ALL_EVENTS_FAILURE,
  DELETE_EVENTS_REQUEST, DELETE_EVENTS_SUCCESS, DELETE_EVENTS_FAILURE,
  GET_RESTAURANTS_EVENTS_REQUEST, GET_RESTAURANTS_EVENTS_SUCCESS, GET_RESTAURANTS_EVENTS_FAILURE,
  CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_CATEGORY_FAILURE,
  GET_RESTAURANTS_CATEGORY_REQUEST, GET_RESTAURANTS_CATEGORY_SUCCESS, GET_RESTAURANTS_CATEGORY_FAILURE,
} from "./ActionType";

/** ===================== RESTAURANTS (public + admin) ===================== **/

// GET /api/restaurants  (PUBLIC theo controller)
export const getAllRestaurantAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_RESTAURANTS_REQUEST });
  try {
    const { data } = await api.get(`/api/restaurants`, {
      // đã có /^\/api\/restaurants\// trong PUBLIC_PATHS nên không cần meta
    });
    dispatch({ type: GET_ALL_RESTAURANTS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: GET_ALL_RESTAURANTS_FAILURE, payload: err?.response?.data || err.message });
  }
};

// GET /api/restaurants/{id}  (PUBLIC theo controller)
export const getRestaurantId = ({ restaurantId }) => async (dispatch) => {
  dispatch({ type: GET_RESTAURANT_BY_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/restaurants/${restaurantId}`);
    dispatch({ type: GET_RESTAURANT_BY_ID_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: GET_RESTAURANT_BY_ID_FAILURE, payload: err?.response?.data || err.message });
  }
};


// GET /api/admin/restaurants/user  (ADMIN – controller không show ở trên nhưng bạn đang dùng)
export const getRestaurantByUserId = () => async (dispatch) => {
  dispatch({ type: GET_RESTAURANT_BY_USER_ID_REQUEST });
  try {
    const { data } = await api.get(`/api/admin/restaurants/user`);
    console.log("[getRestaurantByUserId] response:", data);
    dispatch({ type: GET_RESTAURANT_BY_USER_ID_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: GET_RESTAURANT_BY_USER_ID_FAILURE, payload: err?.response?.data || err.message });
  }
};

// POST /api/admin/restaurants  
export const createRestaurant = ({ data: body }) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_RESTAURANT_REQUEST });
    try {
      const { data } = await api.post(`/api/admin/restaurants`, body);
      dispatch({ type: CREATE_RESTAURANT_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: CREATE_RESTAURANT_FAILURE, payload: err?.response?.data || err.message });
    }
  };
};

// PUT /api/admin/restaurants/{id}  (ADMIN)
export const updateRestaurant = ({ restaurantId, restaurantData }) => async (dispatch) => {
  dispatch({ type: UPDATE_RESTAURANT_REQUEST });
  try {
    const { data } = await api.put(`/api/admin/restaurants/${restaurantId}`, restaurantData);
    dispatch({ type: UPDATE_RESTAURANT_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: UPDATE_RESTAURANT_FAILURE, payload: err?.response?.data || err.message });
  }
};

// DELETE /api/admin/restaurants/{id}  (ADMIN)
export const deleteRestaurant = ({ restaurantId }) => async (dispatch) => {
  dispatch({ type: DELETE_RESTAURANT_REQUEST, meta: { restaurantId } });
  try {
    await api.delete(`/api/admin/restaurants/${restaurantId}`);
    dispatch({ type: DELETE_RESTAURANT_SUCCESS, payload: restaurantId });
  } catch (err) {
    dispatch({ type: DELETE_RESTAURANT_FAILURE, payload: err?.response?.data || err.message });
  }
};

// PUT /api/admin/restaurants/{id}/status  (ADMIN)
export const updateRestaurantStatus = ({ restaurantId }) => async (dispatch) => {
  dispatch({ type: UPDATE_RESTAURANT_STATUS_REQUEST, meta: { restaurantId } });
  try {
    const { data } = await api.put(`/api/admin/restaurants/${restaurantId}/status`, {});
    dispatch({ type: UPDATE_RESTAURANT_STATUS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: UPDATE_RESTAURANT_STATUS_FAILURE, payload: err?.response?.data || err.message });
  }
};

/** ===================== EVENTS (public? + admin) ===================== **/

// POST /api/admin/events/restaurant/{restaurantId}  (ADMIN)
export const createEvenAction = ({ data: body, restaurantId }) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_EVENTS_REQUEST });
    try {
      const { data } = await api.post(`/api/admin/events/restaurant/${restaurantId}`, body);
      dispatch({ type: CREATE_EVENTS_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: CREATE_EVENTS_FAILURE, payload: err?.response?.data || err.message });
    }
  };
};

// GET /api/events 
export const getAllEvents = () => async (dispatch) => {
  dispatch({ type: GET_ALL_EVENTS_REQUEST });
  try {
    console.log("getAllEvents");
    const { data } = await api.get(`/api/events`,);
    console.log("getAllEvents data", data);
    dispatch({ type: GET_ALL_EVENTS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: GET_ALL_EVENTS_FAILURE, payload: err?.response?.data || err.message });
  }
};

// DELETE /api/admin/events/{eventId}  (ADMIN)
export const deleteEventAction = ({ eventId }) => async (dispatch) => {
  dispatch({ type: DELETE_EVENTS_REQUEST, meta: { eventId } });
  try {
    await api.delete(`/api/admin/events/${eventId}`);
    dispatch({ type: DELETE_EVENTS_SUCCESS, payload: eventId });
  } catch (err) {
    dispatch({ type: DELETE_EVENTS_FAILURE, payload: err?.response?.data || err.message });
  }
};

// GET /api/admin/events/restaurant/{restaurantId}  (ADMIN – nếu muốn public thì thêm meta.isPublic)
export const getRestaurantsEvents = ({ restaurantId }) => async (dispatch) => {
  dispatch({ type: GET_RESTAURANTS_EVENTS_REQUEST });
  try {
    const { data } = await api.get(`/api/admin/events/restaurant/${restaurantId}`);
    dispatch({ type: GET_RESTAURANTS_EVENTS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: GET_RESTAURANTS_EVENTS_FAILURE, payload: err?.response?.data || err.message });
  }
};

/** ===================== CATEGORY (admin + public) ===================== **/

// POST /api/admin/category  (ADMIN)
export const createCategoryAction = (body) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_REQUEST });
    try {
      const response = await api.post(`/api/admin/category`, body);
      dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: response.data });
      return response.data; // trả về để component await
    } catch (err) {
      const payload = err?.response?.data || err?.message || "Unknown error";
      dispatch({ type: CREATE_CATEGORY_FAILURE, payload });
      throw err; // re-throw để component bắt
    }
  };
};


// GET /api/category/restaurant/{id}
export const getRestaurantsCategory = ({ restaurantId }) => async (dispatch) => {
  dispatch({ type: GET_RESTAURANTS_CATEGORY_REQUEST });
  try {
    const { data } = await api.get(`/api/category/restaurant/${restaurantId}`);
    dispatch({ type: GET_RESTAURANTS_CATEGORY_SUCCESS, payload: data });
    console.log("categories payload", data);
  } catch (err) {
    dispatch({ type: GET_RESTAURANTS_CATEGORY_FAILURE, payload: err?.response?.data || err.message });
  }
};

