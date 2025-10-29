// src/State/Restaurant/Reducer.js
import * as actionTypes from "./ActionType";

const initialState = {
  restaurants: [],          // public list
  usersRestaurant: null,    // the admin/owner's restaurant object
  restaurant: null,         // the currently viewed restaurant (by id)
  loading: false,
  error: null,
  events: [],               // all events (if you use a global listing)
  restaurantsEvents: [],    // events of a specific restaurant
  categories: [],           // categories of a specific restaurant
};

const upsertInListById = (list, item) => {
  if (!Array.isArray(list)) return [item];
  const idx = list.findIndex((x) => String(x.id) === String(item.id));
  if (idx === -1) return [...list, item];
  const copy = list.slice();
  copy[idx] = item;
  return copy;
};

const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    /** ========================== REQUESTS ========================== **/
    case actionTypes.CREATE_RESTAURANT_REQUEST:
    case actionTypes.GET_ALL_RESTAURANTS_REQUEST:
    case actionTypes.DELETE_RESTAURANT_REQUEST:
    case actionTypes.UPDATE_RESTAURANT_REQUEST:
    case actionTypes.UPDATE_RESTAURANT_STATUS_REQUEST:
    case actionTypes.GET_RESTAURANT_BY_ID_REQUEST:
    case actionTypes.GET_RESTAURANT_BY_USER_ID_REQUEST:
    case actionTypes.CREATE_CATEGORY_REQUEST:
    case actionTypes.GET_RESTAURANTS_CATEGORY_REQUEST:
    case actionTypes.CREATE_EVENTS_REQUEST:
    case actionTypes.GET_ALL_EVENTS_REQUEST:
    case actionTypes.GET_RESTAURANTS_EVENTS_REQUEST:
    case actionTypes.DELETE_EVENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    /** ========================== SUCCESS ========================== **/
    case actionTypes.CREATE_RESTAURANT_SUCCESS: {
      const created = action.payload;
      return {
        ...state,
        loading: false,
        usersRestaurant: created,
        // optionally reflect in the public list (if your API returns full entity)
        restaurants: upsertInListById(state.restaurants, created),
      };
    }

    case actionTypes.GET_ALL_RESTAURANTS_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurants: Array.isArray(action.payload) ? action.payload : [],
      };

    case actionTypes.GET_RESTAURANT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurant: action.payload,
      };

    case actionTypes.GET_RESTAURANT_BY_USER_ID_SUCCESS:
    case actionTypes.UPDATE_RESTAURANT_SUCCESS:
    case actionTypes.UPDATE_RESTAURANT_STATUS_SUCCESS: {
      const updated = action.payload;
      return {
        ...state,
        loading: false,
        usersRestaurant: updated,
        restaurants: upsertInListById(state.restaurants, updated),
        // also refresh the detailed one if it is the same id
        restaurant:
          state.restaurant && String(state.restaurant.id) === String(updated.id)
            ? updated
            : state.restaurant,
      };
    }

    case actionTypes.DELETE_RESTAURANT_SUCCESS: {
      const deletedId = action.payload;
      return {
        ...state,
        loading: false,
        error: null,
        restaurants: (state.restaurants || []).filter(
          (item) => String(item.id) !== String(deletedId)
        ),
        // usersRestaurant is an object, not array — clear it if it matches
        usersRestaurant:
          state.usersRestaurant &&
          String(state.usersRestaurant.id) === String(deletedId)
            ? null
            : state.usersRestaurant,
        // also clear currently viewed restaurant if it was deleted
        restaurant:
          state.restaurant && String(state.restaurant.id) === String(deletedId)
            ? null
            : state.restaurant,
      };
    }

    // Events
    case actionTypes.CREATE_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: [...(state.events || []), action.payload],
        restaurantsEvents: [...(state.restaurantsEvents || []), action.payload],
      };

    case actionTypes.GET_ALL_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        events: Array.isArray(action.payload) ? action.payload : [],
      };

    case actionTypes.GET_RESTAURANTS_EVENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        restaurantsEvents: Array.isArray(action.payload) ? action.payload : [],
      };

    case actionTypes.DELETE_EVENTS_SUCCESS: {
      const removedId = action.payload;
      return {
        ...state,
        loading: false,
        events: (state.events || []).filter(
          (item) => String(item.id) !== String(removedId)
        ),
        restaurantsEvents: (state.restaurantsEvents || []).filter(
          (item) => String(item.id) !== String(removedId)
        ),
      };
    }

    // Categories
    case actionTypes.CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [...(state.categories || []), action.payload],
      };

    case actionTypes.GET_RESTAURANTS_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: Array.isArray(action.payload) ? action.payload : [],
      };

    /** ========================== FAILURES ========================== **/
    case actionTypes.CREATE_RESTAURANT_FAILURE:
    case actionTypes.GET_ALL_RESTAURANTS_FAILURE:
    case actionTypes.DELETE_RESTAURANT_FAILURE:
    case actionTypes.UPDATE_RESTAURANT_FAILURE:
    case actionTypes.UPDATE_RESTAURANT_STATUS_FAILURE:
    case actionTypes.GET_RESTAURANT_BY_ID_FAILURE:
    case actionTypes.GET_RESTAURANT_BY_USER_ID_FAILURE:
    case actionTypes.CREATE_EVENTS_FAILURE:
    case actionTypes.GET_ALL_EVENTS_FAILURE:
    case actionTypes.GET_RESTAURANTS_EVENTS_FAILURE:
    case actionTypes.DELETE_EVENTS_FAILURE:
    case actionTypes.CREATE_CATEGORY_FAILURE:
    case actionTypes.GET_RESTAURANTS_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    /** ========================== DEFAULT ========================== **/
    default:
      return state;
  }
};

export default restaurantReducer;
