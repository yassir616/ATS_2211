/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Divider,
  Form,
  Icon,
  Drawer,
  notification,
  Popconfirm,
  Table,
  Input,
  Row,
  Button,
  Col,
  Select,
  AutoComplete,
  Radio,
  DatePicker,
  InputNumber
} from "antd";
import React, { Component } from "react";
import AddSouscripteur from "../Production Prestations/Souscription/StepOne/AddPerPhysique/AddSouscripteur";
import {
  getAllPersonnePhysique,
  getProfession,
  getSetuation,
  getSexe,
  getVois,
  deletePerPhysique,
  updatePersonnePhysique
} from "./ParticipantAPI";
import { connectedUserContext } from "../../app/App";
import moment from "moment";
import { getColumnSearchProps } from "../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";
import { currencyFormatter, currencyParser } from "../../util/Helpers";
const { Option } = Select;
const dateFormatList = "DD/MM/YYYY";
class Participant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visibled: "",
      rowSelection: "",
      keyRecord: "",
      searchText: "",
      searchedColumn: "",
      sexe: [],
      setuations: [],
      professions: [],
      users: "",
      rolesandprivileges: false,
      parametrage: false,
      vois: [],
      dataloaded: false,
      nationaliteList: ["MAROCAINE ", "FRANÇAISE", "BELGE", "..."],
      Tiers: [0, 1, 2, 3, 4, 5]
    };
    this.columns = [
      {
        title: "Nom",
        dataIndex: "nom",
        key: "nom",
        width: "25%",
        ...getColumnSearchProps("nom", "nom", this)
      },
      {
        title: "Prénom",
        dataIndex: "prenom",
        key: "prenom",
        width: "25%",
        ...getColumnSearchProps("prenom", "prenom", this)
      },
      {
        title: "Cin",
        dataIndex: "cin",
        key: "cin",
        width: "20%",
        ...getColumnSearchProps("cin", "cin", this)
      },
      {
        title: "Opérations",
        align: "center",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <span>
              <a
                onClick={() => {
                  this.edit(record);
                }}
              >
                <Icon
                  type="edit"
                  style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
                />
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <a href="#top" style={{ color: "red" }}>
                  <Icon
                    type="user-delete"
                    style={{ color: "rgb(208, 62, 62)", fontSize: "25px" }}
                  />
                </a>
              </Popconfirm>
            </span>
          );
        }
      }
    ];
  }
  async getproprties() {
    let gander = await getSexe();
    let setuation = await getSetuation();
    let profrssionResponse = await getProfession();
    let vois = await getVois();
    this.setState({
      sexe: [...gander.data],
      setuations: [...setuation.data],
      dataloaded: true,
      professions: [...profrssionResponse.data.content],
      vois: [...vois.data]
    });
  }

  handlePersonphyCreationAssure = data => {};

  componentDidMount() {
    this.getproprties();
    let listpersons = [];

    getAllPersonnePhysique().then(response => {
      response.data.content.forEach(element => {
        let person = { ...element, ...{ key: element.id } };
        listpersons.push(person);
      });
    });

    this.setState({
      data: listpersons
    });
  }
  handleDelete = key => {
    this.deleteParticipant(key);
    const dataSource = [...this.state.data];
    this.setState({ data: dataSource.filter(item => item.key !== key) });
  };
  async deleteParticipant(id) {
    try {
      let response = await deletePerPhysique(id);
      if (response.status === 200) {
        notification.success({
          message: "participant bien supprimé !"
        });
      }
    } catch (err) {
      notification.error({
        message: "Takaful",
        description:
          err.message || "Sorry! Something went wrong. Please try again!"
      });
    }
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
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
  isEditing = record => record.key === this.state.editingKey;
  cancel = () => {
    this.setState({ editingKey: "" });
  };
  updatePer = (id, perData) => {
    updatePersonnePhysique(id, perData)
      .then(response => {
        if (response.status === 200) {
          notification.success({
            message: "participant bien modifier !"
          });
          window.location.reload();
        }
      })
      .catch(error => {
        if (error.response.data.message === "souscripteur already exists") {
          notification.error({
            message: "Un participant deja exist."
          });
        } else {
          notification.error({
            message: "Takaful",
            description:
              error.message || "Sorry! Something went wrong. Please try again!"
          });
        }
      });
  };
  handleChangeNomPrenom = e => {
    e.target.value = e.target.value.toUpperCase();
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.dateNaissance = values.dateNaissance.format("DD-MM-YYYY");
        this.updatePer(this.state.keyRecord, values);
      }
    });
    this.setState({ visibled: false });
  };

  onClose = () => {
    this.setState({
      visibled: false
    });
  };

  edit(value) {
    this.setState({ visibled: true, keyRecord: value.id });

    this.props.form.setFieldsValue({
      isProspect: value.prospect,
      prenom: value.prenom,
      nom: value.nom,
      cin: value.cin,
      dateNaissance: moment(value.dateNaissance, dateFormatList),
      matricule: value.matricule,
      profession: value.profession.libelle,
      sexe: value.sexe,
      situationFamiliale: value.situationFamiliale,
      nationalite: value.nationalite,
      nombreEnfants: value.nombreEnfants,
      rib: value.rib,
      numeroDeTelephone: value.numeroDeTelephone,
      numTiers: value.numTiers,
      adressPays: value.adressPays,
      adressCodePostal: value.adressCodePostal,
      adressComplement: value.adressComplement,
      adressComplete: value.adressComplete,
      adressNumero: value.adressNumero,
      adressVille: value.adressVille,
      adressVois: value.adressVois
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const prefixSelector = getFieldDecorator("prefix", {
      initialValue: "CIN"
    })(
      <Select style={{ width: 100 }}>
        <Option value="CIN">CIN</Option>
        <Option value="Passport">Passport</Option>
        <Option value="Numresidence">N° carte de residence</Option>
      </Select>
    );

    return (
      <div>
        <connectedUserContext.Consumer>
          {value =>
            // eslint-disable-next-line react/no-direct-mutation-state
            value.roles.forEach(element => (this.state.users = element.name))
          }
        </connectedUserContext.Consumer>

        <Drawer
          title="Modification du sociétaire"
          width={720}
          onClose={this.onClose}
          visible={this.state.visibled}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row>
              <Col span={12}>
                <Form.Item label="Prospect">
                  {getFieldDecorator("isProspect", {
                    valuePropName: "checked",
                    initialValue: true
                  })(
                    <Radio.Group buttonStyle="solid" defaultValue={true}>
                      <Radio.Button value={true}>Oui</Radio.Button>
                      <Radio.Button value={false}>Non</Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Prénom">
                  {getFieldDecorator("prenom", {
                    rules: [
                      {
                        required: true,
                        message: "Tapez le prénom de souscripteur"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le prénom de souscripteur"
                      onChange={this.handleChangeNomPrenom}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nom">
                  {getFieldDecorator("nom", {
                    rules: [
                      {
                        required: true,
                        message: "Tapez le prénom de souscripteur"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez le nom de souscripteur"
                      onChange={this.handleChangeNomPrenom}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                {this.state.users === "ADMIN" ? (
                  <Form.Item label="Identifiant">
                    {getFieldDecorator("cin")(
                      <Input
                        className="not-rounded"
                        style={{ width: "100%" }}
                        addonBefore={prefixSelector}
                        onChange={this.onChangeCin}
                      />
                    )}
                  </Form.Item>
                ) : (
                  <Form.Item label="Identifiant">
                    {getFieldDecorator("cin")(
                      <Input
                        className="not-rounded"
                        style={{ width: "100%" }}
                        addonBefore={prefixSelector}
                        onChange={this.onChangeCin}
                        disabled
                      />
                    )}
                  </Form.Item>
                )}
              </Col>
              <Col span={12}>
                <Form.Item label="Date de naissance" hasFeedback>
                  {getFieldDecorator("dateNaissance", {
                    rules: [
                      {
                        required: true,
                        message: "entre la date de naissance"
                      }
                    ]
                  })(
                    <DatePicker
                      format={dateFormatList}
                      disabledDate={this.disabledDate}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Matricule">
                  {getFieldDecorator("matricule", {
                    rules: [{ required: false }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le matricule de souscripteur"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Profession">
                  {getFieldDecorator("profession", {
                    rules: [
                      {
                        required: true,
                        message: "Sélectionnez une profession"
                      }
                    ]
                  })(
                    <Select placeholder="Profession">
                      {this.state.professions.map(element => {
                        return (
                          <Option key={element.id} value={element.libelle}>
                            {element.libelle}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Situation familiale ">
                  {getFieldDecorator("situationFamiliale", {
                    rules: [
                      {
                        required: true,
                        message: "Sélectionnez une Situation familiale"
                      }
                    ]
                  })(
                    <Select placeholder="Situation familiale">
                      {this.state.setuations.map(element => {
                        return (
                          <Option key={element.id} value={element.value}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Sexe">
                  {getFieldDecorator("sexe", {
                    rules: [{ required: true, message: "Sélectionnez le sexe" }]
                  })(
                    <Select placeholder="Sélectionnez le sexe">
                      {this.state.sexe.map(element => {
                        return (
                          <Option key={element.id} value={element.value}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nationalité">
                  {getFieldDecorator("nationalite", {
                    rules: [
                      {
                        required: true,
                        message: "Sélectionnez une Nationalité"
                      }
                    ]
                  })(
                    <AutoComplete
                      size="default"
                      dataSource={this.state.nationaliteList}
                      allowClear={true}
                      placeholder="Nationalité"
                      filterOption={(inputValue, option) =>
                        option.props.children
                          .toUpperCase()
                          .indexOf(inputValue.toUpperCase()) !== -1
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nombre d'enfants">
                  {getFieldDecorator("nombreEnfants", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <InputNumber
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="entrez le nombre d'enfants"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                {this.state.users === "ADMIN" ? (
                  <Form.Item label="RIB">
                    {getFieldDecorator("rib", {
                      rules: [
                        {
                          required: true,
                          message: "Format invalide !"
                        }
                      ]
                    })(
                      <InputNumber
                        className="not-rounded"
                        style={{ width: "100%" }}
                        placeholder="RIB"
                        onChange={this.onChangeRib}
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                ) : (
                  <Form.Item label="RIB">
                    {getFieldDecorator("rib", {
                      rules: [
                        {
                          required: true,
                          message: "Format invalide !"
                        }
                      ]
                    })(
                      <InputNumber
                        className="not-rounded"
                        style={{ width: "100%" }}
                        placeholder="RIB"
                        onChange={this.onChangeRib}
                        disabled
                        formatter={currencyFormatter}
                        parser={currencyParser}
                      />
                    )}
                  </Form.Item>
                )}
              </Col>
              <Col span={12}>
                <Form.Item label="Téléphone">
                  {getFieldDecorator("numeroDeTelephone", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp("^[0][5-7]{1}[0-9]{8}$"),
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Numero de telephone"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="N° Tiers">
                  {getFieldDecorator("numTiers", {
                    rules: [
                      {
                        required: true,
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <Select placeholder="° Tiers">
                      {this.state.Tiers.map(element => {
                        return (
                          <Option key={element} value={element}>
                            {element}
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
                <h4>Adresse :</h4>
                <Divider></Divider>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pays">
                  {getFieldDecorator("adressPays", {
                    rules: [{ required: true, message: "selecte un pays" }]
                  })(<Input placeholder="pays" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ville">
                  {getFieldDecorator("adressVille", {
                    rules: [{ required: true, message: "selecte une ville" }]
                  })(<Input placeholder="ville" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Voie">
                  {getFieldDecorator("adressVois", {
                    rules: [{ required: true, message: "selecte une vois" }]
                  })(
                    <Select placeholder="Voie">
                      {this.state.vois.map(element => {
                        return (
                          <Option key={element.id} value={element.value}>
                            {element.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Code Postal">
                  {getFieldDecorator("adressCodePostal", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <InputNumber
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="entrez le Code Postal"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Numéro">
                  {getFieldDecorator("adressNumero", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide !"
                      }
                    ]
                  })(
                    <InputNumber
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="entrez le Numero"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                      min="0"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Complément d'adresse">
                  {getFieldDecorator("adressComplement")(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="entrez le un complément"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Adresse Complete">
                  {getFieldDecorator("adressComplete")(
                    <Input className="not-rounded" style={{ width: "100%" }} />
                  )}
                </Form.Item>
              </Col>
            </Row>

            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: "100%",
                borderTop: "1px solid #e9e9e9",
                padding: "10px 16px",
                background: "#fff",
                textAlign: "right"
              }}
            >
              <Button
                className="not-rounded"
                onClick={this.onClose}
                style={{ marginRight: 8 }}
              >
                Annuler
              </Button>
              <Button className="not-rounded" type="primary" htmlType="submit">
                Enregistrer
              </Button>
            </div>
          </Form>
        </Drawer>
        {this.state.dataloaded && (
          <AddSouscripteur
            titre="Création d'un nouveau Participant"
            professions={this.state.professions}
            sexe={this.state.sexe}
            setuation={this.state.setuations}
            vois={this.state.vois}
            personCreation={this.handlePersonphyCreationAssure}
          />
        )}
        <Table
          bordered
          rowClassName="editable-row"
          columns={this.columns}
          dataSource={this.state.data}
          pagination={{
            defaultCurrent: 1,
            defaultPageSize: 5,
            onChange: this.cancel
          }}
        />
      </div>
    );
  }
}

export default Form.create()(Participant);
