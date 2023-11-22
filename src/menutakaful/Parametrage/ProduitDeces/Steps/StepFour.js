/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Row,
  Select
} from "antd";
import React, { Component } from "react";
import { getHonoraire } from "../../Honoraires/HonorairesAPI";
import {
  getCauseRes,
  getRestitutions
} from "../../Restitutions/RestitutionAPI";
import { getPieceJoint } from "../../../EchangeFichiersInformatiques/EchangeFileAPI";

let id = 0;
let j = 0;
let i = 0;
let l = 0;
let x = localStorage.getItem("seuilExaminateur");
const { Option } = Select;

function validatePrimeNumber(number) {
  if (number >= x) {
    return {
      validateStatus: "success",
      errorMsg: null
    };
  }
  return {
    validateStatus: "error",
    errorMsg:
      "Le capital min doit être égal ou supérieur au seuil examinateur qui égal " +
      x
  };
}
class StepFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: {
        value: x
      },
      pieceJointe: [],
      restitution: [],
      restitutions: [],
      normesSelection: [],
      causeRes: [],
      localNorme: [],
      localRestitution: [],
      honoraire: [],
      restitutionList: [],
      current: 5,
      code: ""
    };
  }

  handleNumberChange = value => {
    this.setState({
      number: {
        ...validatePrimeNumber(value),
        value
      }
    });
  };

  componentDidMount() {
    this.getAllRestitution();
    this.getAllCauseRes();
    this.getAllHonoraire();
  }

  async getAllPiece(code) {
    let response = await getPieceJoint(code);
    this.setState({
      pieceJointe: response.data.content
    });
  }

  async getAllHonoraire() {
    let response = await getHonoraire();

    this.setState({
      honoraire: response.data.content
    });
  }

  async getAllRestitution() {
    let response = await getRestitutions();
    this.setState({
      restitution: response.data.content
    });
  }

  async getAllCauseRes() {
    let response = await getCauseRes();
    this.setState({
      causeRes: response.data.content
    });
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes

    form.setFieldsValue({
      keys: nextKeys
    });
  };

  removed = c => {
    const { form } = this.props;
    // can use data-binding to get
    const cles = form.getFieldValue("cles");
    // We need at least one passenger
    if (cles.length === 1) {
      return;
    }
    // can use data-binding to set
    form.setFieldsValue({
      cles: cles.filter(cle => cle !== c)
    });
  };

  ajouter = () => {
    const { form } = this.props;
    // can use data-binding to get
    const cles = form.getFieldValue("cles");
    const nextcles = cles.concat(j++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      cles: nextcles
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let data3 = [];
      for (let count = 0; count < values.cles.length; count++) {
        let examens = [];
        values.normes[count].forEach(element => {
          examens.push({ id: element });
        });
        values.normes[count] = [...examens];
        data3 = {
          ageMax: values.ageMax[count],
          ageMin: values.ageMin[count],
          capitalMax: values.capitalMax[count],
          capitalMin: values.capitalMin[count] + "",
          honoraires: values.normes[count]
        };
        this.state.normesSelection.push(data3);
      }

      let data = [];
      for (let count = 0; count < values.keys.length; count++) {
        let piece = [];
        values.pieceJointe[count].forEach(element => {
          piece.push({ id: element });
        });
        values.pieceJointe[count] = [...piece];
        data = {
          idRestitution: values.restitution[count].key,
          idCauseRestitution: values.causeRes[count],
          status: values.statut[count],
          pieceJointes: values.pieceJointe[count]
        };
        this.state.restitutions.push(data);
      }

      let array1 = JSON.parse(localStorage.getItem("localRestitution"));
      if (array1 != null) {
        for (let count of array1) {
          let data2 = {
            idRestitution: count.idRestitution,
            idCauseRestitution: count.idCauseRestitution,
            status: array1[count].status,
            pieceJointes: array1[count].pieceJointes
          };
          this.state.restitutions.push(data2);
        }
      }
    });
    const current = this.state.current + 1;
    this.props.check(
      this.state.restitutions,
      current,
      this.state.normesSelection
    );
  };
  prev() {
    this.props.check(this.state.restitutions, this.state.current - 1);
  }
  handleChange = id => {
    console.log("select change:", id);
    this.getAllPiece("Restitution");
  };
  render() {
    const { number } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => (
      <div key={k}>
        <Row span={24}>
          <Col span={5}>
            <Form.Item label="Restitution">
              {getFieldDecorator(`restitution[${k}]`, {
                validateTrigger: ["onChange", "onBlur"]
              })(
                <Select
                  placeholder="cliquez pour choisir"
                  onChange={this.handleChange}
                  labelInValue
                >
                  {this.state.restitution.map(element => {
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
          <Col span={5} offset={1}>
            <Form.Item label="Cause restitution" required={false}>
              {getFieldDecorator(`causeRes[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Champs Obligatoire."
                  }
                ]
              })(
                <Select placeholder="cliquez pour choisir">
                  {this.state.causeRes.map(element => {
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
          <Col span={5} offset={1}>
            <Form.Item label="Statut">
              {getFieldDecorator(`statut[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    pattern: new RegExp(/^[0-1]/),
                    message: "La valeur du statut doit être 0 ou 1"
                  }
                ]
              })(<Input placeholder="Statut" />)}
            </Form.Item>
          </Col>
          <Col span={5} offset={1}>
            <Form.Item label="Pièces justificatives" required={false} key={k}>
              {getFieldDecorator(`pieceJointe[${k}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs Obligatoire."
                  }
                ]
              })(
                <Select mode="multiple" placeholder="Select...">
                  {this.state.pieceJointe.map(element => {
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
              {keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.remove(k)}
                />
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </div>
    ));
    getFieldDecorator("cles", { initialValue: [] });
    const cles = getFieldValue("cles");
    const formItems1 = cles.map((c, index) => (
      <div key={c}>
        <Row span={24}>
          <Col span={4}>
            <Form.Item label="Age min" required={false}>
              {getFieldDecorator(`ageMin[${c}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide!"
                  }
                ]
              })(<Input placeholder="Age min" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="Age max" required={false}>
              {getFieldDecorator(`ageMax[${c}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide!"
                  }
                ]
              })(<Input placeholder="Age max" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item
              label="Capital min"
              validateStatus={number.validateStatus}
              help={number.errorMsg}
            >
              {getFieldDecorator(`capitalMin[${c}]`, {
                validateTrigger: ["onChange", "onBlur"]
              })(
                <InputNumber
                  min={x}
                  onChange={this.handleNumberChange}
                  style={{ width: "100%" }}
                  placeholder="Capital min"
                  className="not-rounded"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="Capital max" required={false}>
              {getFieldDecorator(`capitalMax[${c}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide!"
                  }
                ]
              })(<Input placeholder="Capital max" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="Examens médicaux" key={c}>
              {getFieldDecorator(`normes[${c}]`, {
                validateTrigger: ["onChange", "onBlur"],
                rules: [
                  {
                    required: true,
                    message: "Champs Obligatoire."
                  }
                ]
              })(
                <Select mode="multiple" placeholder="Selectionnez...">
                  {this.state.honoraire.map(element => {
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
              {cles.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.removed(c)}
                />
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </div>
    ));
    getFieldDecorator("cle", { initialValue: [i] });
    const cle = getFieldValue("cle");
    const formItemsNorme = cle.map(
      (c, index) =>
        localStorage.getItem("localNorme") != null &&
        JSON.parse(localStorage.getItem("localNorme")).map(a => (
          <div key={a}>
            <Row span={24}>
              <Col span={4}>
                <Form.Item label="Age max" required={false}>
                  {getFieldDecorator(
                    `ageMaxim[${c}]`,
                    { initialValue: a.ageMax },
                    {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          pattern: new RegExp(/^[0-9\b]+$/),
                          message: "Format invalide!"
                        }
                      ]
                    }
                  )(<Input placeholder="Age max" />)}
                </Form.Item>
              </Col>

              <Col span={4} offset={1}>
                <Form.Item label="Age min" required={false}>
                  {getFieldDecorator(
                    `ageMinim[${c}]`,
                    { initialValue: a.ageMin },
                    {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          pattern: new RegExp(/^[0-9\b]+$/),
                          message: "Format invalide!"
                        }
                      ]
                    }
                  )(<Input placeholder="Age min" />)}
                </Form.Item>
              </Col>
              <Col span={4} offset={1}>
                <Form.Item label="Capital max" required={false}>
                  {getFieldDecorator(
                    `capMax[${c}]`,
                    { initialValue: a.capitalMax },
                    {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          pattern: new RegExp(/^[0-9\b]+$/),
                          message: "Format invalide!"
                        }
                      ]
                    }
                  )(<Input placeholder="Capital max" />)}
                </Form.Item>
              </Col>
              <Col span={4} offset={1}>
                <Form.Item label="Capital min" required={false}>
                  {getFieldDecorator(
                    `capMin[${c}]`,
                    { initialValue: a.capitalMin },
                    {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          pattern: new RegExp(/^[0-9\b]+$/),
                          message: "Format invalide!"
                        }
                      ]
                    }
                  )(<Input placeholder="Capital min" />)}
                </Form.Item>
              </Col>
              <Col span={4} offset={1}>
                <Form.Item label="Exmanes médicaux" key={c}>
                  {getFieldDecorator(
                    `norme[${c}]`,
                    { initialValue: a.honoraires.map(b => b.id) },
                    {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          message: "Champs Obligatoire."
                        }
                      ]
                    }
                  )(
                    <Select mode="multiple" placeholder="Selectionnez...">
                      {this.state.honoraire.map(element => {
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
            </Row>
          </div>
        ))
    );
    getFieldDecorator("key", { initialValue: [l] });
    const key = getFieldValue("key");
    const formItemsRestitution = key.map(
      (k, index) =>
        localStorage.getItem("localRestitution") != null &&
        JSON.parse(localStorage.getItem("localRestitution")).map(a => (
          <div key={a}>
            <Row span={24}>
              <Col span={5}>
                <Form.Item label="Restitution" required={false}>
                  {getFieldDecorator(
                    `restitutions[${k}]`,
                    { initialValue: a.idRestitution },
                    {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: "Champs Obligatoire."
                        }
                      ]
                    }
                  )(
                    <Select placeholder="cliquez pour choisir">
                      {this.state.restitution.map(element => {
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
              <Col span={5} offset={1}>
                <Form.Item label="Cause restitution" required={false}>
                  {getFieldDecorator(
                    `causeRest[${k}]`,
                    { initialValue: a.idCauseRestitution },
                    {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: "Champs Obligatoire."
                        }
                      ]
                    }
                  )(
                    <Select placeholder="cliquez pour choisir">
                      {this.state.causeRes.map(element => {
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
              <Col span={5} offset={1}>
                <Form.Item label="Statut" required={false}>
                  {getFieldDecorator(
                    `statuts[${k}]`,
                    { initialValue: a.status },
                    {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: "Champs Obligatoire."
                        }
                      ]
                    }
                  )(<Input placeholder="Statut" />)}
                </Form.Item>
              </Col>
              <Col span={5} offset={1}>
                <Form.Item label="Pieces jointes" required={false}>
                  {getFieldDecorator(
                    `pieces[${k}]`,
                    { initialValue: a.pieceJointes.map(b => b.id) },
                    {
                      validateTrigger: ["onChange", "onBlur"],
                      rules: [
                        {
                          required: true,
                          message: "Champs Obligatoire."
                        }
                      ]
                    }
                  )(
                    <Select mode="multiple" placeholder="Select...">
                      {this.state.pieceJointe.map(element => {
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
            </Row>
          </div>
        ))
    );

    return (
      <Row>
        <Col span={24}>
          <Form onSubmit={this.handleSubmit}>
            <Divider orientation="left">Normes de séléction</Divider>
            {localStorage.getItem("localNorme") != null ? formItemsNorme : ""}
            {formItems1}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button
                type="dashed"
                onClick={this.ajouter}
                style={{ width: "60%" }}
              >
                <Icon type="plus" /> Ajouter
              </Button>
            </Form.Item>
            <Divider orientation="left">Restitutions</Divider>
            {localStorage.getItem("localRestitution") != null
              ? formItemsRestitution
              : ""}
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: "60%" }}>
                <Icon type="plus" /> Ajouter
              </Button>
            </Form.Item>
            <Col span={24} offset={1}>
              <Form.Item>
                {this.state.current === 5 && (
                  <Button type="primary" htmlType="submit">
                    Suivant <Icon type="arrow-right" />
                  </Button>
                )}
                {this.state.current > 0 && (
                  <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                    <Icon type="arrow-left" />
                    Précédent
                  </Button>
                )}
              </Form.Item>
            </Col>
          </Form>
        </Col>
      </Row>
    );
  }
}
export default Form.create({ name: "global_state" })(StepFour);
