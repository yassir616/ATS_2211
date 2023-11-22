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
  Modal,
  notification,
  Select,
  Table
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import {
  getSinistreMrb,
  recupereDataSinistreMrb,
  updateSinistreMrb
} from "../ProduitMrb/ProduitMRBAPI";
import { deleteSinistre } from "../../GestionContrats/DetailsTabs/SinistreAPI.js";

import { MyContext } from "../ConsultationsContratsMrb";
const { Option } = Select;
const { TextArea } = Input;
var id = "";
var id_sinistre = "";
var statut = "";
class SinistreMrb extends Component {
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
      dataSinistre: [],
      sinistreInfo: {}
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
    this.getSinistresMrb(id);
  }

  async recupereDataOfSinistreMrb(value) {
    let response = await recupereDataSinistreMrb(value);

    console.log("response", response.data);
  }

  handleChangeed = value => {
    statut = value;
    if (value === "A_signer") {
      this.setState({
        visible: true
      });
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

  async updatePrestationSinistres(body, idPrestation) {
    let response = await updateSinistreMrb(body, idPrestation);
    console.log("body", body);
    let dataSource = [];
    dataSource.push(response.data);
    this.setState({
      data: dataSource
    });
    this.setState({
      dataSinistre: this.state.data
    });
    let pointVente = {};
    let garanties = {};
    if (this.state.dataSinistre[0].contratMrb.pointVente !== null) {
      pointVente = {
        codeCaps: this.state.dataSinistre[0].contratMrb.pointVente.codeCaps,
        codeSite: this.state.dataSinistre[0].contratMrb.pointVente.codeInterne,
        nature: this.state.dataSinistre[0].contratMrb.pointVente.typePointVente
          .libelle
      };
    }
    //Garanties
    this.state.dataSinistre[0].contratMrb.contratGarantie.forEach(element => {
      garanties = {
        ganranties: {
          capital: element.capital,
          franchise: element.franchise,
          libelle: element.garantieMrb.libelle
        }
      };
    });
    let dataRecuperee1 = {};
    dataRecuperee1 = {
      ...garanties,
      //Intermediaire
      ...pointVente,
      //if victime===assure
      nomVictime: this.state.dataSinistre[0].contratMrb.assure.nom,
      prenomVictime: this.state.dataSinistre[0].contratMrb.assure.prenom,
      dateNaissanceVictime: this.state.dataSinistre[0].contratMrb.assure
        .dateNaissanceVictime,
      cinVictime: this.state.dataSinistre[0].contratMrb.assure.cin,
      //if societaire===souscripteur
      numSocietaire: this.state.dataSinistre[0].contratMrb.souscripteur
        .compteTakaful,
      cinSociataire: this.state.dataSinistre[0].contratMrb.souscripteur.cin,
      villeSocietaire: this.state.dataSinistre[0].contratMrb.souscripteur
        .adressVille,
      adresse:
        this.state.dataSinistre[0].contratMrb.souscripteur.adressNumero +
        " " +
        this.state.dataSinistre[0].contratMrb.souscripteur.adressVois +
        " " +
        this.state.dataSinistre[0].contratMrb.souscripteur.adressVille,
      telephoneSocietaire: this.state.dataSinistre[0].contratMrb.souscripteur
        .numeroDeTelephone,

      //effet echeance police
      periodicite: this.state.dataSinistre[0].contratMrb.periodicite.libelle,
      dateEffet: moment(this.state.dataSinistre[0].contratMrb.dateEffet).format(
        "DD/MM/YYYY"
      ),
      dateEcheance: moment(
        this.state.dataSinistre[0].contratMrb.dateEcheance
      ).format("DD/MM/YYYY"),

      //police historique
      police: this.state.dataSinistre[0].contratMrb.numeroContrat,

      //info sinistre
      dateSurvenance: moment(body.dateSurvenance).format("DD/MM/YYYY"),

      dateDeclarationSinistre: moment(body.dateDeclarationSinistre).format(
        "DD/MM/YYYY"
      ),
      sinistreDeclare: body.sinistreDeclare,
      documentDeclaration: this.state.dataSinistre[0].documentDeclaration,
      documentConstatation: body.documentConstatation,
      numeroDocumentConstatation: this.state.dataSinistre[0]
        .numeroDocumentConstatation,
      dateReceptionDoc: moment(body.dateReceptionDoc).format("DD/MM/YYYY"),

      entiteReception: this.state.dataSinistre[0].entiteReception,
      natureSinistre: this.state.dataSinistre[0].natureSinistre,
      referenceIntermedaire: body.referenceIntermediaire,
      villeSurvenance: this.state.dataSinistre[0].villeSurvenance,
      province: this.state.dataSinistre[0].province,
      commune: this.state.dataSinistre[0].commune,
      lieuSinistre: this.state.dataSinistre[0].lieuSinistre,
      cause: this.state.dataSinistre[0].cause,
      circonstance: this.state.dataSinistre[0].circonstance,
      descriptionCauseCirconstance: body.description
    };
    this.setState({
      sinistreInfo: { ...dataRecuperee1 }
    });

    this.recupereDataOfSinistreMrb(this.state.sinistreInfo);
  }

  getSinistresMrb = idContrat => {
    getSinistreMrb(idContrat).then(response => {
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
    this.setState({
      dataSinistre: value
    });
    this.setState({ add: true, keyRecord: value.id }, () => {
      this.props.form.setFieldsValue({
        dateCreation: moment(value.creationDate, "DD/MM/YYYY "),
        numeroSinistre: value.numeroSinistre,
        dateDeclarationSinistre: moment(
          value.dateDeclarationSinistre,
          "DD/MM/YYYY"
        ),
        dateSurvenance: moment(value.dateSurvenance, "DD/MM/YYYY"),
        sinistreDeclare: value.sinistreDeclare,
        documentDeclaration: value.documentDeclaration,
        documentConstatation: value.documentConstatation,
        numeroDocumentConstatation: value.numeroDocumentConstatation,
        circonstance: value.circonstance,
        entiteReception: value.entiteReception,
        referenceIntermediaire: value.referenceIntermediaire,
        villeSurvenance: value.villeSurvenance,
        province: value.province,
        commune: value.commune,
        cause: value.cause,
        lieuSinistre: value.lieuSinistre,
        description: value.description,
        typeSinistre: value.natureSinistre
      });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("values", values);
      if (!err) {
        let request = {
          dateSurvenance: values.dateSurvenance,
          dateDeclarationSinistre: values.dateDeclarationSinistre,
          numeroSinistre: values.numeroSinistre,
          description: values.description,
          lieuSinistre: values.lieuSinistre,
          sinistreDeclare: values.sinistreDeclare,
          natureSinistre: values.typeSinistre,
          documentDeclaration: values.documentDeclaration,
          documentConstatation: values.documentConstatation,
          numeroDocumentConstatation: values.numeroDocumentConstatation,
          dateReceptionDoc: values.dateReceptionDoc,
          entiteReception: values.entiteReception,
          referenceIntermediaire: values.referenceIntermediaire,
          villeSurvenance: values.villeSurvenance,
          province: values.province,
          commune: values.commune,
          cause: values.cause,
          circonstance: values.circonstance,
          remplie: true
        };
        this.setState({
          dataSinistre: { ...this.state.dataSinistre },
          values
        });
        this.updatePrestationSinistres(request, this.state.keyRecord);
        console.log("datasinistre", this.state.dataSinistre);

        this.setState({ remplie: true });
      }
    });
  };
  onChangeDateRecDocument = value => {
    console.log(value);
    this.setState({
      dateReceptionDoc: value
    });
  };
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
    const formItemLayout1 = {
      labelCol: {
        span: 10
      },
      wrapperCol: {
        span: 14
      }
    };
    const { getFieldDecorator } = this.props.form;
    const { visibled } = this.state;
    return (
      <MyContext.Consumer>
        {context => (
          (id = context.state.id),
          (
            <React.Fragment>
              <div>
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
                <Table
                  rowClassName="editable-row"
                  columns={this.columns1}
                  dataSource={this.state.data}
                  pagination={false}
                />
                {this.state.add ? (
                  <div>
                    <Col span={24}>
                      <Divider orientation="left">Données sinistre MRB</Divider>
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
                          <Form.Item
                            label="Sinistre Déclaré"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("sinistreDeclare")(
                              <Select placeholder="Selectionnez ...">
                                <Option value="true" label="true">
                                  true
                                </Option>
                                <Option value="false" label="NON">
                                  NON
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                          <Form.Item label="Sinistre" {...formItemLayout}>
                            {getFieldDecorator("sinistre")(
                              <Select placeholder="Selectionnez ...">
                                <Option value="Document 1" label="Document 11">
                                  Document 11
                                </Option>
                                <Option value="Document 2" label="Document 22">
                                  Document 22
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Document de Déclaration"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("documentDeclaration")(
                              <Select placeholder="Selectionnez ...">
                                <Option value="Document 1" label="Document 1">
                                  Document 1
                                </Option>
                                <Option value="Document 2" label="Document 2">
                                  Document 2
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Document de Constatation"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("documentConstatation")(
                              <Select placeholder="Selectionnez ...">
                                <Option value="Document 1" label="Document 1">
                                  Document 1
                                </Option>
                                <Option value="Document 2" label="Document 2">
                                  Document 2
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                          <Form.Item
                            label="N° Document Constatation"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("numeroDocumentConstatation")(
                              <Input className="not-rounded" />
                            )}
                          </Form.Item>
                          <Form.Item label="Circonstances" {...formItemLayout}>
                            {getFieldDecorator("circonstance")(
                              <Select placeholder="Selectionnez ...">
                                <Option
                                  value="Circonstance 1"
                                  label="Circonstance 1"
                                >
                                  Circonstance 1
                                </Option>
                                <Option
                                  value="Circonstance 2"
                                  label="Circonstance 2"
                                >
                                  Circonstance 2
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
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
                          <Form.Item
                            label="Date de Réception Doc"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("dateReceptionDoc")(
                              <DatePicker
                                format="DD-MM-YYYY"
                                style={{ width: "100%" }}
                                onChange={this.onChangeDateRecDocument}
                              />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Entité Recéption Doc"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("entiteReception")(
                              <Input className="not-rounded" />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Nature sinistre"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("typeSinistre", {
                              initialValue: "Vol"
                            })(
                              <Select
                                placeholder="Séléctionnez "
                                style={{ width: "100%" }}
                              >
                                <Option value="Incendie" label="Incendie">
                                  Incendie
                                </Option>
                                <Option value="Vol" label="Vol">
                                  Vol
                                </Option>
                                <Option
                                  value="Bris des Glaces"
                                  label="Bris des Glaces"
                                >
                                  Bris des Glaces
                                </Option>
                                <Option
                                  value="Dégâts des Eaux"
                                  label="Dégâts des Eaux"
                                >
                                  Dégâts des Eaux
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Référence Intermédiaire"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("referenceIntermediaire")(
                              <Input className="not-rounded" />
                            )}
                          </Form.Item>
                          <Form.Item
                            label="Ville Survenance"
                            {...formItemLayout}
                          >
                            {getFieldDecorator("villeSurvenance")(
                              <Input className="not-rounded" />
                            )}
                          </Form.Item>
                          <Form.Item label="Province" {...formItemLayout}>
                            {getFieldDecorator("province")(
                              <Input className="not-rounded" />
                            )}
                          </Form.Item>
                          <Form.Item label="Commune" {...formItemLayout}>
                            {getFieldDecorator("commune")(
                              <Input className="not-rounded" />
                            )}
                          </Form.Item>
                          <Form.Item label="Cause" {...formItemLayout}>
                            {getFieldDecorator("cause")(
                              <Select placeholder="Selectionnez ...">
                                <Option value="Cause 1" label="Cause 1">
                                  Cause 1
                                </Option>
                                <Option value="Cause 2" label="Cause 2">
                                  Cause 2
                                </Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item label="Lieu Sinistre" {...formItemLayout1}>
                            {getFieldDecorator("lieuSinistre")(
                              <TextArea
                                placeholder="Saisir lieu sinistre"
                                autoSize={{ minRows: 2, maxRows: 6 }}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={16}>
                          <Form.Item
                            label="Description des causes et circonstances"
                            {...formItemLayout1}
                          >
                            {getFieldDecorator("description")(
                              <TextArea
                                placeholder="Saisir une description"
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
          )
        )}
      </MyContext.Consumer>
    );
  }
}
export default Form.create()(SinistreMrb);
