import {
    ACCESS_TOKEN,
    API_BASE_URL,
    REQUEST as request
} from "../../constants/index";

  export function getBordereauEncaissement(requestData) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      return Promise.reject("No access token set.");
    }
    return request({
      url: API_BASE_URL + "/private/genererBordereauEncaissement?partenaireId="
        +requestData.partenaire+"&dateEncaissement="
        +requestData.dateEncaissement+"&compteId="+requestData.compteBancaire,
      method: "POST",
    });  
  }

  export function getAllBordereau(){
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      return Promise.reject("No access token set.");
    }
    return request({
      url:API_BASE_URL + "/private/getBordereaux",
      method: "GET"
    })
  }

  export function imprimerBordereau(model){
    if (!localStorage.getItem(ACCESS_TOKEN)) {
      return Promise.reject("No access token set.");
    }
    return request({
      url:API_BASE_URL + "/private/bordereauEncaissementt/pdf",
      method: "POST",
      data: model,
      responseType: "blob"
    })
  }