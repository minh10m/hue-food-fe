import { isPresentInFavorites } from "../../component/config/logic";
import {
  ADD_TO_FAVORITE_FAILURE, ADD_TO_FAVORITE_REQUEST, ADD_TO_FAVORITE_SUCCESS,
  GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS,
  LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS,

  // ---- Forgot password flow ----
  FORGOT_VERIFY_EMAIL_REQUEST, FORGOT_VERIFY_EMAIL_SUCCESS, FORGOT_VERIFY_EMAIL_FAILURE,
  FORGOT_VERIFY_OTP_REQUEST,   FORGOT_VERIFY_OTP_SUCCESS,   FORGOT_VERIFY_OTP_FAILURE,
  CHANGE_PASSWORD_REQUEST,     CHANGE_PASSWORD_SUCCESS,     CHANGE_PASSWORD_FAILURE, GET_MY_FAVORITES_REQUEST, GET_MY_FAVORITES_SUCCESS, GET_MY_FAVORITES_FAILURE,
  FORGOT_RESET_FLAGS
} from "./ActionType";

const initialState = {
  // Auth
  user: null,
  isLoading: false,
  error: null,
  access_token: localStorage.getItem("access_token") || null,
  favorites: [],
  success: null,

  // Forgot password (gộp vào authReducer để component đọc store.auth.*)
  verifyEmailLoading: false,
  verifyEmailError: null,
  verifyEmailSuccess: false,

  verifyOtpLoading: false,
  verifyOtpError: null,
  verifyOtpSuccess: false,

  changePwdLoading: false,
  changePwdError: null,
  changePwdSuccess: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // ====== Auth common requests ======
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case ADD_TO_FAVORITE_REQUEST:
    case GET_MY_FAVORITES_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: null
      };

    // ====== Register ======
    // Nếu BE KHÔNG trả token khi register, đừng set access_token ở đây
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: "Register success"
      };

    // ====== Login ======
    case LOGIN_SUCCESS: {
      // Chấp nhận payload có thể là string token hoặc object {access_token|token}
      const token = typeof action.payload === "string"
        ? action.payload
        : action.payload?.access_token || action.payload?.token || null;

      return {
        ...state,
        isLoading: false,
        access_token: token,
        error: null,
        success: "Login success"
      };
    }

    // ====== Get user ======
    case GET_USER_SUCCESS: {
      const hasToken = !!state.access_token;
      const user = hasToken ? action.payload : null;
      return {
        ...state,
        isLoading: false,
        user,
        favorites: user?.favorites ?? []
      };
    }

    // ====== Toggle favorite ======
    case GET_MY_FAVORITES_SUCCESS: {
      const list = Array.isArray(action.payload) ? action.payload : [];
      return { ...state, isLoading: false, favorites: list, error: null };
    }

    case ADD_TO_FAVORITE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        favorites: isPresentInFavorites(state.favorites, action.payload)
          ? state.favorites.filter((item) => item.id !== action.payload.id) // toggle off
          : [action.payload, ...state.favorites] // toggle on
      };

    // ====== Logout ======
    case LOGOUT:
      // Khuyên làm: xóa localStorage trong action creator LOGOUT, không làm ở reducer
      return {
        ...initialState,
        access_token: null
      };

    // ====== Auth failures ======
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
    case ADD_TO_FAVORITE_FAILURE:
    case GET_MY_FAVORITES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        success: null
      };

    // ====== Forgot password: Step 1 - verify email ======
    case FORGOT_VERIFY_EMAIL_REQUEST:
      return {
        ...state,
        verifyEmailLoading: true,
        verifyEmailError: null,
        verifyEmailSuccess: false
      };
    case FORGOT_VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        verifyEmailLoading: false,
        verifyEmailSuccess: true
      };
    case FORGOT_VERIFY_EMAIL_FAILURE:
      return {
        ...state,
        verifyEmailLoading: false,
        verifyEmailError: action.payload,
        verifyEmailSuccess: false
      };

    // ====== Forgot password: Step 2 - verify OTP ======
    case FORGOT_VERIFY_OTP_REQUEST:
      return {
        ...state,
        verifyOtpLoading: true,
        verifyOtpError: null,
        verifyOtpSuccess: false
      };
    case FORGOT_VERIFY_OTP_SUCCESS:
      return {
        ...state,
        verifyOtpLoading: false,
        verifyOtpSuccess: true
      };
    case FORGOT_VERIFY_OTP_FAILURE:
      return {
        ...state,
        verifyOtpLoading: false,
        verifyOtpError: action.payload,
        verifyOtpSuccess: false
      };

    // ====== Forgot password: Step 3 - change password ======
    case CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        changePwdLoading: true,
        changePwdError: null,
        changePwdSuccess: false
      };
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePwdLoading: false,
        changePwdSuccess: true
      };
    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        changePwdLoading: false,
        changePwdError: action.payload,
        changePwdSuccess: false
      };

    // ====== Forgot password: reset all flags ======
    case FORGOT_RESET_FLAGS:
      return {
        ...state,
        verifyEmailLoading: false,
        verifyEmailError: null,
        verifyEmailSuccess: false,

        verifyOtpLoading: false,
        verifyOtpError: null,
        verifyOtpSuccess: false,

        changePwdLoading: false,
        changePwdError: null,
        changePwdSuccess: false,
      };

    default:
      return state;
  }
};
