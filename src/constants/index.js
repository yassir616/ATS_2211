import axios from "axios";
import { CONNECTION_URL } from "./source";

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || CONNECTION_URL;

export const ACCESS_TOKEN = "accessToken";
export const UserID = "userId";
export const UserName = "username";
export const NOM_ASSURE = "nom";
export const CIN_ASSURE = "cin";
export const NUM_CONTRAT = "numeroContrat";
export const CODE_ACCEPTATION = "code";
export const DATE_EFFET = "dateEffet";
export const DATE_PRELEVEMENT = "datePrelevement";
export const MEDECIN_EXAMINATEUR = "MEDECIN EXAMINATEUR";
export const MEDECIN_CONSEIL = "MEDECIN CONSEIL";
export const MEDECIN_SPECIALISTE = "MEDECIN SPECIALISTE";
export const LABORATOIRE = "LABORATOIRE";

export const VERDICT_EXAMINATEUR = "examinateur";
export const VERDICT_NON_EXAMINATEUR = "nonexaminateur";
export const VERDICT_STATUS_EXAMEN_COMP = "Examen complementaire";
export const VERDICT_STATUS_MEDECIN_SPECIALISTE = "Medecin Specialiste";
export const POLL_LIST_SIZE = 30;
export const MAX_CHOICES = 6;
export const POLL_QUESTION_MAX_LENGTH = 140;
export const POLL_CHOICE_MAX_LENGTH = 40;

export const NAME_MIN_LENGTH = 4;
export const NUMERO_COMPTE_LENGTH = 24;
export const NAME_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 15;

export const EMAIL_MAX_LENGTH = 40;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 20;

export const AVN_CHANGEMENT_CAPITAL_DURE = "AVN01";
export const AVN_PERIODICITE = "AVN02";
export const AVN_MONTANT_CONTRIBUTION = "AVN03";
export const AVN_BENEFICIAIRE = "AVN04";
export const AVN_DURE = "AVN05";
export const AVN_ADRESSE = "AVN06";
export const AVN_STATUS = "AVN07";
export const AVN_DTEFFET = "AVN08";

export const BRANCH_TYPE_DECES_ET_RETRAITE = "DECES_ET_RETRAITE";
export const BRANCH_TYPE_DECES = "DECES";
export const BRANCH_TYPE_RETRAITE = "EPARGNE";

export const STATUS_WAITING_ACCEPTATION = "WAITING_ACCEPTATION";

export const REQUEST = options => {
  var aut = "";
  if (localStorage.getItem(ACCESS_TOKEN)) {
    aut = localStorage.getItem(ACCESS_TOKEN);
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: aut,
    "Cache-Control": "no-store, no-cache"
  };
  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return axios(options);
};
export const PERSONNE_PHYSIQUE = "physique";
export const PERSONNE_MORALE = "morale";
export const AL_AKHDAR_Code = "AAB";
export const AL_YOUSR_Code = "BAY";
export const ADMIN = "ADMIN";

//Privileges
export const GESTION_ACCEPTATION = "GESTION_ACCEPTATION";
export const GESTION_PATAMETRAGE = "GESTION_PATAMETRAGE";
export const GESTION_ROLE_ET_PERMISSION = "GESTION_ROLE_ET_PERMISSION";
export const GESTION_UTILISATEURS = "GESTION_UTILISATEURS";
export const CREATION_CONTRAT = "CREATION_CONTRAT";
export const SIMULATION = "SIMULATION";
export const CONTRAT_DECES = "CONTRAT_DECES";
export const CONTRAT_MRB = "CONTRAT_MRB";
export const CONTRAT_RETRAITE = "CONTRAT_RETRAITE";
export const PARAMETRAGE_POINT_VENTE = "PARAMETRAGE POINT DE VENTE";
export const AUTRE = "AUTRE";
export const SIMULATION_MRB = "SIMULATION_MRB";
export const PARTICIPANTS = "PARTICIPANTS";
