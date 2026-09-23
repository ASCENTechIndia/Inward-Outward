import React from "react";
import { formatDate } from "../../utils/dateUtils";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// ✅ Register Devanagari font (if multilingual support needed)
Font.register({
  family: "NotoSansDevanagari",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "NotoSansDevanagari",
  },
 header: {
  alignItems: "center", // center company name horizontally
  marginBottom: 5,
},
title: {
  fontSize: 16,
  fontWeight: "bold",
  textAlign: "center",
},
date: {
  alignSelf: "flex-end", // push date to the right
  fontSize: 12,
},
  line: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
    marginTop: 5,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    textDecoration: "underline",
  },
  label: {
    fontWeight: "bold",
  },
  table: {
    display: "table",
    width: "auto",
    marginTop: 5,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
      flexWrap: "wrap",  
  },
  tableCol: {
    borderStyle: "solid",
    borderColor: "#000",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 5,
    flex: 1,
  },
  tableCell: {
    fontSize: 10,
  },
  signature: {
    marginTop: 30,
    textAlign: "right",
    fontSize: 12,
  },
});

const GeneratePDF = ({ data, companyName }) => {
  const prescription = Array.isArray(data) ? data[0] : data;
const today = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
  const vitalsArray = prescription?.VAR_CONSULTATION_VITALS
    ? prescription.VAR_CONSULTATION_VITALS.split("$")
    : []; 
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
       <View style={styles.header}>
  <Text style={styles.title}>
    {companyName || "Hospital Name"}
  </Text>
  <Text style={styles.date}>Date: {today}</Text>
</View>
        <View style={styles.line} />

        {/* Patient Details */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Patient Details</Text>
          <Text>
            <Text style={styles.label}>Patient English Name: </Text>
            {prescription.VAR_PATIENT_ENAME}
          </Text>
          <Text>
            <Text style={styles.label}>Patient Marathi Name: </Text>
            {prescription.VAR_PATIENT_MNAME}
          </Text>
           <Text>
            <Text style={styles.label}>Patient's Date of Birth: </Text>
            {formatDate(prescription.DAT_PATIENT_DOB)}
          </Text>
          <Text>
            <Text style={styles.label}>OPD ID: </Text>
            {prescription.NUM_CONSULTATION_OPDID}
          </Text>
        </View>

        {/* Consultation Details */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Consultation Details</Text>
          <Text>
            <Text style={styles.label}>Doctor Name: </Text>
            {prescription.VAR_DOC_ENAME}
          </Text>
            <Text>
            <Text style={styles.label}>Consultation Diagnose Code : </Text>
            {prescription.VAR_DIAGN_DIAGNCODE}
          </Text>
            <Text>
            <Text style={styles.label}>Clinical Notes: </Text>
            {prescription.VAR_CONSULTATION_CLINICALNOTES}
          </Text>
          <Text>
            <Text style={styles.label}>Visit Date: </Text>
         {new Date(prescription.DAT_CONSULTATION_VISITDATE)
  .toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}
          </Text>
          {/* Placeholder vitals */}
          {vitalsArray.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>BP</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>SPO2</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Temperature</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>Weight</Text></View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{vitalsArray[0] || "-"}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{vitalsArray[1] || "-"}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{vitalsArray[2] || "-"}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{vitalsArray[3] || "-"}</Text></View>
            </View>
          </View>
        )}
        </View>

        {/* Test Details */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Test Details</Text>
            <Text>
            <Text style={styles.label}>Test Name: </Text>
            {prescription.VAR_CONSULTATION_TESTS || "No Test Suggested by Doctor"} 
          </Text>
        </View>

        {/* Prescription Details */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Prescription Details</Text>
       <View style={styles.table} wrap>
  {/* Table Header */}
  <View style={styles.tableRow} fixed>
    <View style={styles.tableCol}>
      <Text style={styles.tableCell}>Medicine Name</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCell}>Dosage</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCell}>Frequency</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCell}>Duration (Days)</Text>
    </View>
    <View style={styles.tableCol}>
      <Text style={styles.tableCell}>Instructions</Text>
    </View>
  </View>

  {/* Table Data */}
  {Array.isArray(data) &&
    data.map((item, i) => (
      <View style={styles.tableRow} key={i} wrap>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{item.VAR_PRESCRIPTION_MEDICINENAME}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{item.VAR_PRESCRIPTION_DOSAGE}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{item.VAR_PRESCRIPTION_FREQUENCY}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{item.NUM_PRESCRIPTION_DURATIONDAYS}</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>{item.VAR_PRESCRIPTION_INSTRUCTIONS}</Text>
        </View>
      </View>
    ))}
</View>

        </View>

        {/* Doctor Signature */}
        <Text style={styles.signature}>Doctor's Signature: ____________</Text>
      </Page>
    </Document>
  );
};

export default GeneratePDF;
