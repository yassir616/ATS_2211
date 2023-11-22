/* eslint-disable react/prop-types */
import "./Souscription.css";
import "antd/dist/antd.css";
import {
  Button,
  Descriptions,
  Divider,
  notification,
  Steps,
  Input,
  Modal,
  Form,
  Select
} from "antd";
import React, { Component } from "react";
import { connectedUserContext } from "../../../app/App";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import StepFour from "./StepFour/StepFour";
import StepOne from "./StepOne/StepOne";
import StepThree from "./StepThree/StepThree";
import StepTwo from "./StepTwo/StepTwo";
import moment from "moment";
import { getAllPartenaire } from "../../Parametrage/partenaire/PartenaireAPI";
import { getDecesProduit } from "../../Parametrage/ProduitDeces/ProduitDecesAPI";
import {
  createContratDeces,
  getPeriodicite
} from "../../GestionContrats/ContratsAPI";
import { codeBycontrat } from "../GestionAcceptation/AcceptationsAPI";
import {
  getNormeByCapitalAndAge,
  lettreOrientation,
  conditionParticulier,
  getContratById,
  updateDecesContratOrientation
} from "./SouscriptionAPI";
import { getAuxiliairesByType } from "../../Parametrage/Auxiliaires/AuxiliaireAPI";
import {
  STATUS_WAITING_ACCEPTATION,
  MEDECIN_EXAMINATEUR
} from "../../../constants/index";
import { jasperFile } from "../../EchangeFichiersInformatiques/EchangeFileAPI";
const { Step } = Steps;
const { Option } = Select;
var pointVente = "";
var numeroContrat = "";
const dateFormat = "DD-MM-YYYY";
let consumeData = null;
class Souscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assure: false,
      examinateur: "",
      visible: false,
      booleen: false,
      contrat: [],
      souscripteur: false,
      allow: false,
      disableButton: false,
      allowSec: false,
      souscripteurObj: {},
      codeAcceptation: "",
      assureObj: {},
      current: 0,
      produits: [],
      Partenaires: [],
      periodicites: [],
      normes: null,
      honoraires: [],
      encours: 0,
      medecins: [],
      cumul: 0,
      fields: {
        // step one
        radio: { value: "morale" },
        cin: { value: "" },
        patente: { value: "" },
        assure: { value: "" },

        numeroDossierFinancement: { value: "" },
        souscripteur: { value: "" },
        souscripteurIsAssure: { value: "" },
        assurePresent: { value: false },
        //stepOne View inputs

        //step tow
        preiodicite: { value: "" },
        dureeContrat: { value: "" },
        dateEffet: { value: "" },
        dateEcheance: { value: "" },
        produit: { value: "" },
        pointVente: { value: "" },
        NombreMensualitesEtalementLaPrimeUnique: { value: "" },
        agence: { value: "" },
        partenaire: { value: "" },
        selectedProduct: { value: "" },
        dateEtablissement: { value: "" },
        datePremierecheane: { value: "" },
        //step three
        TarificationFound: { value: false },
        PrelevementSource: { value: false },
        Differe: { value: "" },
        optionAssurance: { value: "" },
        montantFrais: { value: "" },
        capitalAssure: { value: "" },
        montantSurprime: { value: "" },
        prorata: { value: "" },
        tauxTaxe: { value: "" },
        montantCotisation: { value: "" },
        tauxInteret: { value: "" },
        datePrelevement: { value: "" },
        montantTaxe: { value: "" },
        tauxSurprime: { value: "" },
        cotisationTotale: { value: "" },
        montantTaxeParafiscale: { value: "" },
        montantAccessoire: { value: "" },
        encours: { value: "" },
        cumul: { value: "" },
        fraisAcquisitionTTC: { value: "" },
        fraisGestionTTC: { value: "" },
        contributionPure: { value: "" },
        // stepFour
        invaliditeOuMaladie: { value: false },
        quelleMaladieOuInvalidite: { value: "" },
        pensionIncapacite: { value: false },
        suspendreAtiviteDeuxDernierAnnee: { value: false },
        maladiesOuOperationChirurgicaleQuandEtOu: { value: "" },
        suspendreAtiviteDeuxDernierAnneePourquiEtTemps: { value: "" },
        maladiesOuOperationChirurgicale: { value: false }
      }
    };
  }
  async getDroppDownData() {
    const responsePartenaire = await getAllPartenaire();
    let responsePereiodecite = await getPeriodicite();
    let responseProduit = await getDecesProduit();

    this.setState({
      Partenaires: responsePartenaire.data.content,
      produits: responseProduit.data.content,
      periodicites: responsePereiodecite.data.content
    });
  }

  async normeCapitalAge(age, capital, produit) {
    console.log("test produit norme");
    console.log(produit);
    console.log(capital);
    console.log(age);
    let responseNorme = await getNormeByCapitalAndAge(age, capital, produit);
    this.setState({
      normes: responseNorme.data
    });
    console.log("test examen norme");
    console.log("state normes", this.state.normes);
    console.log("response norme", responseNorme.data);
  }

  componentDidMount() {
    this.getDroppDownData();
    this.AuxiliairesByType(MEDECIN_EXAMINATEUR);
  }
  // async jasperFiles(requestDevis) {
  //   let response = await jasperFile(requestDevis);
  //   if (response.status === 200) {
  //     const file = new Blob([response.data], { type: "application/pdf" });
  //     const fileURL = URL.createObjectURL(file);
  //     window.open(fileURL);
  //   }
  // }
  async jasperLettre(requestLettre) {
    let response = await lettreOrientation(requestLettre);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async conditionsParticulier(conditions) {
    let response = await conditionParticulier(conditions);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log("les nouveux examens");
    console.log(this.state.honoraires);
    console.log(this.state.honoraires.length);

    let examens = [];
    console.log("test requestLettreOrientation");
    console.log(this.state.normes);
    if (this.state.normes !== null) {
      this.state.normes.honoraires.forEach(element => {
        examens.push(element.code);
      });

      let listNorme = examens.toString();
      console.log("liste normes", listNorme);
      if (this.state.honoraires.length !== 0) {
        let newExamens = this.state.honoraires;
        console.log("liste des normes", newExamens);
        listNorme = newExamens.toString();
        console.log("liste des nouvelles normes", listNorme);
      }
      let requestLettreOrientation = {
        ville: this.state.contrat.souscripteur.adressVille,
        nomPrenom:
          this.state.contrat.souscripteur.nom +
          " " +
        this.state.contrat.souscripteur.prenom,
        cin: this.state.contrat.souscripteur.cin,
        montantFinancement: this.state.contrat.capitalAssure,
        montantEncours: this.state.fields.encours.value,
        montantCumul: this.state.fields.cumul.value,
        differe: this.state.contrat.differe,
        duree: this.state.contrat.dureeContrat,
        taux: this.state.contrat.tauxInteret,
        intermediaire: this.state.contrat.produit.partenaire.raisonSocial,
        agence: this.state.contrat.pointVente.libelle,
        norme: listNorme,
        dateNaissance: this.state.contrat.souscripteur.dateNaissance,
        pointVenteVille: this.state.contrat.pointVente.adressVille,
        examinateurId: this.state.examinateur,
        codeAcceptation: this.state.codeAcceptation
      };
      console.log(requestLettreOrientation);
      this.jasperLettre(requestLettreOrientation);
      this.updateDecesContrat(this.state.contrat.id, this.state.examinateur);
      this.setState({
        current: 0,
        fields: {
          // step one
          radio: { value: "morale" },
          cin: { value: "" },
          patente: { value: "" },
          assure: { value: "" },

          numeroDossierFinancement: { value: "" },
          souscripteur: { value: "" },
          souscripteurIsAssure: { value: "" },
          assurePresent: { value: false },
          //step two
          preiodicite: { value: "" },
          dureeContrat: { value: "" },
          dateEffet: { value: "" },
          dateEcheance: { value: "" },
          produit: { value: "" },
          pointVente: { value: "" },
          NombreMensualitesEtalementLaPrimeUnique: { value: "" },
          agence: { value: "" },
          partenaire: { value: "" },
          //step three
          PrelevementSource: { value: false },
          Differe: { value: "" },
          optionAssurance: { value: "" },
          montantFrais: { value: "" },
          capitalAssure: { value: "" },
          montantSurprime: { value: "" },
          prorata: { value: "" },
          tauxTaxe: { value: "" },
          montantCotisation: { value: "" },
          tauxInteret: { value: "" },
          datePrelevement: { value: "" },
          montantTaxe: { value: "" },
          tauxSurprime: { value: "" },
          cotisationTotale: { value: "" },
          encours: { value: "" },
          cumul: { value: "" },
          montantTaxeParafiscale: { value: "" },
          montantAccessoire: { value: "" },
          // step four
          invaliditeOuMaladie: { value: false },
          pensionIncapacite: { value: false },
          suspendreAtiviteDeuxDernierAnnee: { value: false },
          maladiesOuOperationChirurgicaleQuandEtOu: { value: "" },
          suspendreAtiviteDeuxDernierAnneePourquiEtTemps: { value: "" },
          quelleMaladieOuInvalidite: { value: "" },
          maladiesOuOperationChirurgicale: { value: false }
        }
      });
    }

    this.setState({
      visible: false
    });

    // window.open("/takafulapp/souscription", "_self");
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  async updateDecesContrat(id, orientation) {
    let response = await updateDecesContratOrientation(id, orientation);
  }
  async AuxiliairesByType(type) {
    let respense = await getAuxiliairesByType(type);
    this.setState({ medecins: respense.data });
    console.log("medecin:", respense);
  }
  async createDecesContrat(body) {
    // if (this.state.normes !== null) {

    let response = await createContratDeces(body);

    this.setState({
      honoraires: response.data.honoraires
    });

    if (response.status === 200) {
      let responseContrat = await getContratById(response.data.id);

      let code = await codeBycontrat(response.data.id);
      this.setState({ codeAcceptation: code.data });

      if (responseContrat.status === 200) {
        let requestCP = {};
        console.log("response contrat:", responseContrat);
        if (responseContrat.data.souscripteur.nom === undefined) {
          requestCP = {
            numeroContrat: responseContrat.data.numeroContrat,
            id: responseContrat.data.id,
            dateEffet: responseContrat.data.dateEffet,
            dureeContrat: responseContrat.data.dureeContrat,
            dateEcheance: responseContrat.data.dateEcheance,
            typePersonne: "moral",
            nomPrenomAssure:
              responseContrat.data.assure.nom +
              " " +
              responseContrat.data.assure.prenom,
            dateNaissance: responseContrat.data.assure.dateNaissance,
            nationalite: responseContrat.data.assure.nationalite,
            cinAssure: responseContrat.data.assure.cin,
            adresseAssure: responseContrat.data.assure.adressComplete,
            telephone: responseContrat.data.assure.numeroDeTelephone,
            //emailAssure: "11111",
            ribAssure: responseContrat.data.assure.rib,
            nomPrenomSouscripteur:
              responseContrat.data.souscripteur.raisonSocial,
            // dateNaissanceSouscripteur:
            //   responseContrat.data.souscripteur.dateNaissance,
            // nationaliteSouscripteur:
            //   responseContrat.data.souscripteur.nationalite,
            // cinSouscripteur: responseContrat.data.souscripteur.cin,
            professionSouscripteur:
              responseContrat.data.pointVente.secteurActivite.libelle,
            adresseSouscripteur:
              responseContrat.data.souscripteur.adressComplete,
            telephoneSouscripteur:
              responseContrat.data.souscripteur.numeroDeTelephone,
            //emailSouscripteur: "1 2 3 4 5 6 7 8 9 10 ",
            ribSouscripteur: responseContrat.data.souscripteur.rib,
            partenaire: responseContrat.data.produit.partenaire.raisonSocial,
            dossierFinancement: responseContrat.data.numeroDossierFinancement,
            capitalAssure: responseContrat.data.capitalAssure,
            montantTTC: this.state.fields.cotisationTotale.value.toFixed(2),
            montantHT: responseContrat.data.montantCotisation.toFixed(2),
            montantTaxe: responseContrat.data.montantTaxe.toFixed(2),
            periodicite: responseContrat.data.periodicite.libelle,
            datePrelevement: responseContrat.data.datePrelevement,
            codePartenaire: responseContrat.data.produit.partenaire.code,
            villeAgence: responseContrat.data.pointVente.adressVille,
            dateEffetFinancement: responseContrat.data.dateEtablissement,
            dateDebutEcheanceFinancement:
              responseContrat.data.datePremierecheance,
            dateFinEcheanceFinancement:
              responseContrat.data.dateDernierEcheance,
            date: moment(responseContrat.data.creationDate, "DD-MM-YYYY")
          };
        } else {
          requestCP = {
            numeroContrat: responseContrat.data.numeroContrat,
            id: responseContrat.data.id,
            dateEffet: responseContrat.data.dateEffet,
            dureeContrat: responseContrat.data.dureeContrat,
            dateEcheance: responseContrat.data.dateEcheance,
            typePersonne: "physique",
            nomPrenomAssure:
              responseContrat.data.assure.nom +
              " " +
              responseContrat.data.assure.prenom,
            dateNaissance: responseContrat.data.assure.dateNaissance,
            nationalite: responseContrat.data.assure.nationalite,
            cinAssure: responseContrat.data.assure.cin,
            adresseAssure: responseContrat.data.assure.adressComplete,
            telephone: responseContrat.data.assure.numeroDeTelephone,
            //emailAssure: "11111",
            profession: responseContrat.data.assure.profession.libelle,
            ribAssure: responseContrat.data.assure.rib,
            nomPrenomSouscripteur:
              responseContrat.data.souscripteur.nom +
              " " +
              responseContrat.data.souscripteur.prenom,
            dateNaissanceSouscripteur:
              responseContrat.data.souscripteur.dateNaissance,
            nationaliteSouscripteur:
              responseContrat.data.souscripteur.nationalite,
            cinSouscripteur: responseContrat.data.souscripteur.cin,
            professionSouscripteur:
              responseContrat.data.souscripteur.profession.libelle,
            adresseSouscripteur:
              responseContrat.data.souscripteur.adressComplete,
            telephoneSouscripteur:
              responseContrat.data.souscripteur.numeroDeTelephone,
            //emailSouscripteur: "1 2 3 4 5 6 7 8 9 10 ",
            ribSouscripteur: responseContrat.data.souscripteur.rib,
            partenaire: responseContrat.data.produit.partenaire.raisonSocial,
            dossierFinancement: responseContrat.data.numeroDossierFinancement,
            capitalAssure: responseContrat.data.capitalAssure,
            montantTTC: this.state.fields.cotisationTotale.value.toFixed(2),
            montantHT: responseContrat.data.montantCotisation.toFixed(2),
            montantTaxe: responseContrat.data.montantTaxe.toFixed(2),
            periodicite: responseContrat.data.periodicite.libelle,
            datePrelevement: responseContrat.data.datePrelevement,
            codePartenaire: responseContrat.data.produit.partenaire.code,
            villeAgence: responseContrat.data.pointVente.adressVille,
            dateEffetFinancement: responseContrat.data.dateEtablissement,
            dateDebutEcheanceFinancement:
              responseContrat.data.datePremierecheance,
            dateFinEcheanceFinancement:
              responseContrat.data.dateDernierEcheance,
            date: moment(responseContrat.data.creationDate, dateFormat)
          };
        }
        // if (responseContrat.data.status === "SIMULATION") {
        //   let requestModel = {
        //     pointVente: responseContrat.data.produit.partenaire.raisonSocial,
        //     nomPrenom:
        //       responseContrat.data.assure.nom +
        //       " " +
        //       responseContrat.data.assure.prenom,
        //     dateNaissance: responseContrat.data.assure.dateNaissance,
        //     capital: responseContrat.data.capitalAssure,
        //     duree: responseContrat.data.dureeContrat,
        //     differe: responseContrat.data.differe,
        //     periodicite: responseContrat.data.periodicite.libelle,
        //     montantParticipationHT: this.state.fields.montantCotisation.value.toFixed(
        //       2
        //     ),
        //     taxe: responseContrat.data.produit.taxe,
        //     montantParticipationTTC: this.state.fields.cotisationTotale.value.toFixed(
        //       2
        //     ),
        //     risque: responseContrat.data.produit.risque.libelle,
        //     produit: responseContrat.data.produit.code
        //   };
        //   this.jasperFiles(requestModel);
        // }

        if (responseContrat.data.status === "INSTANTANEE") {
          this.conditionsParticulier(requestCP);
          this.setState({
            current: 0,
            fields: {
              // step one
              radio: { value: "morale" },
              cin: { value: "" },
              patente: { value: "" },
              assure: { value: "" },

              numeroDossierFinancement: { value: "" },
              souscripteur: { value: "" },
              souscripteurIsAssure: { value: "" },
              assurePresent: { value: false },
              //step two
              preiodicite: { value: "" },
              dureeContrat: { value: "" },
              dateEffet: { value: "" },
              dateEcheance: { value: "" },
              produit: { value: "" },
              pointVente: { value: "" },
              NombreMensualitesEtalementLaPrimeUnique: { value: "" },
              agence: { value: "" },
              partenaire: { value: "" },
              //step three
              PrelevementSource: { value: false },
              Differe: { value: "" },
              optionAssurance: { value: "" },
              montantFrais: { value: "" },
              capitalAssure: { value: "" },
              montantSurprime: { value: "" },
              prorata: { value: "" },
              tauxTaxe: { value: "" },
              montantCotisation: { value: "" },
              tauxInteret: { value: "" },
              datePrelevement: { value: "" },
              montantTaxe: { value: "" },
              tauxSurprime: { value: "" },
              cotisationTotale: { value: "" },
              encours: { value: "" },
              cumul: { value: "" },
              // step four
              invaliditeOuMaladie: { value: false },
              pensionIncapacite: { value: false },
              suspendreAtiviteDeuxDernierAnnee: { value: false },
              maladiesOuOperationChirurgicaleQuandEtOu: { value: "" },
              suspendreAtiviteDeuxDernierAnneePourquiEtTemps: { value: "" },
              quelleMaladieOuInvalidite: { value: "" },
              maladiesOuOperationChirurgicale: { value: false }
            }
          });
        } else {
          this.setState({
            visible: true
          });
        }

        this.setState({ contrat: responseContrat.data });
        const key = `open${Date.now()}`;
        const btn = (
          <Button
            type="primary"
            size="small"
            onClick={() => notification.close(key)}
          >
            Confirm
          </Button>
        );
        notification.success({
          message: "CONTRAT ENREGISTRE",
          description:
            " CONTRAT NUMERO     : " +
            responseContrat.data.numeroContrat +
            " QUITTANCE NUMERO   : " +
            response.data.numQuittance,
          btn,
          duration: 0,
          key
        });
      }
    } else {
      const key = `open${Date.now()}`;
      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => notification.close(key)}
        >
          Confirm
        </Button>
      );
      notification.error({
        message: "erreur d'insertion",
        description: "erreur servenu, ,Merci d'essayer plus tard.",
        btn,
        duration: 0,
        key
      });
    }
    // } else {
    //   const key = `open${Date.now()}`;
    //   const btn = (
    //     <Button
    //       type="primary"
    //       size="small"
    //       onClick={() => notification.close(key)}
    //     >
    //       Confirm
    //     </Button>
    //   );
    //   notification.error({
    //     message: "erreur d'insertion",
    //     description:
    //       "Merci de verifier les normes de sélection du produit selectionné.",
    //     btn,
    //     duration: 0,
    //     key
    //   });
    // }
  }
  checkSelectedPers = (
    souscripteurIsAssure,
    assurePresent,
    souscripteurPresent,
    souscripteurObject,
    assureObject,
    consumeDatas
  ) => {
    console.log("commm", consumeDatas);
    if (assurePresent && souscripteurPresent) {
      if (this.state.allow === false) {
        if (consumeDatas === null) {
          let newStateSouscripteur = this.state.fields.souscripteur;
          newStateSouscripteur.value = souscripteurObject;
          let newStateAssure = this.state.fields.assure;
          newStateAssure.value = assureObject;
          let newStateSouscripteurIsAssure = this.state.fields
            .souscripteurIsAssure;
          newStateSouscripteurIsAssure.value = souscripteurIsAssure;
          let newStateAssurePresent = this.state.fields.assurePresent;
          newStateAssurePresent.value = newStateAssurePresent;
          this.setState({
            allow: true,
            souscripteurObj: souscripteurObject,
            assureObj: assureObject,
            newStateSouscripteur: newStateSouscripteur,
            newStateAssure: newStateAssure,
            newStateSouscripteurIsAssure: newStateSouscripteurIsAssure,
            newStateAssurePresent: newStateAssurePresent
          });
        } else if (consumeDatas !== "undefined" && consumeDatas !== null) {
          // let newStateSouscripteur = { value: consumeDatas.souscripteur };
          // let newStateAssure = { value: consumeDatas.assure };
          let newStateSouscripteurIsAssure = this.state.fields
            .souscripteurIsAssure;
          newStateSouscripteurIsAssure.value = souscripteurIsAssure;
          let newStateAssurePresent = this.state.fields.assurePresent;
          newStateAssurePresent.value = newStateAssurePresent;
          this.setState({
            allow: true,
            souscripteurObj: consumeDatas.souscripteur,
            assureObj: consumeDatas.assure,
            // fields: {
            //   souscripteur: { value: consumeDatas.souscripteur }
            //   // ,dateEffet: { value: consumeDatas.dateEffet },
            //   // dureeContrat: { value: consumeDatas.dureeContrat },
            //   // produit: { value: consumeDatas.produit }
            // },
            // ,newStateAssure: newStateAssure,
            newStateSouscripteurIsAssure: newStateSouscripteurIsAssure,
            newStateAssurePresent: newStateAssurePresent
          });

          consumeData = consumeDatas;
        }
      }
    } else {
      consumeData = consumeDatas;
      if (this.state.allow === true) this.setState({ allow: false });
    }
  };

  next = () => {
    if (this.state.allow && this.state.current === 0) {
      const current = this.state.current + 1;
      this.setState({ current });
    }

    if (consumeData !== null) {
      const age = moment(this.state.fields.dateEcheance.value).diff(
        moment(consumeData.assure.dateNaissance, "DD-MM-YYYY").format(),
        "years"
      );
    } else {
      const age = moment(this.state.fields.dateEcheance.value).diff(
        moment(this.state.assureObj.dateNaissance, "DD-MM-YYYY").format(),
        "years"
      );
    }

    if (
      this.state.fields.produit.value !== "" &&
      this.state.fields.preiodicite.value !== "" &&
      this.state.fields.dateEcheance.value !== "" &&
      this.state.current === 1
    ) {
      const current = this.state.current + 1;
      this.setState({ current });
    }
    if (
      this.state.fields.Differe.value !== "" &&
      this.state.fields.tauxSurprime.value !== "" &&
      this.state.fields.capitalAssure.value !== "" &&
      this.state.fields.montantSurprime.value !== "" &&
      this.state.fields.datePrelevement.value !== "" &&
      this.state.fields.encours.value !== "" &&
      this.state.fields.tauxTaxe.value !== "" &&
      this.state.fields.cumul.value !== "" &&
      this.state.fields.cotisationTotale.value !== "" &&
      this.state.current === 2
    ) {
      const current = this.state.current + 1;
      this.setState({ current });
    }
    if (this.state.current === 2) {
      if (this.state.fields.TarificationFound.value == false) {
        if (
          this.state.fields.Differe.value === "" ||
          this.state.fields.tauxSurprime.value === "" ||
          this.state.fields.capitalAssure.value === "" ||
          this.state.fields.montantSurprime.value === "" ||
          this.state.fields.datePrelevement.value === "" ||
          this.state.fields.encours.value === "" ||
          this.state.fields.tauxTaxe.value === "" ||
          this.state.fields.cumul.value === "" ||
          this.state.fields.cotisationTotale.value === ""
        ) {
          const key = `open${Date.now()}`;
          const btn = (
            <Button
              type="primary"
              size="small"
              onClick={() => notification.close(key)}
            >
              Confirm
            </Button>
          );
          notification.error({
            message: "Attention!",
            description:
              "Ce produit n'a pas une tarification avec les valeurs saisies",
            btn,
            duration: 0,
            key
          });
        }
      }
    }
    if (this.state.current === 1) {
      const current = this.state.current + 1;
      this.setState({ current });
    }
  };
  handleConfirm = (value, key) => {
    console.log("value requete");
    console.log(value);
    this.createDecesContrat(value);
    notification.close(key);
  };

  // handleConf = request => {
  //   let requestModel = {
  //     pointVente: pointVente,
  //     nomPrenom: request.souscripteur.nom + " " + request.souscripteur.prenom,
  //     dateNaissance: request.souscripteur.dateNaissance,
  //     capital: request.capitalAssure,
  //     duree: request.dureeContrat,
  //     differe: request.differe,
  //     periodicite: this.state.fields.preiodicite.value.label,
  //     montantParticipationHT: this.state.fields.montantCotisation.value,
  //     taxe: request.montantTaxe,
  //     montantParticipationTTC: this.state.fields.cotisationTotale.value,
  //     risque: request.produit.risque.libelle,
  //     produit: request.produit.code
  //   };

  //   this.jasperFiles(requestModel);
  // };

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  handleFormChange = changedFields => {
    this.setState(({ fields }) => ({
      fields: { ...fields, ...changedFields }
    }));
  };

  done(event) {
    const { fields } = this.state;
    console.log("fields:", fields);
    this.setState({ disableButton: true });

    if (
      fields.Differe.value !== "" &&
      fields.tauxSurprime.value !== "" &&
      fields.tauxInteret.value !== "" &&
      fields.capitalAssure.value
    ) {
      let myObject;
      if (fields.optionAssurance.value !== "")
        myObject = { id: fields.optionAssurance.value.key };
      else myObject = null;
      let agee, ageObj;
      if (consumeData !== null) {
        agee = moment(this.state.fields.dateEcheance.value).diff(
          moment(consumeData.assure.dateNaissance, "DD-MM-YYYY").format(),
          "years"
        );
      } else {
        ageObj = isNaN(
          moment().diff(
            moment(
              this.state.souscripteurObj.dateNaissance,
              "DD-MM-YYYY"
            ).format(),
            "years"
          )
        );
        agee = ageObj
          ? moment(this.state.fields.dateEcheance.value).diff(
              moment(this.state.assureObj.dateNaissance, "DD-MM-YYYY").format(),
              "years"
            )
          : moment().diff(
              moment(
                this.state.souscripteurObj.dateNaissance,
                "DD-MM-YYYY"
              ).format(),
              "years"
            );
      }
      const agee1 = moment().diff(
        moment(this.state.assureObj.dateNaissance, "DD-MM-YYYY").format(),
        "years"
      );
      console.log("age test ");
      console.log(ageObj);
      console.log(agee);
      // const agee = moment().diff(
      //   moment(this.state.souscripteurObj.dateNaissance, "DD-MM-YYYY").format(),
      //   "years"
      // );

      let fieldsToRequest = {
        // step one
        assure:
          consumeData !== null || consumeData != undefined
            ? consumeData.assure
            : this.state.assureObj,
        souscripteur:
          consumeData !== null || consumeData != undefined
            ? consumeData.souscripteur
            : this.state.souscripteurObj,
        numeroDossierFinancement: fields.numeroDossierFinancement.value,
        souscripteurIsAssure: fields.souscripteurIsAssure.value,
        age: agee1,
        //step two
        dateEtablissement:
          consumeData !== null || consumeData != undefined
            ? moment(consumeData.dateEffet, "DD/MM/YYYY")
            : null,
        datePremierecheance:
          consumeData !== null || consumeData != undefined
            ? moment(consumeData.dateEffet, "DD/MM/YYYY")
            : null,
        dateDernierEcheance:
          consumeData !== null || consumeData != undefined
            ? moment(consumeData.dateEcheance, "DD/MM/YYYY")
            : null,
        idPeriodicite: fields.preiodicite.value.key,
        dureeContrat: fields.dureeContrat.value,
        dateEffet: moment.addRealMonth(
          fields.dateEffet.value,
          fields.Differe.value
        ),
        dateEcheance: fields.dateEcheance.value,
        seuilExaminateur: this.state.produits.filter(
          item => item.id === fields.produit.value.key
        )[0].seuilExaminateur,
        seuilConseil: this.state.produits.filter(
          item => item.id === fields.produit.value.key
        )[0].seuilConseil,
        seuilReassurance: this.state.produits.filter(
          item => item.id === fields.produit.value.key
        )[0].seuilReassurance,
        idProd: this.state.produits.filter(
          item => item.id === fields.produit.value.key
        )[0].id,
        idPointVente: fields.pointVente.value,
        partenaire: fields.partenaire.value,
        //step three
        PrelevementSource: fields.Differe.value,
        differe: fields.Differe.value,
        optionAssurance: myObject,
        montantSurprime: fields.montantSurprime.value,
        montantFrais: fields.montantFrais.value,
        capitalAssure: fields.capitalAssure.value,
        prorata: fields.prorata.value,
        montantTaxeParafiscale: fields.montantTaxeParafiscale.value,
        montantAccessoire: fields.montantAccessoire.value,

        montantCotisation: fields.montantCotisation.value,
        tauxInteret: fields.tauxInteret.value,
        datePrelevement: fields.datePrelevement.value,
        montantTaxe: fields.montantTaxe.value,
        tauxSurprime: fields.tauxSurprime.value,
        encours: fields.encours.value,
        cumul: fields.cumul.value,
        fraisAcquisitionTTC: fields.fraisAcquisitionTTC.value,
        fraisGestionTTC: fields.fraisGestionTTC.value,
        contributionPure: fields.contributionPure.value,
        // step Four fields
        invaliditeOuMaladie: fields.invaliditeOuMaladie.value,
        pensionIncapacite: fields.pensionIncapacite.value,
        suspendreAtiviteDeuxDernierAnnee:
          fields.suspendreAtiviteDeuxDernierAnnee.value,
        maladiesOuOperationChirurgicaleQuandEtOu:
          fields.maladiesOuOperationChirurgicaleQuandEtOu.value,
        suspendreAtiviteDeuxDernierAnneePourquiEtTemps:
          fields.suspendreAtiviteDeuxDernierAnneePourquiEtTemps.value,
        quelleMaladieOuInvalidite: fields.quelleMaladieOuInvalidite.value,
        maladiesOuOperationChirurgicale:
          fields.maladiesOuOperationChirurgicale.value
      };
      console.log("fields request date:", fieldsToRequest);

      this.normeCapitalAge(
        agee,
        fieldsToRequest.cumul,
        fieldsToRequest.idProd
      ).then(response => {
        console.log("response back", response);

        let testsExamens = [];
        if (this.state.normes !== null) {
          this.state.normes.honoraires.forEach(element => {
            testsExamens.push(element.code);
          });

          const listNorme = testsExamens.toString();
          console.log("liste normes", testsExamens);
        }
        fieldsToRequest.honoraires = testsExamens;
        console.log("fields request date 2:", fieldsToRequest);

        if (event === "SIMULATION") {
          fieldsToRequest.status = "SIMULATION";
        }
        const key = `open${Date.now()}`;
        const btn = (
          <div>
            <Button
              type="primary"
              onClick={() => this.handleConfirm(fieldsToRequest, key)}
              className="not-rounded"
            >
              Confirmer
            </Button>
            <Button
              onClick={() => notification.close(key)}
              style={{ marginLeft: 8 }}
              className="not-rounded"
            >
              Fermer
            </Button>
          </div>
        );
        notification.info({
          message: "Confirmation",
          description: (
            <div>
              <Divider />

              <Descriptions bordered column={2} size="small">
                <Descriptions.Item label="MONTANT FINANCEMENT">
                  {parseFloat(fields.capitalAssure.value).toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="CUMUL" span={2}>
                  {parseFloat(fields.cumul.value).toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="DUREE">
                  {fields.dureeContrat.value}
                </Descriptions.Item>
                <Descriptions.Item label="DIFFERE" span={2}>
                  {fields.Differe.value}
                </Descriptions.Item>
                <Descriptions.Item label="MONTANT CONTRIBUTION  PRORATISE TTC">
                  {parseFloat(
                    (fields.prorata.value * 10) / 100 + fields.prorata.value
                  ).toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="MONTANT  CONTRIBUTION PRORATISE HT">
                  {parseFloat(fields.prorata.value).toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="MONTANT CONTRIBUTION HT" span={2}>
                  {parseFloat(fields.montantCotisation.value).toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="MONTANT CONTRIBUTION TTC">
                  {parseFloat(fields.cotisationTotale.value).toFixed(2)}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ),
          btn,
          key,
          style: {
            width: 880,
            marginLeft: 335 - 1280
          },
          duration: 0
        });
      });
    }
  }
  onChangeMedecin = value => {
    this.setState({ examinateur: value });
  };

  render() {
    const { current, fields } = this.state;
    const steps = [
      {
        title: "Première étape",
        content: (
          <connectedUserContext.Consumer>
            {value => (
              <StepOne
                check={this.checkSelectedPers}
                {...fields}
                onChange={this.handleFormChange}
                currentUser={value}
              />
            )}
          </connectedUserContext.Consumer>
        )
      },
      {
        title: "Deuxième étape",
        content: (
          <connectedUserContext.Consumer>
            {value => (
              (pointVente = value.pointVentes[0].libelle),
              (
                <StepTwo
                  produits={this.state.produits}
                  periodicites={this.state.periodicites}
                  partenaires={this.state.Partenaires}
                  {...fields}
                  onChange={this.handleFormChange}
                  currentUser={value}
                  consumeData={consumeData}
                />
              )
            )}
          </connectedUserContext.Consumer>
        )
      },
      {
        title: "Troisième étape",
        content: (
          <StepThree
            dateEffet={this.state.fields.dateEffet.value}
            assureObj={this.state.assureObj}
            dureeContrat={this.state.fields.dureeContrat.value}
            selectedproduit={
              this.state.produits.filter(
                item => item.code === this.state.fields.produit.value.label
              )[0]
            }
            {...fields}
            onChange={this.handleFormChange}
            consumeData={consumeData}
          />
        )
      },
      {
        title: "Quatrième étape",
        content: <StepFour {...fields} onChange={this.handleFormChange} />
      }
    ];
    let title;
    if (fields.produit.value === "")
      title = "Nouvelle souscription décès produit";
    else {
      title =
        "Nouvelle souscription décès produit  " +
        this.state.produits.filter(
          item => item.code === fields.produit.value.label
        )[0].libelle;
    }

    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="Choisissez un médecin examinateur"
          visible={this.state.visible}
          onOk={this.handleOk}
          okText="Valider"
          cancelText="Fermer"
        >
          <Form hideRequiredMark>
            <Form.Item label="Medecin examinateur" hasFeedback>
              {getFieldDecorator("medecin", {
                valuePropName: "selected",
                rules: [
                  {
                    required: true,
                    message: "sélectionnez un medecin"
                  }
                ]
              })(
                <Select
                  placeholder="sélectionnez"
                  onChange={this.onChangeMedecin}
                >
                  {this.state.medecins.map(element => {
                    return (
                      <Option
                        key={element.id}
                        value={element.id}
                        label={element.nom}
                      >
                        {element.nom + " - " + element.adressVille}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
        <ComponentTitle title={title} />
        <Steps current={current}>
          {steps.map(item => (
            <Step
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </Steps>
        <div className="steps-content-style">{steps[current].content}</div>
        <div className="steps-action">
          {current === 0 && (
            <Button
              type="primary"
              className="multisteps-btn-next"
              htmlType="submit"
              form="formadd"
              onClick={() => this.next()}
            >
              Suivant
            </Button>
          )}
          {current === 1 && fields.dureeContrat.value !== "" && (
            <Button
              type="primary"
              htmlType="submit"
              className="multisteps-btn-next"
              form="steptwo"
              onClick={() => this.next()}
              disabled={this.state.booleen}
            >
              Suivant
            </Button>
          )}
          {current === 2 && (
            <Button
              type="primary"
              htmlType="submit"
              className="multisteps-btn-next"
              form="stepthree"
              onClick={() => this.next()}
            >
              Suivant
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              htmlType="submit"
              className="multisteps-btn-next"
              form="stepfour"
              disabled={this.state.disableButton}
              onClick={() => this.done("CREATION")}
            >
              Terminer la création
            </Button>
          )}
          {/* {current === steps.length - 1 && (
            <Button
              type="primary"
              htmlType="submit"
              className="multisteps-btn-simulation"
              form="stepfour"
              onClick={() => this.done("SIMULATION")}
            >
              Terminer la simulation
            </Button>
          )} */}
          {current > 0 && (
            <Button onClick={() => this.prev()}>Précédent</Button>
          )}
        </div>
      </div>
    );
  }
}
export default Form.create()(Souscription);
