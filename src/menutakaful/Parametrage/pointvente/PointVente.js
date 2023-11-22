/* eslint-disable react/prop-types */
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  notification,
  Row,
  Select,
  Table,
  Divider
} from "antd";
import React, { Component } from "react";
import { getAllSecteurActivite } from "../../Participants/ParticipantAPI";
import { getAllPartenaire,  getCompteBancaireById} from "../partenaire/PartenaireAPI";
import { getColumnSearchProps } from "../ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import CreatePointVente from "./CreatePointVente";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";
import {
  getAllPointVente,
  getTypePointVente,
  updatePointVente
} from "./PointVenteAPI";

const { Option } = Select;
export class PointVente extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      searchText: "",
      searchedColumn: "",
      record: {},
      value: "",
      keyRecord: "",
      partenaireTB: [],
      secteurActiviteTB: [],
      typePointVenteTB: [],
      compteBancaire : []
    };
    this.columns = [
      {
        title: "Abréviation",
        dataIndex: "abb",
        key: "abb",
        width: "20%",
        ...getColumnSearchProps("abb", "Abreviation", this)
      },
      {
        title: "Téléphone",
        dataIndex: "telephone",
        key: "telephone",
        width: "20%",
        ...getColumnSearchProps("telephone", "Téléphone", this)
      },
      {
        title: "Code Interne",
        dataIndex: "codeInterne",
        key: "codeInterne",
        width: "20%",
        ...getColumnSearchProps("codeInterne", "Code Interne", this)
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        width: "20%",
        ...getColumnSearchProps("email", "Email", this)
      },
      {
        title: "Opérations",
        key: "action",
        width: "20%",
        render: (text, record) => (
          <span>
            <a
              href="#top"
              type="primary"
              onClick={() => this.handleSelectChange(record)}
              style={{ borderRadius: "0px" }}
            >
              Modifier
            </a>
          </span>
        )
      }
    ];
  }

  async recherchePointVente() {
    let response = await getAllPointVente();
    let newDataList = [];
    this.props.currentUser.roles.forEach(element1 => {
      if (element1.name === "ADMIN") {
        this.setState({
          data: response.data.content
        });
      } else {
        this.props.currentUser.pointVentes.forEach(actualPointVente => {
          response.data.content.forEach(elementPartenaire => {
            if (
              elementPartenaire.partenairepv.code ===
              actualPointVente.partenairepv.code
            ) {
              newDataList.push(elementPartenaire);
              this.setState({
                data: newDataList
              });
            }
          });
        });
      }
    });

    console.log("point de vente :", response);
  }

  async getsecteurActiviteId() {
    let response = await getAllSecteurActivite();
    this.setState({
      secteurActiviteTB: response.data.content
    });
  }

  async getPartenaire() {
    let response = await getAllPartenaire();
    this.setState({
      partenaireTB: response.data.content
    });
  }
  async getCompteBancaireById(id) {
    let response = await getCompteBancaireById(id);
    console.log("test getCompteBancaireById");
    console.log(response.data);
    this.props.form.setFieldsValue({ code :response.data.code ,
    rib :response.data.rib});
    this.setState({
      compteBancaire: response.data
    });
  }

  async getTypePointVenteId() {
    let response = await getTypePointVente();
    this.setState({
      typePointVenteTB: response.data.content
    });
  }

  componentDidMount() {
    this.recherchePointVente();
    this.getPartenaire();
    this.getTypePointVenteId();
    this.getsecteurActiviteId();
  }

  andleSearch = (selectedKeys, confirm, dataIndex) => {
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
  state = { visible: false };
  showDrawer = () => {
    this.setState({
      visible: true
    });
  };
  onClose = () => {
    this.setState({
      visible: false
    });
  };

  async updatePointV(id, body) {
    try {
      let response = await updatePointVente(id, body);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "la modification est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      notification.error({
        message: "Takaful",
        description:
          error.message || "Sorry! Something went wrong. Please try again!"
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.updatePointV(this.state.keyRecord, values);
      }
    });
  };

  handleInputChange(event, validationFun) {
    const target = event.target;
    const inputName = target.name;
    const inputValue = target.value;

    this.setState({
      [inputName]: {
        value: inputValue,
        ...validationFun(inputValue)
      }
    });
  }

  handleChangePartenaire = e => {
    this.setState({
      partenaire: e
    });
  };

  handleChangeSecteurActivite = e => {
    this.setState({
      secteurActivite: e
    });
  };

  handleChangeTypePointVente = e => {
    this.setState({
      typePointVente: e
    });
  };

  handleSelectChange = value => {
    console.log("test value");
    console.log(value.id);
    this.getCompteBancaireById(value.id);
    console.log("this.state.compteBancaire.code");
    console.log(this.state.compteBancaire.code);
    this.setState({ visible: true, keyRecord: value.id });
    this.props.form.setFieldsValue({
      abb: value.abb,
      codeCaps: value.codeCaps,
      codeInterne: value.codeInterne,
      codeResponsable: value.codeResponsable,
      logo: value.logo,
      nomResponsable: value.nomResponsable,
      ice: value.ice,
      libelle: value.libelle,
      patente: value.patente,
      partenairepvId: value.partenairepv.id,
      secteurActiviteId: value.secteurActivite.id,
      typePointVenteId: value.typePointVente.id,
      telephone: value.telephone,
      email: value.email
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <CreatePointVente />
        <Table
          rowClassName="editable-row"
          columns={this.columns}
          dataSource={this.state.data}
          rowKey="id"
          pagination={{ defaultCurrent: 1, defaultPageSize: 5 }}
        />
        <Drawer
          title="Modification du point de vente"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form onSubmit={this.handleSubmit} layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Intermédiaire">
                  {getFieldDecorator("partenairepvId", {
                    rules: [{ required: true, message: "" }]
                  })(
                    <Select
                      placeholder="cliquez pour choisir un intermédiaire"
                      onChange={this.handleChangePartenaire}
                      optionLabelProp="label"
                    >
                      {this.state.partenaireTB.map(element => {
                        return (
                          <Option
                            key={element.id}
                            label={element.code}
                            value={element.id}
                          >
                            {element.code}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Patente">
                  {getFieldDecorator("patente", {
                    rules: [{ required: true, message: "Patente" }]
                  })(<Input className="not-rounded" placeholder="Patente" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Abréviation">
                  {getFieldDecorator("abb", {
                    rules: [{ required: true, message: "Tapez le code" }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le code"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Code ACAPS">
                  {getFieldDecorator("codeCaps", {
                    rules: [{ required: true, message: "Tapez le Code ACAPS" }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le Code ACAPS"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Code Interne">
                  {getFieldDecorator("codeInterne", {
                    rules: [{ required: true, message: "Tapez le code" }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le code"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Code Responsable">
                  {getFieldDecorator("codeResponsable", {
                    rules: [
                      {
                        required: true,
                        message: "Tapez le Code du responsable"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le Code du responsable"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="ICE">
                  {getFieldDecorator("ice", {
                    rules: [{ required: true, message: "Tapez ICE" }]
                  })(<Input className="not-rounded" placeholder="Tapez ICE" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Libelle">
                  {getFieldDecorator("libelle", {
                    rules: [{ required: true, message: "champ obligatoir" }]
                  })(<Input className="not-rounded" placeholder="Libelle" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Téléphone">
                  {getFieldDecorator("telephone", {
                    rules: [{ required: true, message: "Tapez Téléphone" }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez Téléphone"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email">
                  {getFieldDecorator("email", {
                    rules: [
                      {
                        type: "email",
                        message: "L'e-mail n'est pas valid"
                      },
                      {
                        required: true,
                        message: "Svp entré votre E-mail!"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      type="email"
                      placeholder="Email@example.com"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Logo">
                  {getFieldDecorator("logo", {
                    rules: [{ required: true, message: "Logo" }]
                  })(<Input className="not-rounded" placeholder="Logo" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nom du responsable">
                  {getFieldDecorator("nomResponsable", {
                    rules: [{ required: true, message: "champ obligatoir" }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Nom du responsable"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Secteur d'activite">
                  {getFieldDecorator("secteurActiviteId", {
                    rules: [{ required: true, message: "" }]
                  })(
                    <Select
                      placeholder="cliquez pour choisir un secteur "
                      onChange={this.handleChangeSecteurActivite}
                      optionLabelProp="label"
                    >
                      {this.state.secteurActiviteTB.map(element => {
                        return (
                          <Option
                            key={element.id}
                            label={element.libelle}
                            value={element.id}
                          >
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Type de point de vente">
                  {getFieldDecorator("typePointVenteId", {
                    rules: [{ required: true, message: "" }]
                  })(
                    <Select
                      placeholder="cliquez pour choisir un type"
                      onChange={this.handleChangePointVente}
                      optionLabelProp="label"
                    >
                      {this.state.typePointVenteTB.map(element => {
                        return (
                          <Option
                            key={element.id}
                            label={element.code}
                            value={element.id}
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
            <Row gutter={16}>
              <Col span={24}>
                <h4>Compte Bancaire :</h4>
                <Divider></Divider>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Code">
                  {getFieldDecorator("code", {
                    rules: [{ required: true, message: "selectionnez un code" }]
                  })(<Input placeholder="code" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="RIB">
                  {getFieldDecorator("rib", {
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp("^[0-9]{24}"),
                            message: "Le rib n'est pas valid"
                          }
                        ]
                      })(
                        <Input
                          className="not-rounded"
                          style={{ width: "100%" }}
                          placeholder="Tapez le rib d'auxiliaire"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                          maxLength="24"
                        />
                      )}
                </Form.Item>
              </Col>
            </Row>
            <div className="submit-cancel">
              <Button
                className="not-rounded"
                onClick={this.onClose}
                style={{ marginRight: 8 }}
              >
                Fermer
              </Button>
              <Button className="not-rounded" type="primary" htmlType="submit">
                Modifier
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    );
  }
}
export default Form.create()(PointVente);
