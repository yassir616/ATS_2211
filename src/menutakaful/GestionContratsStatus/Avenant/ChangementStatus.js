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
const currentDate = moment(moment(), dateFormat);

class ChangementStatus extends Component {
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
      status: this.props.record.status
    });
  }
  
  disabledDatePrelevement = current => {
    return current < currentDate || Date.parse(current) > Date.parse(this.props.record.dateEcheance);
  };
  
  handleSubmit = event => {


    this.setState({ loading: true });
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      let requestModel = {
        status: values.status,
        datePrelevement: values.datePrelevement,
        seuilConseil: this.props.record.produit.seuilConseil,
        seuilExaminateur: this.props.record.produit.seuilExaminateur,
        seuilReassurance: this.props.record.produit.seuilReassurance,
        invaliditeOuMaladie: this.props.record.invaliditeOuMaladie,
        pensionIncapacite: this.props.record.pensionIncapacite,
        suspendreAtiviteDeuxDernierAnnee: this.props.record
          .suspendreAtiviteDeuxDernierAnnee,
        maladiesOuOperationChirurgicale: this.props.record
          .maladiesOuOperationChirurgicale,
        dateEffetM: moment(this.props.record.dateEffet).format('MM-yyyy'),
        dateSys:moment(moment(), "DD-MM-YYYY").format('MM-YYYY')

      };
      console.log(requestModel);
      
      
      if (!err) {
        
        this.props.saveRequest(requestModel);
      
    }
  

    
    });
  
/*   else{
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        size="small"
        onClick={() => notification.close(key)}
      >
        Confirm
      </Button>
    );
    notification.info({
      message: "Information",
      description: "la Réactivation doit effectuée au cours du meme mois ",
      btn,
      duration: 0,
      key
    });
} */
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
        <Modal
          visible={this.state.visible}
          title="Motif d'annulation"
          onOk={this.handleSubmited}
          onCancel={this.handleCancel}
          width="600px"
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Fermer
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleSubmited}>
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
                <Form.Item label="Status">
                  {getFieldDecorator("status")(
                    <Select
                      placeholder="Sélectionnez "
                      onChange={this.handleChange}
                    >
                      <Option value="VALIDER">Valider</Option>
                      <Option value="ANNULER">Annuler</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Date prélèvement">
                  {getFieldDecorator("datePrelevement")(
                    <DatePicker
                      className="date-style"
                      format={dateFormat}
                      disabledDate={this.disabledDatePrelevement}
                      defaultValue={currentDate}
                    ></DatePicker>
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

export default Form.create()(ChangementStatus);
