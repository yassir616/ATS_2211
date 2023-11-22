/* eslint-disable react/prop-types */
import "./AjoutCauseRes.css";
import "antd/dist/antd.css";
import { ajoutCauseRes } from "../Restitutions/RestitutionAPI";
import {
  Button,
  Col,
  Drawer,
  Form,
  Icon,
  Input,
  notification,
  Row
} from "antd";
import React from "react";

class AjoutCauseRes extends React.Component {
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

  async ajouterCauseRestitution(values) {
    try {
      let response = await ajoutCauseRes(values);
      if (response.status === 200) {
        this.onClose();
        notification.success({
          message: "La création de la cause restitution est bien faite"
        });
        window.location.reload();
      }
    } catch (error) {
      if (error.response.data.message === "cause restitution already exists") {
        notification.error({
          message: "Cette restitution existe déja."
        });
      } else {
        notification.error({
          message: "Takaful",
          description:
            error.message || "Sorry! Something went wrong. Please try again!"
        });
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.ajouterCauseRestitution(values);
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
          <Icon type="plus" /> Nouvelle cause restitution
        </Button>
        <Drawer
          title="Creation d'un nouvelle cause restitution"
          onClose={this.onClose}
          width="300"
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col>
                <Form.Item label="Libelle :">
                  {getFieldDecorator("libelle", {
                    rules: [{ required: true, message: "Tapez le libelle" }]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez le libelle"
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
                Ajouter
              </Button>
            </div>
          </Form>
        </Drawer>
      </div>
    );
  }
}
export default Form.create()(AjoutCauseRes);
