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

// Register Marathi font (must exist in /public/fonts/)
Font.register({
  family: "NotoMarathi",
  src: "/fonts/NotoSansDevanagari-Regular.ttf",
});

// Prevent auto-hyphenation (breaks Marathi words)
Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 8,
    fontFamily: "NotoMarathi",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  logo: {
    width: 50,
    height: 50,
    objectFit: "contain",
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
  },
  titleSection: {
    flex: 1,
    marginHorizontal: 10,
    textAlign: "center",
  },
  ulbName: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 3,
  },
  reportTitle: {
    fontSize: 12,
    color: "#1e40af",
    marginTop: 3,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 7,
    color: "#555",
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#6b7280",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCellHeader: {
    backgroundColor: "#e5e7eb",
    padding: 3,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#6b7280",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 7,
    flex: 1,
  },
  tableCell: {
    padding: 3,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#9ca3af",
    fontSize: 7,
    textAlign: "center",
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 12,
    left: 20,
    right: 20,
    fontSize: 7,
    color: "#666",
    textAlign: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
    paddingTop: 4,
  },
});

const safe = (v, fallback = "—") =>
  v === undefined || v === null || v === "" ? fallback : String(v);

const TablePDF = ({
  tableHeader = [],
  tableData = [],
  logoUrl,
  ulbName,
  reportTitle,
  dateRange,
  userName,
}) => {
  const today = new Date().toLocaleDateString("en-GB");

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* ---------- Header ---------- */}
        <View style={styles.header}>
          {logoUrl ? (
            <Image style={styles.logo} src={logoUrl} />
          ) : (
            <View style={styles.logoPlaceholder} />
          )}

          <View style={styles.titleSection}>
            <Text style={styles.ulbName}>
              {safe(ulbName, "Municipal Corporation")}
            </Text>
            <Text style={styles.reportTitle}>
              {safe(reportTitle, "Report")}
            </Text>
          </View>

          <View style={styles.logoPlaceholder} />
        </View>

        {/* ---------- Meta row ---------- */}
        {(dateRange || userName) && (
          <View style={styles.metaRow}>
            <Text>{dateRange ? `दिनांक: ${dateRange}` : ""}</Text>
            <Text>{userName ? `वापरकर्ता: ${userName}` : ""}</Text>
          </View>
        )}

        {/* ---------- Table ---------- */}
        <View style={styles.table}>
          {/* Header row */}
          <View style={styles.tableRow}>
            {tableHeader.map((head, index) => (
              <Text key={index} style={styles.tableCellHeader}>
                {safe(head)}
              </Text>
            ))}
          </View>

          {/* Data rows */}
          {tableData && tableData.length > 0 ? (
            tableData.map((row, rowIndex) => (
              <View style={styles.tableRow} key={rowIndex} wrap={false}>
                {row.map((cell, cellIndex) => (
                  <Text key={cellIndex} style={styles.tableCell}>
                    {safe(cell)}
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell,
                  { flex: tableHeader.length, padding: 10 },
                ]}
              >
                No data available
              </Text>
            </View>
          )}
        </View>

        {/* ---------- Footer ---------- */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Generated on ${today}  |  Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

const Pdf = ({
  tableHeader = [],
  tableData = [],
  fileName = "report.pdf",
  ulbName,
  logoUrl,
  reportTitle,
  dateRange,
  userName,
}) => {
  // Guard: don't render the link at all if no data
  if (!tableData || tableData.length === 0) {
    return (
      <button
        disabled
        type="button"
        className="bg-blue-600 flex items-center gap-2 text-white font-medium px-4 py-2 rounded-md opacity-60 cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        Export to PDF
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <TablePDF
          tableHeader={tableHeader}
          tableData={tableData}
          ulbName={ulbName}
          logoUrl={logoUrl}
          reportTitle={reportTitle}
          dateRange={dateRange}
          userName={userName}
        />
      }
      fileName={fileName}
      style={{ textDecoration: "none" }}
    >
      {({ loading, error }) => {
        if (error) {
          console.error("PDF generation error:", error);
        }
        return (
          <button
            disabled={loading}
            type="button"
            className="bg-blue-600 flex items-center gap-2 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            {loading ? "Preparing..." : "Export to PDF"}
          </button>
        );
      }}
    </PDFDownloadLink>
  );
};

export default Pdf;
