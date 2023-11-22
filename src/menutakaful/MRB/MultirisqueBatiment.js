/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  Modal,
  notification,
  PageHeader,
  Popconfirm,
  Row,
  Select,
  Table,
  Descriptions,
  Empty,
  AutoComplete,
  Radio,
  InputNumber,
  Spin
} from "antd";
import moment from "moment";
import React, { Component } from "react";
import AddPerMorale from "../Production Prestations/Souscription/StepOne/AddPerMorale/AddPerMorale";
import AddSouscripteur from "../Production Prestations/Souscription/StepOne/AddPerPhysique/AddSouscripteur";
import { getExclusion } from "../EchangeFichiersInformatiques/EchangeFileAPI";
import ComponentTitle from "../../util/Title/ComponentTitle";
import {
  addContratMrb,
  getPeriodicite,
  cpMrb
} from "../GestionContrats/ContratsAPI";
import {
  getAllProductMrb,
  getTarificationMrb
} from "./ProduitMrb/ProduitMRBAPI";
import {
  getallperson,
  getallPersonMorale,
  getAllSecteurActivite,
  getAllTypePersonneMorales,
  getVois,
  getProfession,
  getSetuation,
  getSexe
} from "../Participants/ParticipantAPI";
import { currencyFormatter, currencyParser } from "../../util/Helpers";
import { getAllPartenaire } from "../Parametrage/partenaire/PartenaireAPI";
const { Option } = Select;
const { Panel } = Collapse;
const dateFormat = "DD-MM-YYYY";
let key = 0;
let exclusFamille = "MRB";
const currentDate = moment(moment(), dateFormat).add(1, "days");
let AnneeCivil = 0;
class MultirisqueBatiment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      tarificationMrb :[],
      produitId: "",
      typeAvenant: [],
      visible: false,
      produitMrb: [],
      produitPartenaire: [],
      valeurBatiment: 0,
      natureBatiment: "",
      exclusionMrb: [],
      dateEffet: moment(moment(), "YYYY-MM-DD").add(1, "days"),
      dateEcheance: null,
      nombreMois: 0,
      periodicite: [],
      radio: "morale",
      souscripteur: "",
      permorale: false,
      perphysique: false,
      sexe: [],
      assure: "",
      setuations: [],
      professions: [],
      vois: [],
      dataloaded: false,
      personlist: [],
      personlistForAuto: [],
      selectedPatente: [],
      selectedCinSouscripteur: [],
      selectedCinAsuree: [],
      assurePresent: false,
      typePersonneMoral: [],
      secteurActivite: [],
      personMoraleList: [],
      personMoraleListForAuto: [],
      souscripteurIsAssure: "",
      disableSouscripteuretAssure: "",
      primeHT: 0,
      primeTTC: 0,
      prorata: 0,
      prorataTTC: 0,
      primeEvcat: 0,
      primeNette: 0,
      taxe :0,
      taxeParaFiscale:0,
      fsec: 0,
      dataSimulation: [],
      partenaires: [],
      loading : false,
      valeurContenu:0,
      tableDateEcheance :[]
    };
    this.handleChangeCinSouscripteur = this.handleChangeCinSouscripteur.bind(
      this
    );
    this.clearAutocompleteFields = this.clearAutocompleteFields.bind(this);
    // this.columns = [
    //   {
    //     title: "Nom",
    //     dataIndex: "nom",
    //     key: "nom"
    //   },
    //   {
    //     title: "Prénom",
    //     dataIndex: "prenom",
    //     key: "prenom"
    //   },
    //   {
    //     title: "Masse Salariale Annuelle",
    //     dataIndex: "masseSalarialeAnnuelle",
    //     key: "masseSalarialeAnnuelle"
    //   },
    //   {
    //     title: "Taux",
    //     dataIndex: "taux",
    //     key: "taux"
    //   },
    //   {
    //     title: "operation",
    //     dataIndex: "operation",
    //     render: (text, record) =>
    //       this.state.data.length >= 1 ? (
    //         <Popconfirm
    //           title="Sure to delete?"
    //           onConfirm={() => this.handleDelete(record.key)}
    //         >
    //           <a href="#top">Supprimer</a>
    //         </Popconfirm>
    //       ) : null
    //   }
    // ];
  }

  componentDidMount() {
    this.getProduitMrb();
    this.getAllExclusionsMrb(exclusFamille);
    this.getPeriodicites();
    this.getproprties();
    let dt=[moment.addRealMonth(this.state.dateEffet, 12),moment().endOf('year')];
    this.setState({ tableDateEcheance :dt });
  }
  async conditionParticuliereMrb(requestCP) {
    let response = await cpMrb(requestCP);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
  }
  async getTariffication(produit) {
    let response = await getTarificationMrb(produit);
    //this.setState({ tarificationMrb: response.data });  
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
    let respence = await getAllPartenaire();
    let helpArray = [];
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
      personMoraleListForAuto: [...helpArraymorale],
      typePersonneMoral: [...typePersonneMoraleResponse.data],
      secteurActivite: [...secteurActiviteResponse.data.content],
      partenaires: respence.data.content
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
    const dataSource = [...this.state.personlist];
    this.setState({
      assurePresent: true,
      assure: dataSource.filter(item => item.cin === value.key)[0]
    });
  };

  handleChangeCinSouscripteur(value) {
    
    const dataSource = [...this.state.personlist];
    const Filterdata = dataSource.filter(item => item.cin === (value && value.key));
      
        if(Filterdata.length >0)
        {
        const data = Filterdata[0].id;
        this.setState({ selectedCinSouscripteur: data 
          });
          this.props.form.setFieldsValue({
            adresseBatiment: Filterdata[0].adressComplete
          });
        }
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

  handlechange = e => {
    this.setState({
      radio: e.target.value,
      souscripteur: "",
      assure: "",
      souscripteurIsAssure: "",
      disableSouscripteuretAssure: ""
    });
    this.clearAutocompleteFields();
  };

  onChange = e => {
    if (this.state.radio === "physique" && e.target.checked) {
      this.setState({
        assure: this.state.souscripteur,
        souscripteurIsAssure: true,
        disableSouscripteuretAssure: true
      });
      this.props.form.setFieldsValue({
        assure: {
          key: this.state.souscripteur.cin,
          label: this.state.souscripteur.cin
        }
      });
    } else
      this.setState({
        souscripteurIsAssure: false,
        disableSouscripteuretAssure: false
      });
  };

  calculeAge(date) {
    return moment().diff(moment(date), "years");
  }

  async getPeriodicites() {
    let response = await getPeriodicite();
    this.setState({
      periodicite: response.data.content
    });
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  // handleDelete = keyMrb => {
  //   const data = [...this.state.data];
  //   this.setState({ data: data.filter(item => item.key !== keyMrb) });
  // };

  handleOk = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      let request = {
        key: key,
        nom: values.nom,
        prenom: values.prenom,
        masseSalarialeAnnuelle: values.masseSalarialeAnnuelle,
        taux: values.taux
      };
      this.state.data.push(request);
      key = key + 1;
    });
    this.setState({ visible: false });
  };

  disabledDate = current => {
    return (
      current 
      &&
      current <
        moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").add(1, "days") 
        || current >
        moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").add(2, "days") 
    );
  };

  handleEffetDateChange = value => {
    if (this.state.dateEcheance !== null) {
      let echeanceDate = this.state.dateEcheance;
      this.setState({
        dateEffet: value,
        nombreMois: echeanceDate.diff(value, "months")
      });
    }
  };

  onChangeDuree = e => {
    this.setState({
      nombreMois: e,
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e)
    });
    this.props.form.setFieldsValue({
      dateEcheance: moment.addRealMonth(this.state.dateEffet, e),
      nombreMois: parseInt(e)
    });
  };

  handlePartnerChange = value => {
    let list = [...this.state.produitMrb];
    this.setState({
      produitPartenaire: list.filter(item => item.partenaire.id === value.key)
    });
  };
  handleProduitChange = value => {
    this.setState({ dataSimulation:[]  });
    let selectedproduit = this.state.produitPartenaire.filter(
      item => item.id === value
    );
    /* this.props.form.setFieldsValue({
      valeurBatiment : this.state.tarificationMrb.contenu
    }); */
    //this.setState({tarificationMrb :this.state.tarification })


    /* if (selectedproduit[0].normes.length === 0) {
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
      this.setState({ booleen: true });
      notification.error({
        message: "TAKAFUL",
        description: "Le produit choisi n'a aucune norme de séléction.",
        btn,
        duration: 0,
        key
      });
    } */
    this.props.form.setFieldsValue({ valeurBatiment : ""});
    this.props.form.setFieldsValue({ valeurContenu : ""});
    this.setState({
      periodicite: selectedproduit[0].periodicitesMrb,
      exclusionMrb: selectedproduit[0].exclusionsProduit,
      produitId: value,
      tarificationMrb :selectedproduit[0].tarificationsMrb,
      //selectedProduct: selectedproduit[0].code
    }); 

  };

  disabledDateEcheance = current => {
    return current && current < this.state.dateEffet.endOf("day");
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

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleClose = () => {
    this.props.form.setFieldsValue({
      nom: "",
      prenom: "",
      masseSalarialeAnnuelle: "",
      taux: ""
    });
  };

  async ajouterContratMrb(values) {
    try {
      let response = await addContratMrb(values);
      if (response.status === 200) {
        let requestMrb = {
          numeroSouscription: response.data.numeroContrat,
          dateEcheance: response.data.dateEcheance,
          dateEffet: response.data.dateEffet,
          duree: response.data.dureeContrat,
          agence: response.data.produitMrb.partenaire.raisonSocial,
          raisonSocial: response.data.produitMrb.partenaire.raisonSocial,
          siegeSocial: response.data.produitMrb.partenaire.siegeSocial,
          typePartenaire: response.data.produitMrb.partenaire.typePartenaire,
          adresse: response.data.produitMrb.partenaire.siegeSocial,
          prenomSouscripteur: response.data.souscripteur.prenom,
          nomSouscripteur: response.data.souscripteur.nom,
          cinSouscripteur: response.data.souscripteur.cin,
          adresseSouscripteur: response.data.souscripteur.adressComplete,
          villeSouscripteur: response.data.souscripteur.adressVille,
          ribSouscripteur: response.data.souscripteur.rib,
          prenomAssure: response.data.assure.prenom,
          nomAssure: response.data.assure.nom,
          cinAssure: response.data.assure.cin,
          adresseAssure: response.data.assure.adressComplete,
          villeAssure: response.data.assure.adressVille,
          ribAssure: response.data.assure.rib,
          date: moment(new Date()).format("DD-MM-YYYY"),
          numeroCompte: response.data.souscripteur.rib,
          typeBatiment: response.data.typeBatiment,
          adresseBatiment: response.data.adresseBatiment,
          numTitreFoncier: response.data.numeroTitreFoncier,
          superficie: response.data.superficie,
          caracteristique: response.data.description,
          taciteReconduction: true,
          periodicite: response.data.periodicite.libelle,
          categorie: response.data.categorie,
          typePropriete:response.data.typePropriete
        };
        //this.conditionParticuliereMrb(requestMrb);

        notification.success({
          message: "la souscription est bien faiteee"
        });
      }
      this.props.record.history.push("/ConsultationsContratsMrb");
    } catch (error) {
      console.log(error.message);
      notification.error({
        message: "Takaful",
        description:
          error.message ||
          "Désolé! Quelque chose s'est mal passé Veuillez réessayer!"
      });
    }
    this.setState({ loading : false })
  }
  componentDidUpdate(prevProps, prevState) {
   
     /*if (
      //prevState.valeurBatiment !== this.state.valeurBatiment ||
      prevState.natureBatiment !== this.state.natureBatiment || prevState.produitId != this.state.produitId
    ) {
      if (
        //this.state.valeurBatiment !== "" &&
        this.state.natureBatiment !== "" &&
        this.state.natureBatiment !== null 
        //this.state.valeurBatiment !== null
      )
        this.getTariffication(
          //this.state.valeurBatiment,
          //this.state.natureBatiment,
          this.state.produitId
        );
       
    }
    
    if (prevState.tarification !== this.state.tarification) {
   
       console.log("test tarification");
      console.log(this.state.tarification); 

      //tauxContribution est le meme montant de contribution est le prime nette
      this.setState({ primeNette: this.state.tarification.tauxContribution });

      //prime evcat
      const prime_Evcat = (
        (this.state.tarification.tauxContribution * 8) /
        100
      ).toFixed(2);

      this.setState({ primeEvcat: prime_Evcat });

      //prime HT
      const prime_HT =
        parseFloat(this.state.tarification.tauxContribution) +
        parseFloat(prime_Evcat);

      this.setState({ primeHT: prime_HT });
      //taxe 14%
      const taxe = ((prime_HT * 14) / 100).toFixed(2);

      //FSEC 1%
      const FSEC = ((prime_HT * 1) / 100).toFixed(2);
      this.setState({ fsec: FSEC });

      //prime TTC
      const prime_TTC =
        parseFloat(prime_HT) + parseFloat(taxe) + parseFloat(FSEC);
      this.setState({ primeTTC: prime_TTC });

      //prorata HT
      let Prorata;
      if (currentDate.format("D") <= 15) {
        Prorata = (prime_HT * ((13 - moment().format("M")) / 12)).toFixed(2);
        this.setState({ prorata: Prorata });
      } else {
        Prorata = (prime_HT * ((12 - moment().format("M")) / 12)).toFixed(2);
        this.setState({ prorata: Prorata });
      }

      // prorata TTC
      const taxeAuProrata = ((Prorata * 14) / 100).toFixed(2);
      const Prorata_TTC = parseFloat(taxeAuProrata) + parseFloat(Prorata);
      this.setState({ prorataTTC: Prorata_TTC });

      this.setState({
        dataSimulation: [
          {
            key: "1",
            primeNette: this.state.tarification.tauxContribution,
            primeHT: prime_HT,
            primeEvcat: prime_Evcat,
            primeTTC: prime_TTC.toFixed(2),
            prorata: Prorata,
            prorataTTC: Prorata_TTC.toFixed(2)
          }
        ]
      });
    } */
  }
  handleChangeBatiment = e => {
    this.props.form.setFieldsValue({
      valeurContenu: e/5
    });
    //this will work only in case the valeurBatiment is unique for each product
    let dateEch;
    console.log("date dateEcheeee");
    console.log("dateEcheeee ::");
    console.log(this.props.form.getFieldsValue().dateEcheance);
    console.log(moment().endOf('year'));
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
  async getAllExclusionsMrb(famille) {
    let response = await getExclusion(famille);
    this.setState({
      exclusionMrb: response.data.content
    });
  }

  async getProduitMrb() {
    let response = await getAllProductMrb();
    this.setState({
      produitMrb: response.data.content
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const values = this.props.form.getFieldsValue();
    this.props.form.validateFields((err, values) => {
      let exclus = [];
      values.exclusion.forEach(element => {
        exclus.push({ id: element });
      });
      values.exclusion = [...exclus];
      let requestModel = {
        numeroDossierFinancement: values.numeroDossierFinancement,
        typeBatiment: values.typeBatiment,
        adresseBatiment: values.adresseBatiment,
        numeroTitreFoncier: values.numeroTitreFoncier,
        superficie: values.superficie,
        description: values.description,
        dateEffet: this.state.dateEffet,
        dateEcheance: values.dateEcheance,
        souscripteur: { id: this.state.selectedCinSouscripteur },
        assure: { id: this.state.assure.id },
        produitMrb: { id: values.produit },
        valeurBatiment: values.valeurBatiment,
     //   situationRisque: values.situationRisque,
        reduction: values.reduction,
        exclusionsMrb: values.exclusion,
        domestique: this.state.data,
        periodicite: { id: values.periodicite },
        dureeContrat: values.dureeContrat,
        primeNette: this.state.primeNette,
        primeTTC: this.state.primeTTC,
        primeHT: this.state.primeHT,
        primeEvcat: this.state.primeEvcat,
        FESC: this.state.fsec,
        taxe:this.state.taxe,
        taxeParaFiscale:this.state.taxeParaFiscale,
        prorata: this.state.prorata,
        prorataTTC: this.state.prorataTTC,
        categorie: values.categorie,
        typePropriete : values.typePropriete,
        valeurContenu : values.valeurContenu
      };
      this.setState({ loading:true },()=>{
        this.ajouterContratMrb(requestModel);
      });
      
    });
  };

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    const age = moment().diff(
      moment(this.state.souscripteur.dateNaissance, "DD-MM-YYYY").format(),
      "years"
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 9 },
        lg: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 },
        lg: { span: 15 }
      }
    };

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

    return (
      <div>
        <Spin spinning={loading}>
        <ComponentTitle title="Multirisques bâtiment" />
        <Modal
          visible={visible}
          title="Doméstique Suplémentaire"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          afterClose={this.handleClose}
          footer={[
            <Button
              key="back"
              onClick={this.handleCancel}
              className="not-rounded"
            >
              Annuler
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOk}
              className="not-rounded"
            >
              Ajouter
            </Button>
          ]}
        >
          <Form {...formItemLayout} /*hideRequiredMark*/>
            <Col>
              <Form.Item label="Nom ">
                {getFieldDecorator("nom")(<Input className="not-rounded" />)}
              </Form.Item>
              <Form.Item label="Prénom ">
                {getFieldDecorator("prenom")(<Input className="not-rounded" />)}
              </Form.Item>
              <Form.Item label="Masse Salariale ">
                {getFieldDecorator("masseSalarialeAnnuelle")(
                  <InputNumber
                    className="not-rounded"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                  />
                )}
              </Form.Item>
              <Form.Item label="Taux ">
                {getFieldDecorator("taux")(
                  <InputNumber
                    className="not-rounded"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                  />
                )}
              </Form.Item>
            </Col>
          </Form>
        </Modal>
        <Form {...formItemLayout} /*hideRequiredMark*/>
          <Row
            style={{
              border: "1px solid rgb(235, 237, 240)"
            }}
          >
            <PageHeader title="DEVIS" subTitle="Etablissement devis" />
            <Row>
              <Row>
                <Col span={23} offset={1}>
                  <Divider orientation="left">Produit</Divider>
                </Col>
                <Col span={18} offset={1}>
                  <Form.Item label="Partenaire ">
                    {getFieldDecorator("partenaire", {
                      valuePropName: "selected",
                      rules: [
                        {
                          required: true,
                          message: "Veuillez selectionner"
                        }
                      ]
                    })(
                      <Select
                        placeholder="Sélectionnez "
                        onChange={this.handlePartnerChange}
                        labelInValue
                      >
                        {this.state.partenaires.map(element => {
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
                <Col span={18} offset={1}>
                  <Form.Item label="Produit ">
                    {getFieldDecorator("produit", {
                      valuePropName: "selected",
                      rules: [
                        {
                          required: true,
                          message: "Veuillez selectionner"
                        }
                      ]
                    })(
                      <Select
                        placeholder="Sélectionnez "
                        onChange={this.handleProduitChange}
                        //labelInValue
                      >
                        {this.state.produitPartenaire.map(element => {
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
              <Col offset={1} span={1}></Col>
            </Row>
            <Col offset={1} span={23}>
              <div style={{ minHeight: "200px" }}>
                <Col>
                  <Divider orientation="left">Souscripteur/Assuré</Divider>
                </Col>
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
                            defaultValue={this.state.radio}
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
                              {
                                required: true,
                                message: "patente is required!"
                              }
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
                            />
                          )}
                        {this.state.dataloaded &&
                          this.state.radio === "morale" && (
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
                      <Divider style={{ marginTop: "20px" }}></Divider>
                    </Col>
                  </Col>
                  <Col offset={1} span={14}>
                    {this.state.radio === "physique" &&
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
                      <Form.Item label="L'assuré">
                        {getFieldDecorator("cinAssure", {
                          rules: [
                            { required: !this.state.souscripteurIsAssure, message: "assuree is required!" }
                          ]
                        })(
                          <AutoComplete
                            disabled={
                              this.state.disableSouscripteuretAssure &&
                              this.state.radio === "physique"
                            }
                            size="default"
                            style={{ width: 182 }}
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
                        <Descriptions.Item label="Age">
                          {age}{" "}
                        </Descriptions.Item>
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
            </Col>
            <Col offset={1} span={1}></Col>
          </Row>
          <Row>
            <Col span={22} offset={1}>
              <Divider orientation="left">Periodicité</Divider>
            </Col>
            <Col span={11} offset={1}>
              <Form.Item label="Date d'effet">
                {getFieldDecorator("dateEffet", {
                  valuePropName: "selected"
                })(
                  <DatePicker
                    className="date-style"
                    format={dateFormat}
                    style={{ width: "100%" }}
                    disabledDate={this.disabledDate}
                    defaultValue={this.state.dateEffet}
                    onChange={this.handleEffetDateChange}
                  ></DatePicker>
                )}
              </Form.Item>
              <Form.Item label="Durée de la couverture">
                {getFieldDecorator("dureeContrat", {
                  rules: [
                    {
                      required: true,
                      pattern: new RegExp(/^[0-9\b]+$/),
                      message: "Format invalide !"
                    }
                  ]
                })(
                  <InputNumber
                    className="number-input"
                    onChange={this.onChangeDuree}
                    addonAfter="Mois"
                    formatter={currencyFormatter}
                    parser={currencyParser}
                    disabled
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={11}>
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
                    style={{ width: "100%" }}
                    disabledDate={this.disabledDateEcheance}
                    value={this.state.dateEcheance}
                    onChange={this.handleEcheanceDateChange}
                    //disabled
                  ></DatePicker>*/
                )}
              </Form.Item>
              <Form.Item label="Périodicité" allowClear>
                {getFieldDecorator("periodicite", {
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <Select placeholder="Sélectionnez ">
                    {this.state.periodicite.map(element => {
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
            <Divider />
          </Row>
          <Row
            style={{
              border: "1px solid rgb(235, 237, 240)",
              marginTop: "3%"
            }}
          >
            <PageHeader
              title="Multirisques Habitation"
              style={{ marginBottom: "3%" }}
            />
            <Col offset={1} span={22}>
              <Collapse
                accordion
                style={{ marginBottom: "30px", marginTop: "10px" }}
              >
                <Panel header="Informations Générales" key="1">
                  <Col span={22}>
                    <Divider orientation="left">
                      Informations Principales
                    </Divider>
                  </Col>
                  <Col span={13}>
                    <Form.Item label="N° dossier de financement">
                      {getFieldDecorator("numeroDossierFinancement")(<Input />)}
                    </Form.Item>
                    <Form.Item label="Valeur Contenu ">
                      {getFieldDecorator("valeurContenu")(<Input disabled/>)}
                    </Form.Item>
                    <Form.Item label="Adresse de Bâtiment">
                      {getFieldDecorator("adresseBatiment")(<Input />)}
                    </Form.Item>
                    <Form.Item label="N° du titre foncier">
                      {getFieldDecorator("numeroTitreFoncier")(<Input />)}
                    </Form.Item>
                    <Form.Item label="Catégorie">
                      {getFieldDecorator("categorie")(
                        <Select
                        placeholder="Sélectionnez ..."
                          >
                        <Option value="habitat" label="Habitatt">
                        Habitat
                        </Option>
                        <Option value="professionnel" label="professionnel">
                        Professionnel
                        </Option>
                        <Option value="industriel" label="industriel">
                        Industriel
                        </Option>
                        <Option value="commercial" label="commercial">
                        Commercial
                        </Option>
                        <Option value="autres" label="autres">
                        Autres
                        </Option>
                      </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item label="Nature de Bâtiment">
                      {getFieldDecorator("typeBatiment")(
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
                          <Option value="autres" label="Autre">
                            Autres
                          </Option>
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="Valeur batiment">
                            {getFieldDecorator("valeurBatiment", {
                          rules: [
                            {
                              required: true
                            }
                          ]
                        })(
                       <Select placeholder="Sélectionnez ..." onChange={this.handleChangeBatiment}>
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
                    <Form.Item label="Superficie">
                      {getFieldDecorator("superficie")(
                        <Input addonAfter="m²" />
                      )}
                    </Form.Item>
                    <Form.Item label="Description">
                      {getFieldDecorator("description")(<Input />)}
                    </Form.Item>
                    <Form.Item label="Type Propriété">
                      {getFieldDecorator("typePropriete")(
                        <Select
                          placeholder="Sélectionnez ..."
                        >
                          <Option value="propriété" label="Propriété">
                            Propriété
                          </Option>
                          <Option value="location" label="location">
                           Location
                          </Option>
                          <Option value="copropriété" label="Copropriété">
                          Copropriété
                          </Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}></Col>
                  <Col span={22}>
                    <Divider orientation="left">Exclusion</Divider>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Exclusion ">
                      {getFieldDecorator("exclusion",{
                        rules : [
                          {
                          required : true
                         }
                      ]
                      })(
                        <Select placeholder="Sélectionnez... " mode="multiple">
                          {this.state.exclusionMrb.map(element => {
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
                  <Col span={22}>
                    <Divider orientation="left">Réduction Mutuelle</Divider>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Réduction ">
                      {getFieldDecorator("reduction")(<Input addonBefore="%" />)}
                    </Form.Item>
                  </Col>
                </Panel>
                {/* <Panel header="Détail du Risque" key="2">
                  <Col span={22}>
                    <Divider orientation="left">
                      Doméstique Suplémentaire
                    </Divider>
                  </Col>
                  <Table
                    bordered
                    rowClassName="editable-row"
                    columns={this.columns}
                    dataSource={this.state.data}
                  />
                  <Col span={22}>
                    <Form.Item>
                      <Button
                        type="primary"
                        className="not-rounded"
                        onClick={this.showModal}
                      >
                        <Icon type="plus" />
                        Ajouter
                      </Button>
                      <Button style={{ marginLeft: 8 }} className="not-rounded">
                        <Icon type="sync" />
                        Actualiser
                      </Button>
                    </Form.Item>
                  </Col>
                </Panel> */}
                <Panel header="Garanties" key="3">
                  <table>
                    <tr>
                      <th>Garantie</th>
                      <th>Montant garantie</th>
                      <th>Franchise</th>
                      <th>Cotisation HT Annuelle</th>
                      <th>Cotisation HT Prorate</th>
                      <th>Taxe Prorate</th>
                      <th>TTC Prorate</th>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <h3>Garanties de base</h3>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox defaultChecked />
                        Vol
                      </td>
                      <td>
                        {" "}
                        <Form.Item>
                          {getFieldDecorator("volCapital")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>
                        {" "}
                        <Form.Item>
                          {getFieldDecorator("volFranchaise")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox defaultChecked />
                        Incendie
                      </td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator("incendieCapital")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>
                        {" "}
                        <Form.Item>
                          {getFieldDecorator("incendieFranchaise")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox defaultChecked />
                        EVCAT
                      </td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator("evcatCapital")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>
                        {" "}
                        <Form.Item>
                          {getFieldDecorator("evcatFranchaise")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox defaultChecked />
                        Bris des Glaces
                      </td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator("brisGlaceCapital")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>
                        {" "}
                        <Form.Item>
                          {getFieldDecorator("brisGlaceFranchaise")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox defaultChecked />
                        Dégâts des Eaux
                      </td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator("degatEauCapital")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>
                        {" "}
                        <Form.Item>
                          {getFieldDecorator("degatEauFranchaise")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                    </tr>
                    {/*<tr>
                      <td>
                        <h3>Garanties optionnelles</h3>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox defaultChecked />
                        RC Chef de Famille
                      </td>
                      <td>
                        {" "}
                        <Form.Item>
                          {getFieldDecorator("RcCapital")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>
                        {" "}
                        <Form.Item>
                          {getFieldDecorator("RcFranchaise")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                    </tr>
                    <tr>
                      <td>
                        <Checkbox />
                        AT Bonne
                      </td>
                      <td>
                        <Form.Item>
                          {getFieldDecorator("AtBonneCapital")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>
                        {" "}
                        <Form.Item>
                          {getFieldDecorator("AtBonneFranchaise")(<Input />)}
                        </Form.Item>
                      </td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
                      <td>0.00</td>
              </tr>*/}
                  </table>
                </Panel>
              </Collapse>
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
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <div style={{ float: "right", marginTop: "3%" }}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="not-rounded rech-btn"
                    style={{ width: "200px" }}
                    onClick={this.handleSubmit}
                  >
                    Enregistrer
                  </Button>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        </Spin>
      </div>
    );
  }
}
export default Form.create()(MultirisqueBatiment);
