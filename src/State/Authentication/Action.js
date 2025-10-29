import axios from "axios";
import { api, API_URL } from "../../component/config/api";
import { ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS, CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, FORGOT_VERIFY_EMAIL_FAILURE, FORGOT_VERIFY_EMAIL_REQUEST, FORGOT_VERIFY_EMAIL_SUCCESS, FORGOT_VERIFY_OTP_FAILURE, FORGOT_VERIFY_OTP_REQUEST, FORGOT_VERIFY_OTP_SUCCESS, GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS, LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS, FORGOT_RESET_FLAGS, GET_MY_FAVORITES_FAILURE, GET_MY_FAVORITES_SUCCESS, GET_MY_FAVORITES_REQUEST } from "./ActionType";


export const registerUser = (reqData) => async (dispatch) => {
   dispatch({ type: REGISTER_REQUEST });
   try {
     const { data } = await axios.post(`${API_URL}/register`, reqData.userData);
 
     const token = data?.access_token;
     const role  = data?.role;
 
     if (token) {
       localStorage.setItem("access_token", token);
       if (role) localStorage.setItem("role", role);
       axios.defaults.headers.common.Authorization = `Bearer ${token}`;
     }
 
     dispatch({ type: REGISTER_SUCCESS, payload: token });
 
     console.log("Register success", data);
 
     if (role === "ROLE_RESTAURANT_OWNER") {
       reqData.navigate("/admin/restaurant");
     } else {
       reqData.navigate("/");
     }
   } catch (err) {
     const msg =
       err?.response?.data?.message || err.message || "Register failed";
     dispatch({ type: REGISTER_FAILURE, payload: msg });
     console.error("Register error:", err);
   }
 };

 export const loginUser = ({ userData, navigate }) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    // đánh dấu public để interceptor không gắn Bearer
    const { data } = await api.post("/login", userData, { meta: { isPublic: true } });

    const accessToken  = data?.access_token;
    const refreshToken = data?.refresh_token;
    const role         = data?.role;

    if (!accessToken) throw new Error("Missing access_token");

    // lưu localStorage
    localStorage.setItem("access_token", accessToken);
    console.log(accessToken);
    if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    if (role) localStorage.setItem("role", role);

    // cập nhật redux: App sẽ tự fetch user + cart dựa vào token này
    dispatch({ type: LOGIN_SUCCESS, payload: accessToken });

    dispatch(getMyFavorites());

    // điều hướng (tuỳ role nếu cần)
    if (role === "ROLE_ADMIN") navigate("/admin");
    else navigate("/");

    return data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Login failed. Please try again.";
    dispatch({ type: LOGIN_FAILURE, payload: msg });
    throw err;
  }
};


export const getUser = () => async (dispatch) => {
   dispatch({ type: GET_USER_REQUEST });
   try {
     const { data } = await api.get("/api/user/profile"); // không cần headers nữa
     dispatch({ type: GET_USER_SUCCESS, payload: data });
   } catch (err) {
     dispatch({
       type: GET_USER_FAILURE,
       payload: err?.response?.data || err.message,
     });
   }
 };

 export const addToFavorite = (restaurantId) => async (dispatch) => {
  dispatch({ type: ADD_TO_FAVORITE_REQUEST, meta: { restaurantId } });
  try {
    const { data } = await api.put(`/api/me/favorites/${restaurantId}`, {}, { meta: { isPublic: false } });
    dispatch({ type: ADD_TO_FAVORITE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: ADD_TO_FAVORITE_FAILURE, payload: err?.response?.data || err.message });
  }
};

export const getMyFavorites = () => async (dispatch) => {
  dispatch({ type: GET_MY_FAVORITES_REQUEST });
  try {
    const { data } = await api.get(`/api/me/favorites`, { meta: { isPublic: false } });
    dispatch({ type: GET_MY_FAVORITES_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: GET_MY_FAVORITES_FAILURE, payload: err?.response?.data || err.message });
  }
};


export const logout = () => async (dispatch) => {
  try {
    // gọi backend xoá token
    await api.post("/logout");  
    localStorage.clear();
    dispatch({ type: LOGOUT });
    console.log("Logout success (backend + frontend)");
  } catch (err) {
    console.error("Logout error", err);
    // fallback: vẫn xoá local để tránh kẹt
    localStorage.clear();
    dispatch({ type: LOGOUT });
  }
};

const normErr = (err) =>
  err?.response?.data
    ? { ...err.response.data, message: err.response.data.message || "Request failed" }
    : { message: err?.message || "Request failed" };

export const resetForgotFlags = () => ({ type: FORGOT_RESET_FLAGS });

export const forgotVerifyEmail = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_VERIFY_EMAIL_REQUEST });
  try {
    const { data } = await api.post(`/forgot-password/verify-email/${encodeURIComponent(email)}`);
    dispatch({ type: FORGOT_VERIFY_EMAIL_SUCCESS, payload: data });
    // Quan trọng: return để component có thể .then(...) và nhảy step ngay
    return data;
  } catch (err) {
    const payload = normErr(err);
    dispatch({ type: FORGOT_VERIFY_EMAIL_FAILURE, payload });
    // throw để component có thể .catch(...)
    throw payload;
  }
};

export const forgotVerifyOtp = ({ otp, email }) => async (dispatch) => {
  dispatch({ type: FORGOT_VERIFY_OTP_REQUEST });
  try {
    const { data } = await api.post(
      `/forgot-password/verify-otp/${encodeURIComponent(otp)}/${encodeURIComponent(email)}`
    );
    dispatch({ type: FORGOT_VERIFY_OTP_SUCCESS, payload: data });
    return data;
  } catch (err) {
    const payload = normErr(err);
    dispatch({ type: FORGOT_VERIFY_OTP_FAILURE, payload });
    throw payload;
  }
};

export const changePassword = ({ email, newPassword, confirmPassword }) => async (dispatch) => {
  dispatch({ type: CHANGE_PASSWORD_REQUEST });
  try {
    const body = { password: newPassword, repeatPassword: confirmPassword };
    const { data } = await api.post(`/forgot-password/change-password/${encodeURIComponent(email)}`, body);
    dispatch({ type: CHANGE_PASSWORD_SUCCESS, payload: data });
    return data;
  } catch (err) {
    const payload = normErr(err);
    dispatch({ type: CHANGE_PASSWORD_FAILURE, payload });
    throw payload;
  }
};