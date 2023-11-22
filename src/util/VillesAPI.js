import {
  API_BASE_URL,
  REQUEST as request,
  ACCESS_TOKEN
} from "../constants/index";

export function getAllVille() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }


  return request({
    url: API_BASE_URL + "/private/villes",
    method: "GET"
  });
}

