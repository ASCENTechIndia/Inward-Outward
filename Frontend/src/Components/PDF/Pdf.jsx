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



const PAGE_WIDTH = 842; // A4 landscape width
const PAGE_HEIGHT = 595; // A4 landscape height

const PAGE_PADDING_LEFT = 12;
const PAGE_PADDING_RIGHT = 12;

const CONTENT_WIDTH =
  PAGE_WIDTH -
  PAGE_PADDING_LEFT -
  PAGE_PADDING_RIGHT;



const safe = (value, fallback = "—") => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  return String(value);
};



const wrapText = (value, width, fontSize = 6) => {
  const text = safe(value);

  if (!text || text === "—") {
    return text;
  }

  // Account for left/right cell padding
  const availableWidth = Math.max(
    width - 4,
    5
  );

  const averageCharWidth =
    fontSize * 0.65;

  const maxChars = Math.max(
    2,
    Math.floor(
      availableWidth / averageCharWidth
    )
  );

  const words = text.split(/\s+/);

  const lines = [];
  let currentLine = "";

  for (const word of words) {

    
    if (word.length > maxChars) {

      if (currentLine) {
        lines.push(currentLine);
        currentLine = "";
      }

      let remaining = word;

      while (remaining.length > maxChars) {
        lines.push(
          remaining.substring(
            0,
            maxChars
          )
        );

        remaining =
          remaining.substring(maxChars);
      }

      currentLine = remaining;

      continue;
    }

    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;

    if (testLine.length <= maxChars) {
      currentLine = testLine;
    } else {

      if (currentLine) {
        lines.push(currentLine);
      }

      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
};


const styles = StyleSheet.create({
  page: {
    paddingTop: 15,
    paddingBottom: 30,
    paddingLeft: PAGE_PADDING_LEFT,
    paddingRight: PAGE_PADDING_RIGHT,

    fontSize: 6,
    fontFamily: "NotoMarathi",
  },


  header: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 6,
    paddingBottom: 5,

    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },

  logo: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },

  logoPlaceholder: {
    width: 40,
    height: 40,
  },

  titleSection: {
    flex: 1,

    marginLeft: 8,
    marginRight: 8,

    textAlign: "center",
  },

  ulbName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
  },

  reportTitle: {
    fontSize: 9,
    color: "#1e40af",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: 5,

    fontSize: 6,
    color: "#555",
  },


  table: {
    width: "100%",

    borderWidth: 0.5,
    borderColor: "#6b7280",
  },

  tableHeaderRow: {
    flexDirection: "row",

    backgroundColor: "#e5e7eb",
  },

  tableRow: {
    flexDirection: "row",
    width: "100%",
  },

  tableCellHeader: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 1,
    paddingRight: 1,

    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#6b7280",

    fontSize: 6,
    fontWeight: "bold",

    textAlign: "center",
    lineHeight: 1.1,

    flexGrow: 0,
    flexShrink: 0,
  },

  tableCell: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 1,
    paddingRight: 1,

    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#9ca3af",

    fontSize: 7,
    textAlign: "center",
    lineHeight: 1.15,

    flexGrow: 0,
    flexShrink: 0,
  },

  noData: {
    width: "100%",
    padding: 10,
    textAlign: "center",
  },


  footer: {
    position: "absolute",

    bottom: 10,
    left: PAGE_PADDING_LEFT,
    right: PAGE_PADDING_RIGHT,

    fontSize: 6,
    color: "#666",

    textAlign: "center",

    borderTopWidth: 0.5,
    borderTopColor: "#ccc",

    paddingTop: 3,
  },
});


const TablePDF = ({
  tableHeader = [],
  tableData = [],

  logoUrl,
  ulbName,
  reportTitle,

  dateRange,
  userName,

  /*
   * Example:
   *
   * [
   *   "5%",
   *   "5%",
   *   "5%",
   *   "6%",
   *   ...
   * ]
   */
  columnWidths = [],
}) => {
  const today =
    new Date().toLocaleDateString("en-GB");

  // ------------------------------------------------
  // COLUMN WIDTH
  // ------------------------------------------------

  const getColumnWidth = (index) => {
    if (
      columnWidths &&
      columnWidths[index]
    ) {
      return columnWidths[index];
    }

    return `${100 / tableHeader.length}%`;
  };


  const getColumnWidthInPoints = (index) => {
    const width = getColumnWidth(index);

    if (
      typeof width === "string" &&
      width.endsWith("%")
    ) {
      const percentage =
        parseFloat(width);

      return (
        CONTENT_WIDTH *
        (percentage / 100)
      );
    }


    if (typeof width === "number") {
      return width;
    }

    return (
      CONTENT_WIDTH /
      tableHeader.length
    );
  };

  return (
    <Document>

      <Page
        size="A4"
        orientation="landscape"
        style={styles.page}
      >


        <View style={styles.header}>

          {logoUrl ? (
            <Image
              src={logoUrl}
              style={styles.logo}
            />
          ) : (
            <View
              style={styles.logoPlaceholder}
            />
          )}

          <View
            style={styles.titleSection}
          >
            <Text style={styles.ulbName}>
              {safe(
                ulbName,
                "Municipal Corporation"
              )}
            </Text>

            <Text
              style={styles.reportTitle}
            >
              {safe(
                reportTitle,
                "Report"
              )}
            </Text>
          </View>

          <View
            style={styles.logoPlaceholder}
          />

        </View>

        {(dateRange || userName) && (
          <View style={styles.metaRow}>

            <Text>
              {dateRange
                ? `दिनांक: ${dateRange}`
                : ""}
            </Text>

            <Text>
              {userName
                ? `वापरकर्ता: ${userName}`
                : ""}
            </Text>

          </View>
        )}


        <View style={styles.table}>

          {/* TABLE HEADER */}
          <View
            style={styles.tableHeaderRow}
            fixed
          >
            {tableHeader.map((header, index) => {
              const width = getColumnWidth(index);

              return (
                <Text
                  key={index}
                  style={[
                    styles.tableCellHeader,
                    {
                      width,
                      flexGrow: 0,
                      flexShrink: 0,
                    },
                  ]}
                >
                  {wrapText(
                    header,
                    getColumnWidthInPoints(index),
                    6
                  )}
                </Text>
              );
            })}
          </View>

          {/* TABLE BODY */}
          {tableData && tableData.length > 0 ? (
            tableData.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={styles.tableRow}
                wrap={false}
              >
                {tableHeader.map((_, cellIndex) => {
                  const cell = row[cellIndex];

                  const width = getColumnWidth(cellIndex);

                  const widthInPoints =
                    getColumnWidthInPoints(cellIndex);

                  return (
                    <Text
                      key={cellIndex}
                      style={[
                        styles.tableCell,
                        {
                          width,
                          flexGrow: 0,
                          flexShrink: 0,
                        },
                      ]}
                    >
                      {wrapText(
                        cell,
                        widthInPoints,
                        6
                      )}
                    </Text>
                  );
                })}
              </View>
            ))
          ) : (
            <View
              style={styles.tableRow}
              wrap={false}
            >
              <Text
                style={[
                  styles.tableCell,
                  styles.noData,
                ]}
              >
                No data available
              </Text>
            </View>
          )}
        </View>


        <Text
          style={styles.footer}
          fixed
          render={({
            pageNumber,
            totalPages,
          }) =>
            `Generated on ${today} | Page ${pageNumber} of ${totalPages}`
          }
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

  columnWidths = [],
}) => {

  if (
    !tableData ||
    tableData.length === 0
  ) {
    return (
      <button
        disabled
        type="button"
        className="
          bg-blue-600
          flex
          items-center
          gap-2
          text-white
          font-medium
          px-4
          py-2
          rounded-md
          opacity-60
          cursor-not-allowed
        "
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

          columnWidths={
            columnWidths
          }
        />
      }
      fileName={fileName}
      style={{
        textDecoration: "none",
      }}
    >
      {({
        loading,
        error,
      }) => {

        if (error) {
          console.error(
            "PDF generation error:",
            error
          );
        }

        return (
          <button
            disabled={loading}
            type="button"
            className="
              bg-blue-600
              flex
              items-center
              gap-2
              hover:bg-blue-700
              text-white
              font-medium
              px-4
              py-2
              rounded-md
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition-colors
            "
          >
            <Download className="w-4 h-4" />

            {loading
              ? "Preparing..."
              : "Export to PDF"}
          </button>
        );
      }}
    </PDFDownloadLink>
  );
};

export default Pdf;