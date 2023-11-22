/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Table
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import ComponentTitle from "../../../../util/Title/ComponentTitle";
import DetailsRetraiteContrat from "./DetailsRetraiteContrat";
import { getTarification } from "../../../Parametrage/ProduitDeces/ProduitDecesAPI";
import {
  addAvenantRetrait,
  getCodeTypeAvenantById,
  getTypeAvenant
} from "../../../Parametrage/avenant/AvenantAPI";
import {
  addBeneficiaire,
  getBeneficiaireById,
  getRetraiteContrat,
  searchRetraitContrat,
  updateRetraiteContratStatus
} from "../../ContratsAPI";
import { ajoutPrestationRachatTotal } from "../../../Parametrage/TypePrestation/PrestationAPI";
import { getColumnSearchProps } from "../../../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { getCotisationById } from "../../../TableauBord/CotisationAPI";
import { currencyFormatter, currencyParser } from "../../../../util/Helpers";
export const MyContext = React.createContext();
var statuts = "ACCEPTED";
const { Option } = Select;
const { Search } = Input;
const dateFormat = "DD-MM-YYYY";
var typeProduit = "";
class ConsultRetraiteContrat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      visibled: false,
      show: false,
      avenantOneShow: false,
      avenantTwoShow: false,
      avenantFourShow: false,
      avenantFiveShow: false,
      avenantOne: false,
      avenantTwo: false,
      avenantFour: false,
      avenantFive: false,
      showed: false,
      sinistre: false,
      restitution: false,
      dateCreation: new Date(),
      searchText: "",
      searchedColumn: "",
      selectedRowKeys: [],
      searchby: "numeroContrat",
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
      cotisationTotale: null,
      montantTaxe: null,
      prorata: null,
      typeAvenant: [],
      periodicite: "",
      ajouterBenef: false,
      modifierBenef: false,
      supprimerBenef: false,
      beneficiareAModifierId: "",
      beneficiareAModifier: {},
      beneficiareASupprimerId: "",
      beneficiareASupprimer: {},
      contratPrestation: {},
      rachatTotalVisible: false,
      rachatPartielVisible: false,
      rachatTotal: false,
      rachatPartiel: false,
      liquidation: false,
      avance: false,
      montantCotisationBrut: 0,
      aSimuler: false
    };
    this.columns = [
      {
        title: "N° de Contrat",
        dataIndex: "id",
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
                  <DetailsRetraiteContrat />
                </MyContext.Provider>
              </div>
            </span>
          );
        }
      },
      {
        title: "Durée Contrat",
        dataIndex: "dureeContrat",
        key: "dureeContrat",
        ...getColumnSearchProps("dureeContrat", "Durée contrat", this)
      },
      {
        title: "Nom assuré",
        dataIndex: "assure.nom",
        key: "nomAssure",
        ...getColumnSearchProps("assure.nom", "Nom assure", this)
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
        ...getColumnSearchProps("souscripteur.nom", "Nom souscripteur", this)
      },
      {
        title: "Prénom souscripteur",
        dataIndex: "souscripteur.prenom",
        key: "prenomSouscripteur"
      },

      {
        title: "Date d'effet",
        dataIndex: "dateEffet",
        key: "dateEffet"
      },
      {
        title: "Date écheance",
        dataIndex: "dateEcheance",
        key: "dateEcheance"
      },
      {
        title: "Produit",
        dataIndex: "produit.libelle",
        key: "produit"
      },
      {
        title: "Action",
        dataIndex: "operation",
        width: "22%",
        render: (text, record) => {
          return (
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
            </span>
          );
        }
      }
    ];
    this.typeAvenants = [
      {
        id: "11",
        code: "AVN01",
        libelle:
          "La modification de la périodicité de versement de la contribution"
      },
      {
        id: "2",
        code: "AVN02",
        libelle: "La modification du montant de la contribution périodique"
      },
      {
        id: "4",
        code: "AVN04",
        libelle:
          "La modification du bénéficiaire du contrat par un autre bénéficiaire"
      },
      {
        id: "5",
        code: "AVN05",
        libelle: "La modification du la durée du contrat"
      }
    ];
  }

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
    if (value === "Rachat total") {
      this.setState({
        rachatTotal: true,
        rachatPartiel: false,
        liquidation: false,
        avance: false
      });
    } else if (value === "Rachat partiel") {
      this.setState({
        rachatTotal: false,
        rachatPartiel: true,
        liquidation: false,
        avance: false
      });
    } else if (value === "Liquidation") {
      this.setState({
        rachatTotal: false,
        rachatPartiel: false,
        liquidation: true,
        avance: false
      });
    } else if (value === "Avance") {
      this.setState({
        rachatTotal: false,
        rachatPartiel: false,
        liquidation: false,
        avance: true
      });
    }
  };

  handleChangeBenefAction = value => {
    if (value === "Ajouter") {
      this.setState(
        {
          ajouterBenef: true,
          modifierBenef: false,
          supprimerBenef: false,
          beneficiareAModifier: {},
          beneficiareASupprimer: {},
          beneficiareAModifierId: "",
          beneficiareASupprimerId: ""
        },
        () => {
          this.props.form.setFieldsValue({
            nomBeneficiaire: "",
            prenomBeneficiaire: "",
            ribBeneficiaire: ""
          });
        }
      );
    } else if (value === "Modifier") {
      this.setState({
        ajouterBenef: false,
        modifierBenef: true,
        supprimerBenef: false,
        beneficiareAModifier: {},
        beneficiareASupprimer: {},
        beneficiareAModifierId: "",
        beneficiareASupprimerId: ""
      });
    } else {
      this.setState({
        ajouterBenef: false,
        modifierBenef: false,
        supprimerBenef: true
      });
    }
  };

  handleBenefeciairesToEditChange = async value => {
    const request = await getBeneficiaireById(value);
    this.setState(
      {
        beneficiareAModifier: request.data,
        beneficiareAModifierId: value
      },
      () => {
        this.props.form.setFieldsValue({
          nomBeneficiaire: this.state.beneficiareAModifier.nom,
          prenomBeneficiaire: this.state.beneficiareAModifier.prenom,
          ribBeneficiaire: this.state.beneficiareAModifier.rib,
          cinBeneficiaire: this.state.beneficiareAModifier.cin
        });
      }
    );
  };

  addBeneficiaireImpl = async (data, model) => {
    const request = await addBeneficiaire(data);
    model.beneficiaireEnDeces.push(request.data);
  };

  handleBenefeciairesToDelete = async value => {
    const request = await getBeneficiaireById(value);
    this.setState({
      beneficiareASupprimer: request.data,
      beneficiareASupprimerId: value
    });
  };

  handleChange = id => {
    if (id === "11") {
      this.setState(
        {
          show: true,
          avenantOneShow: true,
          avenantOne: true,
          avenantTwoShow: false,
          avenantTwo: false,
          avenantFour: false,
          avenantFourShow: false,
          avenantFiveShow: false,
          avenantFive: false,
          beneficiareAModifier: {},
          beneficiareASupprimer: {},
          beneficiareAModifierId: "",
          beneficiareASupprimerId: ""
        },
        () => {
          this.props.form.setFieldsValue({
            periodicite: this.state.record.periodicite.libelle,
            periodicites: this.state.record.produit.periodicite,
            nombrePeriodicite: this.state.record.nombrePeriodicite
          });
        }
      );
    } else if (id === "2") {
      this.setState(
        {
          show: false,
          avenantOneShow: false,
          avenantTwoShow: true,
          avenantFiveShow: false,
          avenantFour: false,
          avenantFourShow: false,
          avenantOne: false,
          avenantTwo: true,
          avenantFive: false,
          beneficiareAModifier: {},
          beneficiareASupprimer: {},
          beneficiareAModifierId: "",
          beneficiareASupprimerId: ""
        },
        () => {
          this.props.form.setFieldsValue({
            montantContributionPeriodique: this.state.record
              .montantContributionPeriodique,
            nouveauMontantContributionPeriodique: this.state.record
              .montantContributionPeriodique
          });
        }
      );
    } else if (id === "4") {
      this.setState({
        show: false,
        avenantTwoShow: false,
        avenantOneShow: false,
        avenantFiveShow: false,
        avenantOne: false,
        avenantTwo: false,
        avenantFive: false,
        avenantFour: true,
        avenantFourShow: true
      });
    } else if (id === "5") {
      this.setState(
        {
          show: false,
          avenantTwoShow: false,
          avenantOneShow: false,
          avenantFiveShow: true,
          avenantOne: false,
          avenantTwo: false,
          avenantFive: true,
          avenantFour: false,
          avenantFourShow: false,
          beneficiareAModifier: {},
          beneficiareASupprimer: {},
          beneficiareAModifierId: "",
          beneficiareASupprimerId: ""
        },
        () => {
          this.props.form.setFieldsValue({
            dureeContrat: this.state.record.dureeContrat,
            nouveauDureeContrat: this.state.record.dureeContrat
          });
        }
      );
    }
  };

  componentDidMount() {
    this.getproprties(statuts, this.state.pagenumber - 1, 3);
    this.getTypeAvenants();
  }

  async getproprties(statut, page, limit) {
    let contratsResponse = await getRetraiteContrat(statut, page, limit);
    this.setState({
      contrats: [...contratsResponse.data.content],
      totalItems: contratsResponse.data.totalElements
    });
  }

  handleSelectChange = value => {
    this.setState({
      visible: true,
      record: value
    });
    this.setState({
      deductibiliteFiscale: value.deductibiliteFiscale,
      souscripteurIsAssure: value.souscripteurIsAssure,
      attributionIrrevocable: value.attributionIrrevocable,
      tauxRedubenificiareCasDecesction: value.benificiareCasDeces,
      montantContributionInitiale: value.montantContributionInitiale,
      montantContributionPeriodique: value.montantContributionPeriodique,
      beneficiaireEnDeces: value.beneficiaireEnDeces,
      nombrePeriodicite: value.nombrePeriodicite,
      periodicite: value.periodicite.id,
      montantCotisation: value.montantCotisation
    });
  };

  handleChangePrestation = value => {
    this.setState({
      visibled: true,
      dateEcheance: value.dateEcheance,
      keyRecord: value.id,
      contratPrestation: value,
      rachatTotalVisible: value.produit.rachatTotal,
      rachatPartielVisible: value.produit.rachatPartiel
    });
    this.setState({ visibled: true, dateEcheance: value.dateEcheance });
  };

  handleConfirm = (value, key, values) => {
    notification.close(key);
    this.updatedContrat(this.state.record.id, value);
    this.setState({ visible: false });
  };

  componentDidUpdate(_, prevState) {
    const date = moment(this.state.record.dateEffet, "DD/MM/YYYY");
    const effetMonth = date.format("M");
    const effet = date.format("D");
    if (this.state.show) {
      if (
        this.state.capital !== prevState.capital ||
        (this.state.differe !== prevState.differe &&
          this.state.capital !== "" &&
          this.state.differe !== "" &&
          this.state.differe !== null &&
          this.state.capital !== null)
      ) {
        this.getTariffication(this.state.capital, this.state.differe);
      }
      if (
        prevState.tarification !== this.state.tarification &&
        typeProduit === "taux"
      ) {
        const capital = this.props.form.getFieldValue("capitalAssure");
        this.setState({
          montantCotisation: (this.state.tarification.taux * capital) / 100
        });
        this.props.form.setFieldsValue({
          montantCotisation: (this.state.tarification.taux * capital) / 100
        });
      } else if (
        prevState.tarification !== this.state.tarification &&
        typeProduit === "forfait"
      ) {
        this.setState({ montantCotisation: this.state.tarification.forfait });
        this.props.form.setFieldsValue({
          montantCotisation: this.state.tarification.forfait
        });
      }
      if (
        prevState.tauxSurprime !== this.state.tauxSurprime &&
        this.state.montantCotisation !== null
      ) {
        this.props.form.setFieldsValue({
          montantSurprime:
            (this.state.tauxSurprime * this.state.montantCotisation) / 100
        });
        this.setState({
          montantSurprime:
            (this.state.tauxSurprime * this.state.montantCotisation) / 100
        });
      }
      if (
        prevState.montantSurprime !== this.state.montantSurprime ||
        this.state.montantCotisation !== prevState.montantCotisation
      ) {
        if (
          this.state.montantSurprime !== null &&
          this.state.montantCotisation !== null
        ) {
          this.props.form.setFieldsValue({
            cotisationTotale:
              this.state.montantSurprime + this.state.montantCotisation
          });

          this.setState({
            cotisationTotale:
              this.state.montantSurprime + this.state.montantCotisation
          });
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
  }

  async searchContrats(page, limit, searchby, searchfor) {
    let contratResponse = await searchRetraitContrat(
      page,
      limit,
      searchby,
      searchfor
    );
    if (searchby === "cin" || searchby === "nom") {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.numberOfElements
      });
    } else if (searchby === "numeroContrat") {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.totalElements
      });
    }
  }

  async getTypeAvenants() {
    let response = await getTypeAvenant();
    this.setState({
      typeAvenant: response.data.content
    });
  }

  async getCodeById(id) {
    return getCodeTypeAvenantById(id);
  }

  onChangeNombrePeriodicite = e => {
    this.setState({ nombrePeriodicite: e.target.value });
  };

  onChangeContributionPeriodique = e => {
    this.setState({ montantContributionPeriodique: e.target.value });
  };

  onChangeDureeContrat = e => {
    this.setState({ dureeContrat: e });
  };

  onPaginationChange = (pagenumber, pagesize) => {
    if (this.state.searchfor === "")
      this.getproprties(statuts, pagenumber - 1, 3);
    else {
      this.searchContrats(
        pagenumber - 1,
        3,
        this.state.searchby,
        this.state.searchfor
      );
    }
  };

  selectBefore = (
    <Select
      onChange={value => this.setState({ searchby: value })}
      defaultValue="numContrat"
      style={{ width: 150 }}
    >
      <Option value="numContrat">N° de contrat</Option>
      <Option value="cin">CIN</Option>
      <Option value="nom">Nom Assuré</Option>
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
    this.setState({
      show: false,
      avenantTwoShow: false,
      avenantOneShow: false,
      avenantFiveShow: false,
      avenantFourShow: false,
      ajouterBenef: false,
      modifierBenef: false,
      supprimerBenef: false,
      beneficiareAModifier: {},
      beneficiareASupprimer: {},
      beneficiareAModifierId: "",
      beneficiareASupprimerId: ""
    });
  };

  handleClosed = () => {
    this.setState({
      showed: false,
      sinistre: false,
      restitution: false,
      aSimuler: false,
      montantCotisationBrut: 0
    });
  };

  handleCanceled = () => {
    this.props.form.setFieldsValue({
      typePrestation: " Séléctionnez "
    });
    this.setState({
      visibled: false,
      rachatPartiel: false,
      rachatTotal: false,
      liquidation: false,
      avance: false,
      montantCotisationBrut: 0
    });
  };

  async updatedContrat(id, body) {
    await addAvenantRetrait(id, body);
  }

  async updatedContratStatus(id, body) {
    await updateRetraiteContratStatus(id, body);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.avenantOne) {
          let request = this.state.record;
          request.nombrePeriodicite = values.nouveauNombrePeriodicite;
          request.periodicite.id = this.state.periodicite.key;
          request.typeAvenantId = values.avenants;
          const close = () => {};
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
                  <Descriptions.Item label="Nombre de periodicite">
                    {this.state.nombrePeriodicite}
                  </Descriptions.Item>
                  <Descriptions.Item label="Periodicite" span={2}>
                    {this.state.periodicite.label}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ),
            btn,
            key,
            onClose: close,
            style: {
              width: 880,
              marginLeft: 335 - 1280
            },
            duration: 0
          });
        } else if (this.state.avenantTwo) {
          let request = this.state.record;
          request.montantContributionPeriodique = this.state.montantContributionPeriodique;
          request.typeAvenantId = values.avenants;
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
                  <Descriptions.Item label="Montant de la contribution periodique">
                    {this.state.montantContributionPeriodique}
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
        } else if (this.state.avenantFour) {
          let request = this.state.record;
          if (this.state.ajouterBenef) {
            const beneficiareToAdd = {
              nom: values.nomBeneficiaire,
              prenom: values.prenomBeneficiaire,
              rib: values.ribBeneficiaire,
              cin: values.cinBeneficiaire
            };
            this.addBeneficiaireImpl(beneficiareToAdd, request);
          }
          request.typeAvenantId = values.avenants;
          const key = `open${Date.now()}`;
          const btn = (
            <div>
              <Button
                type="primary"
                onClick={() => this.handleConfirm(request, key, values)}
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
                <h2>Bénéficiaire à ajouter :</h2>
                <Descriptions bordered>
                  <Descriptions.Item label="Prenom :" span={3}>
                    {values.prenomBeneficiaire}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nom :" span={3}>
                    {values.nomBeneficiaire}
                  </Descriptions.Item>
                  <Descriptions.Item label="RIB :" span={3}>
                    {values.ribBeneficiaire}
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
        } else if (this.state.avenantFive) {
          let request = this.state.record;
          request.dureeContrat = this.state.dureeContrat;
          request.typeAvenantId = values.avenants;
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
                  <Descriptions.Item label="Duree du contrat">
                    {this.state.dureeContrat}
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
        }
      }
    });
  };
  handleSimulation = async e => {
    let total = 0;
    const result = await (await getCotisationById(this.state.keyRecord)).data;
    result.forEach(o => {
      if (o.solde === 0) {
        total = total + o.montantCotisation;
      }
    });
    this.setState({
      montantCotisationBrut: total,
      aSimuler: true
    });
  };
  handleSubmited = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let requestmodel = {
          contratId: this.state.keyRecord,
          dateDepart: moment(values.dateDepart, "DD/MM/YYYY"),
          ir: 0,
          montantBrutRachatTotal: this.state.montantCotisationBrut,
          montantNetRachatTotal: this.state.montantCotisationBrut
        };
        this.setState({ visibled: false, rachatTotalVisible: false });
        ajoutPrestationRachatTotal(requestmodel)
          .then(response => {
            notification.success({
              message: "TAKAFUL",
              description: "L'insertion est bien faite"
            });
            this.props.record.history.push("/consultRetraiteContrat");
          })
          .catch(error => {
            notification.error({
              message: "TAKAFUL",
              description:
                error.message ||
                "Sorry! Something went wrong. Please try again!"
            });
          });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, visibled } = this.state;
    const beneficiaireEnDeces = this.state.record.beneficiaireEnDeces;
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
          rowClassName="editable-row"
          columns={this.columns}
          dataSource={this.state.contrats}
          pagination={{
            onChange: this.onPaginationChange,
            pageSize: 3,
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
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleSubmit}
              className="not-rounded"
            >
              Ajouter
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
                      {this.typeAvenants.map(element => {
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
            </Row>{" "}
            {this.state.avenantOneShow ? (
              <div>
                <h3>
                  {" "}
                  Changement de la périodicité de versement de la contribution
                </h3>
                <Divider />
                <Row>
                  <Col span={11}>
                    <Form.Item label="Date création">
                      {getFieldDecorator("dateCreation", {
                        initialValue: moment(
                          this.state.dateCreation,
                          dateFormat
                        )
                      })(<DatePicker format={dateFormat} disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="N° Avenant">
                      {getFieldDecorator("numeroAvenant")(
                        <Input className="not-rounded" disabled />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <Form.Item label="Ancien Periodicite">
                      {getFieldDecorator("periodicite")(
                        <Input className="not-rounded" disabled />
                      )}
                    </Form.Item>
                  </Col>

                  <Col span={11} offset={1}>
                    <Form.Item label="Préiodicité" hasFeedback>
                      {getFieldDecorator("nouveauPeriodicite", {
                        rules: [
                          {
                            required: true
                          }
                        ]
                      })(
                        <Select
                          onChange={value => {
                            this.setState({ periodicite: value });
                          }}
                          placeholder="Choisir une periodicite"
                          optionLabelProp="label"
                          labelInValue
                        >
                          {this.state.record.produit.periodicites.map(
                            element => {
                              return (
                                <Option
                                  key={element.id}
                                  value={element.id}
                                  label={element.libelle}
                                >
                                  {element.libelle}
                                </Option>
                              );
                            }
                          )}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <Form.Item label="Ancien n°periodicite">
                      {getFieldDecorator("nombrePeriodicite")(
                        <Input className="not-rounded" disabled />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="n°periodicite">
                      {getFieldDecorator("nouveauNombrePeriodicite")(
                        <Input
                          className="not-rounded"
                          onChange={this.onChangeNombrePeriodicite}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={11}>
                    <Form.Item label="Date effet avenant">
                      {getFieldDecorator("dateEffetAvenant", {
                        initialValue: moment(
                          this.state.dateCreation,
                          dateFormat
                        )
                      })(<DatePicker format={dateFormat} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ) : null}
            {this.state.avenantTwoShow ? (
              <div>
                <h3> Changement du montant de la contribution periodique</h3>
                <Divider />
                <Row>
                  <Col span={11}>
                    <Form.Item label="Ancien contribution">
                      {getFieldDecorator(
                        "montantContributionPeriodique",
                        {}
                      )(<Input className="not-rounded" disabled />)}
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="Nouveau contribution">
                      {getFieldDecorator(
                        "nouveauMontantContributionPeriodique"
                      )(
                        <Input
                          className="not-rounded"
                          type="number"
                          onChange={this.onChangeContributionPeriodique}
                          addonAfter="DH"
                          min={this.state.record.produit.montantMinContribution}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ) : null}
            {this.state.avenantFourShow ? (
              <div>
                <h3>La modification du bénéficiaire du contrat</h3>
                <Divider />
                <Row>
                  <Select
                    placeholder="Séléctionnez une action"
                    onChange={this.handleChangeBenefAction}
                    style={{ width: "45%" }}
                  >
                    <Option value="Ajouter" label="ajouter">
                      Ajouter
                    </Option>
                    <Option value="Modifier" label="modifier">
                      Modifier
                    </Option>
                  </Select>
                </Row>
                <Divider />
                <Row>
                  {this.state.ajouterBenef ? (
                    <div>
                      <h3>Ajouter un nouveau bénéficiaire</h3>
                      <Col span={11}>
                        <Form.Item label="cin">
                          {getFieldDecorator("cinBeneficiaire", {
                            rules: [
                              {
                                required: true,
                                message: "Entrer le cin"
                              }
                            ]
                          })(
                            <Input
                              className="not-rounded"
                              placeholder={"CIN du bénéficiare"}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="nom">
                          {getFieldDecorator("nomBeneficiaire", {
                            rules: [
                              {
                                required: true,
                                message: "Entrer le nom"
                              }
                            ]
                          })(
                            <Input
                              className="not-rounded"
                              placeholder={"Nom du bénéficiare"}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="prenom">
                          {getFieldDecorator("prenomBeneficiaire", {
                            rules: [
                              {
                                required: true,
                                message: "Entrer le prenom"
                              }
                            ]
                          })(
                            <Input
                              className="not-rounded"
                              placeholder={"Prenom du bénéficiare"}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="rib">
                          {getFieldDecorator(
                            "ribBeneficiaire",
                            {}
                          )(
                            <Input
                              className="not-rounded"
                              placeholder={"RIB du bénéficiare"}
                              type="number"
                            />
                          )}
                        </Form.Item>
                      </Col>
                    </div>
                  ) : null}
                  {this.state.modifierBenef ? (
                    <div>
                      <h3>Modifier un bénéficiaire</h3>
                      <Select
                        placeholder="Séléctionnez le bénéficiaire à modifier"
                        onChange={this.handleBenefeciairesToEditChange}
                        style={{ width: "45%" }}
                      >
                        {beneficiaireEnDeces.map(b => {
                          return (
                            <Option key={b.id} value={b.id} label={b.nom}>
                              {b.nom + " " + b.prenom}
                            </Option>
                          );
                        })}
                      </Select>
                      <Divider />
                      <Row>
                        <Col span={11}>
                          <Form.Item label="cin">
                            {getFieldDecorator("cinBeneficiaire", {
                              rules: [
                                {
                                  required: true,
                                  message: "Entrer le cin"
                                }
                              ]
                            })(
                              <Input
                                className="not-rounded"
                                placeholder={"CIN du bénéficiare"}
                              />
                            )}
                          </Form.Item>
                          <Form.Item label="nom">
                            {getFieldDecorator("nomBeneficiaire", {
                              rules: [
                                {
                                  required: true,
                                  message: "Entrer le nom"
                                }
                              ]
                            })(
                              <Input
                                className="not-rounded"
                                placeholder={"Nom du bénéficiare"}
                              />
                            )}
                          </Form.Item>
                          <Form.Item label="prenom">
                            {getFieldDecorator("prenomBeneficiaire", {
                              rules: [
                                {
                                  required: true,
                                  message: "Entrer le prenom"
                                }
                              ]
                            })(
                              <Input
                                className="not-rounded"
                                placeholder={"Prenom du bénéficiare"}
                              />
                            )}
                          </Form.Item>
                          <Form.Item label="rib">
                            {getFieldDecorator(
                              "ribBeneficiaire",
                              {}
                            )(
                              <InputNumber
                                className="not-rounded"
                                placeholder={"RIB du bénéficiare"}
                                type="number"
                                formatter={currencyFormatter}
                                parser={currencyParser}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ) : null}
                  {this.state.supprimerBenef ? (
                    <div>
                      <h3>Supprimer un bénéficiaire</h3>
                      <Select
                        placeholder="Séléctionnez le bénéficiaire à supprimer"
                        onChange={this.handleBenefeciairesToDelete}
                        style={{ width: "45%" }}
                      >
                        {beneficiaireEnDeces.map(b => {
                          return (
                            <Option key={b.id} value={b.id} label={b.nom}>
                              {b.nom + " " + b.prenom}
                            </Option>
                          );
                        })}
                      </Select>
                      <Divider />
                      <Row>
                        <Descriptions bordered>
                          <Descriptions.Item label="Nom">
                            {this.state.beneficiareASupprimer.nom}
                          </Descriptions.Item>
                          <Descriptions.Item label="Prenom" span={2}>
                            {this.state.beneficiareASupprimer.prenom}
                          </Descriptions.Item>
                          <Descriptions.Item label="Rib" span={2}>
                            {this.state.beneficiareASupprimer.rib}
                          </Descriptions.Item>
                        </Descriptions>
                      </Row>
                    </div>
                  ) : null}
                </Row>
              </div>
            ) : null}
            {this.state.avenantFiveShow ? (
              <div>
                <h3>La modification du la durée du contrat</h3>
                <Divider />
                <Row>
                  <Col span={11}>
                    <Form.Item label="Ancien durée">
                      {getFieldDecorator(
                        "dureeContrat",
                        {}
                      )(
                        <InputNumber
                          className="not-rounded"
                          disabled
                          addonAfter="Mois"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11} offset={1}>
                    <Form.Item label="Nouveau duree">
                      {getFieldDecorator("nouveauDureeContrat")(
                        <InputNumber
                          className="not-rounded"
                          type="number"
                          onChange={this.onChangeDureeContrat}
                          addonAfter="Mois"
                          min={
                            this.state.record.produit.dureeMinimalSouscription
                          }
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ) : null}
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
              key="simuler"
              type="link"
              onClick={this.handleSimulation}
              className="not-rounded"
            >
              Simuler
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleSubmited}
              className="not-rounded"
              disabled={!this.state.aSimuler}
            >
              Ajouter
            </Button>,
            <Button
              key="back"
              onClick={this.handleCanceled}
              className="not-rounded"
            >
              Fermer
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
                      {this.state.rachatTotalVisible ? (
                        <Option value="Rachat total" label="Rachat total">
                          Rachat total
                        </Option>
                      ) : null}

                      {this.state.rachatPartielVisible ? (
                        <Option value="Rachat partiel" label="Rachat total">
                          Rachat partiel
                        </Option>
                      ) : null}

                      <Option value="Liquidation" label="Liquidation">
                        Liquidation
                      </Option>
                      <Option value="Avance" label="Avance">
                        Avance
                      </Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {this.state.rachatTotal ? (
              <div>
                <h3> AJOUT PRESTATION RACHAT TOTAL</h3>
                <Divider />
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="Date Prestation">
                      {getFieldDecorator("datePrestation", {
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
                    <Form.Item label="Date Départ">
                      {getFieldDecorator("dateDepart", {
                        rules: [
                          {
                            required: true,
                            message: "Date de départ est obligatoire"
                          }
                        ]
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
                    <Form.Item label="Mode de Paiement">
                      {getFieldDecorator("modeReglement", {
                        rules: [
                          {
                            required: true,
                            message: "Mode de virement est obligatoire"
                          }
                        ]
                      })(
                        <Select
                          placeholder="Séléctionnez "
                          style={{ width: "60%" }}
                        >
                          <Option value="Virement" label="Virement">
                            Virement
                          </Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="Banque">
                      {getFieldDecorator("banque", {
                        initialValue: this.state.contratPrestation.produit
                          .partenaire.raisonSocial
                      })(
                        <Input style={{ width: "60%" }} type="text" disabled />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="N° de compte bancaire">
                      {getFieldDecorator("compteBancaire", {
                        initialValue: this.state.contratPrestation.produit
                          .partenaire.numeroCompte
                      })(
                        <Input style={{ width: "60%" }} type="text" disabled />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="Montant rachat brut à la date du jour">
                      <InputNumber
                        style={{ width: "60%" }}
                        type="number"
                        value={this.state.montantCotisationBrut}
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="IR">
                      {getFieldDecorator("ir", { initialValue: 0 })(
                        <InputNumber
                          style={{ width: "60%" }}
                          type="number"
                          disabled
                          formatter={currencyFormatter}
                          parser={currencyParser}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={22} offset={2}>
                    <Form.Item label="Montant rachat net à la date du jour">
                      <InputNumber
                        style={{ width: "60%" }}
                        type="number"
                        value={this.state.montantCotisationBrut}
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
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
export default Form.create()(ConsultRetraiteContrat);
