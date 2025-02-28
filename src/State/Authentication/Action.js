import axios from "axios";
import { api, API_URL } from "../../component/config/api";
import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType";


export const registerUser = (reqData) => async(dispatch) => {
   dispatch({type: REGISTER_REQUEST})
   try {
      const {data} = await axios.post(`${API_URL}/auth/signup`, reqData.userData)
      if (data.jwt) localStorage.setItem("jwt", data.jwt)
      if (data.role === "ROLE_RESTAURANT_OWNER") {
         reqData.navigate("/admin/restaurant")
      }
      else {
         reqData.navigate("/")
      }
      dispatch({type: REGISTER_SUCCESS, payload: data.jwt})

      console.log("register success", data)
   } catch (err) {
      dispatch({type: REGISTER_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const loginUser = (reqData) => async(dispatch) => {
   dispatch({type: LOGIN_REQUEST})
   try {
      const {data} = await axios.post(`${API_URL}/auth/signin`, reqData.userData)
      if (data.jwt) localStorage.setItem("jwt", data.jwt)
      if (data.role === "ROLE_RESTAURANT_OWNER") {
         // reqData.navigate("/admin/restaurant")
         reqData.navigate("/")
      }
      else {
         reqData.navigate("/")
      }
      dispatch({type: LOGIN_SUCCESS, payload: data.jwt})
      console.log("Login success", data)

   } catch (err) {
      dispatch({type: LOGIN_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const getUser = (jwt) => async(dispatch) => {
   dispatch({type: GET_USER_REQUEST})
   try {
      const {data} = await api.get(`/api/user/profile`,{
         headers: {
            Authorization: `Bearer ${jwt}`
         }
      } )
      
      dispatch({type: GET_USER_SUCCESS, payload: data})
      console.log("user profile", data)

   } catch (err) {
      dispatch({type: GET_USER_FAILURE, payload: err})
      console.log("error", err)

   }
}

export const addToFavorite = (jwt, restaurantId) => async(dispatch) => {
   dispatch({type: ADD_TO_FAVORITE_REQUEST})
   try {
      const {data} = await api.put(`/api/restaurants/${restaurantId}/add-favorites`, {
         
      },{
         headers: {
            Authorization: `Bearer ${jwt}`
         }
      } )
      
      dispatch({type: ADD_TO_FAVORITE_SUCCESS, payload: data})
      console.log("added to favorite", data)
   } catch (err) {
      dispatch({type: ADD_TO_FAVORITE_FAILURE, payload: err})
      console.log("error", err)
   }
}

export const logout = () => async(dispatch) => {
   try {
      
      localStorage.clear();
      dispatch({type: LOGOUT})
      console.log("log out success")

   } catch (err) {
      console.log("error", err)
   }
}
