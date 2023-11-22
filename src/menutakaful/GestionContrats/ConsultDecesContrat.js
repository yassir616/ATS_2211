/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import axios from "axios";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Icon,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
  Table,
  Tag,
  Upload
} from "antd";
import moment, { duration } from "moment";
import React, { Component } from "react";
import {
  NOM_ASSURE,
  CIN_ASSURE,
  NUM_CONTRAT,
  DATE_EFFET,
  DATE_PRELEVEMENT,
  AVN_PERIODICITE,
  AVN_ADRESSE,
  AVN_BENEFICIAIRE,
  AVN_CHANGEMENT_CAPITAL_DURE,
  AVN_STATUS,
  AVN_DTEFFET,
  ACCESS_TOKEN,
  CODE_ACCEPTATION
} from "../../constants/index";
import DetailsContrat from "./DetailsContrat";
import ComponentTitle from "../../util/Title/ComponentTitle";
import { getTarification } from "../Parametrage/ProduitDeces/ProduitDecesAPI";
import {
  addAvenant,
  ajouterAvenant,
  getTypeAvenant
} from "../Parametrage/avenant/AvenantAPI";
import {
  getDecesContratsByPartenaire,
  getDecesContrats,
  getDecesContrat,
  searchContrat,
  updateDecesContratStatus,
  updateContratDateEffetAPI,
  updateContartDeces,
  getBConditionGenerale,
  getAcceptationByContrat
} from "./ContratsAPI";

import {
  conditionParticulier,
  ReglemntGestion
} from "../Production Prestations/Souscription/SouscriptionAPI";
import { getColumnSearchProps } from "../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { ajoutSinistre } from "./DetailsTabs/SinistreAPI";

import ChangementAdresse from "./Avenant/ChangementAdresse";
import ChangementStatus from "./Avenant/ChangementStatus";
import ChangementDateEffet from "./Avenant/ChangementDateEffet";
import ChangementCapitaleEtDuree from "./Avenant/ChangementCapitaleEtDuree";
import { CONNECTION_URL } from "../../constants/source";
import {
  lettreAcceptation,
  lettreAcceptationAvecSurprime,
  lettreRenonciation
} from "../Production Prestations/GestionAcceptation/AcceptationsAPI";
import QRCode from "react-qr-code";
import QrScanner from "qr-scanner";
export const MyContext = React.createContext();
var contrats = [];
var statuts = "ACCEPTED";
const { Option } = Select;
const { Search } = Input;
const dateFormat = "DD-MM-YYYY";
var typeProduit = "";
let dateCP = new Date();
let formData = new FormData();
class ConsultDecesContrat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      Avenantchoisi: "",
      TypeAvenant: null,
      AdressChangementVisibilty: false,
      modelShow: false,
      visible: false,
      visibled: false,
      show: false,
      acceptation: [],
      avenantCapital: false,
      avenantContrat: false,
      showed: false,
      sinistre: false,
      view: false,
      restitution: false,
      dateCreation: new Date(),
      dateEff: moment(moment(), "YYYY-MM-DD").format("YYYY-MM-DD"),
      flag: 0,
      searchText: "",
      searchedColumn: "",
      selectedRowKeys: [],
      searchby: NUM_CONTRAT,
      searchfor: "",
      selectedFile: null,
      record: {},
      contrats: [],
      totalItems: 0,
      pagenumber: 1,
      value: "",
      differe: null,
      dateEcheance: "",
      duree: null,
      keyRecord: "",
      capital: null,
      tauxSurprime: null,
      tauxReduction: null,
      tauxTaxe: null,
      tarification: {},
      montantSurprime: null,
      montantCotisation: null,
      montantTTC: null,
      cotisationTotale: null,
      montantTaxe: null,
      prorata: null,
      typesAvenant: []
    };

    this.columns = [
      {
        title: "N° de Contrat",
        dataIndex: NUM_CONTRAT,
        key: "idContrat",
        render: (text, record) => {
          return (
            <span>
              <div>
                <MyContext.Provider
                  value={{
                    state: record
                  }}
                >
                  <DetailsContrat />
                </MyContext.Provider>
              </div>
            </span>
          );
        }
      },
      {
        title: "Code d'acceptation",
        dataIndex: "acceptation.code",
        key: CODE_ACCEPTATION
      },
      {
        title: "Durée Contrat",
        dataIndex: "dureeContrat",
        key: "dureeContrat",
        ...getColumnSearchProps("dureeContrat", "Durée contrat", this)
      },
      {
        title: "CIN assuré",
        dataIndex: "assure.cin",
        key: "cinAssure"
      },
      {
        title: "Nom assuré",
        dataIndex: "assure.nom",
        key: "nomAssure",
        ...getColumnSearchProps("assure.nom", "Prénom assure", this)
      },
      {
        title: "Prénom assuré",
        dataIndex: "assure.prenom",
        key: "prenomAssure"
      },
      {
        title: "Nom souscripteur",
        dataIndex: "souscripteur.nom",
        key: "nomSouscripteur",
        ...getColumnSearchProps("souscripteur.nom", "Prénom assure", this)
      },
      {
        title: "Prénom souscripteur",
        dataIndex: "souscripteur.prenom",
        key: "prenomSouscripteur"
      },

      {
        title: "Date d'effet",
        dataIndex: DATE_EFFET,
        width: "10%",
        key: "dateEffet"
      },
      {
        title: "Date écheance",
        dataIndex: "dateEcheance",
        width: "10%",
        key: "dateEcheance"
      },
      {
        title: "Produit",
        dataIndex: "produit.libelle",
        key: "produit"
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
        render: status => (
          <span>
            {status === "ACCEPTED" ? (
              <Tag color="green" key={status}>
                ACCEPTE
              </Tag>
            ) : (
              <Tag color="volcano" key={status}>
                {status}
              </Tag>
            )}
          </span>
        )
      },
      {
        title: "Capital Assure",
        dataIndex: "capitalAssure",
        key: "capitalAssure"
      },
      {
        title: "Action",
        dataIndex: "operation",
        width: "10%",
        render: (text, record) => {
          return (
            <span>
              {record.status == "ACCEPTED" && (
                <span>
                  <Button
                    type="primary"
                    onClick={() => this.handleChangePrestation(record)}
                    size="small"
                    style={{
                      borderRadius: "0px",
                      width: "105px",
                      backgroundColor: "#4ee289",
                      borderColor: "#4ee289",
                      textAlign: "left"
                    }}
                  >
                    <Icon type="plus-circle" /> Prestation
                  </Button>
                  <Button
                    onClick={() => this.showModal(record)}
                    size="small"
                    style={{
                      borderRadius: "0px",
                      width: "105px",
                      textAlign: "left"
                    }}
                  >
                    <Icon type="download" />
                    Edition
                  </Button>
                  <Modal
                    visible={this.state.modelShow}
                    title="EDITION DU CONTRAT"
                    onOk={this.handleOk}
                    onCancel={this.Canceled}
                    width="950px"
                    footer={[
                      <Button key="back" onClick={this.handleOk}>
                        Fermer
                      </Button>
                    ]}
                  >
                    <Button
                      key="back"
                      onClick={() => this.getReglementGestion()}
                      style={{
                        borderRadius: "0px",
                        textAlign: "center",
                        marginLeft: "40px",
                        width: "180px"
                      }}
                    >
                      REGLEMENT GESTION
                    </Button>

                    <Button
                      key="submit"
                      type="primary"
                      onClick={() => this.conditionParticuliere(record)}
                      style={{
                        borderRadius: "0px",
                        textAlign: "center",
                        marginLeft: "20px",
                        width: "190px"
                      }}
                    >
                      CONDITIONS PARTICULIERES
                    </Button>
                    <Button
                      key="submit"
                      onClick={() =>
                        this.conditionGenerale(record.produit.partenaire.code)
                      }
                      style={{
                        borderRadius: "0px",
                        textAlign: "center",
                        marginLeft: "20px",
                        width: "190px"
                      }}
                    >
                      CONDITIONS GENERALES
                    </Button>

                    <Button
                      key="submit"
                      type="primary"
                      onClick={() => this.lettreAcceptation()}
                      style={{
                        borderRadius: "0px",
                        textAlign: "center",
                        marginLeft: "20px",
                        width: "190px"
                      }}
                    >
                      LETTRE D'ACCEPTATION
                    </Button>
                  </Modal>
                </span>
              )}
              {record.status == "WAITING_ACCEPTATION" ||
              record.status == "EN_COURS_RESILIATION" ||
              record.status == "ACCEPTED" ? (
                ""
              ) : (
                <span>
                  <Button
                    type="primary"
                    onClick={() => this.handleSelectChange(record)}
                    size="small"
                    style={{
                      borderRadius: "0px",
                      width: "105px",
                      backgroundColor: "rgb(236 131 91)",
                      borderColor: "rgb(236 131 91)",
                      textAlign: "left",
                      marginBottom: "2px"
                    }}
                  >
                    <Icon type="plus-circle" /> Avenant
                  </Button>
                  {record.status == "INSTANTANEE" && (
                    <span>
                      <Button
                        type="primary"
                        onClick={() => this.handleChangePrestation(record)}
                        size="small"
                        style={{
                          borderRadius: "0px",
                          width: "105px",
                          backgroundColor: "#4ee289",
                          borderColor: "#4ee289",
                          textAlign: "left"
                        }}
                      >
                        <Icon type="plus-circle" /> Prestation
                      </Button>
                      <Button
                        onClick={() => this.showModal(record)}
                        size="small"
                        style={{
                          borderRadius: "0px",
                          width: "105px",
                          textAlign: "left"
                        }}
                      >
                        <Icon type="download" />
                        Edition
                      </Button>
                      <Modal
                        visible={this.state.modelShow}
                        title="EDITION DU CONTRAT"
                        onOk={this.handleOk}
                        onCancel={this.Canceled}
                        width="950px"
                        footer={[
                          <Button key="back" onClick={this.handleOk}>
                            Fermer
                          </Button>
                        ]}
                      >
                        <Button
                          key="back"
                          onClick={() => this.getReglementGestion()}
                          style={{
                            borderRadius: "0px",
                            textAlign: "center",
                            marginLeft: "40px",
                            width: "180px"
                          }}
                        >
                          REGLEMENT GESTION
                        </Button>

                        <Button
                          key="submit"
                          type="primary"
                          onClick={() => this.conditionParticuliere(record)}
                          style={{
                            borderRadius: "0px",
                            textAlign: "center",
                            marginLeft: "20px",
                            width: "190px"
                          }}
                        >
                          CONDITIONS PARTICULIERES
                        </Button>
                        <Button
                          key="submit"
                          onClick={() =>
                            this.conditionGenerale(
                              record.produit.partenaire.code
                            )
                          }
                          style={{
                            borderRadius: "0px",
                            textAlign: "center",
                            marginLeft: "20px",
                            width: "190px"
                          }}
                        >
                          CONDITIONS GENERALES
                        </Button>

                        <Button
                          key="submit"
                          type="primary"
                          onClick={() => this.lettreAcceptation()}
                          style={{
                            borderRadius: "0px",
                            textAlign: "center",
                            marginLeft: "20px",
                            width: "190px"
                          }}
                        >
                          LETTRE D'ACCEPTATION
                        </Button>
                      </Modal>
                      <Upload {...this.upload}>
                        <Button
                          size="small"
                          style={{
                            borderRadius: "0px",
                            width: "105px",
                            textAlign: "left"
                          }}
                          onClick={() => this.getContratId(record)}
                        >
                          Télécharger
                        </Button>
                      </Upload>
                    </span>
                  )}
                </span>
              )}
            </span>
          );
        }
      }
    ];
  }

  getContratId = value => {
    console.log(value);
    formData.append("contract_id", value.id);
  };
  upload = {
    transformFile(file) {
      return new Promise(resolve => {
        formData.append("file", file);
        axios
          .post(
            process.env.REACT_APP_API_BASE_URL ||
              CONNECTION_URL + "/private/upload",
            formData,
            {
              headers: {
                Authorization: localStorage.getItem(ACCESS_TOKEN),
                "Content-Type":
                  "multipart/form-data; boundary=<calculated when request is sent>"
              }
            }
          )
          .then(response => {
            resolve(response.data.content);

            const keys = `open${Date.now()}`;
            const btn = (
              <Button
                type="primary"
                size="small"
                onClick={() => notification.close(keys)}
              >
                Confirm
              </Button>
            );
            notification.success({
              message: "Importation avec succès",
              btn,
              duration: 0
            });
            window.location.reload();
          })
          .catch(error => {
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
              message: "Erreur d'importation",
              btn,
              duration: 0
            });
            window.location.reload();
          });
      });
    }
  };

  conditionGenerale(record) {
    console.log("intermediaire:", record);
    this.getConditionGenerale(record);
  }

  lettreAcceptation = () => {
    //console.log("value acceptation :", this.state.record);
    this.getAcceptation(this.state.record.id);
    if (
      this.state.acceptation.contrat.tauxSurprime != 0 ||
      this.state.acceptation.contrat.surprimeTTC != 0
    ) {
      let requestsurprime = {
        nomPrenom:
          this.state.acceptation.contrat.assure.nom +
          " " +
          this.state.acceptation.contrat.assure.prenom,
        intermediaire: this.state.acceptation.contrat.produit.partenaire
          .raisonSocial,
        agence: this.state.acceptation.contrat.pointVente.libelle,
        numeroAcceptation: this.state.acceptation.code,
        montantFinancement: this.state.acceptation.contrat.capitalAssure,
        encours: this.state.acceptation.encours,
        cumul: this.state.acceptation.cumul,
        duree: this.state.acceptation.contrat.dureeContrat,
        differe: this.state.acceptation.contrat.differe,
        tauxSurprime: this.state.acceptation.contrat.tauxSurprime,
        surprimeTTC: this.state.acceptation.contrat.surprimeTTC
      };
      console.log("request surprime:", requestsurprime);
      this.jasperLettreAcceptationAvecSurprime(requestsurprime);
    } else if (
      this.state.acceptation.verdict === "Acceptation avec rénonciation"
    ) {
      let requestRenonciation = {
        nomParticipant:
          this.state.acceptation.contrat.assure.nom +
          " " +
          this.state.acceptation.contrat.assure.prenom,
        motif: this.state.acceptation.observationsVerdict,
        adresse: this.state.acceptation.contrat.assure.adressComplete,
        cin: this.state.acceptation.contrat.assure.cin
      };
      console.log("request Renonciation:", requestRenonciation);
      this.jasperLettreRenonciation(requestRenonciation);
    } else {
      let requestAcceptation = {
        intermediaire: this.state.record.produit.partenaire.raisonSocial,
        nom:
          this.state.record.assure.nom + " " + this.state.record.assure.prenom,
        agence: this.state.record.pointVente.libelle,
        numeroAcceptation: this.state.acceptation.code,
        montantMourabaha: this.state.record.capitalAssure.toFixed(2),
        encours: this.state.acceptation.encours.toFixed(2),
        cumul: this.state.acceptation.cumul.toFixed(2),
        duree: this.state.record.dureeContrat,
        differe: this.state.record.differe,
        montantCotisation: (
          this.state.record.montantCotisation + this.state.record.montantTaxe
        ).toFixed(2)
      };
      this.jasperLettreAcceptation(requestAcceptation);
    }
  };

  async jasperLettreAcceptation(requestLettre) {
    let response = await lettreAcceptation(requestLettre);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async jasperLettreAcceptationAvecSurprime(requestLettreSurprime) {
    let response = await lettreAcceptationAvecSurprime(requestLettreSurprime);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async jasperLettreRenonciation(requestLettreRenonciation) {
    let response = await lettreRenonciation(requestLettreRenonciation);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }

  async getAcceptation(id) {
    let response = await getAcceptationByContrat(id);
    this.setState({ acceptation: response.data });
  }

  async ajouterUnAvenant(avenant) {
    await ajouterAvenant(avenant);
  }
  conditionParticuliere = value => {
    console.log("value gestion :", value);
    console.log("state value : ",this.state.record)
    //let separator='-';

    //let date = this.state.dateEff.getDate();
    //let month = this.state.dateEff.getMonth() + 1;
    //let year = this.state.dateEff.getFullYear();
    //let currentDate = this.state.dateEff.format('YYYY-MM-DD');
    //`${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date<10?`0${date}`:`${date}`}`;

    var montantTaxe =
      (this.state.record.montantCotisation / 100) *
      this.state.record.produit.taxe.toFixed(2);
    var cotisationTotale =
      this.state.record.montantSurprime +
      this.state.record.montantCotisation +
      montantTaxe;
    let requestCP = {};
    if (this.state.record.souscripteur.nom === undefined) {
      requestCP = {
        numeroContrat: this.state.record.numeroContrat,
        id: this.state.record.id,
        dateEffet:
          this.state.record.status == "INSTANTANEE" &&
          this.state.record.cotisation.contrat.flag == 0
            ? this.state.dateEff
            : this.state.record.dateEffet,
        dureeContrat: this.state.record.dureeContrat,
        dateEcheance: this.state.record.dateEcheance,
        typePersonne: "moral",
        nomPrenomAssure:
          this.state.record.assure.nom + " " + this.state.record.assure.prenom,
        dateNaissance: this.state.record.assure.dateNaissance,
        nationalite: this.state.record.assure.nationalite,
        cinAssure: this.state.record.assure.cin,
        adresseAssure: this.state.record.assure.adressComplete,
        telephone: this.state.record.assure.numeroDeTelephone,
        //emailAssure: "11111",
        ribAssure: this.state.record.assure.rib,
        nomPrenomSouscripteur: this.state.record.souscripteur.raisonSocial,
        // dateNaissanceSouscripteur:
        //   this.state.record.souscripteur.dateNaissance,
        // nationaliteSouscripteur:
        //   this.state.record.souscripteur.nationalite,
        // cinSouscripteur: this.state.record.souscripteur.cin,
        professionSouscripteur: this.state.record.pointVente.secteurActivite
          .libelle,
        adresseSouscripteur: this.state.record.souscripteur.adressComplete,
        telephoneSouscripteur: this.state.record.souscripteur.numeroDeTelephone,
        //emailSouscripteur: "1 2 3 4 5 6 7 8 9 10 ",
        ribSouscripteur: this.state.record.souscripteur.rib,
        partenaire: this.state.record.produit.partenaire.raisonSocial,
        dossierFinancement: this.state.record.numeroDossierFinancement,
        capitalAssure: this.state.record.capitalAssure,
        montantTTC:
          this.state.record.surprimeTTC !== 0
            ? this.state.record.surprimeTTC
            : cotisationTotale.toFixed(2),
        montantHT:
          this.state.record.surprimeHT !== 0
            ? this.state.record.surprimeHT
            : this.state.record.montantCotisation.toFixed(2),
        montantTaxe:
          this.state.record.surprimeTaxe !== 0
            ? this.state.record.surprimeTaxe
            : this.state.record.montantTaxe.toFixed(2),
        periodicite: this.state.record.periodicite.libelle,
        datePrelevement: this.state.record.datePrelevement,
        codePartenaire: this.state.record.produit.partenaire.code,
        villeAgence: this.state.record.pointVente.adressVille,
        dateEffetFinancement: this.state.record.dateEtablissement,
        dateDebutEcheanceFinancement: this.state.record.datePremierecheance,
        dateFinEcheanceFinancement: this.state.record.dateDernierEcheance,
        date: this.state.record.creationDate
      };
    } else {
      requestCP = {
        numeroContrat: this.state.record.numeroContrat,
        id: this.state.record.id,
        dateEffet:
          this.state.record.status == "INSTANTANEE" &&
          this.state.record.cotisation.contrat.flag == 0
            ? this.state.dateEff
            : this.state.record.dateEffet,
        dureeContrat: this.state.record.dureeContrat,
        dateEcheance: this.state.record.dateEcheance,
        typePersonne: "physique",
        nomPrenomAssure:
          this.state.record.assure.nom + " " + this.state.record.assure.prenom,
        dateNaissance: this.state.record.assure.dateNaissance,
        nationalite: this.state.record.assure.nationalite,
        cinAssure: this.state.record.assure.cin,
        adresseAssure: this.state.record.assure.adressComplete,
        telephone: this.state.record.assure.numeroDeTelephone,
        //emailAssure: "11111",
        ribAssure: this.state.record.assure.rib,
        profession: this.state.record.assure.profession.libelle,
        nomPrenomSouscripteur:
          this.state.record.souscripteur.nom +
          " " +
          this.state.record.souscripteur.prenom,
        dateNaissanceSouscripteur: this.state.record.souscripteur.dateNaissance,
        nationaliteSouscripteur: this.state.record.souscripteur.nationalite,
        cinSouscripteur: this.state.record.souscripteur.cin,
        professionSouscripteur: this.state.record.souscripteur.profession
          .libelle,
        adresseSouscripteur: this.state.record.souscripteur.adressComplete,
        telephoneSouscripteur: this.state.record.souscripteur.numeroDeTelephone,
        //emailSouscripteur: "1 2 3 4 5 6 7 8 9 10 ",
        ribSouscripteur: this.state.record.souscripteur.rib,
        partenaire: this.state.record.produit.partenaire.raisonSocial,
        dossierFinancement: this.state.record.numeroDossierFinancement,
        capitalAssure: this.state.record.capitalAssure,
        montantTTC:
          this.state.record.surprimeTTC !== 0
            ? this.state.record.surprimeTTC
            : cotisationTotale.toFixed(2),
        montantHT:
          this.state.record.surprimeHT !== 0
            ? this.state.record.surprimeHT
            : this.state.record.montantCotisation.toFixed(2),
        montantTaxe:
          this.state.record.surprimeTaxe !== 0
            ? this.state.record.surprimeTaxe
            : this.state.record.montantTaxe.toFixed(2),
        periodicite: this.state.record.periodicite.libelle,
        datePrelevement: this.state.record.datePrelevement,
        codePartenaire: this.state.record.produit.partenaire.code,
        villeAgence: this.state.record.pointVente.adressVille,
        dateEffetFinancement: this.state.record.dateEtablissement,
        dateDebutEcheanceFinancement: this.state.record.datePremierecheance,
        dateFinEcheanceFinancement: this.state.record.dateDernierEcheance,
        date: this.state.record.creationDate,
        codeQr:
          "Numero Contrat :" +
          this.state.record.numeroContrat +
          "\n HashCTR :" +
          this.state.record.id +
          "\n HashP :" +
          this.state.record.produit.id
      };
    }

    //console.log('test condition particuliere :');
    console.log(requestCP);
    let requestContratDateEffet = {
      id: requestCP.id,
      dateEffet: this.state.dateEff,
      status: this.state.record.status,
      flag: this.state.record.cotisation.contrat.flag
    };
    console.log("flag:", requestContratDateEffet.flag);
    this.state.record.dateEffet = requestCP.dateEffet;
    if (requestContratDateEffet.flag == 0) {
      this.state.record.cotisation.contrat.flag=1
      const key = `open${Date.now()}`;
      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            this.getConditionParticuliere(requestCP);
            this.updatedContratDateEffet(requestCP.id, requestContratDateEffet);
            notification.close(key);
          }}
        >
          Confirmer
        </Button>
      );
      notification.warning({
        message: "Attention cette action va changer la date d'effet",
        description:
          " Contrat n° : " +
          requestCP.numeroContrat +
          "  Nom :" +
          requestCP.nomPrenomAssure,

        btn,
        duration: 0,
        key
      });
    } else {
      this.updatedContratDateEffet(requestCP.id, requestContratDateEffet);
      this.getConditionParticuliere(requestCP);
    }
  };

  async getConditionGenerale(partenaire) {
    console.log("hello:", partenaire);
    let response = await getBConditionGenerale(partenaire);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async getReglementGestion() {
    let response = await ReglemntGestion();
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }

  async getConditionParticuliere(body) {
    let response = await conditionParticulier(body);

    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }

  Canceled = () => {
    this.setState({ modelShow: false });
  };

  handleOk = () => {
    this.setState({ modelShow: false });
  };

  showModal = value => {
    this.getAcceptation(value.id);
    this.setState({
      modelShow: true,
      record: value
    });
  };

  async getTariffication(capital, differe) {
    const age = moment().diff(
      moment(this.state.record.assure.dateNaissance),
      "years"
    );
    const duree = this.state.duree;
    typeProduit = this.state.record.produit.produitType;
    let response = await getTarification(
      duree,
      age,
      capital,
      differe,
      typeProduit,
      this.state.record.produit.id
    );
    this.setState({ tarification: response.data });
  }

  handleChanged = value => {
    if (value === "Restitution") {
      this.setState({ restitution: true, sinistre: false });
    } else if (value === "Sinistre") {
      this.setState({ sinistre: true, restitution: false });
    }
  };

  saveRequest = values => {
    let contrat = this.state.record;
    switch (this.state.TypeAvenant.code) {
      case AVN_ADRESSE:
        delete values.tarification;
        delete values.dateCreation;
        values.assure = contrat.assure;
        values.assure.adressVille = values.adressVille.label;
        values.assure.adressComplete = values.adressComplete;
        values.assure.adressCodePostal = values.adressCodePostal;
        values.assure.adressPays = values.adressPays;
        values.assure.adressVois = values.AdressVois;
        values.assure.adressComplement = values.Complement;
        values.assure.adressNumero = values.adressNumero;
        delete values.adressVille;
        delete values.adressComplete;
        delete values.adressCodePostal;
        delete values.adressPays;
        delete values.AdressVois;
        delete values.Complement;
        delete values.adressNumero;

        const avenantUpdateModel = {
          ...values,
          typeAvenantId: this.state.TypeAvenant.id
        };

        this.updateDecesContratCapitaleDureeChangementAdresseChangementStatus(
          contrat.id,
          avenantUpdateModel
        );
        break;
      case AVN_CHANGEMENT_CAPITAL_DURE:
        delete values.tarification;
        delete values.dateCreation;
        const changementCapitaleDureeUpdateModel = {
          ...values,
          typeAvenantId: this.state.TypeAvenant.id
        };

        this.updateDecesContratCapitaleDureeChangementAdresseChangementStatus(
          contrat.id,
          changementCapitaleDureeUpdateModel
        );
        break;

      case AVN_STATUS:
        const changementStatusModel = {
          ...values,
          typeAvenantId: this.state.TypeAvenant.id
        };
        this.updateDecesContratCapitaleDureeChangementAdresseChangementStatus(
          contrat.id,
          changementStatusModel
        );
        break;

      case AVN_DTEFFET:
        const changementDateEffetModel = {
          ...values,
          typeAvenantId: this.state.TypeAvenant.id
        };
        this.updateDecesContratCapitaleDureeChangementAdresseChangementStatus(
          contrat.id,
          changementDateEffetModel
        );
        break;
    }
  };

  async updateDecesContratCapitaleDureeChangementAdresseChangementStatus(
    id,
    changementCapitaleDureeUpdateModel
  ) {
    let response = await updateContartDeces(
      id,
      changementCapitaleDureeUpdateModel
    );
    console.log("response:", response);
    if (response.status === 200) {
      this.setState({ visible: false });
      window.location.reload();
    }
  }

  handleChange = id => {
    let selectedType;
    this.state.typesAvenant.forEach(element => {
      if (element.id === id) {
        this.setState({ TypeAvenant: element });
        selectedType = element.code;
      }
    });

    switch (selectedType) {
      case AVN_ADRESSE:
        this.setState({
          Avenantchoisi: <ChangementAdresse saveRequest={this.saveRequest} />
        });
        break;
      // case AVN_CHANGEMENT_CAPITAL_DURE:
      //   this.setState({
      //     Avenantchoisi: (
      //       <ChangementCapitaleEtDuree
      //         saveRequest={this.saveRequest}
      //         record={this.state.record}
      //       />
      //     )
      //   });
      //   break;

      case AVN_STATUS:
        this.setState({
          Avenantchoisi: (
            <ChangementStatus
              record={this.state.record}
              saveRequest={this.saveRequest}
            />
          )
        });
        break;

      case AVN_DTEFFET:
        if (
          this.state.record.status == "INSTANTANEE" &&
          this.state.record.cotisation.contrat.flag == "1" &&
          (this.state.dateEff ==
            moment(this.state.record.dateEffet, "YYYY-MM-DD")
              .add(1, "days")
              .format("YYYY-MM-DD") ||
            this.state.dateEff ==
              moment(this.state.record.dateEffet, "YYYY-MM-DD")
                .add(3, "days")
                .format("YYYY-MM-DD"))
        ) {
          this.setState({
            Avenantchoisi: (
              <ChangementDateEffet
                record={this.state.record}
                saveRequest={this.saveRequest}
              />
            )
          });
          break;
        } else {
          let msg = "";
          if (this.state.record.status != "INSTANTANEE") {
            msg = "Statut doit etre Instantanee";
          }
          if (this.state.record.cotisation.contrat.flag == "2") {
            msg += "---vous avez le droit de réediter une seul fois";
          }
          if (this.state.record.cotisation.contrat.flag == "0") {
            msg += "--- Contrat non éditer";
          }
          if (
            this.state.dateEff !=
            moment(this.state.record.dateEffet, "YYYY-MM-DD")
              .add(1, "days")
              .format("YYYY-MM-DD")
          ) {
            msg += "--- Vérifier la date d'effet";
          }

          const key = `open${Date.now()}`;
          const btn = (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                notification.close(key);
              }}
            >
              Confirmer
            </Button>
          );
          notification.warning({
            message:
              "Impossible de modifier , Vérifier le statut ou la date d'effet",
            description:
              " Contrat n° : \n" +
              this.state.record.numeroContrat +
              " Message : \n" +
              msg,

            btn,
            duration: 5,
            key
          });
        }
    }
  };

  componentDidMount() {
    console.log("contrats", this.state.contrats);
    console.log("props", this.props);
    this.getproprties(
      statuts,
      this.state.pagenumber - 1,
      5,
      DATE_PRELEVEMENT,
      "desc"
    );
    this.getTypeAvenants();
  }

  async getproprties(statut, page, limit, sort, direction) {
    let contratsResponse = await getDecesContratsByPartenaire(
      page,
      limit,
      sort,
      direction
    );
    contrats = [...contratsResponse.data.content];
    this.setState({
      contrats: [...contratsResponse.data.content],
      totalItems: contratsResponse.data.totalElements
    });
    console.log("contracts", this.state.contrats);
  }

  handleSelectChange = value => {
    this.setState({
      visible: true,
      record: value
    });
  };

  handleChangePrestation = value => {
    this.setState({
      visibled: true,
      dateEcheance: value.dateEcheance,
      keyRecord: value.id
    });
    this.setState({ visibled: true, dateEcheance: value.dateEcheance });
  };

  handleConfirm = (value, key) => {
    notification.close(key);
    this.updatedContrat(this.state.record.id, value);
    this.setState({ visible: false });
  };

  componentDidUpdate(_, prevState) {
    console.log("contrats1", this.state.contrats);
    console.log("contrats0", contrats);
    const effetMonth = moment(this.state.record.dateEffet).format("M");
    const effet = moment(this.state.record.dateEffet).format("D");
    if (
      prevState.differe !== this.state.differe ||
      prevState.capital !== this.state.capital
    ) {
      if (
        this.state.capital !== "" &&
        this.state.differe !== "" &&
        this.state.differe !== null &&
        this.state.capital !== null
      )
        this.getTariffication(this.state.capital, this.state.differe);
    }
    if (
      prevState.tarification !== this.state.tarification &&
      typeProduit === "taux"
    ) {
      const capital = this.props.form.getFieldValue("capitalAssure");
      const montantC = (this.state.tarification.taux * capital) / 100;
      this.setState({
        montantCotisation: (this.state.tarification.taux * capital) / 100
      });
      this.props.form.setFieldsValue({
        montantCotisation: (this.state.tarification.taux * capital) / 100
      });
      const montantS = (this.state.tauxSurprime * montantC) / 100;
      this.props.form.setFieldsValue({
        montantSurprime: (this.state.tauxSurprime * montantC) / 100
      });
      this.setState({
        montantSurprime: (this.state.tauxSurprime * montantC) / 100
      });
      if (
        prevState.montantSurprime !== this.state.montantSurprime ||
        this.state.montantCotisation !== prevState.montantCotisation
      ) {
        if (
          this.state.montantSurprime !== null &&
          this.state.montantCotisation !== null
        ) {
          this.props.form.setFieldsValue({
            cotisationTotale: montantS + montantC
          });
          this.setState({
            cotisationTotale: montantS + montantC
          });
        }
      }
    } else if (
      prevState.tarification !== this.state.tarification &&
      typeProduit === "forfait"
    ) {
      const montantC = this.state.tarification.forfait;
      this.setState({ montantCotisation: this.state.tarification.forfait });
      this.props.form.setFieldsValue({
        montantCotisation: this.state.tarification.forfait
      });
      const montantS = (this.state.tauxSurprime * montantC) / 100;
      this.props.form.setFieldsValue({
        montantSurprime: (this.state.tauxSurprime * montantC) / 100
      });
      this.setState({
        montantSurprime: (this.state.tauxSurprime * montantC) / 100
      });
      if (
        prevState.montantSurprime !== this.state.montantSurprime ||
        this.state.montantCotisation !== prevState.montantCotisation
      ) {
        if (
          this.state.montantSurprime !== null &&
          this.state.montantCotisation !== null
        ) {
          this.props.form.setFieldsValue({
            cotisationTotale: montantS + montantC
          });
          this.setState({
            cotisationTotale: montantS + montantC
          });
        }
      }
    }
    if (prevState.cotisationTotale !== this.state.cotisationTotale) {
      if (
        this.state.cotisationTotale !== null &&
        this.state.record.periodicite.libelle !== "Unique"
      ) {
        if (effet <= 15) {
          this.props.form.setFieldsValue({
            prorata: this.state.cotisationTotale * ((13 - effetMonth) / 12)
          });
          this.setState({
            prorata: this.state.cotisationTotale * ((13 - effetMonth) / 12)
          });
        } else {
          this.props.form.setFieldsValue({
            prorata: this.state.cotisationTotale * ((12 - effetMonth) / 12)
          });
          this.setState({
            prorata: this.state.cotisationTotale * ((12 - effetMonth) / 12)
          });
        }
      }
    }
    if (
      prevState.prorata !== this.state.prorata &&
      this.state.tauxTaxe !== null
    ) {
      this.props.form.setFieldsValue({
        montantTaxe: (this.state.prorata * this.state.tauxTaxe) / 100
      });
      this.setState({
        montantTaxe: (this.state.prorata * this.state.tauxTaxe) / 100
      });
    }
  }

  async searchContrats(page, limit, searchby, searchfor) {
    console.log(
      "test value searchby= " +
        this.state.searchby +
        "  test value searchfor=  " +
        searchfor
    );

    let contratResponse = await searchContrat(page, limit, searchby, searchfor);
    if (searchby === CIN_ASSURE || searchby === NOM_ASSURE) {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.numberOfElements
      });
    } else if (searchby === NUM_CONTRAT) {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.totalElements
      });
    } else if (searchby === "code") {
      this.setState({
        contrats: [...contratResponse.data.content]
      });
    }
  }
  async getTypeAvenants() {
    let response = await getTypeAvenant();
    this.setState({
      typesAvenant: response.data.content
    });
  }

  onChangeCapital = e => {
    this.setState({ capital: e.target.value });
  };

  onChangeDuree = e => {
    this.setState({ duree: e.target.value });
  };

  onChangeTauxS = e => {
    this.setState({ tauxSurprime: e.target.value });
  };

  onChangeTauxReduction = e => {
    this.setState({ tauxReduction: e.target.value });
  };

  onPaginationChange = (pagenumber, pagesize) => {
    if (this.state.searchfor === "")
      this.getproprties(statuts, pagenumber - 1, 5, DATE_PRELEVEMENT, "desc");
    else {
      this.searchContrats(
        pagenumber - 1,
        5,
        this.state.searchby,
        this.state.searchfor
      );
    }
  };

  selectBefore = (
    <Select
      onChange={value => this.setState({ searchby: value })}
      defaultValue={NUM_CONTRAT}
      style={{ width: 150 }}
    >
      <Option value={NUM_CONTRAT}>N° de contrat</Option>
      <Option value={CIN_ASSURE}>CIN</Option>
      <Option value={NOM_ASSURE}>Nom Assuré</Option>
      <Option value={CODE_ACCEPTATION}>Code d'acceptation</Option>
    </Select>
  );

  search = value => {
    this.setState({ pagenumber: 1, searchfor: value });
    this.searchContrats(
      this.state.pagenumber - 1,
      2,
      this.state.searchby,
      value
    );
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleClose = () => {
    this.props.form.setFieldsValue({
      avenants: ""
    });
    this.setState({ show: false, view: false });
  };

  handleClosed = () => {
    this.setState({ showed: false, sinistre: false, restitution: false });
  };

  handleCanceled = () => {
    this.props.form.setFieldsValue({
      typePrestation: " Séléctionnez "
    });
    this.setState({ visibled: false });
  };

  async updatedContrat(id, body) {
    // debugger;
    await addAvenant(id, body);
  }
  async updatedContratStatus(id, body) {
    // debugger;
    await updateDecesContratStatus(id, body);
  }

  async updatedContratDateEffet(id, body) {
    // debugger;
    await updateContratDateEffetAPI(id, body);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.avenantCapital) {
          let request = {
            capital: values.capitalAssure,
            duree: values.duree,
            differe: values.differe,
            montantCotisation: values.montantCotisation,
            montantSurprime: values.montantSurprime,
            montantTaxe: values.montantTaxe,
            prorata: values.prorata,
            tauxReduction: values.tauxReduction,
            tauxSurprime: values.tauxSurprime,
            typeAvenantId: values.avenants
          };
          const key = `open${Date.now()}`;
          const btn = (
            <div>
              <Button
                type="primary"
                onClick={() => this.handleConfirm(request, key)}
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
                <Descriptions bordered>
                  <Descriptions.Item label="Montant cotisation">
                    {values.montantCotisation}
                  </Descriptions.Item>
                  <Descriptions.Item label="Montant surprime" span={2}>
                    {values.montantSurprime}
                  </Descriptions.Item>
                  <Descriptions.Item label="Montant proratisé">
                    {values.prorata}
                  </Descriptions.Item>
                  <Descriptions.Item label="Montant taxe" span={2}>
                    {values.montantTaxe}
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
        } else if (this.state.avenantContrat) {
          let request = {
            status: values.nouveauStatus,
            typeAvenantId: values.avenants
          };
          this.updatedContratStatus(this.state.record.id, request);
          this.setState({ visible: false });
        }
      }
    });
  };

  handleSubmited = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const dateEcheance = moment(this.state.dateEcheance);
        const dateSurvenance = moment(values.dateSurvenanceSinistre);
        let requestmodel = {
          contratId: this.state.keyRecord,
          dateDeclarationSinistre: values.dateDeclarationSinistre,
          dateSurvenance: values.dateSurvenanceSinistre,
          natureSinistre: values.natureSinistre,
          typePrestation: values.typePrestation
        };
        // if (dateSurvenance <= dateEcheance) {
        this.setState({ visibled: false });
        ajoutSinistre(requestmodel)
          .then(response => {
            if (response.data.status === "REJ_CONTRAT_ECHU") {
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
              notification.warn({
                message: "Demande de resiliation rejeté",
                description:
                  "CONTRAT NUMERO     : \n" +
                  response.data.contrat.numeroContrat +
                  "Contrat non couvert au date de sinistre",
                btn,
                duration: 0,
                key
              });
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
              notification.success({
                message: "Demande de resiliation a bien ete envoyée",
                description:
                  " CONTRAT NUMERO     : \n" +
                  response.data.contrat.numeroContrat +
                  " SINISTRE NUMERO   : " +
                  response.data.numeroSinistre,
                btn,
                duration: 0,
                key
              });
            }
            this.props.record.history.push("/consultDecesContrat");
          })
          .catch(error => {
            notification.error({
              message: "TAKAFUL",
              description:
                error.message ||
                "Sorry! Something went wrong. Please try again!"
            });
          });
        // } else {
        //   message.warning("Contrat non couvert au date de sinistre");
        // }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, visibled } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 14 }
      }
    };

    return (
      <div>
        <ComponentTitle title="Gestion des contrats" />
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Entrez le text de recherche"
            addonBefore={this.selectBefore}
            onSearch={value => this.search(value)}
            enterButton
            style={{ width: 600 }}
          />
        </div>
        <Table
          bordered
          // rowClassName="editable-row"
          size="middle"
          columns={this.columns}
          dataSource={this.state.contrats}
          pagination={{
            onChange: this.onPaginationChange,
            pageSize: 5,
            total: this.state.totalItems
          }}
        />
        <Modal
          visible={visible}
          title="Ajouter Avenant"
          onOk={this.handleSubmit}
          onCancel={this.handleCancel}
          afterClose={this.handleClose}
          style={{ top: 20 }}
          width="880px"
          footer={[
            <Button
              key="back"
              onClick={this.handleCancel}
              className="not-rounded"
            >
              Fermer
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <Row>
              <Col span={24}>
                <Form.Item label="Liste des avenants ">
                  {getFieldDecorator("avenants", {
                    rules: [
                      { message: "Please input the title of collection!" }
                    ]
                  })(
                    <Select
                      placeholder="Sélectionnez "
                      onChange={this.handleChange}
                    >
                      {this.state.typesAvenant.map(element => {
                        return (
                          <Option
                            key={element.id}
                            value={element.id}
                            label={element.code}
                          >
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {this.state.Avenantchoisi}
          </Form>
        </Modal>

        <Modal
          visible={visibled}
          title="Veuillez saisir les informations de la prestation"
          onOk={this.handleSubmited}
          onCancel={this.handleCanceled}
          afterClose={this.handleClosed}
          style={{ top: 20 }}
          width="900px"
          footer={[
            <Button
              key="back"
              onClick={this.handleCanceled}
              className="not-rounded"
            >
              Fermer
            </Button>,
            <Button
              key="back"
              type="primary"
              onClick={this.handleSubmited}
              className="not-rounded"
            >
              Enregistrer
            </Button>
          ]}
        >
          <Form {...formItemLayout}>
            <Row>
              <Col span={16} offset={6}>
                <Form.Item>
                  {getFieldDecorator("typePrestation")(
                    <Select
                      placeholder="Séléctionnez "
                      onChange={this.handleChanged}
                    >
                      <Option value="Restitution" label="restitution">
                        Restitution
                      </Option>
                      <Option value="Sinistre" label="sinistre">
                        Sinistre
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {this.state.sinistre ? (
              <div>
                <h3> AJOUT SINISTRE</h3>
                <Divider />
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="Date Création">
                      {getFieldDecorator("dateCreation", {
                        initialValue: moment(
                          this.state.dateCreation,
                          dateFormat
                        )
                      })(
                        <DatePicker
                          format={dateFormat}
                          style={{ width: "60%" }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="Nature Sinistre">
                      {getFieldDecorator("natureSinistre")(
                        <Select
                          placeholder="Séléctionnez "
                          style={{ width: "60%" }}
                        >
                          <Option value="Décès" label="deces">
                            Décès
                          </Option>
                          <Option
                            value="INVALIDITE TOTALE ET DEFINITIVE"
                            label="ITD"
                          >
                            INVALIDITE TOTALE ET DEFINITIVE
                          </Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="Date de survenance sinistre">
                      {getFieldDecorator("dateSurvenanceSinistre")(
                        <DatePicker
                          format={dateFormat}
                          style={{ width: "60%" }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="Date déclaration sinistre">
                      {getFieldDecorator("dateDeclarationSinistre")(
                        <DatePicker
                          format={dateFormat}
                          style={{ width: "60%" }}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ) : null}
            {this.state.restitution ? (
              <div>
                <h3> AJOUT restitution</h3>
                <Divider />
              </div>
            ) : null}
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(ConsultDecesContrat);
