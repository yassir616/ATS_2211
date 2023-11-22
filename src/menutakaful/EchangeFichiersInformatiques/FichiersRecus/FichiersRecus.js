import "antd/dist/antd.css";

import React, { Component } from "react";

import { Col, Form, Row, Select, DatePicker, Button, Table } from "antd";
import { formatDateToFormatTwo } from "../../../util/Helpers";
import { getAllPartenaire } from "../../Parametrage/partenaire/PartenaireAPI";
import { searchFlux } from "../EchangeFileAPI";

const { Option } = Select;
const dateFormat = "DD-MM-YYYY";
const columns = [
  {
    title: "Nom de Fichier",
    dataIndex: "nom",
    key: "nom",
  },
  {
    title: "Nombre de lignes totales",
    dataIndex: "nombreLigneTotal",
    key: "nombreLigneTotal",
  },
  {
    title: "Nombre de lignes valides ",
    dataIndex: "nombreLigneValide",
    key: "nombreLigneValide",
  },
  {
    title: "Nombre de lignes Invalides ",
    dataIndex: "nombreLigneInvalide",
    key: "nombreLigneInvalide",
  },
  {
    title: "Etat de fichier  ",
    dataIndex: "etat",
    key: "etat",
  },
  {
    title: "Motif de rejet",
    dataIndex: "motifRejet",
    key: "motifRejet",
  },
];
class FichiersRecus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partenaires: [],
      typeFlux: [
        {
          id: "1",
          code: "PRL",
          libelle: "Prélévement",
        },
        {
          id: "2",
          code: "VRS",
          libelle: "Versement",
        },
      ],
      produits: [],
      etat: [],
      selectedProduct: "",
      selectedPartner: "",
      selectedEtat: "",
      selectedFluxType: "",
      selectedDate: "",
      data: [],
    };
    this.search = this.search.bind(this);
  }

  partnerChange = (value) => {
    this.setState({
      produits: this.props.produits.filter(
        (item) => item.partenaire.id === value
      ),
      selectedPartner: value,
    });
  };

  handleChangeProduit = (value) => {
    this.setState({
      selectedProduct: value,
    });
  };
  handleChangeTypeFlux = (value) => {
    this.setState({
      selectedFluxType: value,
    });
  };
  handleChangeEtat = (value) => {
    this.setState({
      selectedEtat: value,
    });
  };

  handleDateChange = (value) => {
    this.setState({
      selectedDate: value,
    });
  };

  async getDroppDownData() {
    const responsePartenaire = await getAllPartenaire();
    this.setState({
      partenaires: responsePartenaire.data.content,
    });
  }

  async search() {
    const request = {
      dateTraitement: formatDateToFormatTwo(new Date(this.state.selectedDate)),
      etat: this.state.selectedEtat,
      partenaire: this.state.selectedPartner,
      produit: this.state.selectedProduct,
      typeDeFlux: this.state.selectedFluxType,
    };


    const result = await searchFlux(request);
    this.setState({
      data: result.data,
    });
  }
  componentDidMount() {
    this.getDroppDownData();
  }

  render() {
    const { getFieldDecorator } = this.props.form;

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
        <Form {...formItemLayout}>
          <h3>Critères de recherche</h3>
          <Row>
            <Col span={12}>
              <Form.Item label="Intermediaire" hasFeedback>
                {getFieldDecorator("partenaire", {
                  rules: [
                    { message: "Veuillez séléctionner un intermediaire" },
                  ],
                })(
                  <Select
                    placeholder="Sélectionnez "
                    onChange={this.partnerChange}
                  >
                    {this.state.partenaires.map((element) => {
                      return (
                        <Option value={element.id} label={element.raisonSocial}>
                          {element.raisonSocial}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Type de flux " hasFeedback>
                {getFieldDecorator("typeFlux", {
                  rules: [{ message: "Veuillez séléctionner un type de flux" }],
                })(
                  <Select
                    placeholder="Sélectionnez "
                    onChange={this.handleChangeTypeFlux}
                  >
                    {this.state.typeFlux.map((element) => {
                      return (
                        <Option value={element.id} label={element.code}>
                          {element.libelle}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="Produit" hasFeedback>
                {getFieldDecorator("produit", {
                  rules: [{ message: "Veuillez séléctionner un produit" }],
                })(
                  <Select
                    placeholder="Sélectionnez "
                    onChange={this.handleChangeProduit}
                  >
                    {this.state.produits.map((element) => {
                      return (
                        <Option value={element.id} label={element.code}>
                          {element.libelle}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="État  " hasFeedback>
                {getFieldDecorator("etat", {
                  rules: [{ message: "Veuillez séléctionner un état" }],
                })(
                  <Select
                    placeholder="Sélectionnez "
                    onChange={this.handleChangeEtat}
                  >
                    <Option value="rejeté" label="Rejeté">
                      Rejeté
                    </Option>

                    <Option value="accepté" label="Accepté">
                      Accepté
                    </Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="Date de traitement " hasFeedback>
                <DatePicker
                  className="date-style"
                  format={dateFormat}
                  onChange={this.handleDateChange}
                ></DatePicker>
              </Form.Item>
            </Col>

            <Col span={11}>
              <Button
                type="primary"
                onClick={this.search}
                className="multisteps-btn-next"
                form="stepfour"
              >
                Rechercher
              </Button>
            </Col>
          </Row>
        </Form>
        <Table dataSource={this.state.data} columns={columns}></Table>
      </div>
    );
  }
}

export default Form.create()(FichiersRecus);
