import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REQUEST as request
} from "../../constants/index";

export function getAllPersonnePhysique() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL +
      "/private/personne-physique?direction=asc&limit=2147483647&page=0&sort=nom",
    method: "GET"
  });
}
export function getallPersonMorale() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL +
      "/private/personne-morale?page=0&sort=creationDate&direction=desc",
    method: "GET"
  });
}
export function getAllSecteur() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/secteur?direction=asc&limit=4&page=0&sort=id",
    method: "GET"
  });
}
export function getAllSecteurActivite() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/secteur?page=0&sort=libelle&direction=asc",
    method: "GET"
  });
}
export function getAllTypePersonneMorales() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  } else {
    return request({
      url: API_BASE_URL + "/private/type-personne-morale",
      method: "GET"
    });
  }
}
export function createPersonnePhysique(souscripteur) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  console.log(souscripteur);
  return request({
    url: API_BASE_URL + "/private/personne-physique",
    data: souscripteur,
    method: "POST"
  });
}

export function getSexe() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/sexe",
    method: "GET"
  });
}
export function getSetuation() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/situation",
    method: "GET"
  });
}
export function getProfession() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL +
      "/private/profession?page=0&sort=creationDate&direction=desc",
    method: "GET"
  });
}
export function ajoutProfession(profession) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/addProfession",
    method: "POST",
    data: profession
  });
}
export function getallperson() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/personne-physique?page=0&sort=creationDate&direction=desc",
    method: "GET"
  });
}

export function createPersonneMorale(souscripteur) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/personne-morale",
    data: souscripteur,
    method: "POST"
  });
}

export function getVois() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/vois",
    method: "GET"
  });
}

export function getByCinIfExist(cin) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/personne-physique/" + cin,
    method: "GET"
  });
}

export function addBeneficiaireEnDeces(model) {
  return request({
    url: API_BASE_URL + "/private/beneficiaireendeces",
    method: "POST",
    data: model
  });
}

export function updatePersonnePhysique(perId, updatedPer) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/personne-physique/" + perId,
    data: updatedPer,
    method: "PUT"
  });
}

export function updatePersonneMorale(perId, updatedPer) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/personne-morale/" + perId,
    data: updatedPer,
    method: "PUT"
  });
}

export function getByPatent(patente) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/personne-morale/" + patente,
    method: "GET"
  });
}

export function deletePerMrale(userId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/personne-morale/delete/" + userId,
    method: "DELETE"
  });
}

export function deletePerPhysique(userId) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/personne-physique/delete/" + userId,
    method: "DELETE"
  });
}
export function getAllPays() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL +
      "/private/payss?page=0&sort=libelle&direction=desc",
    method: "GET"
  });
} 
