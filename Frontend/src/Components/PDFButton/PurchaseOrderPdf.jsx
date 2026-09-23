import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// ✅ Register the custom font (supports Marathi/Hindi/Unicode)
Font.register({
  family: "NotoMarathi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "NotoMarathi",
  },
  header: {
    width: "100%",
    position: "relative",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
    position: "absolute",
    left: 0,
    top: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  dateRange: {
    fontSize: 10,
    marginTop: 4,
    color: "#555",
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 20,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 6,
    fontWeight: "bold",
    textAlign: "left", // Align headers left
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    textAlign: "left", // Align data left
  },
  poItemsCol: {
    width: "45%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
    textAlign: "left", // Align items left
  },
  poItemsColHeader: {
    width: "45%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 6,
    fontWeight: "bold",
    textAlign: "left", // Align header left
  },
});

const PurchaseOrderPdf = ({
  tableData,
  tableHeader,
  logoUrl,
  ulbName,
  startDate,
  endDate,
}) => {
  const formatHeaderDate = (date) => {
    return date ? new Date(date).toLocaleDateString("en-GB") : "N/A";
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo and Text */}
        <View style={styles.header}>
          {logoUrl && <Image style={styles.logo} src={logoUrl} />}
          <Text style={styles.title}>{ulbName}</Text>
          <Text style={styles.subHeader}>Purchase Order Report</Text>
          <Text style={styles.dateRange}>
            From Date: {formatHeaderDate(startDate)} To Date:{" "}
            {formatHeaderDate(endDate)}
          </Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {tableHeader.map((header, index) => (
              <Text
                key={index}
                style={
                  header === "Purchase Order Items"
                    ? styles.poItemsColHeader
                    : styles.tableColHeader
                }
              >
                {header}
              </Text>
            ))}
          </View>
          {tableData.map((row, rowIndex) => (
            <View style={styles.tableRow} key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Text
                  key={cellIndex}
                  style={
                    tableHeader[cellIndex] === "Purchase Order Items"
                      ? styles.poItemsCol
                      : styles.tableCol
                  }
                >
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PurchaseOrderPdf;
