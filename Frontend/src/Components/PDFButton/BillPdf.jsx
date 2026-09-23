import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "30%",
    fontWeight: "bold",
  },
  value: {
    width: "70%",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 6,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    textAlign: "center",
  },
  summary: {
    marginTop: 20,
    borderTop: "1px solid #000",
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 12,
  },
  footer: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 10,
    fontStyle: "italic",
  },
});

const BillPdf = ({ patientName, billDate, services, totals, billData }) => {
  const getPaymentMode = () => {
    switch (billData.NUM_BILL_PAYMODE) {
      case 1:
        return "Cash";
      case 2:
        return "UPI";
      case 3:
        return "Card";
      case 4:
        return "Online Payment";
      default:
        return "";
    }
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.hospitalName}>Receipt</Text>
          <Text style={styles.subHeader}>Patient Billing</Text>
        </View>

        {/* Patient & Bill Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Bill ID:</Text>
            <Text style={styles.value}>{billData.NUM_BILL_ID}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Patient ID:</Text>
            <Text style={styles.value}>{billData.NUM_BILL_PATIENTID}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Patient Name:</Text>
            <Text style={styles.value}>{patientName || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Consultation ID:</Text>
            <Text style={styles.value}>{billData.NUM_BILL_CONSULTATIONID}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>OPD ID:</Text>
            <Text style={styles.value}>{billData.NUM_BILL_OPDID}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Bill Date:</Text>
            <Text style={styles.value}>{billDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{billData.VAR_BILL_STATUS}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Mode:</Text>
            <Text style={styles.value}>{getPaymentMode()}</Text>
          </View>
        </View>

        {/* Services Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Service Code</Text>
            <Text style={styles.tableColHeader}>Description</Text>
            <Text style={styles.tableColHeader}>Rate</Text>
          </View>
          {services.map((service, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCol}>{service.code}</Text>
              <Text style={styles.tableCol}>{service.description}</Text>
              <Text style={styles.tableCol}>{service.rate}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Total Amount:</Text>
            <Text>{totals.total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Discount:</Text>
            <Text>{totals.discount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Paid Amount:</Text>
            <Text>{totals.paid}</Text>
          </View>
        </View>

        {/* Footer */}
      </Page>
    </Document>
  );
};

export default BillPdf;
