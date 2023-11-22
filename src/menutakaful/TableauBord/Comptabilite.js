/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Table,
} from "antd";
import React, { Component } from "react";
import { NOM_ASSURE, CIN_ASSURE, NUM_CONTRAT } from "../../constants/index";
import { getDecesContrat, searchContrat } from "../GestionContrats/ContratsAPI";
import { getColumnSearchProps } from "../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { ajoutCotisation, getPrelevement } from "./CotisationAPI";
import DetailsCotisation from "./DetailsCotisation";
import moment from "moment";
import { currencyFormatter, currencyParser } from "../../util/Helpers";
import e from "cors";
export const MyContext = React.createContext();
var statuts = "ACCEPTED";
const { Option } = Select;
const { Search } = Input;
const dateFormat = "DD-MM-YYYY";
let id = "";
let date = new Date();
class Comptabilite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      dateCreation: new Date(),
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
      tauxSurprime: null,
      montantSurprime: null,
      montantCotisation: null,
      cotisationTotale: null,
      fraisAcquisitionTTC: null,
    };
    this.columns = [
      /*     {
        title: "Numéro quittance",
        dataIndex: "numQuittance",
        key: "numQuittance",
        ...getColumnSearchProps("numQuittance", "numQuittance1", this)
      }, */
      {
        title: "N° de Contrat",
        dataIndex: NUM_CONTRAT,
        key: "numcontrat",
        render: (text, record) => {
          return (
            <span>
              <div>
                <MyContext.Provider
                  value={{
                    state: record,
                  }}
                >
                  <DetailsCotisation />
                </MyContext.Provider>
              </div>
            </span>
          );
        },
      },
      {
        title: "Durée Contrat",
        dataIndex: "dureeContrat",
        key: "dureeContrat",
        ...getColumnSearchProps("dureeContrat", "Durée contrat", this),
      },
      {
        title: "CIN assuré",
        dataIndex: "assure.cin",
        key: "cinAssure",
      },
      {
        title: "Nom assuré",
        dataIndex: "assure.nom",
        key: "nomAssure",
        ...getColumnSearchProps("assure.nom", "Prénom assure", this),
      },
      {
        title: "Prénom assuré",
        dataIndex: "assure.prenom",
        key: "prenomAssure",
      },
      {
        title: "Nom souscripteur",
        dataIndex: "souscripteur.nom",
        key: "nomSouscripteur",
        ...getColumnSearchProps("souscripteur.nom", "Prénom assure", this),
      },
      {
        title: "Prénom souscripteur",
        dataIndex: "souscripteur.prenom",
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
        dataIndex: "produit.libelle",
        key: "produit",
      },
      /*  {
        title: "Etat cotisation",
        dataIndex: "etatCotisation",
        key: "etatCotisation"
      }, */
      {
        title: "Action",
        dataIndex: "operation",
        fixed: "right",
        render: (text, record) => {
          return (
            <span>
              {moment(record.dateEcheance).diff(moment(), "months") > 0 ? (
                <Button
                  type="primary"
                  onClick={() => this.handleChange(record)}
                  size="small"
                  style={{
                    borderRadius: "0px",
                    width: "105px",
                    backgroundColor: "#4ee289",
                    borderColor: "#4ee289",
                    textAlign: "left",
                  }}
                >
                  <Icon type="plus-circle" /> Cotisation
                </Button>
              ) : (
                "Echouée "
              )}
            </span>
          );
        },
      },
    ];
  }
  componentDidMount() {
    //this.recherchePrelevement();
    this.getproprties(statuts, 0, 5, NUM_CONTRAT, "desc");
  }
  recherchePrelevement = () => {
    getPrelevement()
      .then((response) => {
        let newDataList = [];
        response.data.content.forEach((element) => {
          let key = { key: element.id };
          element = { ...element, ...key };
          newDataList.push(element);
        });

        this.setState({
          data: newDataList,
        });
      })
      .catch((error) => {
        if (error.status === 401) {
          notification.error({
            message: "Takaful",
            description:
              "Votre login ou mot de passe est incorrect. Veuillez réessayer!",
          });
        } else {
          notification.error({
            message: "Takaful",
            description:
              error.message ||
              "Désolé! Quelque chose s'est mal passé Veuillez réessayer!",
          });
        }
      });
  };
  componentDidUpdate(_, prevState) {
    if (
      prevState.montantCotisation !== this.state.montantCotisation &&
      this.state.montantCotisation !== null
    ) {
      this.setState({
        montantSurprime:
          (this.state.tauxSurprime * this.state.montantCotisation) / 100,
      });
      this.setState({
        cotisationTotale:
          this.state.montantSurprime + this.state.montantCotisation,
      });
    }
  }
  handleChange = (value) => {
    this.setState({ record: value });
    console.log(
      "record cot:",
      moment(value.dateEcheance).diff(moment(), "months")
    );

    if (value.periodicite.libelle === "Annuelle") {
      this.props.form.setFieldsValue({
        montantCotisation: value.montantCotisation.toFixed(2),
        montantTaxe: value.montantTaxe.toFixed(2),
        montantTTC:
          parseFloat(value.montantCotisation) + parseFloat(value.montantTaxe),
        datePrelevement: moment(value.dateEffet).add(1, "Y"),
        fraisAcquisitionTTC: value.fraisAcquisitionTTC,
        fraisGestionTTC: value.fraisGestionTTC,
        contributionPure: value.contributionPure,
        montantAccessoire: value.produit.montantAccessoire,
        montantTaxeParaFiscale: value.montantTaxe,
      });
    }
    if (value.periodicite.libelle === "Mensuelle") {
      this.props.form.setFieldsValue({
        montantCotisation: value.montantCotisation.toFixed(2),
        montantTaxe: value.montantTaxe.toFixed(2),
        montantTTC:
          parseFloat(value.montantCotisation) + parseFloat(value.montantTaxe),
        datePrelevement: moment(value.dateEffet).add(1, "M"),
        fraisAcquisitionTTC: value.fraisAcquisitionTTC,
        fraisGestionTTC: value.fraisGestionTTC,
        contributionPure: value.contributionPure,
        montantAccessoire: value.produit.montantAccessoire,
        montantTaxeParaFiscale: value.montantTaxe,
      });
    }

    id = value.id;
    this.setState({
      visible: true,
      tauxSurprime: value.tauxSurprime,
      fraisAcquisitionTTC: value.fraisAcquisitionTTC,
    });
  };
  onChangeMontantCotisation = (e) => {
    this.setState({ montantCotisation: e });
    const montantTaxe = (e * this.state.record.produit.taxe) / 100;
    const montantTTC = parseFloat(e) + parseFloat(montantTaxe);
    const fraisAcquisitionTTC =
      (this.state.record.produit.fraisAcquisition / 100) *
      ((1 + this.state.record.produit.tvaFraisAcquisition) / 100) *
      e;
    const fraisGestionTTC =
      (this.state.record.produit.fraisGestion / 100) *
      (1 + this.state.record.produit.tvaFraisGestion / 100) *
      e;

    const contributionPure = e - fraisAcquisitionTTC - fraisGestionTTC;
    const montantTaxeParafiscale =
      (this.state.record.produit.taxeParaFiscale / 100) * e;
    this.props.form.setFieldsValue({
      montantTaxe: montantTaxe,
      montantTTC: montantTTC,
      fraisAcquisitionTTC: fraisAcquisitionTTC,
      fraisGestionTTC: fraisGestionTTC,
      contributionPure: contributionPure,
      montantTaxeParaFiscale: montantTaxeParafiscale,
    });
    this.setState({
      montantTaxe: montantTaxe,
      montantTTC: montantTTC,
      fraisAcquisitionTTC: fraisAcquisitionTTC,
      fraisGestionTTC: fraisGestionTTC,
      contributionPure: contributionPure,
      montantTaxeParaFiscale: montantTaxeParafiscale,
    });
  };
  async getproprties(statut, page, limit, sort, direction) {
    let contratsResponse = await getDecesContrat(
      statut,
      page,
      limit,
      sort,
      direction
    );
    this.setState({
      contrats: [...contratsResponse.data.content],
      totalItems: contratsResponse.data.totalElements,
    });
    console.log("probleme contrats");
    console.log(contratsResponse.data.content);
  }

  async searchContrats(page, limit, searchby, searchfor) {
    let contratResponse = await searchContrat(page, limit, searchby, searchfor);

    if (searchby === CIN_ASSURE || searchby === NOM_ASSURE) {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.numberOfElements,
      });
    } else if (searchby === NUM_CONTRAT) {
      this.setState({
        contrats: [...contratResponse.data.content],
        totalItems: contratResponse.data.totalElements,
      });
    }
  }
  seachChange = (e) => {
    this.setState({ searchfor: e });
  };
  onPaginationChange = (pagenumber, pagesize) => {
    this.state.searchfor === ""
      ? this.getproprties(statuts, pagenumber - 1, 5, NUM_CONTRAT, "desc")
      : this.searchContrats(
          pagenumber - 1,
          5,
          this.state.searchby,
          this.state.searchfor
        );
  };
  selectBefore = (
    <Select
      onChange={(value) => this.setState({ searchby: value })}
      defaultValue={NUM_CONTRAT}
      style={{ width: 150 }}
    >
      <Option value={NUM_CONTRAT}>N° de contrat</Option>
      <Option value={CIN_ASSURE}>CIN</Option>
      <Option value={NOM_ASSURE}>Nom Assuré</Option>
    </Select>
  );
  search = (value) => {
    console.log("searchFor ", value);
    if (value === "") {
      this.setState({ pagenumber: 1, searchfor: value });
      this.getproprties(statuts, 0, 5, NUM_CONTRAT, "desc");
    } else {
      this.setState({ pagenumber: 1, searchfor: value });
      this.searchContrats(
        this.state.pagenumber - 1,
        5,
        this.state.searchby,
        value
      );
    }
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  handleSubmited = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ visible: false });
        let requestModel = {
          datePrelevement: values.datePrelevement,
          montantCotisation: values.montantCotisation,
          montantTTC: values.montantTTC,
          montantTaxe: values.montantTaxe,
          montantAccessoire: values.montantAccessoire,

          fraisAcquisitionTTC: values.fraisAcquisitionTTC,
          fraisGestionTTC: values.fraisGestionTTC,
          contributionPure: values.contributionPure,
          montantTaxeParaFiscale: values.montantTaxeParaFiscale,
          contrat: id,
        };

        ajoutCotisation(requestModel)
          .then((response) => {
            notification.success({
              message: "TAKAFUL",
              description: "L'insertion est bien faite",
            });
            window.location.reload();
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
    });
  };
  handleCanceled = () => {
    this.setState({ visible: false });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
      },
    };

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Entrez le text de recherche"
            addonBefore={this.selectBefore}
            onSearch={(value) => this.search(value)}
            onChange={this.seachChange}
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
            pageSize: 5,
            total: this.state.totalItems,
          }}
          size="small"
          tableLayout="unset"
          scroll={{ x: 1300 }}
        />
        <Modal
          visible={visible}
          title="Veuillez saisir les informations d'une cotisation"
          onOk={this.handleSubmited}
          onCancel={this.handleCanceled}
          afterClose={this.handleClosed}
          style={{ top: 20 }}
          width="1000px"
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
              <Row>
                <Col span={11}>
                  <Form.Item label="Effet Emission">
                    {getFieldDecorator("datePrelevement")(
                      <DatePicker
                        format={dateFormat}
                        style={{ width: "100%" }}
                        className="not-rounded"
                        disabled
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                  <Form.Item label="Montant HT">
                    {getFieldDecorator("montantCotisation")(
                      <InputNumber
                        className="not-rounded"
                        onChange={this.onChangeMontantCotisation}
                        //disabled
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label="Montant Taxe">
                    {getFieldDecorator("montantTaxe")(
                      <InputNumber
                        className="not-rounded"
                        disabled
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                </Col>

                <Col span={11} offset={1}>
                  <Form.Item label="Montant TTC">
                    {getFieldDecorator("montantTTC")(
                      <InputNumber
                        className="not-rounded"
                        disabled
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label="Frais Acquisation">
                    {getFieldDecorator("fraisAcquisitionTTC")(
                      <InputNumber
                        className="not-rounded"
                        disabled
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                  <Form.Item label="Frais Gestion">
                    {getFieldDecorator("fraisGestionTTC")(
                      <InputNumber
                        className="not-rounded"
                        disabled
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label="Contribution Pure">
                    {getFieldDecorator("contributionPure")(
                      <InputNumber
                        className="not-rounded"
                        disabled
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                  <Form.Item label="Montant Accessoire">
                    {getFieldDecorator("montantAccessoire")(
                      <InputNumber
                        className="not-rounded"
                        disabled
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={11}>
                  <Form.Item label="Montant Taxe Parafiscale">
                    {getFieldDecorator("montantTaxeParaFiscale")(
                      <InputNumber
                        className="not-rounded"
                        disabled
                        formatter={currencyFormatter}
                        parser={currencyParser}
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
export default Form.create()(Comptabilite);
