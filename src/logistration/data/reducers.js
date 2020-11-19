import {
  REGISTER_NEW_USER,
  LOGIN_REQUEST,
  THIRD_PARTY_AUTH_CONTEXT,
  REGISTER_FORM,
} from './actions';

export const defaultState = {
  registrationResult: {},
  loginResult: {},
  registrationError: null,
  loginError: null,
  formData: null,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case REGISTER_NEW_USER.BEGIN:
      return {
        ...state,
      };
    case REGISTER_NEW_USER.SUCCESS:
      return {
        ...state,

        registrationResult: action.payload,
      };
    case REGISTER_NEW_USER.FAILURE:
      return {
        ...state,
        registrationError: action.payload.error,
      };
    case LOGIN_REQUEST.BEGIN:
      return {
        ...state,
      };
    case LOGIN_REQUEST.SUCCESS:
      return {
        ...state,
        loginResult: action.payload,
      };
    case LOGIN_REQUEST.FAILURE:
      return {
        ...state,
        loginError: action.payload.loginError,
      };
    case THIRD_PARTY_AUTH_CONTEXT.BEGIN:
      return {
        ...state,
      };
    case THIRD_PARTY_AUTH_CONTEXT.SUCCESS:
      return {
        ...state,
        thirdPartyAuthContext: action.payload.thirdPartyAuthContext,
      };
    case THIRD_PARTY_AUTH_CONTEXT.FAILURE:
      return {
        ...state,
      };
    case REGISTER_FORM.BEGIN:
      return {
        ...state,
      };
    case REGISTER_FORM.SUCCESS:
      return {
        ...state,
        formData: action.payload.formData,
      };
    case REGISTER_FORM.FAILURE:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default reducer;
