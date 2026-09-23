import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// ✅ Register font (Devanagari/Marathi/Hindi support)
Font.register({
  family: "NotoMarathi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "NotoMarathi",
    fontSize: 10,
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

// ✅ Safe text helper
const safe = (v, fallback = "—") =>
  v === undefined || v === null || v === "" ? fallback : String(v);

const RptItemPDF = ({ reportData, ulbName, logoUrl }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {/* Logo */}
        {logoUrl ? (
          <Image style={styles.logo} src={logoUrl} />
        ) : (
          <Image
            style={styles.logo}
            src="https://via.placeholder.com/60?text=Logo"
          />
        )}
        {/* ULB Name + Report Title */}
        <View style={styles.titleSection}>
          <Text style={styles.ulbName}>{safe(ulbName, "ULB Name")}</Text>
          <Text style={styles.reportTitle}>Utilization Report</Text>
        </View>
        {/* Right side empty (for balance spacing) */}
        <View style={{ width: 60 }} />
      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Header Row */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>Sr.No</Text>
          <Text style={styles.tableCellHeader}>Item Name</Text>
          {/* <Text style={styles.tableCellHeader}>Department</Text> */}
          <Text style={styles.tableCellHeader}>Category Type</Text>
          <Text style={styles.tableCellHeader}>Times Used</Text>
          <Text style={styles.tableCellHeader}>Qty Used</Text>
        </View>

        {/* Data Rows */}
        {reportData && reportData.length > 0 ? (
          reportData.map((row, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>{idx + 1}</Text>
              <Text style={styles.tableCell}>{safe(row.ITEM_NAME)}</Text>
              {/* <Text style={styles.tableCell}>{safe(row.DEPT_NAME)}</Text> */}
              <Text style={styles.tableCell}>{safe(row.CATEGORY_NAME)}</Text>
              <Text style={styles.tableCell}>{safe(row.TIMES_USED)}</Text>
              <Text style={styles.tableCell}>{safe(row.QTY_USED)}</Text>
            </View>
          ))
        ) : (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 6 }]} colSpan={6}>
              No data available
            </Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export default RptItemPDF;
