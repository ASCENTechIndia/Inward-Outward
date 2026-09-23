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

// ✅ Safe font registration (Devanagari support for Marathi/Hindi text)
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
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    textDecoration: "underline",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 10, // ⬆️ more vertical spacing between lines
    fontSize: 11,
    lineHeight: 1.4, // ⬆️ better readability
  },
  detailLabel: {
    width: "20%",
    fontWeight: "bold",
  },
  detailValue: {
    width: "40%", // ⬆️ made slightly bigger for better spacing
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

// ✅ Status mapping
const mapStatus = (status) => {
  if (status === "A") return "Approved";
  if (status === "R") return "Rejected";
  return status || "—";
};

// ✅ Date formatter (dd-mm-yyyy)
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

const FrmPurchaseOrderPDF = ({
  poDetails,
  items,
  approvedBy,
  ulbName,
  logoUrl,
  status,
}) => {
  if (!poDetails || !items || items.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>No data available for this Purchase Order.</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {logoUrl ? (
            <Image style={styles.logo} src={logoUrl} />
          ) : (
            <Image
              style={styles.logo}
              src="https://via.placeholder.com/60?text=Logo"
            />
          )}
          <View style={{ flex: 1, marginLeft: 10, textAlign: "center" }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{ulbName}</Text>
            <Text style={{ fontSize: 18, color: "blue", marginTop: 5 }}>
              Purchase Order
            </Text>
          </View>
          <View style={{ width: 80, alignItems: "flex-end" }}>
            <Text style={{ fontSize: 10 }}>
              Date: {formatDate(poDetails.DAT_PURCHASEORDER_DATE)}
            </Text>
          </View>
        </View>

        {/* PO Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>PO No:</Text>
            <Text style={styles.detailValue}>
              {safe(poDetails.VAR_PURCHASEORDER_PONO)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Supplier:</Text>
            <Text style={styles.detailValue}>
              {safe(poDetails.VAR_VENDOR_NAME)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expected Delivery:</Text>
            <Text style={styles.detailValue}>
              {formatDate(poDetails.DAT_PURCHASEORDER_EXPDELIVERYDT)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Approved By:</Text>
            <Text style={styles.detailValue}>{safe(approvedBy)}</Text>
          </View>
        </View>

        {/* Items Table Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Details</Text>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <Text style={[styles.tableCellHeader, { flex: 0.5 }]}>Sr.No</Text>
              <Text style={styles.tableCellHeader}>Item Name</Text>
              <Text style={styles.tableCellHeader}>Category</Text>
              <Text style={styles.tableCellHeader}>Quantity</Text>
            </View>
            {/* Data Rows */}
            {items.map((item, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>{idx + 1}</Text>
                <Text style={styles.tableCell}>{safe(item.name)}</Text>
                <Text style={styles.tableCell}>{safe(item.category)}</Text>
                <Text style={styles.tableCell}>{safe(item.quantity)}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FrmPurchaseOrderPDF;
