/* eslint-disable react/prop-types */
import "antd/dist/antd.css";
import {
  Alert,
  Button,
  notification,
  Table,
  Typography,
  Icon,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select
} from "antd";
import React, { Component } from "react";
import PrestationTestsMedicalHonoraire from "./PrestationTestsMedicalTable";
import {
  getPrestationSearch,
  updateStatus
} from "../../Parametrage/TypePrestation/PrestationAPI";
import {

  lettreRegHonoraire
} from "../../Parametrage/TypePrestation/PrestationAPI";
import { LABORATOIRE, MEDECIN_CONSEIL, MEDECIN_EXAMINATEUR, MEDECIN_SPECIALISTE } from "../../../constants";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === "status") {
      return (
        <Select
          style={{ width: "100%" }}
          placeholder="sélectionnez"
          labelInValue
        >
          <Option value="En cours">En cours</Option>
          <Option value="Annulé">Annulé</Option>
          <Option value="A signer">A signer</Option>
        </Select>
      );
    }
    return <Input></Input>;
  };
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      record,
      status,
      children,
      ...restProps
    } = this.props;
    if (editing && title === "status") {
      return (
        <td {...restProps}>
          <Form.Item name={dataIndex} style={{ margin: 0 }}>
            {getFieldDecorator("status", {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: status
            })(this.getInput())}
          </Form.Item>
        </td>
      );
    } else return <td {...restProps}>{children}</td>;
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}
class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      editingKey: "",
      showDetailPrestation: false,
      detailPrestation: [],
      loading: false,
      status: this.props.status
    };
    this.columns = [
      {
        title: "Numéro sinistre",
        dataIndex: "numeroSinistre",
        key: "numeroSinistre",
        render: text => <Button type="link">{text}</Button>,
        onCellClick: record => {
          this.handleFilter(record);
        }
      },
      {
        title: "Date préstation",
        dataIndex: "datePrestation",
        key: "datePrestation"
      },
      {
        title: "Montant",
        dataIndex: "montant",
        key: "montant"
      },
      {
        title: "Montant IR",
        dataIndex: "montantIr",
        key: "montantIr"
      },
      {
        title: "Montant Net",
        dataIndex: "montantNet",
        key: "montantNet"
      },
      {
        title: "Mode Réglement",
        dataIndex: "modeReglement",
        key: "modeReglement"
      },
      {
        title: "status",
        dataIndex: "status",
        editable: true
      },
      {
        title: "Auxiliaire",
        dataIndex: "auxiliaire",
        key: "auxiliaire",
        render: name => `${name.nom} ${name.prenom}`
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.id)}
                    style={{ marginRight: 8 }}
                  >
                    Enregistrer
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="êtes-vous certain de vouloir annuler ?"
                onConfirm={() => this.cancel(record.id)}
              >
                <a>Annuler</a>
              </Popconfirm>
            </span>
          ) : (
            <a>
            <a
              disabled={editingKey !== ""}
              onClick={() => this.edit(record.id)}
            >
              <Icon
                type="edit"
                style={{ color: "rgb(119, 204, 109)", fontSize: "25px" }}
              />
             </a>
             <a>
              <Icon type="file-pdf"  onClick={() => this.fichierpdf(record)} style={{ color: "rgb(255, 0, 0)", fontSize: "25px" }} />
           </a>
         
            </a>      
           
          );
        }
      }
    ];
  }

  fichierpdf= (record) => {
    console.log(record);
    let uniqueNames = [];
        let data = [];
        let filteredArr=[];
        let filteredArr1=[];
        let sum = 0;
      
        const { NumberToLetter } = require("convertir-nombre-lettre");
          record.detailPrestationHonoraire.forEach(element => {
           console.log()
            let var_examinateur = '';
            switch(record.auxiliaire.typeAuxiliaire.libelle){
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
              rib: record.auxiliaire.rib,
              typefiscal : record.auxiliaire.typeFiscal,
              benificiaire:
                record.auxiliaire.nom + " " + record.auxiliaire.prenom,
              assure:
                element.acceptationTestMedical.acceptation.contrat.assure.nom +
                " " +
                element.acceptationTestMedical.acceptation.contrat.assure
                  .prenom,
              montantBrut: record.montant, 
              montantTaxe:
                record.montantIr.toFixed(2),
              montantNet: record.montantNet, 
              nature: "Honoraire",
              total: record.montantNet.toString() +" DHS " + "(" + NumberToLetter(record.montantNet) + " dirhams)",
              partenaire:
                element.acceptationTestMedical.acceptation.contrat.produit
                  .partenaire.numeroCompte,
              agence:
                element.acceptationTestMedical.acceptation.contrat.produit
                  .partenaire.raisonSocial,
              adresse:
                element.acceptationTestMedical.acceptation.contrat.produit
                  .partenaire.siegeSocial,
              adresseAuxiliaire: record.auxiliaire.adressComplete,
              date_visite: var_examinateur,
              referencePartenaire:
               record.reference + " " + record.datePrestation
            });
          
          })
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
  
        
        console.log("data", uniqueNames);
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
        if(record.modeReglement === "Cheque"){
          groupedArrays.forEach(element => {
             
            this.jasperLettreRegelementHonoraire(
              element,
              "Reglement_honoraire_Virement",
              "cheque"
            );
          });
        }
        else{
            groupedArrays.forEach(element => {
             
              this.jasperLettreRegelementHonoraire(
                element,
                "Reglement_honoraire_Virement",
                record.modeReglement
              );
            });
          }
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
  isEditing = record => record.id === this.state.editingKey;
  cancel = () => {
    this.setState({ editingKey: "" });
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          status: row.status.key
        });
        this.setState({
          data: newData,
          editingKey: ""
        });
        this.updateStatus(row.status.key, key);
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }
    });
  }

  async updateStatus(data, key) {
    let response = await updateStatus(data, key);
    console.log(response);
  }

  handleFilter = record => {
    let uniqueNames = [];
    const result = [];
    console.log("test test 88");
    console.log(record);
    let i=0,id="";
    record.detailPrestationHonoraire.forEach(element => {
      if(id != element.acceptationTestMedical.id){
        id=element.acceptationTestMedical.id;
        i=0;
      }else{
        i++;
      }
      uniqueNames.push({
        id: element.acceptationTestMedical.id,
        idDetail: element.id,
        code: element.acceptationTestMedical.acceptation.code,
        Nom: element.acceptationTestMedical.acceptation.contrat.assure.nom,
        Intitule: element.acceptationTestMedical.honoraires[i].intituele,
        libelle :element.acceptationTestMedical.honoraires[i].libelle,
       /* montantHonoraire :element.detailPrestationHonoraire.map( 
          elem => elem.montantHonoraire
        )*/
        montantHonoraire :element.montantHonoraire,
        numeroSinistre : record.numeroSinistre,
        typeFiscal : record.auxiliaire.typeFiscal
      });
      
    });
    const seen = new Set();
    for (const obj of uniqueNames) {
      if (!seen.has(obj.id)) {
        result.push(obj);
        seen.add(obj.id);
      }
    }
  
    this.setState({
      detailPrestation: [...uniqueNames],
      showDetailPrestation: true
    });
  };

  componentDidMount() {
    const {
      auxiliaire,
      produit,
      typeAuxiliaire,
      status,
      participant,
      contrat
    } = this.props;

    this.searchPrestation(
      auxiliaire,
      status.key,
      produit.key,
      typeAuxiliaire.label,
      participant,
      contrat
    );
    
  }
 
  async searchPrestation(
    auxiliaire,
    status,
    produit,
    typeAuxiliaire,
    nomParticipant,
    numContrat
  ) {
    this.setState({ loading: true });
    let respence = await getPrestationSearch(
      auxiliaire,
      status,
      produit,
      typeAuxiliaire,
      nomParticipant,
      numContrat
    );
    if (respence.status === 200) {
      let filteredArr = [];
      filteredArr = respence.data.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      this.setState({ data: filteredArr, loading: false });
    } else {
      notification.error({
        message: "Merci de verifier les informations de recherche et réessayer"
      });
    }
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      } else
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.title,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: this.isEditing(record),
            status: this.state.status
          })
        };
    });
    return (
      <div style={{ marginTop: "50px" }}>
        <Title style={{ marginBottom: "25px" }} level={4} underline={true}>
          Résultats de Recherche :
        </Title>
        {!this.state.loading && (
          <Alert
            message={this.state.data.length + " ligne trouvé"}
            type="success"
          />
        )}
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            rowKey={(record, index) => index}
            columns={columns}
            rowClassName="editable-row"
            dataSource={this.state.data}
            pagination={{ hideOnSinglePage: true }}
            loading={this.state.loading}
            bordered
          />
        </EditableContext.Provider>
        {this.state.showDetailPrestation && (
          <PrestationTestsMedicalHonoraire
            data={this.state.detailPrestation}
          ></PrestationTestsMedicalHonoraire>
        )}
      </div>
    );
  }
}
const RecherchPrestationHonoraire = Form.create()(EditableTable);
export default RecherchPrestationHonoraire;
