/* eslint-disable react/prop-types */
import React, { Component } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Divider,
  Select,
  InputNumber,
  Button,
  Descriptions,
  notification,
  AutoComplete,
  Spin,
  Modal,
  DatePicker
} from "antd";
import moment from "moment";
import { getVois } from "../../Participants/ParticipantAPI";
import { getAllVille } from "../../../util/VillesAPI";

const { Option } = Select;
const { TextArea } = Input;
const dateFormat = "DD-MM-YYYY";

class ChangementDateEffet extends Component {
  state = {
    loading: false,
    visible: false
  };

  async componentDidMount() {
    console.log("props:", this.props);
    this.props.form.setFieldsValue({
      assureNom: this.props.record.assure.nom,
      assurePrenom: this.props.record.assure.prenom,
      souscripteurNom: this.props.record.souscripteur.nom,
      souscripteurPrenom: this.props.record.souscripteur.prenom,
      produit: this.props.record.produit.libelle,
      status: this.props.record.status,
      dateEffet:  moment(this.props.record.dateEffet).day() == 5 ?  moment(this.props.record.dateEffet,"YYYY-MM-DD").add(3, "days").format("YYYY-MM-DD") :
      moment(this.props.record.dateEffet,"YYYY-MM-DD").add(1, "days").format("YYYY-MM-DD")
    });
  }
  
  handleSubmit = event => {
  
    this.setState({ loading: true });
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      let requestModel = {
        dateEffet:moment(this.props.record.cotisation.contrat.dateEffet,"DD-MM-YYYY").day() == 5 ?  moment(this.props.record.cotisation.contrat.dateEffet,"DD-MM-YYYY").add(3, "days") :
        moment(this.props.record.cotisation.contrat.dateEffet,"DD-MM-YYYY").add(1, "days")
      };
      
      console.log(requestModel);
      if (!err) {
        this.props.saveRequest(requestModel);
      }
    });
  };
  handleChange = id => {
    console.log("select change:", id);

    if (id === "ANNULER") {
      this.setState({
        visible: true
      });
    }
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleSubmited = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let request = { motifAnnulation: values.motif, status: values.status };
        this.props.saveRequest(request);
        this.setState({ visible: false });
      }
    });
  };
  //   const key = `open${Date.now()}`;
  //   const btn = (
  //     <Button
  //       type="primary"
  //       size="small"
  //       onClick={() => notification.close(key)}
  //     >
  //       Confirm
  //     </Button>
  //   );
  //   notification.info({
  //     message: "confirmation",
  //     description: "l'avenant vien d'etre ajoute au contrat",
  //     btn,
  //     duration: 0,
  //     key
  //   });
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <span>
        <Spin spinning={this.state.loading}>
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <Divider></Divider>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nom d'assuré">
                  {getFieldDecorator("assureNom")(
                    <Input placeholder="nom d'assuré" disabled />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Prénom d'assuré">
                  {getFieldDecorator("assurePrenom")(
                    <Input placeholder="prenom d'assuré" disabled />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nom du souscripteur">
                  {getFieldDecorator("souscripteurNom")(
                    <Input placeholder="nom du souscripteur" disabled />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Prénom du souscripteur">
                  {getFieldDecorator("souscripteurPrenom")(
                    <Input placeholder="prenom du souscripteur" disabled />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Produit">
                  {getFieldDecorator("produit")(
                    <Input placeholder="produit" disabled />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item label="Date d'effet">
              {getFieldDecorator("dateEffet")
              (
                <Input placeholder="date d'effet" disabled />
              )}
            </Form.Item>
              </Col>
            </Row>
         
            <Button
              key="submit"
              type="primary"
              onClick={this.handleSubmit}
              className="not-rounded"
            >
              Ajouter
            </Button>
          </Form>
        </Spin>
      </span>
    );
  }
}

export default Form.create()(ChangementDateEffet);
