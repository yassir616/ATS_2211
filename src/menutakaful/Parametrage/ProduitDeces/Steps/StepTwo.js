/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Col,
  Divider,
  Form,
  Icon,
  Input,
  Radio,
  Row,
  Select
} from "antd";
import React, { Component } from "react";
import { getExclusion } from "../../../EchangeFichiersInformatiques/EchangeFileAPI";
let exclusFamille = "Deces";
const { Option } = Select;
class StepTwo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exclusions: [],
      current: 2,
      visible: false
    };
  }
  next = () => {
    if (this.state.current === 2) {
      const current = this.state.current + 1;
      this.setState({ current });
      this.props.check(current);
    }
  };
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
    this.props.check(current);
  }
  onChange = e => {
    this.setState({
      visible: e.target.value
    });
  };
  componentDidMount() {
    this.getAllExclusion(exclusFamille);
  }

  async getAllExclusion(famille) {
    let response = await getExclusion(famille);

    this.setState({
      exclusions: response.data.content
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (
        values.ageMaxEligibilite !== "" &&
        values.ageMin !== "" &&
        values.differeMax !== "" &&
        values.differeMin !== "" &&
        values.dureeMax !== "" &&
        values.dureeMin !== "" &&
        values.fraisAcquisition !== "" &&
        values.fraisGestion !== "" &&
        values.taxe !== "" &&
        values.exclusion !== undefined
      ) {
        this.next();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { current } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };

    return (
      <Row>
        <Col span={24} offset={1}>
          <Form {...formItemLayout} id="steptwo" onSubmit={this.handleSubmit}>
            <Col span={20}>
              <Divider orientation="left">Informations générales</Divider>
            </Col>
            <Row>
              <Col span={11}>
                <Form.Item label="Frais de gestion WAKALA">
                  {getFieldDecorator("fraisGestion", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="%" />)}
                </Form.Item>
                <Form.Item label="Frais d'acquisition">
                  {getFieldDecorator("fraisAcquisition", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="%" />)}
                </Form.Item>
                {this.props.risque.libelle !== "DECES PREVOYANCE" && (
                  <div>
                    {" "}
                    <Form.Item label="Différé minimum">
                      {getFieldDecorator("differeMin", {
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp(/^[0-9\b]+$/),
                            message: "Format invalide!"
                          }
                        ]
                      })(<Input addonAfter="Mois" />)}
                    </Form.Item>
                    <Form.Item label="Durée minimale">
                      {getFieldDecorator("dureeMin", {
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp(/^[0-9\b]+$/),
                            message: "Format invalide!"
                          }
                        ]
                      })(<Input addonAfter="Mois" />)}
                    </Form.Item>
                  </div>
                )}

                <Form.Item label="Age minimum">
                  {getFieldDecorator("ageMin", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="ANS" />)}
                </Form.Item>
                <Form.Item label="Age maximum d’éligibilité">
                  {getFieldDecorator("ageMaxEligibilite", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="ANS" />)}
                </Form.Item>
                <Form.Item label="Montant accessoire">
                  {getFieldDecorator("montantAccessoire", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="Dhs" />)}
                </Form.Item>
              </Col>

              <Col span={11}>
                <Form.Item label="TVA frais de gestion WAKALA">
                  {getFieldDecorator("tvaFraisGestion", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="%" />)}
                </Form.Item>
                <Form.Item label="TVA frais d'acquisition">
                  {getFieldDecorator("tvaFraisAcquisition", {
                    rules: [
                      {
                        required: true,
                        pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                        message: "Format invalide!"
                      }
                    ]
                  })(<Input addonAfter="%" />)}
                </Form.Item>
                {this.props.risque.libelle !== "DECES PREVOYANCE" && (
                  <div>
                    <Form.Item label="Différé Maximum">
                      {getFieldDecorator("differeMax", {
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp(/^[0-9\b]+$/),
                            message: "Format invalide!"
                          }
                        ]
                      })(<Input addonAfter="Mois" />)}
                    </Form.Item>
                    <Form.Item label="Durée maximale">
                      {getFieldDecorator("dureeMax", {
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp(/^[0-9\b]+$/),
                            message: "Format invalide!"
                          }
                        ]
                      })(<Input addonAfter="Mois" />)}
                    </Form.Item>{" "}
                    <Form.Item label="Taux taxe d'assurance">
                      {getFieldDecorator("taxe", {
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                            message: "Format invalide!"
                          }
                        ]
                      })(<Input addonAfter="%" />)}
                    </Form.Item>
                    <Form.Item label="Taxe parafiscale">
                      {getFieldDecorator("taxeParafiscale", {
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                            message: "Format invalide!"
                          }
                        ]
                      })(<Input addonAfter="%" />)}
                    </Form.Item>
                    <Form.Item label="Age visite médicale">
                      {getFieldDecorator("ageVisite", {
                        rules: [
                          {
                            required: true,
                            pattern: new RegExp(/[+-]?([0-9]*[.])?[0-9]+$/),
                            message: "Format invalide!"
                          }
                        ]
                      })(<Input addonAfter="Ans" />)}
                    </Form.Item>
                  </div>
                )}
              </Col>
            </Row>
            <Row>
              {this.props.risque.libelle !== "DECES PREVOYANCE" && (
                <div>
                  <Col span={10}>
                    <Form.Item label="Echéances impayées à assurer">
                      {getFieldDecorator("visibilite", {
                        valuePropName: "unchecked",
                        initialValue: false
                      })(
                        <Radio.Group
                          buttonStyle="solid"
                          defaultValue={false}
                          onChange={this.onChange}
                        >
                          <Radio.Button value={true}>Oui</Radio.Button>
                          <Radio.Button value={false}>Non</Radio.Button>
                        </Radio.Group>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={13}>
                    {this.state.visible ? (
                      <Form.Item>
                        {getFieldDecorator("echeanceImpayees", {
                          rules: [
                            {
                              required: true,
                              pattern: new RegExp(/^[0-9\b]+$/),
                              message: "Format invalide!"
                            }
                          ]
                        })(<Input addonAfter="Mois" />)}
                      </Form.Item>
                    ) : null}
                  </Col>
                  <Col span={24}>
                    <label>
                      <Form.Item label=" Délai de prescription de l'acceptation" />
                    </label>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="En l'attente du retour participant">
                      {getFieldDecorator("delaiEnAttente", {
                        rules: [
                          { required: true, message: "Champs Obligatoire !" }
                        ]
                      })(<Input addonAfter="Jours" />)}
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Sans souscription">
                      {getFieldDecorator("delaiSansSouscription", {
                        rules: [
                          { required: true, message: "Champs Obligatoire !" }
                        ]
                      })(<Input addonAfter="Jours" />)}
                    </Form.Item>
                  </Col>
                </div>
              )}
            </Row>

            <Col span={20}>
              <Divider orientation="left"> Exclusions</Divider>
            </Col>

            <Col span={24} offset={2}>
              <Form.Item>
                {" "}
                {getFieldDecorator("exclusion", {
                  rules: [{ required: true, message: "Exclusion is required!" }]
                })(
                  <Select mode="multiple" placeholder="Selectionnez ...">
                    {this.state.exclusions.map(element => {
                      return (
                        <Option
                          key={element.id}
                          value={element.id}
                          label={element.exclusionNom}
                        >
                          {element.exclusionNom}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={24}>
              {current === 2 && (
                <Button
                  type="primary"
                  style={{ right: "float", marginBottom: "25px" }}
                  htmlType="submit"
                >
                  Suivant
                  <Icon type="arrow-right" />
                </Button>
              )}
              {current > 0 && (
                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                  <Icon type="arrow-left" />
                  Précédent
                </Button>
              )}
            </Col>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Form.create({
  name: "global_state",
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      fraisGestion: Form.createFormField({
        ...props.fraisGestion,
        value: props.fraisGestion.value
      }),
      fraisAcquisition: Form.createFormField({
        ...props.fraisAcquisition,
        value: props.fraisAcquisition.value
      }),
      differeMin: Form.createFormField({
        ...props.differeMin,
        value: props.differeMin.value
      }),
      differeMax: Form.createFormField({
        ...props.differeMax,
        value: props.differeMax.value
      }),
      dureeMax: Form.createFormField({
        ...props.dureeMax,
        value: props.dureeMax.value
      }),
      dureeMin: Form.createFormField({
        ...props.dureeMin,
        value: props.dureeMin.value
      }),

      ageMin: Form.createFormField({
        ...props.ageMin,
        value: props.ageMin.value
      }),

      taxe: Form.createFormField({
        ...props.taxe,
        value: props.taxe.value
      }),

      ageMaxEligibilite: Form.createFormField({
        ...props.ageMaxEligibilite,
        value: props.ageMaxEligibilite.value
      }),
      echeanceImpayees: Form.createFormField({
        ...props.echeanceImpayees,
        value: props.echeanceImpayees.value
      }),
      delaiEnAttente: Form.createFormField({
        ...props.delaiEnAttente,
        value: props.delaiEnAttente.value
      }),
      delaiSansSouscription: Form.createFormField({
        ...props.delaiSansSouscription,
        value: props.delaiSansSouscription.value
      }),

      tvaFraisAcquisition: Form.createFormField({
        ...props.tvaFraisAcquisition,
        value: props.tvaFraisAcquisition.value
      }),
      tvaFraisGestion: Form.createFormField({
        ...props.tvaFraisGestion,
        value: props.tvaFraisGestion.value
      }),

      exclusion: Form.createFormField({
        ...props.exclusion,
        value: props.exclusion.value
      }),
      visibilite: Form.createFormField({
        ...props.visibilite,
        value: props.visibilite.value
      }),
      taxeParafiscale: Form.createFormField({
        ...props.taxeParafiscale,
        value: props.taxeParafiscale.value
      }),
      ageVisite: Form.createFormField({
        ...props.ageVisite,
        value: props.ageVisite.value
      }),
      montantAccessoire: Form.createFormField({
        ...props.montantAccessoire,
        value: props.montantAccessoire.value
      })
    };
  }
})(StepTwo);
