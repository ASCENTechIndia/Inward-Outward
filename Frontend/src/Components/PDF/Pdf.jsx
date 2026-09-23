import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Download } from "lucide-react";

Font.register({
  family: "NotoMarathi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "NotoMarathi",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  logo: {
    width: 60,
    height: 60,
  },
  titleSection: {
    flex: 1,
    marginLeft: 10,
    textAlign: "center",
  },
  ulbName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  reportTitle: {
    fontSize: 18,
    color: "blue",
    marginTop: 5,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    backgroundColor: "#d3d3d3",
    padding: 6,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 9,
  },
  tableCell: {
    padding: 6,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    flex: 1,
    fontSize: 9,
    textAlign: "center",
  },
});

const safe = (v, fallback = "—") =>
  v === undefined || v === null || v === "" ? fallback : String(v);

const TablePDF = ({ tableHeader, tableData, logoUrl, ulbName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        {logoUrl ? (
          <Image style={styles.logo} src={logoUrl} />
        ) : (
          <Image
            style={styles.logo}
            src="https://via.placeholder.com/60?text=Logo"
          />
        )}
        <View style={styles.titleSection}>
          <Text style={styles.ulbName}>{safe(ulbName, "ULB Name")}</Text>
          <Text style={styles.reportTitle}>Return Adjustment Report</Text>
        </View>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          {tableHeader.map((head, index) => (
            <Text key={index} style={styles.tableCellHeader}>
              {safe(head)}
            </Text>
          ))}
        </View>

        {tableData && tableData.length > 0 ? (
          tableData.map((row, rowIndex) => (
            <View style={styles.tableRow} key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <Text key={cellIndex} style={styles.tableCell}>
                  {safe(cell)}
                </Text>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: tableHeader.length }]}>
              No data available
            </Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

const Pdf = ({
  tableHeader,
  tableData,
  fileName = "table.pdf",
  ulbName,
  logoUrl,
}) => (
  <PDFDownloadLink
    document={
      <TablePDF
        tableHeader={tableHeader}
        tableData={tableData}
        ulbName={ulbName}
        logoUrl={logoUrl}
      />
    }
    fileName={fileName}
  >
    {({ loading }) => (
      <button className="bg-blue-600 flex items-center gap-2 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md hover:cursor-pointer">
        <Download className="w-4 h-4" />
        Export to PDF
      </button>
    )}
  </PDFDownloadLink>
);

export default Pdf;
