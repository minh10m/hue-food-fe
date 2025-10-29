// src/State/Ingredients/Action.js
import { api } from "../../component/config/api";
import {
  GET_INGREDIENTS_REQUEST, GET_INGREDIENTS_SUCCESS, GET_INGREDIENTS_FAILURE,
  GET_INGREDIENT_CATEGORY_REQUEST, GET_INGREDIENT_CATEGORY_SUCCESS, GET_INGREDIENT_CATEGORY_FAILURE,
  CREATE_INGREDIENT_REQUEST, CREATE_INGREDIENT_SUCCESS, CREATE_INGREDIENT_FAILURE,
  CREATE_INGREDIENT_CATEGORY_REQUEST, CREATE_INGREDIENT_CATEGORY_SUCCESS, CREATE_INGREDIENT_CATEGORY_FAILURE,
  UPDATE_INGREDIENT_STOCK_REQUEST, UPDATE_INGREDIENT_STOCK_SUCCESS, UPDATE_INGREDIENT_STOCK_FAILURE
} from "./ActionType";

// ---- GET all ingredients of a restaurant (PRIVATE) ----
export const getIngredientsOfRestaurant = ({ id }) => async (dispatch) => {
  dispatch({ type: GET_INGREDIENTS_REQUEST });
  try {
    const res = await api.get(`/api/admin/ingredients/restaurant/${id}`);
    dispatch({ type: GET_INGREDIENTS_SUCCESS, payload: res.data });
  } catch (err) {
    console.log("getIngredients error", err);
    dispatch({ type: GET_INGREDIENTS_FAILURE, payload: err?.response?.data || err.message });
  }
};

// ---- GET ingredient categories of a restaurant (PRIVATE) ----
export const getIngredientCategory = ({ id }) => async (dispatch) => {
  dispatch({ type: GET_INGREDIENT_CATEGORY_REQUEST });
  try {
    const res = await api.get(`/api/admin/ingredients/restaurant/${id}/category`);
    dispatch({ type: GET_INGREDIENT_CATEGORY_SUCCESS, payload: res.data });
  } catch (err) {
    console.log("getIngredientCategory error", err);
    dispatch({ type: GET_INGREDIENT_CATEGORY_FAILURE, payload: err?.response?.data || err.message });
  }
};

// ---- CREATE ingredient item (PRIVATE) ----
export const createIngredient = ({ data }) => async (dispatch) => {
  dispatch({ type: CREATE_INGREDIENT_REQUEST });
  try {
    const res = await api.post(`/api/admin/ingredients`, data);
    dispatch({ type: CREATE_INGREDIENT_SUCCESS, payload: res.data });
  } catch (err) {
    console.log("createIngredient error", err);
    dispatch({ type: CREATE_INGREDIENT_FAILURE, payload: err?.response?.data || err.message });
  }
};

// ---- CREATE ingredient category (PRIVATE) ----
export const createIngredientCategory = ({ data }) => async (dispatch) => {
  dispatch({ type: CREATE_INGREDIENT_CATEGORY_REQUEST });
  try {
    const res = await api.post(`/api/admin/ingredients/category`, data);
    dispatch({ type: CREATE_INGREDIENT_CATEGORY_SUCCESS, payload: res.data });
  } catch (err) {
    console.log("createIngredientCategory error", err);
    dispatch({ type: CREATE_INGREDIENT_CATEGORY_FAILURE, payload: err?.response?.data || err.message });
  }
};

// ---- TOGGLE/UPDATE stock (PRIVATE) ----
// Nếu backend vẫn là /stoke thì giữ nguyên path; nếu đã sửa thành /stock thì đổi bên dưới
export const updateStockOfIngredients = ({ id }) => async (dispatch) => {
  dispatch({ type: UPDATE_INGREDIENT_STOCK_REQUEST, meta: { id } });
  try {
    const res = await api.put(`/api/admin/ingredients/${id}/stoke`, {});
    // Nếu đã sửa controller: /stock
    // const res = await api.put(`/api/admin/ingredients/${id}/stock`, {});
    dispatch({ type: UPDATE_INGREDIENT_STOCK_SUCCESS, payload: res.data });
  } catch (err) {
    console.log("updateStock error", err);
    dispatch({
      type: UPDATE_INGREDIENT_STOCK_FAILURE,
      payload: err?.response?.data || err.message,
      meta: { id }
    });
  }
};
