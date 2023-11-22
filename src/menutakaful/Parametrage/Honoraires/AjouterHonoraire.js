/* eslint-disable react/prop-types */
import "./AjouterHonoraire.css";
import "antd/dist/antd.css";
import {
  Button,
  Col,
  Drawer,
  Form,
  Icon,
  Input,
  InputNumber,
  notification,
  Row,
  Select
} from "antd";
import React, { Component } from "react";
import { getTypeAuxiliaire } from "../Auxiliaires/AuxiliaireAPI";
import { ajoutHonoraire } from "./HonorairesAPI";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";

const { Option } = Select;

class AjouterHonoraire extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, auxiliaire: [] };
  }
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
  ajouterHonFunction = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.ajouterHon(values);
      }
    });
  };

  
  async getTypeAux() {
    let auxiliaireResponse = await getTypeAuxiliaire();

    this.setState({
      auxiliaire: auxiliaireResponse.data.content
    });
  }
  componentDidMount() {
    this.getTypeAux();
  }
  async ajouterHon(values) {
    try {
      let response = await ajoutHonoraire(values);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "la creation d'honoraire est bien faite"
        });
        
        if(!this.props.isMedecinHonoraire){
          window.location.reload();
        }
        else{
          this.props.testCreation(response.data);
        }
      }
    } catch (error) {
      if (error.response.data.message === "honoraire already exists") {
        notification.error({
          message: "ce honoraire existe déja."
        });
      } else {
        notification.error({
          message: "Takaful",
          description:
            error.message ||
            "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
        });
      }
    }
  }


  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("values "+values);
        this.ajouterHon(values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button type="primary" className="add-button" onClick={this.showDrawer}>
          <Icon type="plus" /> Nouvel honoraire
        </Button>
        <Drawer
          title="Création d'un nouvel honoraire"
          width={320}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Code :">
                  {getFieldDecorator("code", {
                    rules: [{ required: true, message: "Tapez le code" }]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le code d'honoraire"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Libelle :">
                  {getFieldDecorator("libelle", {
                    rules: [{ required: true, message: "Tapez le libelle" }]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez le libelle d'honoraire"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Montant :">
                  {getFieldDecorator("montantHonoraire", {
                    rules: [{ required: true, message: "Tapez le montant" }]
                  })(
                    <InputNumber
                      className="not-rounded"
                      placeholder="Tapez le montant d'honoraire"
                      formatter={currencyFormatter}
                      parser={currencyParser}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col>
                <Form.Item label="Type auxiliaire :">
                  {getFieldDecorator("typeAuxiliaireId")(
                    <Select
                      placeholder="cliquez pour choisir un type"
                      optionLabelProp="label"
                    >
                      {this.state.auxiliaire.map(element => {
                        return (
                          <Option
                            key={element.id}
                            value={element.id}
                            label={element.code}
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
            <div className="submit-cancel">
              <Button
                className="not-rounded"
                onClick={this.onClose}
                style={{ marginRight: 8 }}
              >
                Fermer
              </Button>
              <Button 
                className="not-rounded" 
                type="primary" 
                onClick={this.ajouterHonFunction}
                // htmlType="submit"
                >
                Ajouter
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    );
  }
}

export default Form.create()(AjouterHonoraire);
