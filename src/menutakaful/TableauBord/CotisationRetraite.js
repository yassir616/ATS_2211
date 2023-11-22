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
  Table
} from "antd";
import React, { Component } from "react";
import {
  getCotisationById,
  getEncaissementById,
  ajoutEncaissement,
  getCompteBancaire
} from "./CotisationAPI";
import { MyContext } from "./ComptabiliteRetraite";
import { currencyFormatter, currencyParser } from "../../util/Helpers";

const { Option } = Select;
let id = "";
let ids = "";
class CotisationRetraite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandIconPosition: "left",
      data: [],
      visible: false,
      visibled: false,
      comptes: [],
      encaissement: []
    };
    this.columns = [
      {
        title: "Numéro quittance",
        dataIndex: "numQuittance",
        key: "numQuittance",
        render: (text, record) => {
          return (
            <span>
              <a href="#top" onClick={() => this.handleChanged(record)}>
                {text}
              </a>
            </span>
          );
        }
      },
      {
        title: "Date Prélèvement",
        dataIndex: "datePrelevement",
        key: "datePrelevement"
      },
      {
        title: "Montant cotisation",
        dataIndex: "montantCotisation",
        key: "montantCotisation"
      },
      {
        title: "Etat cotisation",
        dataIndex: "etatCotisation",
        key: "etatCotisation"
      },
      {
        title: "Type cotisation ",
        dataIndex: "cotisationType",
        key: "cotisationType"
      },
      {
        title: "Montant TTC ",
        dataIndex: "montantTTC",
        key: "montantTtc"
      },
      {
        title: "Contribution Pure ",
        dataIndex: "contributionPure",
        key: "contributionPure"
      },
      {
        title: "Solde ",
        dataIndex: "solde",
        key: "solde"
      },
      {
        title: "Action",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <span>
              {record.etatCotisation === "EMIS" ||
              record.etatCotisation === "PARTIELEMENT_ENCAISSEE" ? (
                <Button
                  type="primary"
                  onClick={() => this.handleChange(record)}
                  size="small"
                  style={{
                    borderRadius: "0px",
                    width: "130px",
                    backgroundColor: "#4ee289",
                    borderColor: "#4ee289",
                    textAlign: "left"
                  }}
                >
                  <Icon type="plus-circle" />
                  Encaissement
                </Button>
              ) : (
                "---"
              )}
            </span>
          );
        }
      }
    ];
    this.columns1 = [
      {
        title: "Date d'encaissement",
        dataIndex: "dateEncaissement",
        key: "datePrelevement"
      },
      {
        title: "N° d'encaissement",
        dataIndex: "numEncaissement",
        key: "numeroEncaissement"
      },
      {
        title: "Montant Encaissé",
        dataIndex: "montantEncaissement",
        key: "montantEncaisse"
      },
      {
        title: "Montant Taxe ",
        dataIndex: "montantTaxe",
        key: "montantTaxe"
      },
      {
        title: "Mode d'encaissement",
        dataIndex: "modeEncaissement",
        key: "modeEncaissement"
      },
      {
        title: "Référence ",
        dataIndex: "numReference",
        key: "reference"
      }
    ];
  }
  handleChange = value => {
    id = value.id;
    this.setState({ visible: true });
  };
  handleChanged = value => {
    this.getAllEncaissement(value.id);
    this.setState({ visibled: true });
  };
  componentDidMount() {
    this.getAllCotisations(ids);
    this.getAllComptes();
  }
  async getAllCotisations(contratId) {
    let response = await getCotisationById(contratId);
    this.setState({
      data: response.data
    });
  }
  async getAllEncaissement(cotisationId) {
    let response = await getEncaissementById(cotisationId);
    this.setState({
      encaissement: response.data
    });
  }
  async getAllComptes() {
    let response = await getCompteBancaire();
    this.setState({
      comptes: response.data.content
    });
  }
  handleSubmited = e => {
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
          cotisation: id
        };
        ajoutEncaissement(requestModel)
          .then(response => {
            notification.success({
              message: "TAKAFUL",
              description: "L'insertion est bien faite"
            });
          })
          .catch(error => {
            notification.error({
              message: "TAKAFUL",
              description:
                error.message ||
                "Sorry! Something went wrong. Please try again!"
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
  handleCancel = () => {
    this.setState({ visibled: false });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, visibled } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 12 }
      }
    };
    return (
      <MyContext.Consumer>
        {context => (
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
                    </Button>
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
                            //SelectOption
                          </Form.Item>
                        </Col>
                        <Col span={11} offset={1}>
                          <Form.Item label="Numéro de compte">
                            {getFieldDecorator("numerocompte")(
                              <Select placeholder="Veuillez selectionner">
                                {this.state.comptes.map(element => {
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
                              <Input className="not-rounded" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={11} offset={1}>
                          <Form.Item label="Reste à payer">
                            {getFieldDecorator("reste")(
                              <InputNumber
                                className="not-rounded"
                                formatter={currencyFormatter}
                                parser={currencyParser}
                              />
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={11}>
                          <Form.Item label="Montant à encaisser ">
                            {getFieldDecorator("montantEncaisser")(
                              <InputNumber
                                className="not-rounded"
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
                  onCancel={this.handleCancel}
                  style={{ top: 20 }}
                  width="1000px"
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
                  <Table
                    bordered
                    rowClassName="editable-row"
                    columns={this.columns1}
                    dataSource={this.state.encaissement}
                    pagination={{
                      onChange: this.onPaginationChange,
                      pageSize: 3,
                      total: this.state.totalItems
                    }}
                  />
                </Modal>
              </div>
            </React.Fragment>
          )
        )}
      </MyContext.Consumer>
    );
  }
}

export default Form.create()(CotisationRetraite);
