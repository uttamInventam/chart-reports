/* eslint-disable @typescript-eslint/no-explicit-any */
import { Device } from "../types/device";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions, Content, TableCell } from "pdfmake/interfaces";
import metadataJson from "../data/deviceMetadata.json";

// Initialize virtual file system for browser execution
(pdfMake as any).vfs = (pdfFonts as any)?.pdfMake?.vfs || (pdfFonts as any)?.vfs || pdfFonts;

export const generatePDF = async (
  device: Device,
  activeChartType: string,
  chartBase64: string,
) => {
  try {
    const extraData = metadataJson.devices.find(
      (d) => d.deviceName === device.name,
    );

    // Build Metadata Content
    const metadataContent: Content[] = [];
    if (extraData) {
      metadataContent.push({
        text: "Device Specifications",
        style: "subheader",
        margin: [0, 10, 0, 5],
      });

      const metaList = Object.entries(extraData)
        .filter(
          ([k]) =>
            ![
              "deviceId",
              "deviceName",
              "readings",
              "vessels",
              "distribution",
            ].includes(k),
        )
        .map(([key, value]) => {
          const formattedKey = key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .replace(/^./, (str) => str.toUpperCase());
          const formattedValue =
            typeof value === "object" ? JSON.stringify(value) : String(value);
          return {
            text: `${formattedKey}: ${formattedValue}`,
            margin: [0, 2, 0, 2] as [number, number, number, number],
          };
        });

      metadataContent.push({
        columns: [
          metaList.slice(0, Math.ceil(metaList.length / 2)),
          metaList.slice(Math.ceil(metaList.length / 2)),
        ],
        columnGap: 10,
        margin: [0, 0, 0, 15],
      });
    }

    // Build Table
    const dataKeys =
      device.metrics.length > 0 ? Object.keys(device.metrics[0]) : [];

    // Header row
    const tableHeaders = dataKeys.map((key) => ({
      text: key
        .replace(/([A-Z])/g, " $1")
        .trim()
        .toUpperCase(),
      style: "tableHeader",
    }));

    const hasValue = dataKeys.includes("value");
    const hasSpecs =
      device.specs &&
      (device.specs.lsl !== undefined || device.specs.usl !== undefined);

    if (hasValue && hasSpecs) {
      tableHeaders.push({ text: "STATUS", style: "tableHeader" });
    }

    const tableBody = device.metrics.map((metric) => {
      const row: TableCell[] = dataKeys.map((key) => ({
        text: String(metric[key as keyof typeof metric] ?? ""),
      }));

      if (hasValue && hasSpecs) {
        const val = Number(metric["value" as keyof typeof metric]);
        let pass = true;
        if (device.specs?.lsl !== undefined && val < device.specs.lsl)
          pass = false;
        if (device.specs?.usl !== undefined && val > device.specs.usl)
          pass = false;

        row.push({
          text: pass ? "PASS" : "FAIL",
          color: pass ? "green" : "red",
          bold: true,
        });
      }
      return row;
    });

    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: "Company Name Inc.", style: "header" },
        { text: "IPQC Device Performance Report", style: "subheader" },
        {
          text: `Generated on: ${new Date().toLocaleDateString()}`,
          margin: [0, 0, 0, 20],
        },

        {
          columns: [
            [
              { text: `Name: ${device.name}` },
              { text: `ID: ${device.id}` },
              { text: `Status: ${device.status}` },
            ],
            [
              { text: `Location: ${device.location}` },
              { text: `Measurement Unit: ${device.unit}` },
              { text: `Chart Type: ${activeChartType}` },
            ],
          ],
          margin: [0, 0, 0, 15],
        },

        ...metadataContent,

        {
          text: `Performance Trend (${activeChartType})`,
          style: "subheader",
          margin: [0, 10, 0, 10],
        },
        {
          image: chartBase64,
          width: 500,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        { text: "Summary Table", style: "subheader", margin: [0, 10, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: Array(tableHeaders.length).fill("*"),
            body: [tableHeaders, ...tableBody],
          },
          layout: "lightHorizontalLines",
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: "black",
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`${device.name.replace(/\\s+/g, "-")}-Report.pdf`);
  } catch (error) {
    console.error("Error generating PDF with pdfmake:", error);
    throw error;
  }
};
