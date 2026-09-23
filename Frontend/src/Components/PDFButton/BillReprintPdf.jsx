import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
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
    backgroundColor: "#e6e6e6",
    padding: 4,
    fontWeight: "bold",
  },
  tableCol: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
  },
  headerText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});

const BillReprintPdf = ({ headers, records }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.headerText}>Bill Report</Text>

      {/* Table */}
      <View style={styles.table}>
        {/* Header Row */}
        <View style={styles.tableRow}>
          {headers.slice(0, -1).map((header, idx) => (   // ✅ last column removed
            <Text key={idx} style={styles.tableColHeader}>
              {header}
            </Text>
          ))}
        </View>

        {/* Data Rows */}
        {records.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {row.slice(0, -1).map((cell, cellIndex) => (   // ✅ last column removed
              <Text key={cellIndex} style={styles.tableCol}>
                {typeof cell === "string" || typeof cell === "number"
                  ? cell
                  : ""}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default BillReprintPdf;
