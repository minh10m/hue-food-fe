import { api } from "../../component/config/api";
import { CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, CREATE_EVENTS_FAILURE, CREATE_EVENTS_REQUEST, CREATE_EVENTS_SUCCESS, CREATE_RESTAURANT_FAILURE, CREATE_RESTAURANT_REQUEST, CREATE_RESTAURANT_SUCCESS, DELETE_EVENTS_FAILURE, DELETE_EVENTS_REQUEST, DELETE_EVENTS_SUCCESS, DELETE_RESTAURANT_FAILURE, DELETE_RESTAURANT_REQUEST, DELETE_RESTAURANT_SUCCESS, GET_ALL_EVENTS_FAILURE, GET_ALL_EVENTS_REQUEST, GET_ALL_EVENTS_SUCCESS, GET_ALL_RESTAURANTS_FAILURE, GET_ALL_RESTAURANTS_REQUEST, GET_ALL_RESTAURANTS_SUCCESS, GET_RESTAURANT_BY_ID_FAILURE, GET_RESTAURANT_BY_ID_REQUEST, GET_RESTAURANT_BY_ID_SUCCESS, GET_RESTAURANT_BY_USER_ID_FAILURE, GET_RESTAURANT_BY_USER_ID_REQUEST, GET_RESTAURANT_BY_USER_ID_SUCCESS, GET_RESTAURANTS_CATEGORY_FAILURE, GET_RESTAURANTS_CATEGORY_REQUEST, GET_RESTAURANTS_CATEGORY_SUCCESS, GET_RESTAURANTS_EVENTS_FAILURE, GET_RESTAURANTS_EVENTS_REQUEST, GET_RESTAURANTS_EVENTS_SUCCESS, UPDATE_RESTAURANT_FAILURE, UPDATE_RESTAURANT_REQUEST, UPDATE_RESTAURANT_STATUS_FAILURE, UPDATE_RESTAURANT_STATUS_REQUEST, UPDATE_RESTAURANT_STATUS_SUCCESS, UPDATE_RESTAURANT_SUCCESS } from "./ActionType";

export const getAllRestaurantAction = (token) => async(dispatch) => {
   dispatch({type: GET_ALL_RESTAURANTS_REQUEST})
   try {
      const {data} = await api.get("/api/restaurants", {
         headers: {
            Authorization: `Bearer ${token}` 
         } 
      });
     
      dispatch({type: GET_ALL_RESTAURANTS_SUCCESS, payload: data})

      console.log("all restaurants", data)
   } catch (err) {
      dispatch({type: GET_ALL_RESTAURANTS_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const getRestaurantId = (reqData) => async(dispatch) => {
   dispatch({type: GET_RESTAURANT_BY_ID_REQUEST})
   try {
      const response = await api.get(`/api/restaurants/${reqData.restaurantId}`, {
         headers: {
            Authorization: `Bearer ${reqData.jwt}` 
         } 
      });
     
      dispatch({type: GET_RESTAURANT_BY_ID_SUCCESS, payload: response.data})

      console.log("restaurant by id", response.data)
   } catch (err) {
      dispatch({type: GET_RESTAURANT_BY_ID_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const getRestaurantByUserId = (token) => async(dispatch) => {
   dispatch({type: GET_RESTAURANT_BY_USER_ID_REQUEST})
   try {
      const {data} = await api.get("api/admin/restaurants/user", {
         headers: {
            Authorization: `Bearer ${token}` 
         } 
      });
     
      dispatch({type: GET_RESTAURANT_BY_USER_ID_SUCCESS, payload: data})
      console.log("restaurant by user id", data)
   } catch (err) {
      dispatch({type: GET_RESTAURANT_BY_USER_ID_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const createRestaurant = (reqData) => {
   console.log("token--------------", reqData.token);
   return async(dispatch) => {
   dispatch({type: CREATE_RESTAURANT_REQUEST})
   try {
      const {data} = await api.post("api/admin/restaurants", reqData.data, {
         headers: {
            Authorization: `Bearer ${reqData.token}` 
         } 
      });
     
      dispatch({type: CREATE_RESTAURANT_SUCCESS, payload: data})
      console.log("created restaurant: ", data)
   } catch (err) {
      dispatch({type: CREATE_RESTAURANT_FAILURE, payload: err})
      console.log("error", err)
   }
}}

export const updateRestaurant = ({restaurantId, restaurantData, jwt})    => async(dispatch) => {
   dispatch({type: UPDATE_RESTAURANT_REQUEST})
   try {
      const res = await api.put(`/api/admin/restaurants/${restaurantId}`, restaurantData,
         {
         headers: {
            Authorization: `Bearer ${jwt}`
         }
      } )
      
      dispatch({type: UPDATE_RESTAURANT_SUCCESS, payload: res.data})
      console.log("updated restaurant", res.data)
   } catch (err) {
      dispatch({type: UPDATE_RESTAURANT_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const deleteRestaurant = ({restaurantId, jwt})    => async(dispatch) => {
   dispatch({type: DELETE_RESTAURANT_REQUEST})
   try {
      const res = await api.delete(`/api/admin/restaurants/${restaurantId}`, 
         {
         headers: {
            Authorization: `Bearer ${jwt}`
         }
      })

      console.log("deleted restaurant", res.data);
      dispatch({type: DELETE_RESTAURANT_SUCCESS, payload: restaurantId})
   } catch (err) {
      console.log("error", err)
      dispatch({type: DELETE_RESTAURANT_FAILURE, payload: err})
   }
}

export const updateRestaurantStatus = ({restaurantId, jwt})    => async(dispatch) => {
   dispatch({type: UPDATE_RESTAURANT_STATUS_REQUEST})
   try {
      const res = await api.put(`/api/admin/restaurants/${restaurantId}/status`, {},
         {
         headers: {
            Authorization: `Bearer ${jwt}`
         }
      } )
      console.log("updated restaurant", res.data)
      dispatch({type: UPDATE_RESTAURANT_STATUS_SUCCESS, payload: res.data})
   } catch (err) {
      dispatch({type: UPDATE_RESTAURANT_STATUS_FAILURE, payload: err})
      console.log("error", err)
   }
}


export const createEvenAction = ({data, jwt, restaurantId}) => {
   return async(dispatch) => {
   dispatch({type: CREATE_EVENTS_REQUEST})
   try {
      const res = await api.post(`api/admin/events/restaurant/${restaurantId}`, data, {
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });
     
      dispatch({type: CREATE_EVENTS_SUCCESS, payload: res.data})
      console.log("created event: ", res.data)
   } catch (err) {
      dispatch({type: CREATE_EVENTS_FAILURE, payload: err})
      console.log("error", err)
   }
}}


export const getAllEvents = (token) => async(dispatch) => {
   dispatch({type: GET_ALL_EVENTS_REQUEST})
   try {
      const res = await api.get("api/events", {
         headers: {
            Authorization: `Bearer ${token}` 
         } 
      });
     
      console.log("all events", res.data)
      dispatch({type: GET_ALL_EVENTS_SUCCESS, payload: res.data})
   } catch (err) {
      dispatch({type: GET_ALL_EVENTS_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const deleteEventAction = ({eventId, jwt}) => async(dispatch) => {
   dispatch({type: DELETE_EVENTS_REQUEST})
   try {
      const res = await api.delete(`/api/admin/events/${eventId}`, 
         {
         headers: {
            Authorization: `Bearer ${jwt}`
         }
      })

      console.log("deleted events", res.data);
      dispatch({type: DELETE_EVENTS_SUCCESS, payload: eventId})
   } catch (err) {
      console.log("error", err)
      dispatch({type: DELETE_EVENTS_FAILURE, payload: err})
   }
}

export const getRestaurantsEvents = (restaurantId,token) => async(dispatch) => {
   dispatch({type: GET_RESTAURANTS_EVENTS_REQUEST})
   try {
      const res = await api.get(`api/admin/events/restaurant/${restaurantId}`, {
         headers: {
            Authorization: `Bearer ${token}` 
         } 
      });
     
      console.log("get restaurants events", res.data)
      dispatch({type: GET_RESTAURANTS_EVENTS_SUCCESS, payload: res.data})
   } catch (err) {
      dispatch({type: GET_RESTAURANTS_EVENTS_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const createCategoryAction = ({data, jwt}) => {
   return async(dispatch) => {
   dispatch({type: CREATE_CATEGORY_REQUEST})
   try {
      const res = await api.post(`api/admin/category`, data, {
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });
     
      dispatch({type: CREATE_CATEGORY_SUCCESS, payload: res.data})
      console.log("created category: ", res.data)
   } catch (err) {
      dispatch({type: CREATE_EVENTS_FAILURE, payload: err})
      console.log("error", err)
   }
}}

export const getRestaurantsCategory = ({jwt, restaurantId}) => async(dispatch) => {
   dispatch({type: GET_RESTAURANTS_CATEGORY_REQUEST})
   try {
      const res = await api.get(`api/category/restaurant/${restaurantId}`, {
         headers: {
            Authorization: `Bearer ${jwt}` 
         } 
      });
     
      console.log("get restaurants category", res.data)
      dispatch({type: GET_RESTAURANTS_CATEGORY_SUCCESS, payload: res.data})
   } catch (err) {
      dispatch({type: GET_RESTAURANTS_CATEGORY_FAILURE, payload: err})
      console.log("error category", err)
   }
}