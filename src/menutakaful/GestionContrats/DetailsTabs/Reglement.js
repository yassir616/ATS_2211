/* eslint-disable react/no-direct-mutation-state */
/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Form,
  Icon,
  notification,
  Row,
  Select,
  Table,
  Typography,
  Spin,
  Space
} from "antd";
import React, { Component } from "react";
import { getAllPartenaire } from "../../Parametrage/partenaire/PartenaireAPI";
import { getDecesProduit } from "../../Parametrage/ProduitDeces/ProduitDecesAPI";
import {
  addPrestationHonoraire,
  setPrestationStatut,
  lettreRegHonoraire,
  virement2,
  cheque2
} from "../../Parametrage/TypePrestation/PrestationAPI";
import { LABORATOIRE, MEDECIN_CONSEIL, MEDECIN_EXAMINATEUR, MEDECIN_SPECIALISTE } from "../../../constants";
import { ajoutReglement, getReglements } from "./SinistreAPI";
import { getAuxiliairesByStatut } from "../../Parametrage/Auxiliaires/AuxiliaireAPI";
import { getColumnSearchProps } from "../../Parametrage/ProduitRetraite/ProduitRetraiteServices/getColumnSearchProps";


const { Option } = Select; 
const { Title,Paragraph } = Typography;

var id_reglement = "";

class Reglement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      honoraireData: [],
      partenaires: [],
      produits: [],
      auxiliaires: [],
      auxiliaire: {},
      disable: false,
      produitPartenaire: [],
      add: false,
      reglement: [],
      statuts: false,
      loading: false,
      dataT: [],
      num_lot: "",
      _mode_reglement: "",
      searchText: "",
      searchedColumn: "",
      filepdfData : [],
      showMessage : false,
      totalItems:0,
      spinner : false
    };

    this.columns = [
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
          
              <span
                onClick={() => this.fichierExcel (record)}
                style={{ cursor: 'pointer', marginRight: '8px'}}
              >
                <Icon type="file-excel" style={{ color: 'green' }}/>
              </span>
           
          
              <span
                onClick={() => this.fichierPDF(record)}
                style={{ cursor: 'pointer', marginRight: '8px'}}
              >
                <Icon type="file-pdf" style={{ color: 'red' }} />
              </span>
          
         
              <span
                onClick={() => this.fichierTxt(record)}
                style={{ cursor: 'pointer' }}
              >
                <Icon type="file-text" />
              </span>
          
          </span>
        ),
      },
      {
        title: "Date génération",
        dataIndex: "creationDate",
        ...getColumnSearchProps("creationDate", "creationDate", this),
        key: "creationDate",
      },
      {
        title: "Libelle",
        dataIndex: "libelle",
        key: "libelle"
      },
      {
        title: "Type reglement",
        dataIndex: "reglementType",
        ...getColumnSearchProps("reglementType", "reglementType", this),
        key: "reglementType"
      },
      {
        title: "Status",
        dataIndex: "statut",
        key: "statut",
        ...getColumnSearchProps("statut", "statut", this),
        render: (text, record) => {
          if (text === 'VALIDER') {
            // If 'Valider' is the value, render the text in green
            return  <Paragraph style={{ color: 'green' }}>
              {text}
            </Paragraph>;
          } else {
          return (
            <span>
              <Select
                placeholder="Please select"
                onChange={this.handleChangeed(record)}
                style={{ width: "100%" }}
                defaultValue={text}
              >
                <Option
                  value="Valider"
                  onClick={() => this.handleRecord(record)}
                >
                  VALIDER
                </Option>
                <Option
                  value="Supprimer"
                  onClick={() => this.handleRecord(record)}
                >
                  SUPPRIMER
                </Option>
              </Select>
            </span>
          );
        }
      }
      }
    ];
  }

 fichierTxt (record) {
    let filte = [];
    let filteredArr = [];
    let data = [];
    let sum = 0;
 
    filteredArr = record.honoraires.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    filteredArr.forEach(element1 => {
      sum += element1.montantNet;
        data.push({
          NumSinistre: element1.numeroSinistre,
          NomEtPrenom:
            element1.auxiliaire.nom + " " + element1.auxiliaire.prenom,
          rib: element1.auxiliaire.rib,
          montantNet: element1.montantNet.toFixed(2)
        });
    });
    console.log(data);
    filte = data.reduce((acc, current) => {
      const x = acc.find(item => item.NumSinistre === current.NumSinistre);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
     // Create a Blob with the text content
    const formattedData = filte.map((obj) => `${obj.montantNet}`);

    formattedData.push('FIN');
    // Convert the array of formatted data to a plain text string
    const textContent = formattedData.join('\n'); // Use '\n' to separate lines

     // Create a Blob containing the text content
    const blob = new Blob([textContent], { type: 'text/plain' });

  
     // Create a URL for the Blob
     const url = URL.createObjectURL(blob);
    
       // Create a link element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.txt'; // Set the desired file name
  
  // Trigger a click event on the link to start the download
       a.click();
  
  // Clean up by revoking the Blob URL
  URL.revokeObjectURL(url);
  };

  fichierExcel (record){
    console.log(record.reglementType);
    if(record.reglementType === "virement"){
      let filte;
      let  filteredArr = [];
      let data = [];
      let sum = 0;
   
      filteredArr = record.honoraires.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      filteredArr.forEach(element1 => {
        sum += element1.montantNet;
          data.push({
            NumSinistre: element1.numeroSinistre,
            NomEtPrenom:
              element1.auxiliaire.nom + " " + element1.auxiliaire.prenom,
            rib: element1.auxiliaire.rib,
            montantNet: element1.montantNet.toFixed(2)
          });
      });
      filte = data.reduce((acc, current) => {
        const x = acc.find(item => item.NumSinistre === current.NumSinistre);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      this.generateExcelFile(filte);
    }
    else {
      notification.warning({
        message : "Le mode du reglement est cheque !"
      })
    }

  
  }

  fichierPDF (record) {
        let uniqueNames = [];
        let data = [];
        let filteredArr=[];
        let filteredArr1=[];
        let filte;
        let sum = 0;
     
        filteredArr = record.honoraires.reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        console.log(" filteredArr",filteredArr);
        const { NumberToLetter } = require("convertir-nombre-lettre");
        filteredArr.forEach(element1 => {
          sum += element1.montantNet;
          element1.detailPrestationHonoraire.forEach(element => {
            //console.log("detailprestation", element);
            let var_examinateur = null;
            switch(element1.auxiliaire.typeAuxiliaire.libelle){
              case MEDECIN_EXAMINATEUR : var_examinateur = element.acceptationTestMedical.acceptationExaminateur.dateVisite;
              break;
              case MEDECIN_CONSEIL : var_examinateur = element.acceptationTestMedical.acceptationConseil.dateVisite;
              break;
              case MEDECIN_SPECIALISTE : var_examinateur = element.acceptationTestMedical.acceptationSpecialiste.dateVisite;
              break;
              case LABORATOIRE : var_examinateur = element.acceptationTestMedical.acceptationLaboratoire.dateVisite;
              break;
            }
            uniqueNames.push({
              montantHonoraireAssure : element.acceptationTestMedical.honoraires.reduce((acc, obj) => acc + obj.montantHonoraire, 0),
              cin : element.acceptationTestMedical.acceptation.contrat.assure.cin,
              num_sinistre: element1.numeroSinistre,
              rib: element1.auxiliaire.rib,
              typefiscal : element1.auxiliaire.typeFiscal,
              benificiaire:
                element1.auxiliaire.nom + " " + element1.auxiliaire.prenom,
              assure:
                element.acceptationTestMedical.acceptation.contrat.assure.nom +
                " " +
                element.acceptationTestMedical.acceptation.contrat.assure
                  .prenom,
              montantBrut: element1.montant, 
              montantTaxe:
                element1.montantIr.toFixed(2),
              montantNet: element1.montantNet, 
              nature: "Honoraire",
              total: sum.toString() +" DHS " + "(" + NumberToLetter(sum) + " dirhams)",
              partenaire:
                element.acceptationTestMedical.acceptation.contrat.produit
                  .partenaire.numeroCompte,
              agence:
                element.acceptationTestMedical.acceptation.contrat.produit
                  .partenaire.raisonSocial,
              adresse:
                element.acceptationTestMedical.acceptation.contrat.produit
                  .partenaire.siegeSocial,
              adresseAuxiliaire: element1.auxiliaire.adressComplete,
              date: element1.datePrestation,
              date_visite : var_examinateur,
              referencePartenaire:
                element1.reference + " " + element1.datePrestation
            });
            data.push({
              NumSinistre: element1.numeroSinistre,
              NomEtPrenom:
                element1.auxiliaire.nom + " " + element1.auxiliaire.prenom,
              rib: element1.auxiliaire.rib,
              montantNet: element1.montantNet.toFixed(2)
            });
          });
        });
        console.log(uniqueNames);
        let filteredArr2 = uniqueNames.reduce((acc, current) => {
          const x = acc.find(item => item.cin === current.cin);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        console.log(filteredArr2);
       
        // Create a deep clone of the objects
        let deepClonedArray = JSON.parse(JSON.stringify(filteredArr2));
        let deepClonedArray2 = JSON.parse(JSON.stringify(deepClonedArray));
       
        // Modify the cloned objects without affecting the original array
       
        console.log(deepClonedArray);
   
       
        deepClonedArray2.forEach(obj => {
          if(obj.typefiscal==="IR"){ 
            obj.montantNet = obj.montantHonoraireAssure - (obj.montantHonoraireAssure * 0.1);
          }
        obj.montantBrut = obj.montantHonoraireAssure;
        obj.montantTaxe = obj.montantHonoraireAssure * 0.1;
        });
        console.log( deepClonedArray2);
 
        deepClonedArray2.forEach(obj => {delete obj.montantHonoraireAssure
        delete obj.typefiscal});
        console.log("filteredArr1",filteredArr1);
        filteredArr1 = uniqueNames.reduce((acc, current) => {
          const x = acc.find(
            item => item.num_sinistre === current.num_sinistre
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        
        console.log("data", uniqueNames);
        filte = data.reduce((acc, current) => {
          const x = acc.find(item => item.NumSinistre === current.NumSinistre);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        
    
        const groupedArrays = [];
        deepClonedArray2.forEach((obj) => {
          const index = groupedArrays.findIndex((arr) => arr[0] && arr[0].num_sinistre === obj.num_sinistre);
          if (index >= 0) {
            groupedArrays[index].push(obj);
          } else {
            groupedArrays.push([obj]);
          }
        });

        console.log("groupedArrays",groupedArrays);
        console.log("dataFilter", filteredArr);
    if (record.reglementType === "virement") {
         
            // groupedArrays.forEach(element => {
             
            //   this.jasperLettreRegelementHonoraire(
            //     element,
            //     "Reglement_honoraire_Virement",
            //     ModeReglement
            //   );
            // });

            
            this.jasperLettreRegelementHonoraire(
              filteredArr1,
              "Reglement_honoraire_OrdreVirement",
              record.reglementType
            );
          
        }
        else{
          this.jasperLettreRegelementHonoraire(
            deepClonedArray2,
            "Reglement_honoraire_Virement",
            record.reglementType
          );
    }
    
    
  };

  componentDidMount() {
    this.getAllReglement(0);
    this.getpropreties();
  }
  async getpropreties() {
    let respenceAuxiliaire = await getAuxiliairesByStatut();
    this.state.auxiliaires = respenceAuxiliaire.data;
    console.log("test auxiliaires");
    console.log(this.state.auxiliaires);
    let response = await getAllPartenaire();
    let produitResponse = await getDecesProduit();
    
    this.setState({
      partenaires: response.data.content,
      produits: produitResponse.data.content
    });
  }

  onChangeAuxiliaire = value => {
    this.state.auxiliaire = value;
  };

  async getAllReglement(pageNumber) {
    console.log("beforeAPI : ",pageNumber)
    let response = await getReglements(pageNumber);
    if(response.status==200){
        console.log("hello", response);
        console.log("totalElements : ", response.data.totalElements)
        this.setState({
          spinner:false,
          reglement: response.data.content,
          totalItems:response.data.totalElements
        });
    }else{
      this.setState({spinner:false})
      console.log("Error in getting the Reglements...")
    }
    
 
  
  }


  handleChangeed = value => {
    console.log(value.statut);
  };
  handleRecord = value => {
    id_reglement = value.id;
    console.log(value);
    let uniqueNames = [];
    let filteredArr;
    let sum = 0;
    filteredArr = value.honoraires.reduce((acc, current) => {
      const x = acc.find(item => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    filteredArr.forEach(element1 => {
      sum += element1.montant;
      element1.detailPrestationHonoraire.forEach(element => {
        uniqueNames.push({
          num_sinistre: element1.numeroSinistre,
          rib: element1.auxiliaire.rib,
          benificiaire:
            element1.auxiliaire.nom + " " + element1.auxiliaire.prenom,
          assure:
            element.acceptationTestMedical.acceptation.contrat.assure.nom +
            " " +
            element.acceptationTestMedical.acceptation.contrat.assure.prenom,
          montantBrut: element1.montant,
          montantTaxe:
            element.acceptationTestMedical.acceptation.contrat.montantTaxe,
          montantNet: element1.montantNet,
          nature: "Honoraire",
          total: sum.toString(),
          partenaire:
            element.acceptationTestMedical.acceptation.contrat.produit
              .partenaire.numeroCompte,
          agence:
            element.acceptationTestMedical.acceptation.contrat.produit
              .partenaire.raisonSocial,
          adresse:
            element.acceptationTestMedical.acceptation.contrat.produit
              .partenaire.siegeSocial,
          adresseAuxiliaire: element1.auxiliaire.adressComplete,
          date: element1.datePrestation,
          referencePartenaire:
            element1.reference + " " + element1.datePrestation,
          num_lot: value.num_lot,
          code_part:
            element.acceptationTestMedical.acceptation.contrat.produit
              .partenaire.code
        });
      });
    });

    filteredArr = uniqueNames.reduce((acc, current) => {
      const x = acc.find(item => item.num_sinistre === current.num_sinistre);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    this.send_data_to_trésorie(value.reglementType, filteredArr, value.id);
  };

  handlePartnerChange = value => {
    let list = [...this.state.produits];
    this.setState({
      produitPartenaire: list.filter(item => item.partenaire.id === value.key)
    });
  };
  async ajouterReglement(type, requestModel) {
    try {
      let response = await ajoutReglement(type, requestModel);
      if (response.status === 200) {
      }
    } catch (error) {
      if (error.response.status === 500) {
        notification.error({
          message: "Aucune prestation avec le statut À signer."
        });
      }
    }
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex
    });
  };
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  async ajouterReglementHonoraire(
    ModeReglement,
    Auxiliaire,
    type,
    requestModel
  ) {
    try {
      let response = await addPrestationHonoraire(
        ModeReglement,
        Auxiliaire,
        type,
        requestModel
       );
       if (response.status === 200) {
        let uniqueNames = [];
        let data = [];
        let filteredArr=[];
        let filteredArr1=[];
        let filte;
        let sum = 0;
        filteredArr = response.data.honoraires.reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        console.log(" filteredArr",filteredArr);
        const { NumberToLetter } = require("convertir-nombre-lettre");
        filteredArr.forEach(element1 => {
          sum += element1.montantNet;
          element1.detailPrestationHonoraire.forEach(element => {
            uniqueNames.push({
              montantHonoraireAssure : element.acceptationTestMedical.honoraires.reduce((acc, obj) => acc + obj.montantHonoraire, 0),
              cin : element.acceptationTestMedical.acceptation.contrat.assure.cin,
              num_sinistre: element1.numeroSinistre,
              rib: element1.auxiliaire.rib,
              typefiscal : element1.auxiliaire.typeFiscal ,
              benificiaire:
                element1.auxiliaire.nom + " " + element1.auxiliaire.prenom,
              assure:
                element.acceptationTestMedical.acceptation.contrat.assure.nom +
                " " +
                element.acceptationTestMedical.acceptation.contrat.assure
                  .prenom,
              montantBrut: element1.montant, 
              montantTaxe:
                element1.montantIr.toFixed(2),
              montantNet: element1.montantNet, 
              nature: "Honoraire",
              total: sum.toString() +" DHS " + "(" + NumberToLetter(sum) + " dirhams)",
              partenaire:
                element.acceptationTestMedical.acceptation.contrat.produit
                  .partenaire.numeroCompte,
              agence:
                element.acceptationTestMedical.acceptation.contrat.produit
                  .partenaire.raisonSocial,
              adresse:
                element.acceptationTestMedical.acceptation.contrat.produit
                  .partenaire.siegeSocial,
              adresseAuxiliaire: element1.auxiliaire.adressComplete,
              date: element1.numeroSinistre,
              referencePartenaire:
                element1.reference + " " + element1.datePrestation
            });
            data.push({
              NumSinistre: element1.numeroSinistre,
              NomEtPrenom:
                element1.auxiliaire.nom + " " + element1.auxiliaire.prenom,
              rib: element1.auxiliaire.rib,
              montantNet: element1.montantNet.toFixed(2)
            });
          });
        });
        console.log(uniqueNames);
        let filteredArr2 = uniqueNames.reduce((acc, current) => {
          const x = acc.find(item => item.cin === current.cin);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        console.log(filteredArr2);
       
        // Create a deep clone of the objects
        let deepClonedArray = JSON.parse(JSON.stringify(filteredArr2));
        let deepClonedArray2 = JSON.parse(JSON.stringify(deepClonedArray));
       
        // Modify the cloned objects without affecting the original array
       
        console.log(deepClonedArray);
   
       
        deepClonedArray2.forEach(obj => {
          if(obj.typefiscal==="IR"){ 
            obj.montantNet = obj.montantHonoraireAssure - (obj.montantHonoraireAssure * 0.1);
          }
        obj.montantBrut = obj.montantHonoraireAssure;
        });
        console.log( deepClonedArray2);
 
        deepClonedArray2.forEach(obj => {delete obj.montantHonoraireAssure
        delete obj.typefiscal});
       
        filteredArr1 = uniqueNames.reduce((acc, current) => {
          const x = acc.find(
            item => item.num_sinistre === current.num_sinistre
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        console.log("filteredArr1",filteredArr1);
        console.log("data", uniqueNames);
        filte = data.reduce((acc, current) => {
          const x = acc.find(item => item.NumSinistre === current.NumSinistre);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        
    
        const groupedArrays = [];
        deepClonedArray2.forEach((obj) => {
          const index = groupedArrays.findIndex((arr) => arr[0] && arr[0].num_sinistre === obj.num_sinistre);
          if (index >= 0) {
            groupedArrays[index].push(obj);
          } else {
            groupedArrays.push([obj]);
          }
        });

        console.log("groupedArrays",groupedArrays);
        console.log("dataFilter", filteredArr);
       
        if (ModeReglement === "virement") {
        
            // groupedArrays.forEach(element => {
             
            //   this.jasperLettreRegelementHonoraire(
            //     element,
            //     "Reglement_honoraire_Virement",
            //     ModeReglement
            //   );
            // });
            // this.jasperLettreRegelementHonoraire(
            //   filteredArr1,
            //   "Reglement_honoraire_OrdreVirement",
            //   ModeReglement
            // );
          
        }
        else{
          this.jasperLettreRegelementHonoraire(
            deepClonedArray2,
            "Reglement_honoraire_Virement",
            ModeReglement
          );
        }
        this.setState({
          dataT: filteredArr,
          _mode_reglement: ModeReglement
        });
        notification.success({
          message: "Reglement générer avec succès !"
        });
        console.log(this.state.filepdfData);
      }
    } catch (error) {
      
      notification.error({
        message: "Aucun honoraire avec le statut À signer."
      });
    }
    this.setState({loading:false});
  }

  async jasperLettreRegelement(requestLettre, path) {
    let response = await lettreRegHonoraire(requestLettre, path);
    if (response.status === 200) {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
    this.setState({ loading: false });
  }

  async jasperLettreRegelementHonoraire(requestLettre, rapport, modeReglement) {
    let response = await lettreRegHonoraire(
      requestLettre,
      rapport,
      modeReglement
    );
    if (response.status === 200) {
      this.setState({loading : false});
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    }
    
  }

  async updatePrestationStatut(reglementId, statut) {
    await setPrestationStatut(reglementId, statut);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll();
  };

  // Generer(ModeReglement) {
  //   this.props.form.validateFieldsAndScroll((err, values) => {
  //     const date = new Date();
  //     let requestmodel = {
  //       libelle: "Ordre de " + ModeReglement + " sup " + date,
  //       reglementType: ModeReglement,
  //       dateStatut: date
  //     };
  //     if (!err) {
  //       if (values.nature.key === "Honoraire") {
  //         if (!values.auxiliaire) {
  //           this.ajouterReglementHonoraire(
  //             ModeReglement,
  //             null,
  //             values.nature.label,
  //             requestmodel
  //           );
  //         } else {
  //           this.ajouterReglementHonoraire(
  //             ModeReglement,
  //             values.auxiliaire.key,
  //             values.nature.label,
  //             requestmodel
  //           );
  //         }
  //       } else {
  //         this.ajouterReglement(values.nature.label, requestmodel);
  //         this.getAllReglement();
  //       }
  //     }
  //   });
  // }

  Generer(ModeReglement) {
   
    this.props.form.validateFieldsAndScroll((err, values) => {
      const date = new Date();
      let requestmodel = {
        libelle: "Ordre de " + ModeReglement + " sup " + date,
        reglementType: ModeReglement,
        dateStatut: date
      };
      if (!err) {
        if (values.nature.key === "Honoraire") {
          console.log("values.auxiliaire",values.auxiliaire);
          this.setState({loading : true},()=>{
          if (!values.auxiliaire && ModeReglement == "virement") {
            console.log(values.auxiliaire);
            this.ajouterReglementHonoraire(
              ModeReglement,
              null,
              values.nature.label,
              requestmodel
              );
          }
          if (!values.auxiliaire && ModeReglement == "cheque") {
            notification.error({
              message: "Takaful",
              description:
              "le champs d'auxiliaire est vide, veuillez le remplir"
            });
          }
          if (values.auxiliaire && ModeReglement != "virement") {
            console.log("test here!");
              this.ajouterReglementHonoraire(
                ModeReglement,
                values.auxiliaire.key,
                values.nature.label,
                requestmodel
              );
          } 
          if(values.auxiliaire && ModeReglement != "cheque"){
            console.log("ModeReglement front =  "+ModeReglement);
            this.ajouterReglementHonoraire(
            ModeReglement,
            values.auxiliaire.key,
            values.nature.label,
            requestmodel
            );
        }
      });
        } else {
          this.ajouterReglement(values.nature.label, requestmodel);
          this.getAllReglement(0);
        }
      }
    });
  }


  onClickSearchVirement = e => {
    e.preventDefault();
    this.Generer("virement");
  };

  async send_data_to_trésorie(_mode_reglement, data, id_reglement) {
    if (_mode_reglement === "virement") {
      let responce = await virement2(data);
      if (responce.status == 200) {
        notification.success({
          message: "Viremrent envoyé avec succès !"
        });
      }
    }
    if (_mode_reglement === "cheque") {
      let responce = await cheque2(data);
      if (responce.status == 200) {
        notification.success({
          message: "Chèque envoyé  avec succès !"
        });
      }
    }
    this.updatePrestationStatut(id_reglement, "EN_COURS");
  }
  onClickSearchCheque = e => {
    e.preventDefault();
    this.Generer("cheque");
  };
  onClickSearch = e => {
    this.setState({
      add: true
    });
  };
  convertToCSV = data => {
    const csvRows = [];

    // Add headers
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    // Add data rows
    for (const row of data) {
      const values = headers.map(header => row[header]);
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  };
  generateExcelFile = data => {
    var currentDate = new Date();

    // Get the individual date components
    var year = currentDate.getFullYear(); // 4-digit year
    var month = currentDate.getMonth() + 1; // Month (0-11, so we add 1)
    var day = currentDate.getDate(); // Day of the month

    // Format the date as a string
    var formattedDate =
      year + "-" + addLeadingZero(month) + "-" + addLeadingZero(day);

    // Function to add a leading zero for single-digit numbers
    function addLeadingZero(number) {
      return number < 10 ? "0" + number : number;
    }
    console.log(formattedDate);
    console.log("generating excel file !");
    const csvString = this.convertToCSV(data);

    // Create a blob with the CSV string
    const blob = new Blob([csvString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    var title = "ORV_" + this.state.num_lot + "_CAM_" + formattedDate;
    console.log(title);
    link.download = title.toString() + ".csv";

    // Simulate a click on the download link
    link.click();
  };

  onPaginationChange=(pagenumber,pageSize)=>{
    console.log("pageNumber : ",pagenumber)
    this.setState({spinner:true})
    this.getAllReglement(pagenumber-1)
  }

  render() {
    const { loading } = this.state;
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
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 24,
          offset: 4
        }
      }
    };

    return (
      <div>
        <Row>
          <Title style={{ marginBottom: "25px" }} level={4}>
            RECHERCHE DES PRESTATIONS
          </Title>
          <Divider />
          <Col span={24} offset={1}>
            <Title style={{ marginBottom: "25px" }} level={4} underline={true}>
              Critéres de Recherche :
            </Title>
            <Spin spinning={loading}>
              <Form
                {...formItemLayout}
                onSubmit={this.handleSubmit}
                ref={ref => {
                  this.form = ref;
                }}
                hideRequiredMark
              >
                <Col span={10}>
                  <Form.Item label="Intermédiaire " hasFeedback>
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
                        placeholder="Veuillez selectionner"
                        optionLabelProp="label"
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
                  <Form.Item label="Auxiliaire " hasFeedback>
                    {getFieldDecorator("auxiliaire", {
                      valuePropName: "selected"
                    })(
                      <AutoComplete
                        size="default"
                        className="not-rounded"
                        style={{ width: 182 }}
                        dataSource={this.state.auxiliaires.map(element => {
                          return (
                            <Option
                              key={element.id}
                              value={element.id}
                              label={element.nom}
                            >
                              {element.prenom + " " + element.nom}
                            </Option>
                          );
                        })}
                        onSelect={this.onChangeAuxiliaire}
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
                </Col>

                <Col span={1}></Col>
                <Col span={10}>
                  <Form.Item label="Nature " hasFeedback>
                    {getFieldDecorator("nature", {
                      rules: [
                        {
                          required: true
                        }
                      ]
                    })(
                      <Select
                        placeholder="Veuillez selectionner"
                        optionLabelProp="label"
                        labelInValue
                      >
                        <Option value="Sinistre" label="Sinistre">
                          Sinistre
                        </Option>
                        <Option value="Restitution" label="Restitution">
                          Restitution
                        </Option>
                        <Option value="Honoraire" label="Honoraire">
                          Honoraire
                        </Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                    <Button
                      style={{ margin: "10px" }}
                      type="primary"
                      htmlType="submit"
                      onClick={this.onClickSearchVirement}
                      className="not-rounded"
                    >
                      <Icon type="file-add" theme="filled" />
                      Générer ordre de virement
                    </Button>
                    <Button
                      style={{ margin: "10px" }}
                      type="default"
                      onClick={this.onClickSearchCheque}
                      className="not-rounded"
                    >
                      <Icon type="file-add" theme="twoTone" />
                      Générer fichier chèque
                    </Button>
                  </Form.Item>
                  <Form.Item {...tailFormItemLayout}>
                    <Spin spinning={this.state.spinner}>
                    <Button
                      style={{ float: "right" }}
                      className="rech-btn"
                      type="default"
                      onClick={this.onClickSearch}
                    >
                      Afficher les reglements
                    </Button>
                  </Spin>
                  </Form.Item>
                </Col>
              </Form>
            </Spin>
          </Col>
        </Row>
        {this.state.add ? (
          <Table
            rowClassName="editable-row"
            columns={this.columns}
            size="small"
            bordered
            dataSource={this.state.reglement}
            pagination={{
              onChange: this.onPaginationChange,
              pageSize: 5,
              total: this.state.totalItems
            }}
          />
        ) : null}
      </div>
    );
  }
}
const ReglementForm = Form.create()(Reglement);
export default ReglementForm;
