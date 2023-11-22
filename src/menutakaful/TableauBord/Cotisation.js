/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  message,
  Modal,
  notification,
  Row,
  Select,
  Table,
  InputNumber,
} from "antd";
import React, { Component } from "react";
import {
  ajoutEncaissement,
  getCompteBancaire,
  getCotisationById,
  getEncaissementById,
  AnnulationCotisation,
} from "./CotisationAPI";

import { MyContext } from "./Comptabilite";
import e from "cors";
import { currencyFormatter, currencyParser } from "../../util/Helpers";
import moment from "moment";
const { Option } = Select;
let id = "";
let ids = "";
function validatePrimeNumber(number, x) {
  if (number <= x) {
    return {
      validateStatus: "success",
      errorMsg: null,
    };
  }
  return {
    validateStatus: "error",
    errorMsg: "Vous avez dépassé le solde restant",
  };
}
class Cotisation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandIconPosition: "left",
      data: [],
      visible: false,
      visibled: false,
      comptes: [],
      show: false,
      encaissement: [],
      cotisation: [],
      cotisationId: "",
      recordCotisation: [],
      number: { value: "" },
      montantAEncaisser: 0,
    };
    this.columns = [
      {
        title: "Numéro quittancee",
        dataIndex: "numQuittance",
        key: "numQuittance",
        render: (text, record) => {
          return (
            <span>
              <a onClick={() => this.handleChanged(record)}>{text}</a>
            </span>
          );
        },
      },
      {
        title: "Date Prélèvement",
        dataIndex: "datePrelevement",
        key: "datePrelevement",
      },
      {
        title: "Date de Creation",
        dataIndex: "creationDate",
        key: "creationDate",
        render: (text, record) =>
          moment(text, "DD-MM-YYYY HH:mm").format("YYYY-MM-DD"),
      },
      {
        title: "Montant cotisation",
        dataIndex: "montantCotisation",
        key: "montantCotisation",
      },
      {
        title: "Etat cotisation",
        dataIndex: "etatCotisation",
        key: "etatCotisation",
      },
      {
        title: "Montant Taxe ",
        dataIndex: "montantTaxe",
        key: "montantTaxe",
      },
      {
        title: "Montant Taxe parafiscale ",
        dataIndex: "montantTaxeParaFiscale",
        key: "montantTaxeParafiscale",
      },
      {
        title: "Montant TTC ",
        dataIndex: "montantTTC",
        key: "montantTtc",
      },
      {
        title: "Frais acquisition TTC ",
        dataIndex: "fraisAcquisitionTTC",
        key: "fraisAcquisitionTTC",
      },
      {
        title: "Frais gestion TTC ",
        dataIndex: "fraisGestionTTC",
        key: "fraisGestionTTC",
      },
      {
        title: "Contribution Pure ",
        dataIndex: "contributionPure",
        key: "contributionPure",
      },
      {
        title: "Solde ",
        dataIndex: "solde",
        key: "solde",
      },
      {
        title: "Action",
        dataIndex: "operation",
        fixed: "right",
        render: (text, record) => {
          return (
            <span>
              {record.etatCotisation == "EMIS" ||
              record.etatCotisation == "PARTIELEMENT_ENCAISSEE" ? (
                <Button
                  type="primary"
                  onClick={() => this.handleChange(record)}
                  size="small"
                  style={{
                    borderRadius: "0px",
                    backgroundColor: "#4ee289",
                    borderColor: "#4ee289",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <Icon type="plus-circle" />
                  Encaissement
                </Button>
              ) : (
                "---"
              )}
              {record.etatCotisation == "EMIS" && (
                <Select placeholder="Séléctionnez..." style={{ width: "100%" }}>
                  <Option
                    value="ANNULER"
                    onClick={() => this.handleRecord(record)}
                  >
                    ANNULER
                  </Option>
                </Select>
              )}
            </span>
          );
        },
      },
    ];
    this.columns1 = [
      {
        title: "Date d'encaissement",
        dataIndex: "dateEncaissement",
        key: "datePrelevement",
      },
      {
        title: "N° d'encaissement",
        dataIndex: "numEncaissement",
        key: "numeroEncaissement",
      },
      {
        title: "Montant Encaissé",
        dataIndex: "montantEncaissement",
        key: "montantEncaisse",
      },
      {
        title: "Montant Taxe ",
        dataIndex: "montantTaxe",
        key: "montantTaxe",
      },
      {
        title: "Mode d'encaissement",
        dataIndex: "modeEncaissement",
        key: "modeEncaissement",
      },
      {
        title: "Référence ",
        dataIndex: "numReference",
        key: "reference",
      },
    ];
  }
  handleRecord = (value) => {
    console.log("record:", value);
    this.props.form.setFieldsValue({
      montantCotisation: value.montantCotisation * -1,
      montantTTC: value.montantTTC * -1,
      montantTaxe: value.montantTaxe * -1,
      montantTaxeParafiscale: value.montantTaxeParaFiscale * -1,
      solde: value.solde * -1,
    });
    value.montantTaxeParaFiscale = value.montantTaxeParaFiscale * -1;
    value.montantCotisation = value.montantCotisation * -1;
    value.montantTTC = value.montantTTC * -1;
    value.montantTaxe = value.montantTaxe * -1;
    value.solde = value.solde * -1;

    this.setState({
      show: true,
      cotisation: value,
      cotisationId: value.id,
    });
  };
  handleChange = (value) => {
    console.log("values encaissement : ", value);
    id = value.id;
    const compteFilter = this.state.comptes.filter(
      (element) => element.pointVente.id == value.contrat.pointVente.id
    );
    console.log("test filter ", compteFilter);
    this.setState({ comptes: compteFilter });
    this.props.form.setFieldsValue({
      emissionGlobale: value.montantTTC,
      reste: value.solde,
    });
    this.setState(
      {
        visible: true,
        recordCotisation: value,
        montantAEncaisser: value.solde,
      },
      () => {}
    );
  };
  handleChanged = (value) => {
    this.getAllEncaissement(value.id);
    this.setState({ visibled: true }, () => {});
  };
  componentDidMount() {
    this.getAllCotisations(ids);
    this.getAllComptes();
  }
  handleOK = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ show: false });
        console.log("ok value:", values);

        AnnulationCotisation(this.state.cotisationId, this.state.cotisation)
          .then((response) => {
            notification.success({
              message: "TAKAFUL",
              description: "L'annulation est bien faite",
            });
          })
          .catch((error) => {
            notification.error({
              message: "TAKAFUL",
              description:
                error.message || "Désolé! Quelque chose est mal passé!",
            });
          });
      }
    });
  };

  handleOnClose = () => {
    this.setState({ show: false });
  };
  async getAllCotisations(contratId) {
    let response = await getCotisationById(contratId);
    this.setState({
      data: response.data,
    });
  }
  async getAllEncaissement(cotisationId) {
    let response = await getEncaissementById(cotisationId);
    this.setState({
      encaissement: response.data,
    });
  }
  async getAllComptes() {
    let response = await getCompteBancaire();
    this.setState({
      comptes: response.data.content,
    });
    console.log("test compte bc");
    console.log(response.data.content);
  }
  handleSubmited = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ visible: false });
        let requestModel = {
          dateEncaissement: values.dateEncaissement,
          modeEncaissement: values.modeEncaissement,
          montantEncaissement: values.montantEncaisser,
          montantTaxe: values.montantTaxe,
          numReference: values.numReference,
          compteBancaire: values.numerocompte,
          accessoire: values.montantAccessoire,
          montantQuittance: values.emissionGlobale,
          montantTaxeParafiscale: values.montantTaxeParafiscale,
          montantEmission: values.montantEmission,
          cotisation: id,
        };
        console.log("request:", requestModel);
        ajoutEncaissement(requestModel)
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
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleCanceled = () => {
    this.setState({ visibled: false });
  };

  handleNumberChange = (value) => {
    this.setState({
      number: {
        ...validatePrimeNumber(value, this.state.recordCotisation.solde),
        value,
      },
    });
    if (value <= this.state.recordCotisation.solde) {
      let pourcentage = (
        (value * 100) /
        this.state.recordCotisation.montantTTC
      ).toFixed(2);

      let montantAccessoireEncaissement = (
        (pourcentage * this.state.recordCotisation.montantAccessoire) /
        100
      ).toFixed(2);

      let montantTaxeEncaissement = (
        (pourcentage * this.state.recordCotisation.montantTaxe) /
        100
      ).toFixed(2);

      let montantTaxeParafiscaleEncaissement = (
        (pourcentage * this.state.recordCotisation.montantTaxeParaFiscale) /
        100
      ).toFixed(2);

      let part1 = (
        (this.state.recordCotisation.montantTTC * pourcentage) /
        100
      ).toFixed(2);
      let part2 =
        parseFloat(montantAccessoireEncaissement) +
        parseFloat(montantTaxeEncaissement);
      console.log("part1:", part1);

      let montantEmissionEncaissement = parseFloat(part1) - parseFloat(part2);
      this.props.form.setFieldsValue({
        montantAccessoire: montantAccessoireEncaissement,
        montantTaxe: montantTaxeEncaissement,
        montantTaxeParafiscale: montantTaxeParafiscaleEncaissement,
        montantEmission: montantEmissionEncaissement.toFixed(2),
        reste: this.state.montantAEncaisser - value,
      });
    } else {
      this.props.form.setFieldsValue({
        montantAccessoire: "",
        montantTaxe: "",
        montantTaxeParafiscale: "",
        montantEmission: "",
        reste: 0,
      });
    }
  };
  onChangeMontantEncaisser = (e) => {};

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, visibled, show } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 12 },
      },
    };
    return (
      <MyContext.Consumer>
        {(context) => (
          (ids = context.state.id),
          (
            <React.Fragment>
              <div>
                <br />
                <Table
                  rowClassName="editable-row"
                  columns={this.columns}
                  dataSource={this.state.data}
                  pagination={{ defaultCurrent: 1, defaultPageSize: 5 }}
                  size="small"
                  scroll={{ x: 800 }}
                />
                <Modal
                  visible={visible}
                  title="Veuillez saisir les informations d'une cotisationn"
                  onOk={this.handleSubmited}
                  onCancel={this.handleCanceled}
                  afterClose={this.handleClosed}
                  style={{ top: 20 }}
                  width="1000px"
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
                          <Form.Item label="Mode d'encaissement">
                            {getFieldDecorator("modeEncaissement")(
                              <Select placeholder="Veuillez selectionner">
                                <Option value="Chèque" label="Chèque">
                                  Chèque
                                </Option>
                                <Option value="Virement" label="Virement">
                                  Virement
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={11} offset={1}>
                          <Form.Item label="Numéro de compte">
                            {getFieldDecorator("numerocompte", {
                              rules: [
                                {
                                  required: true,
                                  message: "Champ Obligatoire",
                                },
                              ],
                            })(
                              <Select placeholder="Veuillez selectionner">
                                {this.state.comptes.map((element) => {
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
                      </Row>
                      <Row>
                        <Col span={11}>
                          <Form.Item label="N° reference">
                            {getFieldDecorator("numReference")(
                              <Input className="not-rounded" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={11} offset={1}>
                          <Form.Item label="Date d'encaissement">
                            {getFieldDecorator("dateEncaissement")(
                              <DatePicker
                                style={{ width: "100%" }}
                                className="not-rounded"
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={11}>
                          <Form.Item label="Emission globale">
                            {getFieldDecorator("emissionGlobale")(
                              <Input className="not-rounded" disabled />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={11} offset={1}>
                          <Form.Item label="Reste à payer">
                            {getFieldDecorator("reste")(
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
                          <Form.Item
                            label="Montant à encaisser "
                            validateStatus={this.state.number.validateStatus}
                            help={this.state.number.errorMsg}
                          >
                            {getFieldDecorator("montantEncaisser")(
                              <InputNumber
                                className="not-rounded"
                                max={this.state.recordCotisation.solde}
                                value={this.state.number.value}
                                onChange={this.handleNumberChange}
                                formatter={currencyFormatter}
                                parser={currencyParser}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={11} offset={1}>
                          <Form.Item label="Montant emission">
                            {getFieldDecorator("montantEmission")(
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
                          <Form.Item label="Montant taxe ">
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
                          <Form.Item label="Montant accessoire ">
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
                          <Form.Item label="Montant taxe parafiscale ">
                            {getFieldDecorator("montantTaxeParafiscale")(
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
                <Modal
                  visible={visibled}
                  title="Détails de l'encaissement"
                  onCancel={this.handleCanceled}
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
                  ]}
                >
                  <Table
                    bordered
                    rowClassName="editable-row"
                    columns={this.columns1}
                    dataSource={this.state.encaissement}
                    pagination={{
                      onChange: this.onPaginationChange,
                      pageSize: 3,
                      total: this.state.totalItems,
                    }}
                  />
                </Modal>
                <Modal
                  visible={show}
                  title="Annulation de la cotisation"
                  onOk={this.handleOK}
                  onCancel={this.handleOnClose}
                  style={{ top: 20 }}
                  width="1000px"
                  footer={[
                    <Button
                      key="back"
                      onClick={this.handleOnClose}
                      className="not-rounded"
                    >
                      Fermer
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      onClick={this.handleOK}
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
                          <Form.Item label="Montant de cotisation">
                            {getFieldDecorator("montantCotisation")(
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
                        <Col span={12} offset={1}>
                          <Form.Item label="Montant Taxe Parafiscale">
                            {getFieldDecorator("montantTaxeParafiscale")(
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
                          <Form.Item label="Solde">
                            {getFieldDecorator("solde")(
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
            </React.Fragment>
          )
        )}
      </MyContext.Consumer>
    );
  }
}
export default Form.create()(Cotisation);
