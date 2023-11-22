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
  Radio,
  Row,
  notification,
  Spin
} from "antd";
import React, { Component } from "react";
import moment from "moment";
import ComponentTitle from "../../../../util/Title/ComponentTitle";
import AddPerMorale from "./AddPerMorale/AddPerMorale";
import AddSouscripteur from "./AddPerPhysique/AddSouscripteur";
import {
  createPersonneMorale,
  createPersonnePhysique,
  getallperson,
  getallPersonMorale,
  getAllSecteurActivite,
  getAllTypePersonneMorales,
  getProfession,
  getSetuation,
  getSexe,
  getVois,
  getByCinIfExist,
  getByPatent
} from "../../../Participants/ParticipantAPI";
import {
  ADMIN,
  AL_AKHDAR_Code,
  AL_YOUSR_Code,
  PERSONNE_MORALE,
  PERSONNE_PHYSIQUE
} from "../../../../constants";
import { getDataFromBankingWebService } from "../../../GestionContrats/ContratsAPI";
import Search from "antd/lib/input/Search";

let consumeDatas = null;
class StepOne extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profession: {},
      radio: this.props.radio.value,
      souscripteur: this.props.souscripteur.value,
      permorale: false,
      perphysique: false,
      sexe: [],
      assure: this.props.assure.value,
      setuations: [],
      professions: [],
      disable: false,
      disableMoral: false,
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
      typeProduit: "MRB",
      personMoraleList: [],
      personMoraleListForAuto: [],
      souscripteurIsAssure: this.props.souscripteurIsAssure.value,
      disableSouscripteuretAssure: this.props.souscripteurIsAssure.value,
      dossierFinnancementForAuto: [],
      selectedRefDossier: [],
      consumeReferenceDossier: "",
      partenaire: this.props.currentUser.pointVentes[0].partenairepv,
      partenaireCode: "",
      partenaireRadio: AL_AKHDAR_Code,
      isAdmin: false,
      partenaireData: {},
      loadingPartnerAPI: false,
      cinAssure: "",
      dataload: false
    };
    this.handleChangeCinSouscripteur = this.handleChangeCinSouscripteur.bind(
      this
    );
    // this.handleChangeNumDossier = this.handleChangeNumDossier.bind(this);
    this.clearAutocompleteFields = this.clearAutocompleteFields.bind(this);
    this.saveSouscripteur = this.saveSouscripteur.bind(this);
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
    personslist.data.content.forEach(element => {
      const object = element.cin;
      helpArray.push(object);
    });

    let refDossierFinancement = [];

    let helpArraymorale = [];
    personsMoraleListResponse.data.content.forEach(element => {
      const object = element.patente;
      helpArraymorale.push(object);
    });

    this.setState({
      dossierFinnancementForAuto: [...refDossierFinancement],
      personMoraleList: [...personsMoraleListResponse.data.content],
      sexe: [...gander.data],
      setuations: [...setuation.data],
      vois: [...vois.data],
      dataloaded: true,
      dataload: true,
      professions: [...profrssionResponse.data.content],
      personlist: [...personslist.data.content],
      personlistForAuto: [...helpArray],
      personMoraleListForAuto: [...helpArraymorale],
      typePersonneMoral: [...typePersonneMoraleResponse.data],
      secteurActivite: [...secteurActiviteResponse.data.content]
    });
  }
  componentDidMount() {
    this.getproprties();

    this.props.currentUser.roles.forEach(element => {
      if (element.name === ADMIN) {
        this.setState({
          isAdmin: true,
          partenaireCode: this.state.partenaireRadio
        });
      } else {
        this.setState({
          partenaireCode: this.props.currentUser.pointVentes[0].partenairepv
            .code
        });
      }
    });
  }
  searchPersonnemorale = value => {
    const dataSource = [...this.state.personMoraleList];
    this.setState({
      souscripteur: dataSource.filter(item => item.patente === value.key)[0],
      patente: value.key
    });

  };
  searchPersonnePhysique = value => {
    const dataSource = [...this.state.personlist];
    this.setState({
      souscripteur: dataSource.filter(item => item.cin === value.key)[0],
      cin: value.key
    });
   
  };
  onChangeSelect = value => {
    console.log("value change: ", value);
    const dataSource = [...this.state.personlist];
    this.setState({
      assurePresent: true,
      assure: dataSource.filter(item => item.cin === value.key)[0]
    });
    if (consumeDatas !== null) {
        consumeDatas.assure = dataSource.filter(item => item.cin === value.key)[0];
    }
    // consumeDatas.assurePresent = true;
    // consumeDatas.assure = dataSource.filter(item => item.cin === value.key)[0];
  };
  handleSabmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {});
  };
  handleChangeCinSouscripteur(value) {
    this.setState({ selectedCinSouscripteur: value });
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
    consumeDatas.assure = data;
    consumeDatas.assurePresent = true;

    this.props.form.setFieldsValue({
      assure: { key: data.cin, label: data.cin }
      // consumeAssure: { key: data.cin, label: data.cin }
    });
  };

  componentDidUpdate(_, prevState) {
    this.props.check(
      this.state.souscripteurIsAssure,
      this.state.souscripteurIsAssure || this.state.assurePresent,
      this.state.souscripteur !== "",
      this.state.souscripteur,
      this.state.assure,
      consumeDatas
    );
  }

  handlechange = e => {
    this.setState({
      radio: e.target.value,
      souscripteur: "",
      assure: "",

      souscripteurIsAssure: "",
      disableSouscripteuretAssure: ""
    });
    if (consumeDatas !== null) {
      consumeDatas.assure = "";
    }

    this.clearAutocompleteFields();
  };
  onChange = e => {
    if (this.state.radio === "physique" && e.target.checked) {
      this.setState({
        assure: this.state.souscripteur,
        souscripteurIsAssure: true,
        disableSouscripteuretAssure: true,
        dataload: false
      });
      this.props.form.setFieldsValue({
        cinAssure: {
          key: this.state.souscripteur.cin,
          label: this.state.souscripteur.cin
        }
      });
      if (consumeDatas !== undefined && consumeDatas !== null) {
        consumeDatas.assure = this.state.souscripteur;
        this.props.form.setFieldsValue({
          assure: {
            key: this.state.souscripteur.cin,
            label: this.state.souscripteur.cin
          }
        });
      }
    } else
      this.setState({
        souscripteurIsAssure: false,
        disableSouscripteuretAssure: false
      });
  };
  calculeAge(date) {
    return moment().diff(moment(date), "years");
  }

  async saveSouscripteur(value) {
    this.setState({
      loadingPartnerAPI: true,
      disableSouscripteuretAssure: true,
      dataloaded: false
    });
    let consumeData;
    try {
      consumeData = await getDataFromBankingWebService(
        this.state.partenaireCode,
        value
      );

      consumeData.data.partenaire = this.state.partenaire;

      if (consumeData.data.typePersonne === PERSONNE_PHYSIQUE) {
        this.setState({ disable: true, disableAdd: true });
        try {
          consumeData.data.profession = consumeData.data.profession.id;
          let response = await createPersonnePhysique(consumeData.data);
          if (response.status === 200) {
            consumeDatas = consumeData.data;

            this.setState({
              personlist: [...this.state.personlist, response.data],
              souscripteur: response.data,
              radio: "physique",
              personlistForAuto: [
                ...this.state.personlistForAuto,
                consumeData.data.cin
              ]
            });

            this.props.form.setFieldsValue({
              cin: {
                key: response.data.cin,
                label: response.data.cin
              },
              radio: "physique"
            });
          }
        } catch (error) {
          let responsecin = await getByCinIfExist(consumeData.data.cin);

          if (responsecin.status === 200) {
            this.setState({ loadingPartnerAPI: false });

            consumeDatas = consumeData.data;

            this.setState({
              personlist: [...this.state.personlist, responsecin.data],
              souscripteur: responsecin.data,

              radio: "physique",
              personlistForAuto: [
                ...this.state.personlistForAuto,
                consumeData.data.cin
              ]
            });

            this.props.form.setFieldsValue({
              cin: {
                key: responsecin.data.cin,
                label: responsecin.data.cin
              },
              radio: "physique"
            });
            consumeDatas.souscripteur = this.state.souscripteur;
            consumeDatas.assure = this.state.assure;
          } else if (error.responsecin.status === 500) {
            this.setState({ loadingPartnerAPI: false });

            notification.error({
              message:
                "Sorry! Something went wrong. Please try again!!!!!!!!!!!!!"
            });
          }
        }
      }
      if (consumeData.data.typePersonne === PERSONNE_MORALE) {
        this.setState({ disableMoral: true, disableAdd: true });
        try {
          let response = await createPersonneMorale(consumeData.data);
          if (response.status === 200) {
            this.setState({ loadingPartnerAPI: false });

            consumeDatas = consumeData.data;
            notification.success({
              message: "personne bien ajoute"
            });
            this.setState({
              personMoraleList: [...this.state.personMoraleList, response.data],
              souscripteur: response.data,
              radio: "morale",
              personlistForAuto: [
                ...this.state.personlistForAuto,
                consumeData.data.patente
              ]
            });
            consumeDatas.souscripteur = this.state.souscripteur;
            consumeDatas.assure = this.state.assure;
            this.props.form.setFieldsValue({
              patente: {
                key: consumeData.data.patente,
                label: consumeData.data.patente
              },
              radio: "morale"
            });
          }
        } catch (error) {
          let response = await getByPatent(consumeData.data.patente);
          if (response.status === 200) {
            this.setState({ loadingPartnerAPI: false });

            consumeDatas = consumeData.data;
            notification.success({
              message: "personne deja inscrit"
            });
            this.setState({
              personMoraleList: [...this.state.personMoraleList, response.data],
              souscripteur: response.data,
              radio: "morale",
              personlistForAuto: [
                ...this.state.personlistForAuto,
                consumeData.data.patente
              ]
            });
            this.props.form.setFieldsValue({
              patente: {
                key: consumeData.data.patente,
                label: consumeData.data.patente
              },
              radio: "morale"
            });
            consumeDatas.souscripteur = this.state.souscripteur;
          } else if (error.response.status === 500) {
            this.setState({ loadingPartnerAPI: false });

            notification.error({
              message: "Attention! Il y a une manque des données"
            });
          } else {
            notification.error({
              message: "Takaful",
              description:
                error.message || "Sorry! saisissez les champs manquents"
            });
          }
        }
      } else if (consumeData.data.typePersonne === "") {
        notification.info({
          message: "le type du client manquant"
        });
      }
    } catch (error) {
      this.setState({ loadingPartnerAPI: false });
      notification.info({
        message: "aucune donnée reçue"
      });
    }
  }

  changePartenaire = e => {
    this.setState({
      partenaireRadio: e.target.value,
      partenaireCode: e.target.value
    });
    this.clearAutocompleteFields();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    var age = 0;
    if (this.state.souscripteur.dateNaissance === undefined) {
      age = moment().diff(
        moment(this.state.assure.dateNaissance, "DD-MM-YYYY").format(),
        "years"
      );
    } else {
      age = moment().diff(
        moment(this.state.souscripteur.dateNaissance, "DD-MM-YYYY").format(),
        "years"
      );
    }
    return (
      <Row>
        <Col offset={1} span={23}>
          <Form layout="inline" onSubmit={this.handleSabmit} id="formadd">
            <Col span={24}>
              {this.state.isAdmin === true && (
                <Form.Item>
                  {getFieldDecorator("partenaire", {
                    rules: [{ required: false }],
                    initialValue: this.state.partenaireRadio
                  })(
                    <Radio.Group
                      style={{ marginBottom: 25 }}
                      buttonStyle="solid"
                      value={this.state.partenaireRadio}
                      onChange={this.changePartenaire}
                    >
                      <Radio.Button value={AL_AKHDAR_Code}>
                        AlAkhdar banque
                      </Radio.Button>
                      <Radio.Button value={AL_YOUSR_Code}>
                        AlYousr banque
                      </Radio.Button>
                    </Radio.Group>
                  )}
                </Form.Item>
              )}
            </Col>
            <Col span={24}>
              <Row>
                <Col span={14}>
                  <Form.Item label="N° Dossier de financement/Id Client">
                    {getFieldDecorator("numeroDossierFinancement", {
                      rules: [{ required: false }]
                    })(
                      <Search
                        onSearch={this.saveSouscripteur}
                        placeholder="N° Dossier de financement"
                        enterButton="OK"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col offset={2} span={4}>
                  <div style={{ margin: "50px 15px 50px 15px" }}>
                    <Spin spinning={this.state.loadingPartnerAPI} />
                  </div>
                </Col>
              </Row>
            </Col>
            <ComponentTitle level={4} title="Le souscripteur" />
            <div style={{ minHeight: "200px" }}>
              <Row>
                <Col span={8}>
                  <Col span={24}>
                    <Form.Item>
                      {getFieldDecorator("radio", {
                        rules: [{ required: false }],
                        initialValue: this.state.radio
                      })(
                        <Radio.Group
                          style={{ marginBottom: 25 }}
                          buttonStyle="solid"
                          value={this.state.radio}
                          onChange={this.handlechange}
                          disabled={this.state.disabled}
                        >
                          <Radio.Button
                            value="morale"
                            disabled={this.state.disable}
                          >
                            Personne morale
                          </Radio.Button>
                          <Radio.Button
                            value="physique"
                            disabled={this.state.disableMoral}
                          >
                            Personne physique
                          </Radio.Button>
                        </Radio.Group>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    {this.state.radio === "physique" && (
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
                            style={{ width: 200 }} // 215 ecran pc bureau
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
                    {this.state.radio === "morale" && (
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
                        this.state.radio === "physique" && (
                          <AddSouscripteur
                            titre="Création d'un nouveau souscripteur physique"
                            personCreation={
                              this.handlePersonphyCreationSousctipteur
                            }
                            professions={this.state.professions}
                            sexe={this.state.sexe}
                            setuation={this.state.setuations}
                            vois={this.state.vois}
                            type={this.state.typeProduit}
                          />
                        )}
                      {this.state.dataloaded &&
                        this.state.radio === "morale" && (
                          <AddPerMorale
                            titre="Création"
                            personCreation={
                              this.handlePersonMoraleCreationSousctipteur
                            }
                            typePersonneMoral={this.state.typePersonneMoral}
                            secteurActivite={this.state.secteurActivite}
                            vois={this.state.vois}
                          />
                        )}
                    </Form.Item>
                    {this.state.radio === "physique" && (
                      <Checkbox
                        style={{ marginTop: "10px" }}
                        onChange={this.onChange}
                        checked={this.state.souscripteurIsAssure}
                        disabled={!this.state.radio === "physique"}
                      >
                        Le souscripteur est l&apos;assuré lui même ?
                      </Checkbox>
                    )}
                  </Col>
                </Col>
                <Col offset={1} span={14}>
                  {this.state.radio === "physique" &&
                    this.state.souscripteur !== "" &&
                    age <= 69 && (
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
                        <Descriptions.Item label="Age">
                          {age}{" "}
                        </Descriptions.Item>
                        <Descriptions.Item label="CIN">
                          {this.state.souscripteur.cin}
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
                  {this.state.radio === "physique" &&
                    this.state.souscripteur !== "" &&
                    age > 69 &&
                    notification.error({
                      message: "Takaful",
                      description:
                        "Ce sociétaire a dépassé l'âge autorisé à la souscription"
                    })}
                  {this.state.radio === "morale" &&
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
                    {this.state.souscripteurIsAssure ? (
                      <Form.Item label="L'assuré">
                        {getFieldDecorator("cinAssure", {
                          rules: [
                            { required: true, message: "assuree is required!" }
                          ]
                        })(
                          <AutoComplete
                            disabled={
                              this.state.disableSouscripteuretAssure &&
                              this.state.radio === "physique"
                            }
                            size="default"
                            style={{ width: 182 }} // 192 pc bureau
                            dataSource={this.state.personlistForAuto}
                            onSelect={this.onChangeSelect}
                            // // onChange={this.changeCinAssure}
                            allowClear={true}
                            labelInValue
                            value={this.state.selectedCinSouscripteur}
                            placeholder="ajouter un assuré"
                            filterOption={(inputValue, option) =>
                              option.props.children
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                          />
                        )}
                      </Form.Item>
                    ) : (
                      <Form.Item label="L'assuré">
                        {getFieldDecorator("cinAssure", {
                          rules: [
                            { required: true, message: "assuree is required!" }
                          ]
                        })(
                          <div>
                            <AutoComplete
                              disabled={
                                this.state.disableSouscripteuretAssure &&
                                this.state.radio === "physique"
                              }
                              size="default"
                              style={{ width: 182 }} // 192 pc bureau
                              dataSource={this.state.personlistForAuto}
                              onSelect={this.onChangeSelect}
                              // // onChange={this.changeCinAssure}
                              allowClear={true}
                              labelInValue
                              // value={this.state.selectedCinSouscripteur}
                              placeholder="ajouter un assuré"
                              filterOption={(inputValue, option) =>
                                option.props.children
                                  .toUpperCase()
                                  .indexOf(inputValue.toUpperCase()) !== -1
                              }
                            />
                          </div>
                        )}
                      </Form.Item>
                    )}

                    <Form.Item style={{ float: "right" }}>
                      {this.state.dataload && (
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

                      <Descriptions.Item label="Age">{age} </Descriptions.Item>

                      <Descriptions.Item label="CIN">
                        {this.state.assure.cin}
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
    console.log("props", props);
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

      souscripteur: Form.createFormField({
        ...props.souscripteur,
        value: props.souscripteur.value
      }),

      radio: Form.createFormField({
        ...props.radio,
        value: props.radio.value
      })
    };
  }
})(StepOne);
