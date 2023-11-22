/* eslint-disable react/prop-types */
import "antd/dist/antd.css";

import { notification, Table, Typography, Spin ,Select ,Input, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import AjoutePrestationHonoraire from "./AjoutePrestationHonoraire";
import { createPrestationHonoraire } from "../../Parametrage/Honoraires/HonorairesAPI";
import { isRefObject } from "@fluentui/react-component-ref";

const { Title } = Typography;
const { Option } = Select;
const myInputValue="";
const columns = [
  {
    title: "Nom et prénom assuré",
    key: "Nom Assure",
    dataIndex: "acceptation",
    render: text => (
      <div>{text.contrat.assure.nom + " " + text.contrat.assure.prenom}</div>
    )
  },
  {
    title: "CIN",
    key: "CIN",
    dataIndex: "acceptation",
    render: text => <div>{text.contrat.assure.cin}</div>
  },
  {
    title: "Code examen",
    dataIndex: "honoraires",
    key: "Libelle Test",
    render: text => (
      <div>
        {text.map(element => {
          return element.libelle + " /";
        })}
      </div>
    )
  },
  // {
  //   title: "Intitulé examen",
  //   key: "Intituele Test",
  //   dataIndex: "honoraires",
  //   render: text => (
  //     <div>
  //       {text.map(element => {
  //         return element.intituele + " /";
  //       })}
  //     </div>
  //   )
  // },
  {
    title: "Montant",
    dataIndex: "honoraires",
    key: "Mnt Honoraire",
    render: text => {
      return <div>{addition(text)} DH</div>;
    }
  }
];

const addition = elements => {
  let montant = 0;
  elements.forEach(element => {
    montant = montant + element.montantHonoraire;
  });
  return montant;
};


const HonoraireTable = props => {
  const [montantG, setMontantG] = useState(0);
  const [montantIr, setMontantIr] = useState(0);
  const [montantNet, setMontantNet] = useState(0);
  const [selectedTstRows, setSelectedTstRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState(props.tests);
  const { typeFiscal , montantChange } = props;

  const [myRequestmodel, setMyRequestmodel] = useState({
    detailPrestationHonoraire: []
  });
  const [requestStatus, setRequestStatus] = useState(false);
  const [selectedRowsArray, setSelectedRowsArray] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowsArray(selectedRows);

      setSelectedRowsArray(selectedRowKeys);
      let montant = 0;
      let montantIr = 0;
      let montantNet = 0;

      selectedRows.forEach(element => {
        console.log("*-------honorairSelected----------*");
        console.log(element.honoraires);
        montant = montant + addition(element.honoraires);
        if (typeFiscal == "IR") {
          montantIr = montant * 0.1;
          montantNet = montant - montantIr;
        } else {
          montantNet = montant;
        }
      });
      setSelectedTstRows([...selectedRows]);
      setMontantG(montant);
      setMontantIr(montantIr);
      setMontantNet(montantNet);
    },
    selectedRowKeys: selectedRowsArray
  };

  async function createPrestation(values) {
    setLoading(true);
    console.log(values);
    let rec = await createPrestationHonoraire(values);
    if (rec.status === 200) {
      setRequestStatus(true);
      setSelectedRowsArray([]);
      setLoading(false);
      notification.success({
        message: "bien ajouté"
      });
    } else {
      notification.error({
        message: "Merci de verifier les information entree"
      });
    }
  }

  const submitPrestationHonoraire = requestmodel => {
    setMyRequestmodel(requestmodel);
    createPrestation(requestmodel);
    setRequestStatus(false);
    setSelectedRowsArray(null);
  };

  useEffect(() => {
    console.log(props.produit);
    let listHelp = [...dataList];
    myRequestmodel.detailPrestationHonoraire.forEach(element => {
      listHelp = [
        ...listHelp.filter(
          item => item.id !== element.acceptationTestMedical.id
        )
      ];
    });
    setDataList(listHelp);
  }, [requestStatus]);

  return (
    <div style={{ marginTop: "50px" }}>
      <Title style={{ marginBottom: "25px" }} level={4} underline={true}>
        Création des honoraires :
      </Title>
      <Spin spinning={loading}>
        <Table
          rowKey={record => record.id}
          pagination={{ hideOnSinglePage: true, defaultPageSize: 50 }}
          bordered
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataList}
        />
      </Spin>
      <AjoutePrestationHonoraire
        auxiliaire={props.auxiliaire}
        Ajouter={submitPrestationHonoraire}
        rows={selectedTstRows}
        montantGlobale={montantG}
        montantGIR={montantIr}
        montantNet={montantNet}
        typeFiscal={props.typeFiscal}
        produit={props.produit}
      ></AjoutePrestationHonoraire>
    </div>
  );
};

export default HonoraireTable;
