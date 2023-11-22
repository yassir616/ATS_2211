/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Icon,
  Divider,
  InputNumber
} from "antd";
import { getTypePrestationFamille } from "../../TypePrestation/PrestationAPI";
import { getPieceJoint } from "../../../EchangeFichiersInformatiques/EchangeFileAPI";
import { currencyFormatter, currencyParser } from "../../../../util/Helpers";

let id = 0;
let famille = 1; //la famille de produit est deces
let i = 0;
let current = 4;
const { Option } = Select;
class StepThree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typePrestations: [],
      Modalite: {},
      count: 0,
      current: 4,
      typePrestation: [],
      adresse: [],
      pieceJointe: []
    };
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

  removed = c => {
    const { form } = this.props;
    // can use data-binding to get
    const cle = form.getFieldValue("cle");
    form.setFieldsValue({
      cle: cle.filter(key => key !== c)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmited = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (
        values.delaiResiliation !== "" &&
        values.delaiPreavis !== "" &&
        values.seuilConseil !== "" &&
        values.seuilExaminateur !== "" &&
        values.seuilReassurance !== ""
      ) {
        current = this.state.current + 1;
      }
      id = 0;

      this.state.Modalite = {
        seuilConseil: values.seuilConseil,
        seuilReassurance: values.seuilReassurance,
        seuilExaminateur: values.seuilExaminateur,
        delaiResiliation: values.delaiResiliation,
        delaiPreavis: values.delaiPreavis
      };

      for (var count = 0; count < values.type.length; count++) {
        let piece = [];
        values.piece[count].forEach(element => {
          piece.push({ id: element });
        });
        values.piece[count] = [...piece];
        let data = {
          pieceJointes: values.piece[count],
          typePrestationId: values.type[count].key,
          delaiDeclaration: values.delai[count]
        };
        this.state.typePrestations.push(data);
      }
      let array = JSON.parse(localStorage.getItem("adresse"));
      if (array != null) {
        for (let index of array) {
          let data1 = {
            pieceJointes: index.pieceJointes,
            typePrestationId: index.typePrestationId,
            delaiDeclaration: index.delaiDeclaration
          };
          this.setState({
            typePrestations: [...data1]
          });
        }
      }
      localStorage.setItem(
        "adresse",
        JSON.stringify(this.state.typePrestations)
      );
    });
    this.props.check(this.state.typePrestations, this.state.Modalite, current);
  };

  prev() {
    const currentPrev = this.state.current - 1;
    this.setState({ currentPrev });
    this.props.check(
      this.state.typePrestations,
      this.state.Modalite,
      currentPrev
    );
  }
  handleChange = id => {
    console.log("select change:", id);
    this.getAllPiece(id.label);
  };
  handleChanged = e => this.setState({ [e.target.name]: e.target.value });
  componentDidMount() {
    this.getAllTypePrestationFamille(famille);
  }

  async getAllTypePrestationFamille(idFamille) {
    let response = await getTypePrestationFamille(idFamille);
    this.setState({
      typePrestation: response.data
    });
  }

  async getAllPiece(code) {
    let response = await getPieceJoint(code);
    this.setState({
      pieceJointe: response.data.content
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };

    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => (
      <div>
        <Row span={24}>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label="Type prestation"
              required={false}
            >
              {getFieldDecorator(`type[${k}]`)(
                <Select
                  onChange={this.handleChange}
                  placeholder="- Veuillez sélectionner -"
                  labelInValue
                >
                  {this.state.typePrestation.map(element => {
                    return (
                      <Option value={element.id} label={element.libelle}>
                        {element.libelle}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label="Délai de déclaration"
              required={false}
            >
              {getFieldDecorator(`delai[${k}]`, {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <InputNumber
                  addonAfter="Mois"
                  formatter={currencyFormatter}
                  parser={currencyParser}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              {...formItemLayout}
              label="Pièces justificatives"
              required={false}
              key={k}
            >
              {getFieldDecorator(`piece[${k}]`, {
                rules: [
                  {
                    required: true,
                    message: "Champs obligatoire."
                  }
                ]
              })(
                <Select mode="multiple" placeholder="Select...">
                  {this.state.pieceJointe.map(element => {
                    return (
                      <Option value={element.id} label={element.libelle}>
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

    return (
      <Row>
        <Col span={24} offset={1}>
          <Form
            {...formItemLayout}
            id="stepthree"
            onSubmit={this.handleSubmited}
          >
            <Col span={22}>
              <Divider orientation="left">Modalités de prestations</Divider>
            </Col>
            <Col span={11}>
              <Form.Item label="Seuil examinateur">
                {getFieldDecorator("seuilExaminateur", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                      message: "Format invalide!"
                    }
                  ]
                })(
                  <Input
                    name="seuilExaminateur"
                    addonAfter="Dhs"
                    onChange={this.handleChanged}
                  />
                )}
              </Form.Item>
              <Form.Item label="Seuil conseil">
                {getFieldDecorator("seuilConseil", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                      message: "Format invalide!"
                    }
                  ]
                })(
                  <Input
                    name="seuilConseil"
                    addonAfter="Dhs"
                    onChange={this.handleChanged}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item label="Seuil de la réassurance">
                {getFieldDecorator("seuilReassurance", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                      message: "Format invalide!"
                    }
                  ]
                })(
                  <Input
                    name="seuilReassurance"
                    addonAfter="Dhs"
                    onChange={this.handleChanged}
                  />
                )}
              </Form.Item>
              <Form.Item label="Délai résiliation">
                {getFieldDecorator("delaiResiliation", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/^[0-9\b]+$/),
                      message: "Format invalide!"
                    }
                  ]
                })(
                  <Input
                    name="delaiResiliation"
                    addonAfter="Mois"
                    onChange={this.handleChanged}
                  />
                )}
              </Form.Item>

              <Form.Item label="Délai préavis">
                {getFieldDecorator("delaiPreavis", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/^[0-9\b]+$/),
                      message: "Format invalide!"
                    }
                  ]
                })(
                  <Input
                    name="delaiPreavis"
                    addonAfter="Mois"
                    onChange={this.handleChanged}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={22}>
              <Divider orientation="left">Type de prestations</Divider>
            </Col>
            <Col span={24}>
              {formItems}
              <Form.Item {...formItemLayoutWithOutLabel}>
                <Button
                  type="dashed"
                  onClick={this.add}
                  style={{ width: "60%" }}
                >
                  <Icon type="plus" /> Ajouter
                </Button>
              </Form.Item>
              <Form.Item>
                {this.state.current === 4 && (
                  <Button type="primary" htmlType="submit">
                    Suivant
                    <Icon type="arrow-right" />
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
            <div className="steps-action"></div>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Form.create({ name: "global_state" })(StepThree);
