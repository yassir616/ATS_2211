import {
  API_BASE_URL,
  REQUEST as request,
  ACCESS_TOKEN
} from "../../constants/index";

export function getUsers() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/user?page=0&sort=firstName&direction=asc",
    method: "GET"
  });
}

export function updateUser(userId, updatedUser) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/user/" + userId,
    data: updatedUser,
    method: "PUT"
  });
}

export function deleteUser(userId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/user/delete/" + userId,
    method: "DELETE"
  });
}
export function getAllRoles() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL + "/private/role?page=0&sort=name&direction=asc&limit=100",
    method: "GET"
  });
}

export function getAllPrivileges() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/privilege",
    method: "GET"
  });
}
export function addNewRole(role) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/role",
    method: "POST",
    data: role
  });
}
export function addNewPermission(name) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/privilege?privilege-name=" + name,
    method: "POST"
  });
}
export function editRole(role, id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/role/" + id,
    method: "PUT",
    data: role
  });
}
export function getUserNotifications() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/notifications?limit=60&page=0",
    method: "GET"
  });
}

export function updateNotification(id, notification) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/notification/" + id,
    method: "PUT",
    data: notification
  });
}

export function getUserNotificationsSinistre() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/notificationsSinistre?limit=60&page=0",
    method: "GET"
  });
}

export function updateNotificationSinistre(id, notification) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/notificationSinistre/" + id,
    method: "PUT",
    data: notification
  });
}

export function deleteNotification(id) {
  console.log(id);
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/deletenotification/" + id,
    method: "DELETE"
  });
}
export function updatePassword(userId, password) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/user/" + userId + "/" + password,
    method: "PATCH"
  });
}
