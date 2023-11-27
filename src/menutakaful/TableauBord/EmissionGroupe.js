/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Table,
  Drawer,
  Popconfirm,
  Spin,
} from "antd";
import React, { Component } from "react";
import {
  ajoutEncaissement,
  getCompteBancaire,
  getCotisationById,
  getEncaissementById,
  AnnulationCotisation,
  getEmissionGlobale,
  validationGlobaleCotisation,
} from "./CotisationAPI";
import { getDecesProduit } from "../Parametrage/ProduitDeces/ProduitDecesAPI";
import { getAllPartenaire } from "../Parametrage/partenaire/PartenaireAPI";
import { MyContext } from "./Comptabilite";
import { currencyFormatter, currencyParser ,separateDigitsWithSpaces} from "../../util/Helpers";
import ComponentTitle from "../../util/Title/ComponentTitle";
const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "2%",
};
const data = [
  { id: 1, name: "Yassir" },
  { id: 2, name: "Omar" },
  { id: 3, name: "Achraf" },
];
const { Option } = Select;
class EmissionGroupe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchStartDate: "",
      searchEndDate: "",
      cotisationFiltred: [],
      visibleDrawer: false,
      dataCalcule: [],
      produits: [],
      partenaires: [],
      produitPartenaire: [],
      partenaireId: "",
      produitId: "",
      SommeMontantTTC: 0,
      numeroLot: "",
      validVisible: true,
      spinning: false,
      viewValidModal: false,
    };

    this.columns = [
      {
        title: "FraisGestionTTC",
        dataIndex: "fraisGestionTTC",
        key: "fraisGestionTTC",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "FraisAcquisitionTTC",
        dataIndex: "fraisAcquisitionTTC",
        key: "fraisAcquisitionTTC",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "MontantCotisation",
        dataIndex: "montantCotisation",
        key: "montantCotisation",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "MontantTaxe",
        dataIndex: "montantTaxe",
        key: "montantTaxe",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "MontantTTC",
        dataIndex: "montantTTC",
        key: "montantTTC",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "Solde",
        dataIndex: "solde",
        key: "solde",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
    ];

    this.STableColumn = [
      {
        title: "N° de Contrat",
        dataIndex: "numeroContrat",
        key: "numeroContrat",
        render: (text) => <span style={{ color: "#32CD32" }}>{text}</span>,
      },
      {
        title: "Nom assuré",
        dataIndex: "nomAssuree",
        key: "nomAssuree",
      },
      {
        title: "Prénom assuré",
        dataIndex: "prenomAssuree",
        key: "prenomAssuree",
      },
      {
        title: "Nom souscripteur",
        dataIndex: "contrat.souscripteur.nom",
        key: "nomSouscripteur",
      },
      {
        title: "Prénom souscripteur",
        dataIndex: "contrat.souscripteur.prenom",
        key: "prenomSouscripteur",
      },
      {
        title: "Date d'effet",
        dataIndex: "dateEffet",
        key: "dateEffet",
      },
      {
        title: "Date écheance",
        dataIndex: "dateEcheance",
        key: "dateEcheance",
      },
      {
        title: "Produit",
        dataIndex: "produitLibelle",
        key: "produitLibelle",
      },
      {
        title: "MontantContribution",
        dataIndex: "contributionPure",
        key: "contributionPure",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "MontantTTC",
        dataIndex: "montantTTC",
        key: "montantttc",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "FraisGestionTTC",
        dataIndex: "fraisGestionTTC",
        key: "fraisGestionTTC",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "montantCotisation",
        dataIndex: "montantCotisation",
        key: "montantCotisation",
        render:(text,record)=>(separateDigitsWithSpaces(text))
      },
      {
        title: "Opération",
        dataIndex: "operation",
        render: (text, record) =>
          this.state.cotisationFiltred.length >= 1 ? (
            <Popconfirm
              title="etes-vous sur?"
              onConfirm={() => this.handleDelete(record)}
            >
              <a href="#top">
                <Icon type="delete" theme="twoTone" />
              </a>
            </Popconfirm>
          ) : null,
      },
    ];
  }

  componentDidMount() {
    this.getDecesProduit();
    this.getAllPartenaire();
  }

  async getAllPartenaire() {
    console.log("getting all partenaires");
    let partenaireResponse = await getAllPartenaire();
    if (partenaireResponse.status == 200) {
      console.log("partenaire", partenaireResponse.data.content);
      this.setState({ partenaires: partenaireResponse.data.content });
    } else {
      notification.error({ message: "Get Partenaire Failed" });
    }
  }

  async validationGlobaleCotisation(cotisationList, dataCalcule, Reference) {
    console.log("cotisationList : ", cotisationList);
    console.log("dataCalculé : ", dataCalcule);
    let response = await validationGlobaleCotisation(
      cotisationList,
      dataCalcule,
      Reference
    );
    if (response.status == 200) {
      console.log("succes : ", response.data);
      this.setState({ numeroLot: response.data.numeroLot });
    } else {
      notification.error({
        message: "Takaful",
        description: "Erreur dans la validation des Cotisations",
      });
    }
  }

  async getDecesProduit() {
    console.log("getting produits Déces");
    let response = await getDecesProduit();
    if (response.status == 200) {
      console.log("produits", response.data.content);
      this.setState({ produits: response.data.content });
    } else {
      notification.error({ message: "Get Produits Failed" });
    }
  }

  handlePartnerChange = (value) => {
    this.setState({ produitId: "" });
    this.setState({ partenaireId: value.key, cotisationFiltred: [] });
    this.props.form.setFieldsValue({ produit: "" });
    let list = [...this.state.produits];
    this.setState({
      produitPartenaire: list.filter(
        (item) => item.partenaire.id === value.key
      ),
    });
  };

  handleDelete = (record) => {
    var Cotisation = this.state.cotisationFiltred;
    Cotisation = Cotisation.filter((element) => element.id != record.id);
    var [
      montantTTC,
      montantCotisation,
      montantTaxe,
      montantTaxeParaFiscale,
      solde,
      fraisAcquisitionTTC,
      fraisGestionTTC,
    ] = [0, 0, 0, 0, 0, 0, 0];
    for (let key in Cotisation) {
      montantTTC += Cotisation[key].montantTTC;
      montantCotisation += Cotisation[key].montantCotisation;
      montantTaxe += Cotisation[key].montantTaxe;
      montantTaxeParaFiscale += Cotisation[key].montantTaxeParaFiscale;
      solde += Cotisation[key].solde;
      fraisAcquisitionTTC += Cotisation[key].fraisAcquisitionTTC;
      fraisGestionTTC += Cotisation[key].fraisGestionTTC;
    }
    montantTTC = montantTTC.toFixed(2);
    montantCotisation = montantCotisation.toFixed(2);
    montantTaxe = montantTaxe.toFixed(2);
    montantTaxeParaFiscale = montantTaxeParaFiscale.toFixed(2);
    solde = solde.toFixed(2);
    fraisAcquisitionTTC = fraisAcquisitionTTC.toFixed(2);
    fraisGestionTTC = fraisGestionTTC.toFixed(2);
    const hello = [
      {
        montantTTC: montantTTC,
        montantCotisation: montantCotisation,
        montantTaxe: montantTaxe,
        montantTaxeParaFiscale: montantTaxeParaFiscale,
        solde: solde,
        fraisAcquisitionTTC: fraisAcquisitionTTC,
        fraisGestionTTC: fraisGestionTTC,
      },
    ];
    this.setState({
      dataCalcule: hello,
      cotisationFiltred: Cotisation,
      SommeMontantTTC: montantTTC,
    });
    console.log("dataCalculé", hello);
    console.log("filtredCotisation", Cotisation);
  };

  handleCancel = () => {
    this.setState({ visibleDrawer: false });
  };
  handleDetailsDrawer = () => {
    this.setState({ visibleDrawer: true });
  };

  handleDateChange = (e) => {
    this.props.form.validateFields((err, values) => {
      if (
        !err
        //|| err.Reference.errors[0].message == "Entrer une réference valide"
      ) {
        console.log("value selected 1", e[0].format("YYYY-MM-DD"));
        console.log("value seleted 2", e[1].format("YYYY-MM-DD"));
        this.setState({
          searchStartDate: e[0].format("YYYY-MM-DD"),
          searchEndDate: e[1].format("YYYY-MM-DD"),
        });
      } else {
        notification.error({
          message: "Takaful",
          description: "Sorry! Something went wrong. Please try again!",
        });
      }
    });
  };

  handleProduitChange = (e) => {
    this.setState({ produitId: e.key });
  };

  handleRechercher = () => {
    this.props.form.setFieldsValue({Reference:""})
    this.setState({ spinning: true });
    this.getDataEmissionGlobale();
  };

  async getDataEmissionGlobale() {
    if (
      // this.props.form.getFieldValue("partenaire") != undefined &&
      // this.props.form.getFieldValue("partenaire") != null &&
      // this.props.form.getFieldValue("produit") != undefined &&
      // this.props.form.getFieldValue("produit") != null &&
      this.state.searchStartDate != "" &&
      this.state.searchStartDate != null &&
      this.state.searchStartDate != undefined &&
      this.state.searchEndDate != "" &&
      this.state.searchEndDate != null &&
      this.state.searchEndDate != undefined
    ) {
      let response = await getEmissionGlobale(
        this.state.partenaireId,
        this.state.produitId,
        this.state.searchStartDate,
        this.state.searchEndDate
      );
      console.log("produitId : ", this.state.produitId);
      console.log("partenaireId : ", this.state.partenaireId);
      this.setState({ spinning: false });
      if (response.status == 200) {
        this.setState({ cotisationFiltred: [...response.data] });
        console.log("this is response data", response.data);
        if ([...response.data].length > 0) {
          var [
            montantTTC,
            montantCotisation,
            montantTaxe,
            montantTaxeParaFiscale,
            solde,
            fraisAcquisitionTTC,
            fraisGestionTTC,
          ] = [0, 0, 0, 0, 0, 0, 0];
          for (let key in response.data) {
            montantTTC += response.data[key].montantTTC;
            montantCotisation += response.data[key].montantCotisation;
            montantTaxe += response.data[key].montantTaxe;
            montantTaxeParaFiscale += response.data[key].montantTaxeParaFiscale;
            solde += response.data[key].solde;
            fraisAcquisitionTTC += response.data[key].fraisAcquisitionTTC;
            fraisGestionTTC += response.data[key].fraisGestionTTC;
          }
          montantTTC = montantTTC.toFixed(2);
          montantCotisation = montantCotisation.toFixed(2);
          montantTaxe = montantTaxe.toFixed(2);
          montantTaxeParaFiscale = montantTaxeParaFiscale.toFixed(2);
          solde = solde.toFixed(2);
          fraisAcquisitionTTC = fraisAcquisitionTTC.toFixed(2);
          fraisGestionTTC = fraisGestionTTC.toFixed(2);
          const hello = [
            {
              montantTTC: montantTTC,
              montantCotisation: montantCotisation,
              montantTaxe: montantTaxe,
              montantTaxeParaFiscale: montantTaxeParaFiscale,
              solde: solde,
              fraisAcquisitionTTC: fraisAcquisitionTTC,
              fraisGestionTTC: fraisGestionTTC,
            },
          ];
          console.log("this.state.montant", this.state.SommeMontantTTC);
          this.setState({ dataCalcule: hello, SommeMontantTTC: montantTTC });
        } else {
          notification.warning({
            message: "Takaful",
            description: "pas de cotisation pour cette recherche",
          });
        }
      } else {
        notification.error({
          message: "Takaful",
          description: "Erreur dans le GET des données",
        });
      }
    } else {
      this.setState({ spinning: false });
      notification.warning({
        message: "Takaful",
        description: "Veuillez bien remplir les données!!",
      });
    }
  }
  handleReload = () => {
    window.location.reload();
  };

  handleExeclExport = () => {
    console.log(this.state.cotisationFiltred);
    const worksheetData = this.state.cotisationFiltred.map((item) => [
      item.numeroContrat,
      item.nomAssuree,
      item.prenomAssuree,
      item.montantAccessoire,
      item.capitalAssure,
      item.contributionPure,
      item.creationDateCotisation,
      item.dateEtablissement,
      item.datePrelevement,
      item.etatCotisation,
      item.annulation,
      item.exercice,
      item.fraisAcquisitionTTC,
      item.fraisGestionTTC,
      item.montantCotisation,
      item.montantTTC,
      item.montantTaxe,
      item.montantTaxeParaFiscale,
      item.numeroQuittance,
      item.numeroLot,
      item.solde,
      item.id
      // item.fluxId,
      // item.contrat.id,
    ]);
    const worksheetHeader = [
      "numeroContrat",
      "nomAssure",
      "prenomAssure",
      "montantAccessoire",
      "capitalAssure",
      "contributionPure",
      "creationDate",
      "dateEtablissement",
      "datePrelevement",
      "etatCotisation",
      "annulation",
      "exercice",
      "fraisAcquisitionTTC",
      "fraisGestionTTC",
      "montantCotisation",
      "montantTTC",
      "montantTaxe",
      "montantTaxeParaFiscale",
      "numeroQuittance",
      "numeroLot",
      "solde",
      "id"
      // "fluxId",
      // "contratId",
    ];
    const worksheet = [worksheetHeader, ...worksheetData];

    let content = "";
    worksheet.forEach((row) => {
      const rowData = row.map((cell) => `"${cell}"`).join(",");
      content += rowData + "\n";
    });

    const csvData =
      "data:text/csv;charset=utf-8," + encodeURIComponent(content);
    //console.log("csv data : ", csvData);
    const link = document.createElement("a");
    link.setAttribute("href", csvData);
    link.setAttribute("download", "cotisations.csv");
    //console.log("Link : ", link);
    link.click();
  };
  // var wb = XLSX.utils.book_new();
  // var ws = XLSX.utils.json_to_sheet(this.state.cotisationFiltred);
  // XLSX.utils.book_append_sheet(wb, ws, "Sheet_1");
  // XLSX.writeFile(wb, "Cotisations.xlsx");;

  handleValiderClick = () => {
    var Reference = "";
    this.props.form.validateFields((err, values) => {
      Reference = values.Reference;
      console.log("Reference : ", Reference);
    });
    console.log("Reference : ", Reference);
    this.setState({ validVisible: false });
    console.log("Validating cotisations Groupe....");
    const formattedDates = this.state.cotisationFiltred.map((element) => {
      const parts = element.datePrelevement.split("-");
      if (parts[2].length == 4) {
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        return formattedDate;
      } else {
        const formattedDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
        return formattedDate;
      }
    });
    console.log("formated Dates", formattedDates);
    for (var i in this.state.cotisationFiltred) {
      this.state.cotisationFiltred[i].datePrelevement = formattedDates[i];
    }
    console.log("valueState : ", this.state.dataCalcule);
    this.validationGlobaleCotisation(
      this.state.cotisationFiltred,
      this.state.dataCalcule,
      Reference
    ).then(() => {
      const key = `open${Date.now()}`;
      const btn = (
        <Button type="primary" size="small" onClick={() => this.handleReload()}>
          Confirm
        </Button>
      );
      notification.success({
        message: "Vérification est bien faite",
        description: " NUMERO LOT   : " + this.state.numeroLot,
        btn,
        duration: 0,
        key,
      });
    });
  };

  handleViewModal = () => {
    this.setState({ viewValidModal: true });
  };

  handleModalCancel = () => {
    this.setState({ viewValidModal: false });
  };

  handleSubmited = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        // No validation errors, execute your validation function
        console.log("values : ", values);
        //this.validationGlobaleCotisation();
        this.setState({ viewValidModal: false });
        this.handleValiderClick();
      } else {
        // Validation errors, show an alert
        console.log("errors : ", errors);
      }
    });
  };

  render() {
    const { spinning } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 15 },
        lg: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 9 },
        lg: { span: 12 },
      },
    };
    return (
      <React.Fragment>
        <Spin spinning={spinning}>
          <ComponentTitle title="Emission Groupe" />
          <Col span={24} offset={1} style={{ margin: "0 auto" }}>
            <input
              className="not-rounded criteres-rech"
              placeholder="Critères de Recherche"
              disabled
            />
            <div
              className="div-criteres"
              style={{
                padding: 10,
                width: 1400,
                background: "#fff",
                borderTop: "3px solid #eaa76c",
              }}
            />
            <Form
              {...formItemLayout}
              //onSubmit={this.handleSubmit}
            >
              <Row>
                <Col span={6} className="col-form">
                  <Form.Item label="Date Prelevement " hasFeedback>
                    {getFieldDecorator(
                      "dateeffet",
                      {}
                    )(
                      <DatePicker.RangePicker
                        style={{ width: "300px" }}
                        onChange={this.handleDateChange}
                      ></DatePicker.RangePicker>
                    )}
                  </Form.Item>
                </Col>
                <Col span={9} className="col-form">
                  <Form.Item label="Partenaire " hasFeedback>
                    {getFieldDecorator(
                      "partenaire",
                      {}
                    )(
                      <Select
                        style={{ width: "250px" }}
                        placeholder="sélectionner un partenaire..."
                        onChange={this.handlePartnerChange}
                        optionLabelProp="label"
                        labelInValue
                      >
                        {this.state.partenaires.map((element) => {
                          return (
                            <Option
                              key={element.id}
                              value={element.id}
                              label={element.raisonSocial}
                            >
                              {element.raisonSocial}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4} className="col-form">
                  <Form.Item label="Produit " hasFeedback>
                    {getFieldDecorator(
                      "produit",
                      {}
                    )(
                      <Select
                        style={{ width: "200px" }}
                        placeholder="Veuillez selectionner"
                        optionLabelProp="label"
                        labelInValue
                        onChange={this.handleProduitChange}
                      >
                        {this.state.produitPartenaire.map((element) => {
                          return (
                            <Option
                              key={element.id}
                              value={element.id}
                              label={element.code}
                            >
                              {element.code}
                            </Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={21}>
                  <Form.Item style={{ marginTop: "30px", float: "right" }}>
                    {getFieldDecorator(
                      "searchSubmit",
                      {}
                    )(
                      <Button
                        onClick={() => this.handleRechercher()}
                        className="nouveau-btn"
                        type="primary"
                        htmlType="submit"
                      >
                        Rechercher
                      </Button>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            {this.state.cotisationFiltred.length > 0 && (
              <React.Fragment>
                <Table
                  columns={this.columns}
                  dataSource={this.state.dataCalcule}
                  className="table-simulation simulation-Globale"
                  pagination={false}
                  style={{ marginBottom: "10px" }}
                ></Table>
                <div style={{ marginLeft: "20px" }}>
                  <Button
                    onClick={() => this.handleDetailsDrawer()}
                    //className="primary"
                    style={{ width: "8%" }}
                    visible={false}
                  >
                    <Icon type="info-circle" />
                    Détails
                  </Button>
                  {this.state.validVisible && (
                    <Button
                      onClick={() => this.handleViewModal()}
                      //className="nouveau-btn"
                      style={{
                        color: "white",
                        width: "10%",
                        fontWeight: "bold",
                        backgroundColor: "#77CC6D",
                      }}
                    >
                      Valider
                    </Button>
                  )}
                  <Modal
                    style={{
                      marginTop: "9%",
                    }}
                    visible={this.state.viewValidModal}
                    title="Reference du Lot"
                    onOk={this.handleSubmited}
                    onCancel={this.handleModalCancel}
                    width="600px"
                    footer={[
                      <Button key="back" onClick={this.handleModalCancel}>
                        Fermer
                      </Button>,
                      <Button
                        key="submit"
                        type="primary"
                        onClick={this.handleSubmited}
                      >
                        Valider
                      </Button>,
                    ]}
                  >
                    <Form>
                      <Row gutter={16}>
                        <Col span={20}>
                          <Form.Item label="Référence " hasFeedback>
                            {getFieldDecorator("Reference", {
                              rules: [
                                {
                                  required: true,
                                  pattern: new RegExp(/^.{0,50}$/),
                                  message: "Entrer une réference valide",
                                },
                              ],
                            })(
                              <Input
                                placeholder="Entrer une référence d'emission "
                                style={{
                                  width: "400px",
                                  display: "inline-block",
                                }}
                                // onChange={this.handleDateChange}
                              ></Input>
                            )}
                          </Form.Item>
                        </Col>
                        </Row>
                    </Form>
                  </Modal>
                </div>
              </React.Fragment>
            )}
            <Drawer
              title="Détails Cotisation : résultat de recherche"
              visible={this.state.visibleDrawer}
              onClose={() => this.handleCancel()}
              width={1600}
            >
              <div style={containerStyle}>
                <p style={{ marginTop: "15px", fontSize: "15px" }}>
                  Montant à encaissé :{" "}
                </p>
                <Input
                  style={{
                    width: "25%",
                    fontSize: "25px",
                    marginLeft: "10px",
                    fontWeight: "bold",
                  }}
                  disabled
                  placeholder={separateDigitsWithSpaces(this.state.SommeMontantTTC)}
                ></Input>
              </div>
              <Table
                columns={this.STableColumn}
                dataSource={this.state.cotisationFiltred}
              ></Table>
              <Button
                onClick={() => this.handleExeclExport()}
                style={{
                  color: "white",
                  width: "10%",
                  fontWeight: "bold",
                  backgroundColor: "#77CC6D",
                }}
              >
                <Icon type="file-excel" />
                Télécharger
              </Button>
            </Drawer>
          </Col>
        </Spin>
      </React.Fragment>
    );
  }
}
export default Form.create()(EmissionGroupe);
