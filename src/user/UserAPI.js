import {
  API_BASE_URL,
  REQUEST as request,
  UserID,
  ACCESS_TOKEN
} from "../constants/index";

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/public/login",
    method: "POST",
    data: loginRequest
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/private/sign-up",
    method: "POST",
    data: signupRequest
  });
}
export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/user/" + localStorage.getItem(UserID),
    method: "GET"
  });
}
export function getUserProfile(username) {
  return request({
    url: API_BASE_URL + "/private/user/" + localStorage.getItem(UserID),
    method: "GET"
  });
}
