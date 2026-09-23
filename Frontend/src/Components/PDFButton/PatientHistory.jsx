import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  header: { fontSize: 16, textAlign: "center", marginBottom: 15 },
  patientDetails: { marginBottom: 20 },
  detailRow: { flexDirection: "row", marginBottom: 5 },
  detailLabel: { width: 120, fontWeight: "bold" },
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1 },
  tableRow: { flexDirection: "row", borderBottom: "1pt solid #000", minHeight: 20, alignItems: "center" },
  tableHeader: { backgroundColor: "#eee", fontWeight: "bold" },
  tableCell: { flex: 1, padding: 5 },
});

// PDF Document
const PatientHistoryPDF = ({ patientDetails, tableHeader, tableData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Patient History Report</Text>

      {/* Patient Details */}
      <View style={styles.patientDetails}>
        {Object.entries(patientDetails).map(([label, value], idx) => (
          <View key={idx} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}:</Text>
            <Text>{value}</Text>
          </View>
        ))}
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          {tableHeader.map((head, i) => (
            <Text key={i} style={styles.tableCell}>
              {head}
            </Text>
          ))}
        </View>

        {/* Table Body */}
        {tableData.map((row, i) => (
          <View key={i} style={styles.tableRow} wrap={false}>
            {row.map((cell, j) => (
              <Text key={j} style={styles.tableCell}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);




export default PatientHistoryPDF;
