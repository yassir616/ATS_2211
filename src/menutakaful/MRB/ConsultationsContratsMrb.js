/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  DatePicker,
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
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import ComponentTitle from "../../util/Title/ComponentTitle";
import DetailsContratMrb from "./DetailsContratMrb";
import {
  getAllContratMrb,
  searchContratMrb,
} from "../GestionContrats/ContratsAPI";
import { ajoutSinistreMrb } from "./ProduitMrb/ProduitMRBAPI";
//import { cpMrb } from "../GestionContrats/ContratsAPI";
export const MyContext = React.createContext();
const { Option } = Select;
const { Search } = Input;
const dateFormat = "DD-MM-YYYY";
class ConsultationsContratsMrb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibled: false,
      dateEcheance: "",
      data: [],
      sinistre: false,
      restitution: false,
      keyRecord: "",
      dateCreation: new Date(),
      searchby: "numeroContrat",
      searchfor: "",
      contrats: [],
      totalItems: 0,
      pagenumber: 1,
    };
    this.columns = [
      {
        title: "N° Contrat",
        dataIndex: "numeroContrat",
        key: "numeroContrat",
        render: (text, record) => {
          return (
            <span>
              <div>
                <MyContext.Provider
                  value={{
                    state: record,
                  }}
                >
                  <DetailsContratMrb />
                </MyContext.Provider>
              </div>
            </span>
          );
        },
      },
      {
        title: "N° Simulation",
        dataIndex: "numeroSimulation",
        key: "numeroSimulation",
      },
      {
        title: "Nom assuré",
        dataIndex: "assure.nom",
        key: "nomAssure",
      },
      {
        title: "Prénom assuré",
        dataIndex: "assure.prenom",
        key: "prenomAssure",
      },
      {
        title: "Produit",
        dataIndex: "produitMrb.libelle",
        key: "produit",
      },
      {
        title: "Type bâtiment",
        dataIndex: "typeBatiment",
        key: "typeBatiment",
      },
      {
        title: "Valeur bâtiment",
        dataIndex: "valeurBatiment", //a changer par le champs de la valeur du batiment apres la modification de ce dernier
        key: "typeBatiment",
      },
      {
        title: "Adresse",
        dataIndex: "adresseBatiment",
        key: "adresse",
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
                onClick={() => this.handleChangePrestation(record)}
                size="small"
                style={{
                  borderRadius: "0px",
                  width: "105px",
                  backgroundColor: "#4ee289",
                  borderColor: "#4ee289",
                  textAlign: "left",
                }}
              >
                <Icon type="plus-circle" /> Prestation
              </Button>
              {/* <Button
                type="primary"
                onClick={() => this.conditionParticuliereMrb(record)}
                size="small"
                style={{
                  borderRadius: "0px",
                  width: "105px",
                  backgroundColor: "#fff",
                  borderColor: "#fff",
                  textAlign: "left",
                  display:"block",
                  color:'gray',
                  borderColor:'#e8e8e8'
                }}
              >
                <Icon type="download" /> Télécharger
              </Button> */}
            </span>
          );
        },
      },
    ];
  }
  componentDidMount() {
    this.getAllContrat();
  }
  async getAllContrat() {
    let response = await getAllContratMrb();
    this.setState({
      data: response.data.content,
    });
  }

  // async conditionParticuliereMrb(record) {
  //   console.log("record : ",record);
  //   let cpObject={}
  //   cpObject.numeroSouscription=record.numeroContrat;
  //   cpObject.dateEcheance=record.dateEcheance;
  //   cpObject.dateEffet=record.dateEffet;
  //   cpObject.duree=record.dureeContrat;
  //  // cpObject.agence;
  //   // cpObject.raisonSocial;
  //   // cpObject.siegeSocial;
  //   // cpObject.NumHomologation;
  //   // cpObject.dateHomologation;
  //   // cpObject.typePartenaire;
  //   cpObject.numeroContract=record.numeroContrat;
  //   cpObject.adresse=record.adresseBatiment;
  //   cpObject.nomPrenomSouscripteur=record.souscripteur.prenom+" "+record.souscripteur.nom;
  //   //cpObject.nomSouscripteur=record.souscripteur.nom;
  //   cpObject.dateNaissanceSouscripteur=record.souscripteur.dateNaissance
  //   cpObject.nationaliteSouscripteur=record.souscripteur.nationalite;
  //   cpObject.cinSouscripteur=record.souscripteur.cin;
  //   //cpObject.adresseSouscripteur=record.souscripteur.adressComplete;
  //   cpObject.villeSouscripteur=record.souscripteur.adressVille;
  //   cpObject.ribSouscripteur=record.souscripteur.rib;
  //   cpObject.nomPrenomAssure=record.assure.prenom+" "+record.assure.nom;
  //   cpObject.dateNaissance=record.assure.dateNaissance;
  //   cpObject.nationalite=record.assure.nationalite;
  //   cpObject.proffession=record.assure.profession.libelle;
  //   cpObject.proffessionSouscripteur=record.souscripteur.profession.libelle;
  //   cpObject.addressSouscripteur=record.souscripteur.adressComplete;
  //   cpObject.numeroDeTelephoneAssure=record.numeroDeTelephone;
  //   cpObject.numeroDeTelephoneSouscripteur=record.souscripteur.numeroDeTelephone
  //   //cpObject.ribAssure=record.assure.rib

  //   //cpObject.nomAssure=record.assure.nom;
  //   cpObject.cinAssure=record.assure.prenom;
  //   cpObject.adresseAssure=record.assure.adressComplete;
  //   cpObject.villeAssure=record.assure.villeAssure;
  //   cpObject.ribAssure=record.assure.rib;
  //   cpObject.categorie=record.categorie;
  //   cpObject.typeBatiment=record.typeBatiment;
  //   cpObject.typePropriete=record.typePropriete;
  //   cpObject.valeurBatiment=record.valeurBatiment;
  //   cpObject.valeurContenue=record.valeurContenu;
  //   cpObject.ribSouscripteur=record.souscripteur.rib
  //   // cpObject.raisonSocialSous;
  //   // cpObject.formeJuridiqueSous;
  //   // cpObject.capitalSocialSous;
  //   // cpObject.siegeSocialSous;
  //   // cpObject.villeMoralSous;
  //   // cpObject.ribMoralSous;
  //   // cpObject.raisonSocialAssure;
  //   // cpObject.formeJuridiqueAssure;
  //   // cpObject.capitalSocialAssure;
  //   // cpObject.siegeSocialAssure;
  //   // cpObject.villeMoralAssure;
  //   // cpObject.ribMoralAssure;
  //   // cpObject.ville;
  //   // cpObject.date;
  //   // cpObject.numeroCompte;
  //   // cpObject.typeBatiment;
  //   // cpObject.adresseBatiment;
  //    cpObject.numTitreFoncier=record.numTitreFoncier;
  //   // cpObject.superficie;
  //   // cpObject.caracteristique;
  //   // cpObject.taciteReconduction;
  //   cpObject.primeEvcat=record.primeEvcat;
  //   cpObject.montantTTC=record.montantTTC;
  //   // cpObject.codeQr=
  //         "Numero Contrat :" +
  //         record.numeroContrat +
  //         "\n HashCTR :" +
  //         record.id +
  //         "\n HashP :" +
  //         record.produitMrb.id;
  //   //cpObject.periodicite=record.periodicite;
  //   let response = await cpMrb(cpObject);
  //   if (response.status === 200) {
  //     const file = new Blob([response.data], { type: "application/pdf" });
  //     const fileURL = URL.createObjectURL(file);
  //     window.open(fileURL);
  //   }
  // }
  handleChangePrestation = (value) => {
    this.setState({
      visibled: true,
      dateEcheance: value.dateEcheance,
      keyRecord: value.id,
    });
    this.setState({ visibled: true, dateEcheance: value.dateEcheance });
  };

  handleChanged = (value) => {
    if (value === "Restitution") {
      this.setState({ restitution: true, sinistre: false });
    } else if (value === "Sinistre") {
      this.setState({ sinistre: true, restitution: false });
    }
  };

  selectBefore = (
    <Select
      onChange={(value) => this.setState({ searchby: value })}
      defaultValue="numContrat"
      style={{ width: 150 }}
    >
      <Option value="numContrat">N° de contrat</Option>
      <Option value="numeroSimulation">N° Simulation</Option>
      <Option value="nom">Nom Assuré</Option>
    </Select>
  );

  handleSubmited = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("values", values);
      console.log("this.state.dateEcheance", this.state.dateEcheance);
      if (!err) {
        const dateEcheance = moment(this.state.dateEcheance, "DD/MM/YYYY");
        const dateSurvenance = moment(
          values.dateSurvenanceSinistre,
          "DD/MM/YYYY"
        );

        let requestmodel = {
          contratId: this.state.keyRecord,
          dateDeclarationSinistre: values.dateDeclarationSinistre,
          dateSurvenance: values.dateSurvenanceSinistre,
          natureSinistre: values.natureSinistre,
          typePrestation: values.typePrestation,
        };

        if (dateSurvenance <= dateEcheance) {
          this.setState({ visibled: false });

          console.log(
            "requestmodel.dateDeclarationSinistre",
            requestmodel.dateDeclarationSinistre
          );

          ajoutSinistreMrb(requestmodel)
            .then((response) => {
              notification.success({
                message: "TAKAFUL",
                description: "L'insertion est bien faite",
              });
              this.props.record.history.push("/ConsultationsContratsMrb");
            })
            .catch((error) => {
              notification.error({
                message: "TAKAFUL",
                description:
                  error.message ||
                  "Sorry! Something went wrong. Please try again!",
              });
            });
        } else {
          message.warning("Contrat non couvert au date de sinistre");
        }
      }
    });
  };

  handleCanceled = () => {
    this.props.form.setFieldsValue({
      typePrestation: " Séléctionnez ",
    });
    this.setState({ visibled: false });
  };

  handleClosed = () => {
    this.setState({ sinistre: false, restitution: false });
  };

  async searchContratsMrb(page, limit, searchby, searchfor) {
    let contratResponse = await searchContratMrb(
      page,
      limit,
      searchby,
      searchfor
    );
    if (searchby === "numeroSimulation" || searchby === "nom") {
      this.setState({
        data: [...contratResponse.data.content],
        totalItems: contratResponse.data.numberOfElements,
      });
    } else if (searchby === "numeroContrat") {
      this.setState({
        data: [...contratResponse.data.content],
        totalItems: contratResponse.data.totalElements,
      });
    }
  }

  search = (value) => {
    this.setState({ pagenumber: 1, searchfor: value });
    this.searchContratsMrb(
      this.state.pagenumber - 1,
      2,
      this.state.searchby,
      value
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visibled } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 14 },
      },
    };
    return (
      <div>
        <ComponentTitle title="Gestion des contrats MRB" />
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Entrez le text de recherche"
            addonBefore={this.selectBefore}
            onSearch={(value) => this.search(value)}
            enterButton
            style={{ width: 600 }}
          />
        </div>
        <Table
          rowClassName="editable-row"
          columns={this.columns}
          dataSource={this.state.data}
          pagination={{ pageSize: 5 }}
        />
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
              key="submit"
              type="primary"
              onClick={this.handleSubmited}
              className="not-rounded"
            >
              Ajouter
            </Button>,
          ]}
        >
          <Form {...formItemLayout}>
            <div>
              <h3> AJOUT SINISTRE</h3>
              <Divider />
              <Row>
                <Col span={22} offset={2}>
                  <Form.Item label="Date Création">
                    {getFieldDecorator("dateCreation", {
                      initialValue: moment(this.state.dateCreation, dateFormat),
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
                        onChange={this.onSelectChange}
                        style={{ width: "60%" }}
                      >
                        <Option value="Incendie" label="Incendie">
                          Incendie
                        </Option>
                        <Option value="Vol" label="Vol">
                          Vol
                        </Option>
                        <Option value="Bris des Glaces" label="Bris des Glaces">
                          Bris des Glaces
                        </Option>
                        <Option value="Dégâts des Eaux" label="Dégâts des Eaux">
                          Dégâts des Eaux
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
          </Form>
        </Modal>
      </div>
    );
  }
}
export default Form.create()(ConsultationsContratsMrb);
