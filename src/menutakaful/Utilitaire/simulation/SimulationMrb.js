/* eslint-disable react/prop-types */
import React, { Component } from "react";
import "antd/dist/antd.css";
import {
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  Input,
  Typography,
  Button,
  Table,
  Icon,
  AutoComplete
} from "antd";
import moment from "moment";
import { connectedUserContext } from "../../../app/App";
import ComponentTitle from "../../../util/Title/ComponentTitle";
import { getAllPartenaire } from "../../Parametrage/partenaire/PartenaireAPI";
import { currencyFormatter, currencyParser } from "../../../util/Helpers";
import {
  getTarificationMrb,
  getAllProductMrb
} from "../../MRB/ProduitMrb/ProduitMRBAPI";
import { getallperson } from "../../Participants/ParticipantAPI";
import { getPeriodicite } from "../../GestionContrats/ContratsAPI";
import { jasperFileMrb } from "../../EchangeFichiersInformatiques/EchangeFileAPI";

const { Title } = Typography;
const dateFormat = "DD-MM-YYYY";
const currentDate = moment(moment(), dateFormat).add(1, "days");
const { Option } = Select;
let pointVente = "";
let dateNaissance = new Date();
let AnneeCivil = 0;

const columnsSimulation = [
  {
    title: "Prime Nette (DH)",
    dataIndex: "primeNette"
  },
  {
    title: "Prime HT (DH)",
    dataIndex: "primeHT"
  },
  {
    title: "Prime EVCAT (DH)",
    dataIndex: "primeEvcat"
  },
  {
    title: "Prime TTC(DH)",
    dataIndex: "primeTTC"
  },

  {
    title: "Prorata HT (DH)",
    dataIndex: "prorata"
  },
  {
    title: "Prorata TTC (DH)",
    dataIndex: "prorataTTC"
  }
];
const columnsSim = [
  {
    title: "Prime Nette (DH)",
    dataIndex: "primeNette"
  },
  {
    title: "Prime HT (DH)",
    dataIndex: "primeHT"
  },
  {
    title: "Prime EVCAT (DH)",
    dataIndex: "primeEvcat"
  },
 /*  {
    title: "Prime TTC(DH)",
    dataIndex: "primeTTC"
  }, */
  {
    title: "Prime TTC(DH)",
    dataIndex: "prorataTTC"
  }
];

class SimulationMrb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateNaissance: null,
      dureeContrat: 0,
      dateEcheance: null,
      dateEffet: currentDate,
      Partenaires: [],
      produits: [],
      produit: {},
      usedProducts: [],
      OptionsAssurance: [],
      tarification: {},

      option: null,
      Prorata: 0,
      prorataTTC: 0,
      primeHT: 0,

      
      primeNette: 0,
      primeTTC: 0,
      primeEvcat: 0,
      taxe: 0,

      valeurBatiment: 0,
      natureBatiment: "",
      valeurContenu: 0,
      dataSimulation: [],

      test: null,
      cin: null,
      nom: null,
      booleen: false,
      prenom: null,
      updated: false,
      periodicite: [],
      period: "",
      personlistForAuto: [],
      personlist: [],
      souscripteur: {},
      selectedCinSouscripteur: [],
      tarificationMrb :[],
      tableDateEcheance :[]
    };
  }

  async getproprties() {
    let personslist = await getallperson();
    let helpArray = [];

    personslist.data.content.forEach(element => {
      const object = element.cin;
      helpArray.push(object);
    });

    this.setState({
      personlist: [...personslist.data.content],
      personlistForAuto: [...helpArray]
    });
  }
  searchPersonnePhysique = value => {
    const dataSource = [...this.state.personlist];
    const sousc = dataSource.filter(item => item.cin === value.key)[0];
    dateNaissance = moment(sousc.dateNaissance, dateFormat);
    this.props.form.setFieldsValue({
      nom: sousc.nom,
      prenom: sousc.prenom,
      dateNaissance: moment(sousc.dateNaissance, dateFormat),
      age: moment().diff(moment(sousc.dateNaissance, dateFormat), "years")
    });
    this.setState({
      souscripteur: sousc,
      nom: sousc.nom,
      prenom: sousc.prenom,
      dateNaissance: sousc.dateNaissance
    });
  };

  handleChangeCinSouscripteur = value => {
    this.setState({ selectedCinSouscripteur: value });
  };
  componentDidMount() {
    this.getDroppDownData();
    this.getAllPeriodicite();
    this.getproprties();
    let dt=[moment.addRealMonth(this.state.dateEffet, 12),moment().endOf('year')];
    this.setState({ tableDateEcheance :dt });
  }
  async getAllPeriodicite() {
    let response = await getPeriodicite();
    this.setState({
      periodicite: response.data.content
    });
  }
  async getTariffication(valeur, nature, produit) {
    let response = await getTarificationMrb(valeur, nature, produit);

    this.setState({ tarification: response.data });
  }
  handleEffetDateChange = value => {
    if (this.state.dateEcheance !== null) {
      let echeanceDate = this.state.dateEcheance;
      this.setState({
        dateEffet: value,
        dureeContrat: echeanceDate.diff(value, "months")
      });
    }
  };

  onChangeDateNaissance = date => {
    let dateConvert = moment(date).format("DD-MM-YYYY");
    this.setState({ dateNaissance: dateConvert });
    const age = moment().diff(moment(date), "years");
    this.props.form.setFieldsValue({
      age: age
    });
  };
  onChangeEncours = e => {
    this.setState({ encours: e.target.value });
  };

  onChangePeriodicite = e => {
    let selected = this.state.periodicite.filter(item => item.id === e);
    this.setState({ period: selected[0].libelle });
  };

  onChangeNom = e => {
    this.setState({ nom: e.target.value });
  };
  onChangePrenom = e => {
    this.setState({ prenom: e.target.value });
  };
  onChangeValeurBatiment = e => {
    this.setState({ valeurBatiment:e , valeurContenu: e/5 });
    let dateEch;
  /*   let valeurC = parseFloat(e.target.value * 20) / 100;
    console.log("valeurC:", valeurC);
    this.setState({ valeurBatiment: e.target.value, valeurContenu: valeurC }); */
      //this will work only in case the valeurBatiment is unique for each product 
      if(this.props.form.getFieldsValue().dateEcheance != null && this.props.form.getFieldsValue().dateEcheance != "")
      { dateEch=this.state.dateEcheance.format("DD-MM-YYYY");
      if(dateEch ==moment.addRealMonth(this.state.dateEffet, 12).format("DD-MM-YYYY"))
      {
      AnneeCivil = 1;
      const SelectedTarification=this.state.tarificationMrb.filter(item => item.valeurBatiment == e);
      const SelectedPrimeNette=SelectedTarification[0].primeNet;
      this.setState({ primeNette:SelectedPrimeNette  });
      const primeEvcat=((SelectedPrimeNette * 8) / 100).toFixed(2);
      const primeHT = parseFloat(SelectedPrimeNette) + parseFloat(primeEvcat);
      const taxe=((primeHT * 14) / 100).toFixed(2);
      const taxeParaFiscale=((primeHT * 1) / 100).toFixed(2);
      const primeTTC=parseFloat(primeHT) + parseFloat(taxe) + parseFloat(taxeParaFiscale);
      const prorata=primeHT;
      const prorataTTC=primeTTC;
      
      this.setState({
        dataSimulation: [
          {
            key: "1",
            primeNette: currencyFormatter(SelectedPrimeNette),
            primeHT: currencyFormatter(primeHT),
            primeEvcat: currencyFormatter(primeEvcat),
            primeTTC: currencyFormatter(primeTTC),
            prorata: currencyFormatter(prorata),
            prorataTTC: currencyFormatter(prorataTTC),
          },
        ],
        primeHT:primeHT,
        primeEvcat:primeEvcat,
        primeTTC:primeTTC,
        taxe:taxe,
        taxeParaFiscale:taxeParaFiscale,
        prorata:prorata,
        prorataTTC:prorataTTC
      })
      }
      else if(dateEch == moment().endOf('year').format("DD-MM-YYYY"))
      {
      AnneeCivil =2;
      const SelectedTarification=this.state.tarificationMrb.filter(item => item.valeurBatiment == e);
      const SelectedPrimeNette=SelectedTarification[0].primeNet;
      this.setState({ primeNette:SelectedPrimeNette  });
      let primeEvcat=(((SelectedPrimeNette * 8) / 100)).toFixed(2);
      let primeHT = ((parseFloat(SelectedPrimeNette) + parseFloat(primeEvcat)));
      let taxe=(((primeHT * 14) / 100)).toFixed(2);
      let taxeParaFiscale=(((primeHT * 1) / 100)).toFixed(2);
      let primeTTC=(parseFloat(primeHT) + parseFloat(taxe) + parseFloat(taxeParaFiscale));
      //const prorata=primeHT * 9 /100;
      //const prorataTTC=primeTTC * 9 /100;
  
  
    /*   primeEvcat = primeEvcat *9/12;
      primeHT = primeHT * 9/12;
      taxe=taxe*9/12;
      taxeParaFiscale=taxeParaFiscale*9/12;
      primeTTC=(parseFloat(primeHT) + parseFloat(taxe) + parseFloat(taxeParaFiscale));
      const prorata=primeHT;
      const prorataTTC=primeTTC; */
  
  
         //prorata HT
        let prorata;
        if (currentDate.format("D") <= 15) {
          prorata = (primeHT * ((13 - moment().format("M")) / 12)).toFixed(2);
        } else {
          prorata = (primeHT * ((13 - moment().format("M")) / 12)).toFixed(2);
        }
  
        // prorata TTC
        const taxeAuProrata = ((prorata * 14) / 100).toFixed(2);
        const prorataTTC =  (primeTTC * ((13 - moment().format("M")) / 12)).toFixed(2);//parseFloat(taxeAuProrata) + parseFloat(taxeParaFiscale) + parseFloat(prorata); */
      this.setState({
        dataSimulation: [
          {
            key: "1",
            primeNette: currencyFormatter(SelectedPrimeNette),
            primeHT: currencyFormatter(primeHT),
            primeEvcat: currencyFormatter(primeEvcat),
            primeTTC: currencyFormatter(primeTTC),
            prorata: currencyFormatter(prorata),
            prorataTTC: currencyFormatter(prorataTTC),
          },
        ],
        primeHT:primeHT,
        primeEvcat:primeEvcat,
        primeTTC:primeTTC,
        taxe:taxe,
        taxeParaFiscale:taxeParaFiscale,
        prorata:prorata,
        prorataTTC:prorataTTC
      })
      }
      }
  };
  onChangeNatureBatiment = e => {
    this.setState({ natureBatiment: e });
  };
  onChangemontantSurprime = e => {
    this.setState({ montantSurprime: e.target.value });
  };

  componentDidUpdate(prevProps, prevState) {
    /* if (prevState.tarification !== this.state.tarification) {
      //tauxContribution est le meme montant de contribution
      this.setState({ primeNette: this.state.tarification.primeNet });
      const prime_Evcat = (
        (this.state.tarification.primeNet * 8) /
        100
      ).toFixed(2);
      this.setState({ primeEvcat: prime_Evcat });
      const prime_HT =
        parseFloat(this.state.tarification.primeNet) +
        parseFloat(prime_Evcat);
      this.setState({ primeHT: prime_HT });

      const taxe = ((prime_HT * 14) / 100).toFixed(2);
      this.setState({ taxe: taxe });

      const FSEC = ((prime_HT * 1) / 100).toFixed(2);

      const prime_TTC =
        parseFloat(prime_HT) + parseFloat(taxe) + parseFloat(FSEC);

      this.setState({ primeTTC: prime_TTC });

      let prorata = (prime_HT * ((13 - moment().format("M")) / 12)).toFixed(2);

      this.setState({ Prorata: prorata });

      const taxeAuProrata = ((prorata * 14) / 100).toFixed(2);
      const Prorata_TTC = parseFloat(taxeAuProrata) + parseFloat(prorata);
      this.setState({ prorataTTC: Prorata_TTC });

      this.setState({
        dataSimulation: [
          {
            key: "1",
            primeNette: this.state.tarification.primeNet,
            primeHT: prime_HT,
            primeEvcat: prime_Evcat,
            primeTTC: prime_TTC,
            Prorata: prorata,
            ProrataTTC: Prorata_TTC
          }
        ]
      });
    } */
  }

  async jasperFilesMrb(requestDevis) {
    let response = await jasperFileMrb(requestDevis);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  handleConf = () => {
    let requestModel = {
      pointVente: pointVente,
      nomPrenom: this.state.nom + " " + this.state.prenom,
      dateNaissance: this.state.dateNaissance,
      primeNette: this.state.primeNette,
      primeHT: this.state.primeHT,
      primeTTC: this.state.primeTTC,
      periodicite: this.state.period,
      primeEvcat: this.state.primeEvcat,
      valeurBatiment: this.state.valeurBatiment,
      typeBatiment: this.state.valeurContenu,
      produit: this.state.produit.code,
      taxe: this.state.taxe,
      prorata :this.state.prorata,
      prorataTTC :this.state.prorataTTC
    };
    console.log("test jasperFilesMrb");
    console.log(requestModel);

    this.jasperFilesMrb(requestModel);
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      /* this.getTariffication(
        fieldsValue.valeurBatiment,
        fieldsValue.natureBatiment,
        this.state.produit.id
      ); */
    });
  };
  partnerChange = value => {
    this.setState({
      usedProducts: this.state.produits.filter(
        item => item.partenaire.raisonSocial === value.label
      )
    });
  };
  onChangeDureeContrat = e => {
    let date = moment.addRealMonth(this.state.dateEffet, e.target.value);
    this.setState({
      dureeContrat: e.target.value,
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e.target.value)
    });
    this.props.form.setFieldsValue({
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e.target.value),
      dureeContrat: parseInt(e.target.value)
    });
  };
  handleEcheanceDateChange = value => {
    let effetDate = this.state.dateEffet;
    this.setState({
      dateEcheance: value,
      dureeContrat: value.diff(effetDate, "months"),
      dataSimulation:[]
    });
    this.props.form.setFieldsValue({
      dureeContrat: value.diff(effetDate, "months"),
      valeurBatiment : ""
    });
  };
  async getDroppDownData() {
    const responsePartenaire = await getAllPartenaire();
    let responseProduit = await getAllProductMrb();
    this.setState({
      Partenaires: responsePartenaire.data.content,
      produits: responseProduit.data.content
    });
    console.log("test produit");
    console.log(responseProduit.data.content);
  }
  onChangeProduit = e => {
    this.setState({ dataSimulation:[]  });
    this.props.form.setFieldsValue({ valeurBatiment : ""});
    this.props.form.setFieldsValue({ periodicite : ""});


    let selected = this.state.produits.filter(item => item.id === e)[0];
    this.setState({
      produit: selected,
      tauxFrais: selected.fraisAcquisition,
      tauxGestion: selected.fraisGestion,
      tvaFrais: selected.tvaFraisAcquisition,
      tvaGestion: selected.tvaFraisGestion,
      periodicite: selected.periodicitesMrb,
      tarificationMrb :selected.tarificationsMrb
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 15 },
        lg: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 9 },
        lg: { span: 12 }
      }
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <ComponentTitle title="Simulation MRB" />
        <Col span={24} offset={1}>
          <Title level={4}>INFORMATIONS PROSPECT</Title>
        </Col>
        <br />
        <br />
        <Row>
          <Col span={10}>
            <Form.Item label="CIN" hasFeedback>
              {getFieldDecorator("cin", {
                valuePropName: "selected"
              })(
                <AutoComplete
                  size="default"
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
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Nom" hasFeedback>
              {getFieldDecorator(
                "nom",
                {}
              )(<Input onChange={this.onChangeNom}></Input>)}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Prenom" hasFeedback>
              {getFieldDecorator(
                "prenom",
                {}
              )(<Input onChange={this.onChangePrenom}></Input>)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Date de naissance" hasFeedback>
              {getFieldDecorator("dateNaissance", {
                rules: [
                  {
                    required: true,
                    message: "entre la Date de naissance"
                  }
                ]
              })(
                <DatePicker
                  className="date-style"
                  format={dateFormat}
                  disabledDate={this.disabledDate}
                  onChange={this.onChangeDateNaissance}
                ></DatePicker>
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Age">
              {getFieldDecorator("age", {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide !"
                  }
                ]
              })(
                <Input
                  className="number-input"
                  onChange={this.onChange}
                  addonAfter="Ans"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <Col span={24} offset={1}>
          <Title level={4}>INFORMATIONS CONTRAT</Title>
        </Col>
        <br />
        <br />
        <Row>
          <Col span={10}>
            <Form.Item label="Date d'effet" hasFeedback>
              {getFieldDecorator("dateEffet", {
                valuePropName: "selected",
                rules: [
                  {
                    message: "entre la Date d'effet"
                  }
                ]
              })(
                <DatePicker
                  className="date-style"
                  format={dateFormat}
                  disabledDate={this.disabledDate}
                  onChange={this.handleEffetDateChange}
                  defaultValue={currentDate}
                  disabled={true}
                ></DatePicker>
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Date d'échéance" hasFeedback>
              {getFieldDecorator("dateEcheance", {
                valuePropName: "selected",
                rules: [
                  {
                    required: true,
                    message: "selectionnez une date d'echeance"
                  }
                ]
              })(
                <Select className="date-style" placeholder="Sélectionnez " 
                onChange={this.handleEcheanceDateChange}
                value={this.state.dateEcheance}
                format={dateFormat}>
                  {this.state.tableDateEcheance.map(element => {
                    return (
                      <Option
                        key={element}
                        value={element}
                        label={element}
                      >
                        {element.format("DD-MM-YYYY")}
                      </Option>
                    );
                  })}
                </Select>  
                /* <DatePicker
                  className="date-style"
                  format={dateFormat}
                  value={this.state.dateEcheance}
                  disabledDate={this.disabledDateEcheance}
                  onChange={this.handleEcheanceDateChange}
                ></DatePicker> */
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Durée de contrat">
              {getFieldDecorator("dureeContrat", {
                rules: [
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9\b]+$/),
                    message: "Format invalide !"
                  }
                ]
              })(
                <Input
                  className="number-input"
                  onChange={this.onChangeDureeContrat}
                  addonAfter="Mois"
                  disabled
                />
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <connectedUserContext.Consumer>
              {value => (
                (pointVente = value.pointVentes[0].libelle),
                (
                  <Form.Item label="Agence" hasFeedback>
                    {getFieldDecorator("pointVente", {
                      valuePropName: "selected",
                      rules: [
                        {
                          message: "selectionnez une agence"
                        }
                      ]
                    })(
                      <Select
                        placeholder="agence"
                        defaultValue={
                          value.pointVentes.length === 1 &&
                          value.pointVentes[0].id
                        }
                      >
                        {value.pointVentes.map(element => {
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
                )
              )}
            </connectedUserContext.Consumer>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
          <Form.Item label="Valeur batiment">
                            {getFieldDecorator("valeurBatiment", {
                          rules: [
                            {
                              required: true
                            }
                          ]
                        })(
                       <Select placeholder="Sélectionnez ..." onChange={this.onChangeValeurBatiment}>
                            {this.state.tarificationMrb.map(element => {
                              return (
                                <Option
                                  key={element.valeurBatiment}
                                  value={element.valeurBatiment}
                                  label={element.valeurBatiment}
                                >
                                  {currencyFormatter(element.valeurBatiment)}
                                </Option>
                              );
                            })}
                          </Select>
                          )} 
                    </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Intermédiaire" hasFeedback>
              {getFieldDecorator("partenaire", {
                valuePropName: "selected",
                rules: [
                  {
                    required: true,
                    message: "selectionnez un Intermédiaire"
                  }
                ]
              })(
                <Select
                  placeholder="Intermédiaire"
                  onChange={this.partnerChange}
                  labelInValue
                >
                  {this.state.Partenaires.map(element => {
                    return (
                      <Option
                        key={element.id}
                        value={element.id}
                        label={element.raisonSocial}
                      >
                        {element.raisonSocial}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Nature de batiment">
              {getFieldDecorator("natureBatiment", {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  placeholder="Sélectionnez "
                  onChange={this.onChangeNatureBatiment}
                >
                  <Option value="Appartement" label="Appartement">
                    Appartement
                  </Option>
                  <Option value="Maison" label="Maison">
                    Maison
                  </Option>
                  <Option value="Villa" label="Villa">
                    Villa
                  </Option>
                  <Option value="Bâtiment" label="Bâtiment">
                    Bâtiment
                  </Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Produit" hasFeedback>
              {getFieldDecorator("produit", {
                valuePropName: "selected",
                rules: [
                  {
                    required: true,
                    message: "selectionnez un produit"
                  }
                ]
              })(
                <Select placeholder="produit" onChange={this.onChangeProduit}>
                  {this.state.usedProducts.map(element => {
                    return (
                      <Option
                        key={element.id}
                        value={element.id}
                        label={element.code}
                      >
                        {element.code}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={10}>
            <Form.Item label="Périodicité">
              {getFieldDecorator(
                "periodicite",
                {}
              )(
                <Select
                  placeholder="Selectionnez ..."
                  onChange={this.onChangePeriodicite}
                >
                  {this.state.periodicite.map(element => {
                    return (
                      <Option
                        key={element.id}
                        value={element.id}
                        label={element.abb}
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
        <Row>
          <Col span={10}>
            {this.state.OptionsAssurance.length !== 0 && (
              <Form.Item label="Option Assurance">
                {getFieldDecorator("optionAssurance", {
                  valuePropName: "selected",
                  rules: [
                    {
                      required: true,
                      message: "selectionnez une Option Assurance"
                    }
                  ]
                })(
                  <Select
                    placeholder="Option Assurance"
                    optionLabelProp="label"
                    labelInValue
                    onChange={this.onChangeOption}
                    defaultValue={
                      this.state.OptionsAssurance.length === 1 && {
                        value: this.state.OptionsAssurance[0].id,
                        label: this.state.OptionsAssurance[0].libelle
                      }
                    }
                  >
                    {this.state.OptionsAssurance.map(element => {
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
            )}
          </Col>
          <Col span={10}>
            <Button
              type="primary"
              className="action-btn-calculer"
              htmlType="submit"
              disabled={this.state.booleen}
            >
              Calculer
            </Button>
          </Col>
        </Row>
        { AnneeCivil ==  1 ? (
              <Row gutter={16} style={{ padding: "20px" }}>
                <Table
                  className="table-simulation simulation-mrb"
                  columns={columnsSim}
                  dataSource={this.state.dataSimulation}
                  pagination={false}
                  align="center"
                  size="middle"
                />
              </Row>) : (
              <Row gutter={16} style={{ padding: "20px" }}>
              <Table
                className="table-simulation simulation-mrb"
                columns={columnsSimulation}
                dataSource={this.state.dataSimulation}
                pagination={false}
                align="center"
                size="middle"
              />
            </Row>
              )}
        <Row>
          <Col span={23}>
            {this.state.primeHT !== 0 && (
              <Button
                type="primary"
                className="edit-btn-pdf"
                onClick={() => this.handleConf()}
              >
                <Icon type="download" />
                Editer
              </Button>
            )}
          </Col>
        </Row>
      </Form>
    );
  }
}
moment.addRealMonth = function addRealMonth(d, m) {
  var fm = moment(d).add(m, "M");
  var fmEnd = moment(fm).endOf("month");
  return d.date() !== fm.date() && fm.isSame(fmEnd.format("YYYY-MM-DD"))
    ? fm.add(1, "d")
    : fm;
};
export default Form.create()(SimulationMrb);
