import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  header: { fontSize: 18, marginBottom: 10, textAlign: "center" },
  sectionTitle: { fontSize: 14, marginTop: 15, marginBottom: 5, fontWeight: "bold" },
  table: { marginBottom: 10, borderWidth: 1, borderColor: "#000" },
  tableRow: { flexDirection: "row" },
  tableCol: { flex: 1, padding: 5, borderWidth: 1, borderColor: "#000" },
  tableHeader: { fontWeight: "bold", backgroundColor: "#e0e0e0" },
});

const DiagnosisReport = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Report Title */}
      <Text style={styles.header}>Diagnosis Report</Text>

      {/* Top Diseases */}
      <View style={{ marginBottom: 10 }} wrap={false}>
         <Text style={styles.sectionTitle}>Top Diseases</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableHeader]}>Code</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Description</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Total Cases</Text>
          </View>
          {data?.topDiseases?.length ? (
            data.topDiseases.map((d, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCol}>{d.DIAGN_CODE}</Text>
                <Text style={styles.tableCol}>{d.DISEASE}</Text>
                <Text style={styles.tableCol}>{d.TOTAL_CASES}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, { flex: 2 }]}>No data available</Text>
            </View>
          )}
        </View>
      </View>

      {/* Seasonal Patterns */}
      <View style={{ marginBottom: 10 }} wrap={false}>
         <Text style={styles.sectionTitle}>Seasonal Patterns</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableHeader]}>Month</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Code</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Description</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Total Cases</Text>
          </View>
          {data?.seasonalPatterns?.length ? (
            data.seasonalPatterns.map((s, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCol}>{s.MONTH}</Text>
                <Text style={styles.tableCol}>{s.DIAGN_CODE}</Text>
                <Text style={styles.tableCol}>{s.DISEASE}</Text>
                <Text style={styles.tableCol}>{s.TOTAL_CASES}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, { flex: 3 }]}>No data available</Text>
            </View>
          )}
        </View>
      </View>

      {/* Notifiable Cases */}
      <View style={{ marginBottom: 10 }} wrap={false}>
         <Text style={styles.sectionTitle}>Notifiable Cases</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.tableHeader]}>Diagnosis ID</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Description</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Code</Text>
            <Text style={[styles.tableCol, styles.tableHeader]}>Total Cases</Text>
          </View>
          {data?.notifiableCases?.length ? (
            data.notifiableCases.map((n, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCol}>{n.NUM_DIAGN_ID}</Text>
                <Text style={styles.tableCol}>{n.DISEASE}</Text>
                <Text style={styles.tableCol}>{n.DIAGN_CODE}</Text>
                <Text style={styles.tableCol}>{n.TOTAL_CASES}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, { flex: 4 }]}>No data available</Text>
            </View>
          )}
        </View>
      </View>
    </Page>
  </Document>
);


export default DiagnosisReport;


