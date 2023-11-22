import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REQUEST as request
} from "../../constants/index";

export function ajoutEvent(eventRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/agenda/add",
    data: eventRequest,
    method: "POST"
  });
}

export function updateEvent(eventId, updatedEvent) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/agenda/" + eventId,
    method: "PUT",
    data: updatedEvent
  });
}

export function deleteEventById(id, userId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/agenda/" + id + "/" + userId,
    method: "DELETE"
  });
}
export function getEventByUser(userId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/agenda/" + userId,
    method: "GET"
  });
}
