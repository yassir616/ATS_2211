/* eslint-disable react/prop-types */
import "./AddUserForm.css";
import "antd/dist/antd.css";

import {
  Button,
  Col,
  Drawer,
  Form,
  Icon,
  Input,
  notification,
  Row,
  Select
} from "antd";
import md5 from "md5";
import React, { Component } from "react";
//import { auth, db } from "../../Utilitaire/disccussion/services/firebase";
import { signup } from "../../../user/UserAPI";

const { Option } = Select;

class AddUserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      roles: this.props.Roles,
      createdUser: {}
      //usersRef: db.ref("users")
    };
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

  componentDidUpdate(_, prevState) {
    // if (prevState.createdUser !== this.state.createdUser) {
    //   auth()
    //     .createUserWithEmailAndPassword(
    //       this.state.createdUser.email,
    //       this.state.createdUser.id
    //     )
    //     .then(createdUser => {
    //       createdUser.user
    //         .updateProfile({
    //           displayName:
    //             this.state.createdUser.firstName +
    //             " " +
    //             this.state.createdUser.lastName,
    //           photoURL: `http://gravatar.com/avatar/${md5(
    //             createdUser.user.email
    //           )}?d=identicon`
    //         })
    //         .then(() => {
    //           this.saveUser(createdUser).then(() => {
    //             this.setState({ loading: false });
    //           });
    //         })
    //         .catch(err => {
    //           console.error(err);
    //           this.setState({
    //             errors: this.state.errors.concat(err),
    //             loading: false
    //           });
    //         });
    //       this.setState({ loading: false });
    //     });
    // }
  }

  async signUpUser(values) {
    try {
      let response = await signup(values);

      if (response.status === 200) {
        this.setState({ createdUser: response.data });
        this.onClose();
        notification.success({
          message: "Utilisateur bien crier"
        });
      }
    } catch (error) {
      this.onClose();

      if (error.response.data.message === "takaful user already exists") {
        notification.error({
          message: "Un utilisateur est déja inscrit par cette adress mail."
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
        delete values.confirm;
        let roles = [];
        let Pointvente = [];
        values.roles.forEach(element => {
          roles.push({ name: element });
        });
        values.roles = [...roles];

        values.pointVentes.forEach(element => {
          Pointvente.push({ id: element });
        });

        values.pointVentes = [...Pointvente];

        this.signUpUser(values);
      }
    });
  };

  // saveUser = createdUser => {
  //   return this.state.usersRef.child(createdUser.user.uid).set({
  //     name: createdUser.user.displayName,
  //     avatar: createdUser.user.photoURL
  //   });
  // };
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("Les mots de passe que vous avez saisi ne sont pas identique");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Button
          type="primary"
          className="add-button nouveau-btn"
          onClick={this.showDrawer}
        >
          <Icon type="user-add" /> Nouveau compte
        </Button>
        <Drawer
          title="Création d'un nouveau utilisateur"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Prénom">
                  {getFieldDecorator("firstName", {
                    rules: [
                      {
                        required: true,
                        message: "Tapez le prénom d'utilisateur"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      placeholder="Tapez le prénom d'utilisateur"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nom">
                  {getFieldDecorator("lastName", {
                    rules: [
                      {
                        required: true,
                        message: "Tapez le prénom d'utilisateur"
                      }
                    ]
                  })(
                    <Input
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="Tapez le nom d'utilisateur"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="E-mail">
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
                      placeholder="Tapez l'email d'utilisateur"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="mot de passe" hasFeedback>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "entre votre mot de pass"
                      },
                      {
                        validator: this.validateToNextPassword
                      }
                    ]
                  })(
                    <Input.Password
                      style={{ width: "100%", borderRadius: "0px" }}
                      placeholder="mot de pass"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item hasFeedback label="Confirmation">
                  {getFieldDecorator("confirm", {
                    rules: [
                      {
                        required: true,
                        message: "Merci de confirmer votre mot de passe"
                      },
                      {
                        validator: this.compareToFirstPassword
                      }
                    ]
                  })(
                    <Input.Password
                      className="not-rounded"
                      style={{ width: "100%" }}
                      placeholder="mot de pass"
                      onBlur={this.handleConfirmBlur}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Profil">
                  {getFieldDecorator("roles")(
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="cliquez pour ajouter un profil"
                      optionLabelProp="label"
                    >
                      {this.state.roles.map(element => {
                        return (
                          <Option
                            value={element.name}
                            label={element.name}
                            key={element.name}
                          >
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
              <Col span={24}>
                <Form.Item label="Points de vente">
                  {getFieldDecorator("pointVentes")(
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="cliquez pour ajouter un point de vente"
                      optionLabelProp="label"
                    >
                      {this.props.Pointvente.map(element => {
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

export default Form.create()(AddUserForm);
