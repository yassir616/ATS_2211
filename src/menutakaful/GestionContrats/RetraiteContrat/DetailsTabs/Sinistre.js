/* eslint-disable react/prop-types */
import "./Sinistre.css";
import "antd/dist/antd.css";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Modal,
  notification,
  Radio,
  Select,
  Table
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import {
  getSinistre,
  setStatut,
  deleteSinistre
} from "../../DetailsTabs/SinistreAPI";
import { updatePrestationSinistre } from "../../../Parametrage/TypePrestation/PrestationAPI";
import {
  getExclusion,
  getPieceJoint
} from "../../../EchangeFichiersInformatiques/EchangeFileAPI";
import { MyContext } from "../ConsultRetraiteContrat/ConsultRetraiteContrat";
import { currencyFormatter, currencyParser } from "../../../../util/Helpers";

const { Option } = Select;
const { TextArea } = Input;
var id = "";
var id_sinistre = "";
var statut = "";
var beneficiaire = {};
var famille = "Deces";
class Sinistre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandIconPosition: "left",
      data: [],
      add: false,
      remplie: "",
      visible: false,
      visibled: false,
      exclusions: [],
      pieceJointe: [],
      keyRecord: "",
      agenceBancaire: true
    };
    this.columns = [
      {
        title: "Numéro de sinistre",
        dataIndex: "numeroSinistre",
        key: "numeroSinistre",
        render: (text, record) => {
          return (
            <span>
              <a
                href="#top"
                type="primary"
                onClick={() => this.handleChange(record)}
                size="small"
                style={{ borderRadius: "0px" }}
              >
                {text}
              </a>
            </span>
          );
        }
      },
      {
        title: "Date de survenance",
        dataIndex: "dateSurvenance",
        key: "dateServenance"
      },
      {
        title: "date déclaration sinistre",
        dataIndex: "dateDeclarationSinistre",
        key: "dateDeclarationSinistre"
      },
      {
        title: "Statut",
        dataIndex: "status",
        render: (text, record) => {
          return (
            <span>
              <Select
                placeholder="Please select"
                onChange={this.handleChangeed}
                style={{ width: "100%" }}
                defaultValue={text}
              >
                <Option
                  value="EN_COURS"
                  onClick={() => this.handleRecord(record)}
                >
                  EN COURS
                </Option>
                <Option
                  value="A_signer"
                  onClick={() => this.handleRecord(record)}
                >
                  À SIGNER
                </Option>
                <Option
                  value="ANNULER"
                  onClick={() => this.handleRecord(record)}
                >
                  ANNULER
                </Option>
              </Select>
            </span>
          );
        }
      }
    ];
    this.columns1 = [
      {
        title: "Numéro de sinistre",
        dataIndex: "numeroSinistre",
        key: "numeroSinistre",
        render: (text, record) => {
          return (
            <span>
              <a
                href="#top"
                type="primary"
                onClick={() => this.handleChange(record)}
                size="small"
                style={{ borderRadius: "0px" }}
              >
                {text}
              </a>
            </span>
          );
        }
      },
      {
        title: "Date de survenance",
        dataIndex: "dateSurvenance",
        key: "dateServenance"
      },
      {
        title: "date déclaration sinistre",
        dataIndex: "dateDeclarationSinistre",
        key: "dateDeclarationSinistre"
      },
      {
        title: "Statut",
        dataIndex: "status",
        key: "statut"
      }
    ];
  }

  componentDidMount() {
    this.getSinistres(id);
    this.getAllExclusion(famille);
    this.getAllPiece();
  }

  onChanged = e => {
    this.setState({
      agenceBancaire: e.target.value
    });
  };

  handleChangeed = value => {
    statut = value;
    if (value === "A_signer") {
      this.setState({
        visible: true
      });
    } else if (value === "EN_COURS") {
      let request = { motif: "" };
      this.setStatuts(id_sinistre, value, request);
    } else if (value === "ANNULER") {
      this.setState({
        visibled: true
      });
    }
  };

  handleOk = () => {
    let request = { motif: "" };
    this.setStatuts(id_sinistre, statut, request);
    this.setState({ visible: false });
  };

  handleSubmited = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let request = { motif: values.motif };
        this.setStatuts(id_sinistre, statut, request);
        this.setState({ visibled: false });
      }
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  async updatePrestationSinistres(body, id_prestation) {
    let response = await updatePrestationSinistre(body, id_prestation);
    let dataSource = [];
    dataSource.push(response.data);
    this.setState({
      data: dataSource
    });
  }

  async setStatuts(idSinistre, statuts, model) {
    await setStatut(idSinistre, statuts, model);
  }

  async getAllExclusion(exclusionFamille) {
    let response = await getExclusion(exclusionFamille);
    this.setState({
      exclusions: response.data.content
    });
  }

  getSinistres = idContrat => {
    getSinistre(idContrat).then(response => {
      let newDataList = [];
      response.data.forEach(element => {
        let key = { key: element.id };
        element = { ...element, ...key };
        newDataList.push(element);
      });
      this.setState({ data: newDataList });
      if (this.state.data[0] === undefined) {
        //instruction to do
      } else {
        this.setState({ remplie: this.state.data[0].status });
      }
    });
  };

  async deletePrestationSinistre(idPrestation) {
    try {
      let response = await deleteSinistre(idPrestation);
      if (response.status === 200) {
        notification.success({
          message: "Sinistre annulé !"
        });
      }
    } catch (err) {
      notification.error({
        message: "Takaful",
        description:
          err.message || "Désolé! Un problème est survenu. Veuillez réessayer!"
      });
    }
  }

  handleRecord = value => {
    id_sinistre = value.id;
  };

  handleChange = value => {
    this.setState({ add: true, keyRecord: value.id }, () => {
      var dateDeclaration = new Date(
        moment(value.dateDeclarationSinistre, "DD/MM/YYYY ")
      );
      var dateSurvenance = new Date(
        moment(value.dateSurvenance, "DD/MM/YYYY ")
      );
      var dateApres = new Date(moment(value.creationDate, "DD/MM/YYYY "));
      var diffDeclaration = dateApres.getTime() - dateDeclaration.getTime();
      var dureeDeclaration = (diffDeclaration / (1000 * 60 * 60 * 24)).toFixed(
        0
      );
      var diffSurvenance = dateApres.getTime() - dateSurvenance.getTime();
      var dureeSurvenance = (diffSurvenance / (1000 * 60 * 60 * 24)).toFixed(0);
      this.props.form.setFieldsValue({
        dateCreation: moment(value.creationDate, "DD/MM/YYYY "),
        numeroSinistre: value.numeroSinistre,
        dateDeclarationSinistre: moment(
          value.dateDeclarationSinistre,
          "DD/MM/YYYY"
        ),
        dateSurvenance: moment(value.dateSurvenance, "DD/MM/YYYY"),
        dureeDeclaration: dureeDeclaration,
        dureeSurvenance: dureeSurvenance,
        commentaire: value.commentaire,
        crd: value.crd,
        montantRegler: value.montantRegler,
        typeSinistre: value.natureSinistre,
        nbrEcheanceImpayees: value.nbrEcheanceImpaye,
        numeroCompte: value.numeroCompte,
        reglementPartiel: value.reglementPartiel,
        tauxInvalidite: value.tauxInvalidite,
        modeReglement: value.modeReglement,
        beneficiaire: beneficiaire.id
      });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let request = {
          dateSurvenance: values.dateSurvenance,
          dateDeclarationSinistre: values.dateDeclarationSinistre,
          dureeDeclaration: values.dureeDeclaration,
          dureeSurvenance: values.dureeSurvenance,
          commentaire: values.commentaire,
          crd: values.crd,
          montantRegler: values.montantRegler,
          natureSinistre: values.typeSinistre,
          nbrEcheanceImpaye: values.nbrEcheanceImpayees,
          numeroCompte: values.numeroCompte,
          reglementPartiel: values.reglementPartiel,
          tauxInvalidite: values.tauxInvalidite,
          modeReglement: values.modeReglement,
          exclusion: values.exclusion,
          numeroSinistre: values.numeroSinistre,
          beneficiaireAgenceBancaire: this.state.agenceBancaire,
          pointVente: values.beneficiaire,
          remplie: true
        };
        this.updatePrestationSinistres(request, this.state.keyRecord);
        this.setState({ remplie: true });
      }
    });
  };

  async getAllPiece() {
    let response = await getPieceJoint();
    this.setState({
      pieceJointe: response.data.content
    });
  }

  handleDelete = key => {
    this.deletePrestationSinistre(key);
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.key !== key) });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        span: 11
      },
      wrapperCol: {
        span: 12
      }
    };
    const { getFieldDecorator } = this.props.form;
    const { visible, visibled } = this.state;

    return (
      <MyContext.Consumer>
        {context => (
          <React.Fragment>
            <div>
              <Modal
                visible={visible}
                title="Confirmation"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                  <Button key="back" onClick={this.handleCancel}>
                    Non
                  </Button>,
                  <Button key="submit" type="primary" onClick={this.handleOk}>
                    Oui
                  </Button>
                ]}
              >
                <p>Étes-vous sûre de changer ce statut ?</p>
              </Modal>
              <Modal
                visible={visibled}
                title="Motif d'annulation"
                onOk={this.handleSubmited}
                onCancel={this.handleCancel}
                width="600px"
                footer={[
                  <Button key="back" onClick={this.handleCancel}>
                    Fermer
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    onClick={this.handleSubmited}
                  >
                    Valider
                  </Button>
                ]}
              >
                <Form>
                  <Form.Item label="Le motif ">
                    {getFieldDecorator("motif", {
                      rules: [{ message: "Champs Obligatoire!" }]
                    })(<TextArea rows={2} />)}
                  </Form.Item>
                </Form>
              </Modal>
              {this.state.remplie === "A_SIGNER" ||
              this.state.remplie === "EN_COURS" ? (
                <Table
                  rowClassName="editable-row"
                  columns={this.columns}
                  dataSource={this.state.data}
                  pagination={false}
                />
              ) : (
                <Table
                  rowClassName="editable-row"
                  columns={this.columns1}
                  dataSource={this.state.data}
                  pagination={false}
                />
              )}
              {this.state.add ? (
                <div>
                  <Col span={24}>
                    <Divider orientation="left">Données sinistre</Divider>
                  </Col>
                  <Col span={24}>
                    <Form onSubmit={this.handleSubmit}>
                      <Col span={12}>
                        <Form.Item label="Date création" {...formItemLayout}>
                          {getFieldDecorator("dateCreation")(
                            <DatePicker
                              format="DD-MM-YYYY"
                              style={{ width: "100%" }}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="N° de sinistre" {...formItemLayout}>
                          {getFieldDecorator("numeroSinistre")(
                            <Input className="not-rounded" />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Date déclaration sinistre"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("dateDeclarationSinistre")(
                            <DatePicker
                              format="DD-MM-YYYY"
                              style={{ width: "100%" }}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="Exclusion" {...formItemLayout}>
                          {getFieldDecorator("exclusion")(
                            <Select placeholder="Selectionnez ...">
                              {this.state.exclusions.map(element => {
                                return (
                                  <Option
                                    key={element.id}
                                    value={element.id}
                                    label={element.exclusion}
                                  >
                                    {element.exclusion}
                                  </Option>
                                );
                              })}
                            </Select>
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Durée avant survenance"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("dureeSurvenance")(
                            <InputNumber
                              className="not-rounded"
                              formatter={currencyFormatter}
                              parser={currencyParser}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="Montant à régler" {...formItemLayout}>
                          {getFieldDecorator("montantRegler")(
                            <InputNumber
                              placeholder="0.00 "
                              className="not-rounded"
                              formatter={currencyFormatter}
                              parser={currencyParser}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Taux d'invalidité"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("tauxInvalidite")(
                            <InputNumber
                              placeholder="0.00 "
                              className="not-rounded"
                              formatter={currencyFormatter}
                              parser={currencyParser}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Réglement partiel"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("reglementPartiel", {
                            initialValue: "Non"
                          })(
                            <Select placeholder="Séléctionnez ">
                              <Option value="Oui" label="oui">
                                Oui
                              </Option>
                              <Option value="Non" label="non">
                                Non
                              </Option>
                            </Select>
                          )}
                        </Form.Item>
                        <Form.Item label="Bénéficiaire" {...formItemLayout}>
                          {getFieldDecorator("beneficiaire")(
                            <Select placeholder="Selectionnez ...">
                              <Option
                                value={beneficiaire.id}
                                label={beneficiaire.libelle}
                              >
                                {beneficiaire.libelle}
                              </Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Type de sinistre" {...formItemLayout}>
                          {getFieldDecorator("typeSinistre", {
                            initialValue: "Décès"
                          })(
                            <Select placeholder="Séléctionnez ">
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

                        <Form.Item
                          label="Date de survenanve sinistre"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("dateSurvenance")(
                            <DatePicker
                              format="DD-MM-YYYY"
                              style={{ width: "100%" }}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="Cause sinistre" {...formItemLayout}>
                          {getFieldDecorator("causeSinistre")(
                            <Input className="not-rounded" />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Durée avant déclaration"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("dureeDeclaration")(
                            <InputNumber
                              className="not-rounded"
                              formatter={currencyFormatter}
                              parser={currencyParser}
                            />
                          )}
                        </Form.Item>
                        <Form.Item label="CRD" {...formItemLayout}>
                          {getFieldDecorator("crd")(
                            <InputNumber
                              placeholder="0.00 "
                              className="not-rounded"
                              formatter={currencyFormatter}
                              parser={currencyParser}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Nombre d'écheances impayées"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("nbrEcheanceImpayees")(
                            <InputNumber
                              className="not-rounded"
                              formatter={currencyFormatter}
                              parser={currencyParser}
                            />
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Mode de réglement"
                          {...formItemLayout}
                        >
                          {getFieldDecorator("modeReglement", {
                            initialValue: "Virement"
                          })(
                            <Select placeholder="Séléctionnez ">
                              <Option value="Virement" label="virement">
                                Virement
                              </Option>
                              <Option value="Chèque" label="cheque">
                                Chéque
                              </Option>
                            </Select>
                          )}
                        </Form.Item>
                        <Form.Item label="N° Compte" {...formItemLayout}>
                          {getFieldDecorator("numeroCompte")(
                            <Input className="not-rounded" />
                          )}
                        </Form.Item>
                        <Form.Item label="Agence bancaire" {...formItemLayout}>
                          {getFieldDecorator("agenceBancaire", {
                            valuePropName: "unchecked",
                            initialValue: false
                          })(
                            <Radio.Group
                              buttonStyle="solid"
                              defaultValue={true}
                              onChange={this.onChanged}
                            >
                              <Radio.Button value={true}>Oui</Radio.Button>
                              <Radio.Button value={false}>Non</Radio.Button>
                            </Radio.Group>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Divider orientation="left">
                          Pièces justificatives
                        </Divider>
                      </Col>
                      <table id="customers">
                        <tr>
                          <th>Libelle</th>
                          <th>A fournir</th>
                          <th>O/F</th>
                          <th>Reçu</th>
                          <th>Date réception</th>
                        </tr>
                        {this.state.pieceJointe.map(element => {
                          return (
                            <tr key={element.id}>
                              <td>
                                <Form.Item>
                                  {" "}
                                  {getFieldDecorator("libelle")(
                                    <label>{element.libelle}</label>
                                  )}
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item>
                                  {" "}
                                  {getFieldDecorator("fournir")(<Checkbox />)}
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item>
                                  {" "}
                                  {getFieldDecorator("o/f")(<label></label>)}
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item>
                                  {" "}
                                  {getFieldDecorator("reçu")(<Checkbox />)}
                                </Form.Item>
                              </td>
                              <td>
                                <Form.Item>
                                  {" "}
                                  {getFieldDecorator("dateReception")(
                                    <DatePicker
                                      format="DD-MM-YYYY"
                                      style={{ width: "100%" }}
                                    />
                                  )}
                                </Form.Item>
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                      <Col span={14}>
                        <Form.Item label="Commentaire">
                          {getFieldDecorator("commentaire")(
                            <TextArea
                              placeholder="Commentaire"
                              autoSize={{ minRows: 2, maxRows: 6 }}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={4} offset={21}>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            className="not-rounded"
                          >
                            <Icon type="save" />
                            Enregistrer
                          </Button>
                        </Form.Item>
                      </Col>
                    </Form>
                  </Col>
                </div>
              ) : null}
            </div>
          </React.Fragment>
        )}
      </MyContext.Consumer>
    );
  }
}

export default Form.create()(Sinistre);
