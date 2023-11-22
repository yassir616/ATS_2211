/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  AutoComplete,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  notification,
  Radio,
  Row
} from "antd";
import React, { Component } from "react";
import ComponentTitle from "../../../../../util/Title/ComponentTitle";
import AddPerMorale from "./AddPerMorale/AddPerMorale";
import AddSouscripteur from "./AddPerPhysique/AddSouscripteur";
import {
  ajoutProfession,
  createPersonneMorale,
  createPersonnePhysique,
  getallperson,
  getallPersonMorale,
  getAllSecteurActivite,
  getAllTypePersonneMorales,
  getProfession,
  getSetuation,
  getSexe,
  getVois
} from "../../../../Participants/ParticipantAPI";
import { getConsumeDataByCodeClientOrRefDossier } from "../../../ContratsAPI";
import { PERSONNE_MORALE, PERSONNE_PHYSIQUE } from "../../../../../constants";
const { Option } = AutoComplete;
class StepOne extends Component {
  constructor(props) {
    super(props);

    this.state = {
      moraleOuPhysique: this.props.moraleOuPhysique.value,
      souscripteur: this.props.souscripteur.value,
      permorale: false,
      perphysique: false,
      sexe: [],
      assure: this.props.assure.value,
      setuations: [],
      professions: [],
      vois: [],
      dataloaded: false,
      personlist: [],
      personlistForAuto: [],
      selectedPatente: [],
      selectedCinSouscripteur: [],
      selectedCinAsuree: [],
      assurePresent: this.props.assurePresent.value,
      typePersonneMoral: [],
      secteurActivite: [],
      personMoraleList: [],
      personMoraleListForAuto: [],
      souscripteurIsAssure: this.props.souscripteurIsAssure.value,
      disableSouscripteuretAssure: this.props.souscripteurIsAssure.value,
      dossierFinnancementForAuto: [],
      selectedRefDossier: []
    };
    this.handleChangeCinSouscripteur = this.handleChangeCinSouscripteur.bind(
      this
    );
    this.clearAutocompleteFields = this.clearAutocompleteFields.bind(this);
  }

  async getproprties() {
    let vois = await getVois();
    let personslist = await getallperson();
    let gander = await getSexe();
    let setuation = await getSetuation();
    let profrssionResponse = await getProfession();
    let personsMoraleListResponse = await getallPersonMorale();
    let typePersonneMoraleResponse = await getAllTypePersonneMorales();
    let secteurActiviteResponse = await getAllSecteurActivite();

    let helpArray = [];
    let refDossierFinancement = [];

    personslist.data.content.forEach(element => {
      const object = element.cin;
      helpArray.push(object);
    });
    let helpArraymorale = [];
    personsMoraleListResponse.data.content.forEach(element => {
      const object = element.patente;
      helpArraymorale.push(object);
    });
    this.setState({
      personMoraleList: [...personsMoraleListResponse.data.content],
      sexe: [...gander.data],
      setuations: [...setuation.data],
      vois: [...vois.data],
      dataloaded: true,
      professions: [...profrssionResponse.data.content],
      personlist: [...personslist.data.content],
      personlistForAuto: [...helpArray],
      dossierFinnancementForAuto: [...refDossierFinancement],
      personMoraleListForAuto: [...helpArraymorale],
      typePersonneMoral: [...typePersonneMoraleResponse.data],
      secteurActivite: [...secteurActiviteResponse.data.content]
    });
  }

  componentDidMount() {
    this.getproprties();
  }

  searchPersonnemorale = value => {
    const dataSource = [...this.state.personMoraleList];
    this.setState({
      souscripteur: dataSource.filter(item => item.patente === value.key)[0],
      patente: value.key
    });
  };

  searchPersonnePhysique = value => {
    console.log(
      "souscripteuuuuur",
      this.state.personlist.filter(item => item.cin === value.key)[0]
    );

    const dataSource = [...this.state.personlist];
    if (dataSource != null) {
      this.setState({
        souscripteur: dataSource.filter(item => item.cin === value.key)[0],
        cin: value.key
      });
      console.log("souscripteur", this.state.souscripteur);
    }
  };

  onChangeSelect = value => {
    const dataSource = [...this.state.personlist];
    this.setState({
      assurePresent: true,
      assure: dataSource.filter(item => item.cin === value.key)[0]
    });
  };

  handleSabmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll();
  };

  handleChangeCinSouscripteur(value) {
    this.setState({ selectedCinSouscripteur: value });
  }

  handleChangeRefDossier(value) {
    this.setState({ selectedRefDossier: value });
  }

  clearAutocompleteFields() {
    this.props.form.setFieldsValue({
      patente: "",
      cin: "",
      cinAssure: "",
      numeroDossierFinancement: ""
    });
  }

  handlePersonphyCreationSousctipteur = data => {
    this.setState({ souscripteur: data, perphysique: true, permorale: false });
    this.props.form.setFieldsValue({
      cin: { key: data.cin, label: data.cin }
    });
  };

  handlePersonMoraleCreationSousctipteur = data => {
    this.setState({ souscripteur: data, permorale: true, perphysique: false });
    this.props.form.setFieldsValue({
      patente: { key: data.patente, label: data.patente }
    });
  };

  handlePersonphyCreationAssure = data => {
    let list = [...this.state.personlist];
    list.push(data);
    this.setState({ assure: data, assurePresent: true, personlist: [...list] });
    this.props.form.setFieldsValue({
      assure: { key: data.cin, label: data.cin }
    });
  };

  componentDidUpdate(prevProps, prevState) {
    this.props.check(
      this.state.souscripteurIsAssure,
      this.state.souscripteurIsAssure || this.state.assurePresent,
      this.state.souscripteur !== "",
      this.state.souscripteur,
      this.state.assure
    );
  }

  handlechange = e => {
    this.setState({
      moraleOuPhysique: e.target.value,
      souscripteur: "",
      assure: "",
      souscripteurIsAssure: "",
      disableSouscripteuretAssure: ""
    });
    this.clearAutocompleteFields();
  };

  onChange = e => {
    if (this.state.moraleOuPhysique === "physique" && e.target.checked) {
      this.setState({
        assure: this.state.souscripteur,
        souscripteurIsAssure: true,
        disableSouscripteuretAssure: true
      });
      this.props.form.setFieldsValue({
        assure: {
          key: this.state.souscripteur.cin,
          label: this.state.souscripteur.cin
        },
        cinAssure: this.state.selectedCinSouscripteur
      });
    } else
      this.setState({
        souscripteurIsAssure: false,
        disableSouscripteuretAssure: false
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Row>
        <Col offset={1} span={23}>
          <ComponentTitle level={4} title="Le souscripteur" />
          <Form layout="inline" onSubmit={this.handleSabmit} id="formadd">
            <div style={{ minHeight: "200px" }}>
              <Row>
                <Col span={8}>
                  <Col span={24}>
                    <Form.Item>
                      {getFieldDecorator("moraleOuPhysique", {
                        rules: [{ required: false }],
                        initialValue: this.state.moraleOuPhysique
                      })(
                        <Radio.Group
                          style={{ marginBottom: 25 }}
                          buttonStyle="solid"
                          defaultValue={this.state.moraleOuPhysique}
                          onChange={this.handlechange}
                        >
                          <Radio.Button value="morale">
                            Personne morale
                          </Radio.Button>
                          <Radio.Button value="physique">
                            Personne physique
                          </Radio.Button>
                        </Radio.Group>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    {this.state.moraleOuPhysique === "physique" && (
                      <Form.Item label="CIN">
                        {getFieldDecorator("cin", {
                          rules: [
                            { required: true, message: "CIN is required!" }
                          ]
                        })(
                          <AutoComplete
                            disabled={this.state.disableSouscripteuretAssure}
                            defaultActiveFirstOption
                            size="default"
                            style={{ width: 200 }}
                            dataSource={this.state.personlistForAuto}
                            onSelect={this.searchPersonnePhysique}
                            allowClear={true}
                            value={this.state.selectedCinSouscripteur}
                            onChange={this.handleChangeCinSouscripteur}
                            labelInValue
                            placeholder="CIN"
                            filterOption={(inputValue, option) =>
                              option.props.children
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                          />
                        )}
                      </Form.Item>
                    )}
                    {this.state.moraleOuPhysique === "morale" && (
                      <Form.Item label="Patente">
                        {getFieldDecorator("patente", {
                          rules: [
                            { required: true, message: "patente is required!" }
                          ]
                        })(
                          <AutoComplete
                            size="default"
                            className="not-rounded"
                            style={{ width: 182 }} // 192 pc bureau
                            dataSource={this.state.personMoraleListForAuto}
                            onSelect={this.searchPersonnemorale}
                            allowClear={true}
                            labelInValue
                            placeholder="Numéro de patente"
                            filterOption={(inputValue, option) =>
                              option.props.children
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                          />
                        )}
                      </Form.Item>
                    )}
                    <Form.Item style={{ float: "right" }}>
                      {this.state.dataloaded &&
                        this.state.moraleOuPhysique === "physique" && (
                          <AddSouscripteur
                            titre="Création d'un nouveau souscripteur physique"
                            personCreation={
                              this.handlePersonphyCreationSousctipteur
                            }
                            professions={this.state.professions}
                            sexe={this.state.sexe}
                            setuation={this.state.setuations}
                            vois={this.state.vois}
                          />
                        )}
                      {this.state.dataloaded &&
                        this.state.moraleOuPhysique === "morale" && (
                          <AddPerMorale
                            titre="Création d'un nouveau souscripteur morale"
                            personCreation={
                              this.handlePersonMoraleCreationSousctipteur
                            }
                            typePersonneMoral={this.state.typePersonneMoral}
                            secteurActivite={this.state.secteurActivite}
                            vois={this.state.vois}
                          />
                        )}
                    </Form.Item>
                    {this.state.moraleOuPhysique === "physique" && (
                      <Checkbox
                        style={{ marginTop: "10px" }}
                        onChange={this.onChange}
                        checked={this.state.souscripteurIsAssure}
                        disabled={!this.state.moraleOuPhysique === "physique"}
                      >
                        Le souscripteur est l&apos;assuré lui même ?
                      </Checkbox>
                    )}
                    <Divider style={{ marginTop: "20px" }}></Divider>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="N° Dossier de financement/Id Client">
                      {getFieldDecorator("numeroDossierFinancement")(
                        <Input placeholder="N° Dossier de financement"></Input>
                      )}
                    </Form.Item>
                  </Col>
                </Col>
                <Col offset={1} span={14}>
                  {this.state.moraleOuPhysique === "physique" &&
                    this.state.souscripteur !== "" && (
                      <Descriptions
                        size="small"
                        column={2}
                        bordered={true}
                        title="Informations du souscripteur physique"
                      >
                        <Descriptions.Item label="Prénom">
                          {this.state.souscripteur.prenom}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nom">
                          {this.state.souscripteur.nom}
                        </Descriptions.Item>
                        <Descriptions.Item label="Date de naissance">
                          {this.state.souscripteur.dateNaissance}
                        </Descriptions.Item>
                        <Descriptions.Item label="Sexe">
                          {this.state.souscripteur.sexe}{" "}
                        </Descriptions.Item>
                        <Descriptions.Item label="CIN">
                          {this.state.souscripteur.cin}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nombre d'enfants">
                          {this.state.souscripteur.nombreEnfants}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ville">
                          {this.state.souscripteur.adressVille}
                        </Descriptions.Item>
                        <Descriptions.Item label="RIB">
                          {this.state.souscripteur.rib}
                        </Descriptions.Item>
                        <Descriptions.Item label="Matricule">
                          {this.state.souscripteur.matricule}
                        </Descriptions.Item>
                        <Descriptions.Item label="N° Tiers">
                          {this.state.souscripteur.numTiers}
                        </Descriptions.Item>
                      </Descriptions>
                    )}

                  {this.state.souscripteur === "" && (
                    <Empty
                      description="Merci de mentionner le numéro de patente ou cin"
                      style={{
                        margin: "3% auto",
                        color: "rgba(0, 0, 0, 0.45)"
                      }}
                    />
                  )}
                  {this.state.moraleOuPhysique === "morale" &&
                    this.state.souscripteur !== "" && (
                      <Descriptions
                        size="small"
                        column={2}
                        bordered={true}
                        title="Informations du souscripteur morale"
                      >
                        <Descriptions.Item label="Abb">
                          {this.state.souscripteur.abb}
                        </Descriptions.Item>
                        <Descriptions.Item label="Raison sociale">
                          {this.state.souscripteur.raisonSociale}
                        </Descriptions.Item>
                        <Descriptions.Item label="Patente">
                          {this.state.souscripteur.patente}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ice">
                          {this.state.souscripteur.ice}
                        </Descriptions.Item>
                        <Descriptions.Item label="Code">
                          {this.state.souscripteur.code}
                        </Descriptions.Item>
                      </Descriptions>
                    )}
                </Col>
                <Col offset={1} span={1}></Col>
              </Row>
            </div>
            <div style={{ minHeight: "200px" }}>
              <Row style={{ marginTop: "20px" }}>
                <ComponentTitle level={4} title="L'assuré" />
                <Col span={8}>
                  <Col span={24}>
                    <Form.Item label="L'assuré">
                      {getFieldDecorator("cinAssure", {
                        rules: [
                          { required: true, message: "assuree is required!" }
                        ]
                      })(
                        <AutoComplete
                          disabled={
                            this.state.disableSouscripteuretAssure &&
                            this.state.moraleOuPhysique === "physique"
                          }
                          size="default"
                          style={{ width: 182 }} // 192 pc bureau
                          dataSource={this.state.personlistForAuto}
                          onSelect={this.onChangeSelect}
                          allowClear={true}
                          labelInValue
                          placeholder="ajouter un assuré"
                          filterOption={(inputValue, option) =>
                            option.props.children
                              .toUpperCase()
                              .indexOf(inputValue.toUpperCase()) !== -1
                          }
                        />
                      )}
                    </Form.Item>
                    <Form.Item style={{ float: "right" }}>
                      {this.state.dataloaded && (
                        <AddSouscripteur
                          titre="Création d'un nouveau assuré"
                          personCreation={this.handlePersonphyCreationAssure}
                          professions={this.state.professions}
                          sexe={this.state.sexe}
                          setuation={this.state.setuations}
                          vois={this.state.vois}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}></Col>
                </Col>
                <Col offset={1} span={14}>
                  {this.state.assure !== "" && (
                    <Descriptions
                      size="small"
                      column={2}
                      bordered={true}
                      title="Informations de l'assuré"
                    >
                      <Descriptions.Item label="Prénom">
                        {this.state.assure.prenom}
                      </Descriptions.Item>
                      <Descriptions.Item label="Nom">
                        {this.state.assure.nom}
                      </Descriptions.Item>
                      <Descriptions.Item label="Date de naissance">
                        {this.state.assure.dateNaissance}
                      </Descriptions.Item>
                      <Descriptions.Item label="Sexe">
                        {this.state.assure.sexe}{" "}
                      </Descriptions.Item>
                      <Descriptions.Item label="CIN">
                        {this.state.assure.cin}
                      </Descriptions.Item>
                      <Descriptions.Item label="Nombre d'enfants">
                        {this.state.assure.nombreEnfants}
                      </Descriptions.Item>
                      <Descriptions.Item label="Matricule">
                        {this.state.assure.matricule}
                      </Descriptions.Item>
                    </Descriptions>
                  )}
                  {this.state.assure === "" && (
                    <Empty
                      description="Merci de remplir la partie assure"
                      style={{
                        margin: "3% auto",
                        color: "rgba(0, 0, 0, 0.45)"
                      }}
                    />
                  )}
                </Col>
                <Col offset={1} span={1}></Col>
              </Row>
            </div>
          </Form>
        </Col>
        <Col offset={1} span={1}></Col>
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
      numeroDossierFinancement: Form.createFormField({
        ...props.numeroDossierFinancement,
        value: props.numeroDossierFinancement.value
      }),
      cin: Form.createFormField({
        ...props.cin,
        value: props.cin.value
      }),
      patente: Form.createFormField({
        ...props.patente,
        value: props.patente.value
      }),
      assure: Form.createFormField({
        ...props.assure,
        value: props.assure.value
      }),
      cinAssure: Form.createFormField({
        ...props.cinAssure,
        value: props.cinAssure.value
      }),
      moraleOuPhysique: Form.createFormField({
        ...props.moraleOuPhysique,
        value: props.moraleOuPhysique.value
      })
    };
  }
})(StepOne);
