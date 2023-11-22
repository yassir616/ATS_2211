/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  Divider,
  Form,
  Icon,
  notification,
  Row,
  Select,
  Table,
  Typography
} from "antd";
import React, { Component } from "react";
import { getAllPartenaire } from "../../Parametrage/partenaire/PartenaireAPI";
import { getDecesProduit } from "../../Parametrage/ProduitDeces/ProduitDecesAPI";
import {
  addPrestationHonoraire,
  setPrestationStatut,
  lettreRegHonoraire
} from "../../Parametrage/TypePrestation/PrestationAPI";
import { ajoutReglement, getReglements } from "./SinistreAPI";

const { Option } = Select;
const { Title } = Typography;
var id_reglement = "";

class Reglement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partenaires: [],
      produits: [],
      disable: false,
      produitPartenaire: [],
      add: false,
      reglement: []
    };
    this.columns = [
      {
        title: "Nom du fichier",
        dataIndex: "nomFichier",
        key: "nomFichier"
      },
      {
        title: "Libelle",
        dataIndex: "libelle",
        key: "libelle"
      },
      {
        title: "Type reglement",
        dataIndex: "reglementType",
        key: "reglementType"
      },
      {
        title: "Statut",
        dataIndex: "statut",
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
                  value="Valider"
                  onClick={() => this.handleRecord(record)}
                >
                  Valider
                </Option>
                <Option
                  value="Supprimer"
                  onClick={() => this.handleRecord(record)}
                >
                  Supprimer
                </Option>
              </Select>
            </span>
          );
        }
      }
    ];
  }
  componentDidMount() {
    this.getpropreties();
  }
  async getpropreties() {
    let response = await getAllPartenaire();
    let produitResponse = await getDecesProduit();
    this.setState({
      partenaires: response.data.content,
      produits: produitResponse.data.content
    });
  }
  async getAllReglement() {
    let response = await getReglements();
    this.setState({
      reglement: response.data.content
    });
  }
  handleChangeed = value => {
    this.updatePrestationStatut(id_reglement, value);
  };
  handleRecord = value => {
    id_reglement = value.id;
  };
  handlePartnerChange = value => {
    let list = [...this.state.produits];
    this.setState({
      produitPartenaire: list.filter(item => item.partenaire.id === value.key)
    });
  };
  async ajouterReglement(productId, type, requestModel) {
    try {
      let response = await ajoutReglement(productId, type, requestModel);
      if (response.status === 200) {
        this.setState({ add: true });
      }
    } catch (error) {
      if (error.response.status === 500) {
        notification.error({
          message: "Aucune prestation avec le statut À signer."
        });
      }
    }
  }
  async ajouterReglementHonoraire(productId, type, requestModel) {
    try {
      let response = await addPrestationHonoraire(
        productId,
        type,
        requestModel
      );
      if (response.status === 200) {
        let uniqueNames = [];
        let filteredArr;
        let sum = 0;
        filteredArr = response.data.honoraires.reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        filteredArr.forEach(element1 => {
          sum += element1.montant;
          element1.detailPrestationHonoraire.forEach(element => {
            uniqueNames.push({
              medecin:
                element1.auxiliaire.nom + " " + element1.auxiliaire.prenom,
              nom:
                element.acceptationTestMedical.acceptation.contrat.assure.nom +
                " " +
                element.acceptationTestMedical.acceptation.contrat.assure
                  .prenom,
              num_sinistre: element1.numeroSinistre,
              date: element1.datePrestation,
              nature: "Honoraire",
              montant: element1.montant.toString(),
              total: sum.toString()
            });
          });
        });
        filteredArr = uniqueNames.reduce((acc, current) => {
          const x = acc.find(
            item => item.num_sinistre === current.num_sinistre
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        this.jasperLettreRegelementHonoraire(filteredArr);
        this.handleDowloadText(sum);
      }
    } catch (error) {
      if (error.response.status === 500) {
        notification.error({
          message: "Aucun honoraire avec le statut À signer."
        });
      }
    }
  }

  async jasperLettreRegelementHonoraire(requestLettre) {
    let response = await lettreRegHonoraire(requestLettre);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      console.log("test");
      window.open(fileURL);
    }
  }
  handleDowloadText = sum => {
    const text = "Hello, world!";
    const blob = new Blob([sum], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Fichier_chèque.txt";
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
  };
  async updatePrestationStatut(reglementId, statut) {
    await setPrestationStatut(reglementId, statut);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll();
  };
  onClickSearch = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const date = new Date();
      let requestmodel = {
        libelle: "Ordre de chèque sup " + date,
        reglementType: "Virement",
        dateStatut: date
      };
      if (!err) {
        if (values.nature.key === "Honoraire") {
          this.ajouterReglementHonoraire(
            values.produit.key,
            values.nature.label,
            requestmodel
          );
        } else {
          this.ajouterReglement(
            values.produit.key,
            values.nature.label,
            requestmodel
          );
          this.getAllReglement();
        }
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 15 },
        lg: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 9 },
        lg: { span: 12 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 24,
          offset: 4
        }
      }
    };

    return (
      <div>
        <Row>
          <Title style={{ marginBottom: "25px" }} level={4}>
            RECHERCHE DES PRESTATIONS
          </Title>
          <Divider />
          <Col span={24} offset={1}>
            <Title style={{ marginBottom: "25px" }} level={4} underline={true}>
              Critéres de Recherche :
            </Title>
            <Form
              {...formItemLayout}
              onSubmit={this.handleSubmit}
              ref={ref => {
                this.form = ref;
              }}
              hideRequiredMark
            >
              <Col span={10}>
                <Form.Item label="Intermédiaire " hasFeedback>
                  {getFieldDecorator("partenaire", {
                    valuePropName: "selected",
                    rules: [
                      {
                        required: true,
                        message: "Veuillez selectionner"
                      }
                    ]
                  })(
                    <Select
                      placeholder="Veuillez selectionner"
                      optionLabelProp="label"
                      onChange={this.handlePartnerChange}
                      labelInValue
                    >
                      {this.state.partenaires.map(element => {
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
                <Form.Item label="Produit ">
                  {getFieldDecorator("produit", {
                    rules: [
                      {
                        required: true,
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <Select
                      placeholder="Veuillez selectionner"
                      optionLabelProp="label"
                      labelInValue
                    >
                      {this.state.produitPartenaire.map(element => {
                        return (
                          <Option
                            key={element.id}
                            value={element.id}
                            label={element.libelle}
                          >
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={1}></Col>
              <Col span={10}>
                <Form.Item label="Nature ">
                  {getFieldDecorator("nature", {
                    rules: [
                      {
                        required: true
                      }
                    ]
                  })(
                    <Select
                      placeholder="Veuillez selectionner"
                      optionLabelProp="label"
                      labelInValue
                    >
                      <Option value="Sinistre" label="Sinistre">
                        Sinistre
                      </Option>
                      <Option value="Restitution" label="Restitution">
                        Restitution
                      </Option>
                      <Option value="Honoraire" label="Honoraire">
                        Honoraire
                      </Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Button
                    style={{ margin: "10px" }}
                    type="primary"
                    htmlType="submit"
                    onClick={this.onClickSearch}
                    className="not-rounded"
                  >
                    <Icon type="file-add" theme="filled" />
                    Générer ordre de virement
                  </Button>
                  <Button
                    style={{ margin: "10px" }}
                    type="default"
                    onClick={this.onClickSearch}
                    className="not-rounded"
                  >
                    <Icon type="file-add" theme="twoTone" />
                    Générer fichier chèque
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Col>
        </Row>
        {this.state.add ? (
          <Table
            rowClassName="editable-row"
            columns={this.columns}
            size="small"
            bordered
            dataSource={this.state.reglement}
            pagination={false}
          />
        ) : null}
      </div>
    );
  }
}
const ReglementForm = Form.create()(Reglement);
export default ReglementForm;
