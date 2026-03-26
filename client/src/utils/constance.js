export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_API = "api/auth";
export const SIGNUP_ROUTE = `${AUTH_API}/signup`;
export const LOGIN_ROUTE = `${AUTH_API}/login`;

export const GET_USER_INFO = `${AUTH_API}/user-info`;

export const UPDATE_PROFILE_ROUTE = `${AUTH_API}/update-profile`;

export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_API}/add-profile-image`;

export const LOGOUT_ROUTE = `${AUTH_API}/logout`;

export const CONTACT_ROUTES = "api/contacts";
export const SEARCH_CONTACT_ROUTES = `${CONTACT_ROUTES}/search`;
export const GET_DM_CONTACTS = `${CONTACT_ROUTES}/get-dm-contacts`;

export const MESSAGE_ROUTES = "api/messages";
export const GET_MESSAGES = `${MESSAGE_ROUTES}/get-messages`;
export const UPLOAD_FILE = `${MESSAGE_ROUTES}/upload-file`;
