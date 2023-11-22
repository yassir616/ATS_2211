import {
  ACCESS_TOKEN,
  API_BASE_URL,
  REQUEST as request
} from "../../../constants/index";

export function ajouterAcceptationLaboratoire(eventRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-laboratoire",
    data: eventRequest,
    method: "POST"
  });
}
export function ajouterAcceptationExaminateur(eventRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-examinateur",
    data: eventRequest,
    method: "POST"
  });
}
export function ajouterAcceptationConseil(eventRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-conseil",
    data: eventRequest,
    method: "POST"
  });
}
export function ajouterAcceptationEtape(eventRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-etape",
    data: eventRequest,
    method: "POST"
  });
}
export function ajouterAcceptationExamens(eventRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-examens",
    data: eventRequest,
    method: "POST"
  });
}
export function ajouterAcceptationSpecialiste(eventRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-specialiste",
    data: eventRequest,
    method: "POST"
  });
}
export function ajouterAcceptationReassurance(eventRequest) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-reassurance",
    data: eventRequest,
    method: "POST"
  });
}
export function getAcceptationlaboByAcceptation(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/acceptation-laboratoire?acceptation=" + id,
    method: "GET"
  });
}
export function getAcceptationExaminateurByAcceptation(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/acceptation-examinateur?acceptation=" + id,
    method: "GET"
  });
}
export function getAcceptationConseilByAcceptation(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/acceptation-conseil?acceptation=" + id,
    method: "GET"
  });
}
export function getAcceptationExamnsByAcceptation(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/acceptation-examens?acceptation=" + id,
    method: "GET"
  });
}

export function getAcceptationSpecialisteByAcceptation(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/acceptation-specialiste?acceptation=" + id,
    method: "GET"
  });
}

export function getAcceptationReassuranceByAcceptation(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/acceptation-reassurance?acceptation=" + id,
    method: "GET"
  });
}

export function getAcceptationlaboByAcceptationsLaboratoire(
  acceptation,
  acceptationLabo
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/acceptation-test-medical-laboratoire?acceptation=" +
      acceptation +
      "&acceptationlabo=" +
      acceptationLabo,
    method: "GET"
  });
}
export function getAcceptationTestByAcceptationsExaminateur(
  acceptation,
  acceptationLabo
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/acceptation-test-medical-examinateur?acceptation=" +
      acceptation +
      "&acceptationexamn=" +
      acceptationLabo,
    method: "GET"
  });
}
export function getAcceptationTestByAcceptationsConseil(
  acceptation,
  acceptationLabo
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/acceptation-test-medical-conseil?acceptation=" +
      acceptation +
      "&acceptationconseil=" +
      acceptationLabo,
    method: "GET"
  });
}
export function getAcceptationTestMedicalByAcceptationExamensComplementaire(
  acceptation,
  acceptationExaman
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/acceptation-test-medical-examen?acceptation=" +
      acceptation +
      "&acceptationexamn=" +
      acceptationExaman,
    method: "GET"
  });
}
export function ajouterAcceptationTestMedical(eventRequest) {
  console.log("ajouterAcceptationTestMedical");
  console.log(eventRequest);
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-test-medical",
    data: eventRequest,
    method: "POST"
  });
}

export function updateAcceptationTestMedical(Id, updatedTestMedical) {
  console.log("updatedTestMedical ");
  console.log(updatedTestMedical);
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-test-medical?id=" + Id,
    data: updatedTestMedical,
    method: "PUT"
  });
}



export function updateAcceptationSpecialiste(Id, updatedspecialiste) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation-specialiste?id=" + Id,
    data: updatedspecialiste,
    method: "PUT"
  });
}
export function updateAcceptationReassurance(Id, updatedspecialiste) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  console.log("request ");
  console.log({url: API_BASE_URL + "/private/acceptation-reassurance?id=" + Id,
  data: updatedspecialiste,});
  return request({
    url: API_BASE_URL + "/private/acceptation-reassurance?id=" + Id,
    data: updatedspecialiste,
    method: "PUT"
  });
}
export function getacceptationTestByAuxiliaire(
  auxiliaire,
  typeAuxiliaire,
  partenaire,
  produit
) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/acceptation-test-medical-auxiliaire?auxiliaire=" +
      auxiliaire +
      "&typeAuxiliaire=" +
      typeAuxiliaire +
      "&partenaire=" +
      partenaire +
      "&produit=" +
      produit,
    method: "GET"
  });
}
export function lettreAcceptation(lettreacceptation) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/lettreAcceptation/pdf",
    method: "POST",
    data: lettreacceptation,
    responseType: "blob"
  });
}
export function searchAcceptations(page, limit, searchby, searchfor) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/acceptation/search?page=" +
      page +
      "&sort=code&direction=desc&limit=" +
      limit +
      "&by=" +
      searchby +
      "&for=" +
      searchfor,
    method: "GET"
  });
}

export function getAcceptationsByPagination(page, limit) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url:
      API_BASE_URL +
      "/private/acceptation?page=" +
      page +
      "&sort=creationDate&direction=desc&limit=" +
      limit,
    method: "GET"
  });
}
export function getVerdictByType(type) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }
  return request({
    url: API_BASE_URL + "/private/verdict?type=" + type,
    method: "GET"
  });
}
export function lettreRejet(lettrerejet) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/lettreRejet/pdf",
    method: "POST",
    data: lettrerejet,
    responseType: "blob"
  });
}
export function codeBycontrat(id) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/acceptation/" + id,
    method: "GET"
  });
}
export function lettreExamenComplementaire(examenComplementaire) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url:
      API_BASE_URL +
      "/private/LettreDemandeExamenComplimentaireExaminateur/pdf",
    method: "POST",
    data: examenComplementaire,
    responseType: "blob"
  });
}
export function lettreRenonciation(lettreRenonciation) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/lettreRenonciation/pdf",
    method: "POST",
    data: lettreRenonciation,
    responseType: "blob"
  });
}
export function lettreAcceptationAvecSurprime(lettreSurprime) {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/private/LettreAcceptationAvecSurprime/pdf",
    method: "POST",
    data: lettreSurprime,
    responseType: "blob"
  });
}
