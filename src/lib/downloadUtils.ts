// @/src/lib/downloadUtils.ts
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Helper to fetch CSV text (via CORS proxy).
 */
async function fetchCsv(csvUrl: string): Promise<string> {
  const targetUrl = csvUrl.startsWith("http")
    ? `/api/proxy-dataset?url=${encodeURIComponent(csvUrl)}`
    : csvUrl;
  const response = await fetch(targetUrl);
  if (!response.ok) throw new Error("Failed to fetch CSV file");
  return await response.text();
}

/**
 * Download raw CSV file.
 */
export async function downloadCsvFile(csvUrl: string, slug: string = "dataset") {
  try {
    const csvText = await fetchCsv(csvUrl);
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("CSV Download Error:", err);
    alert("Failed to download CSV file.");
  }
}

/**
 * Convert CSV → Excel (.xlsx) and download.
 */
export async function downloadExcelFromCsv(
  csvUrl: string,
  slug: string = "dataset"
) {
  try {
    const csvText = await fetchCsv(csvUrl);
    const workbook = XLSX.read(csvText, { type: "string" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${slug}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Excel Download Error:", err);
    alert("Failed to download Excel file.");
  }
}

/**
 * Convert CSV → PDF and download.
 */
export async function downloadPdfFromCsv(
  csvUrl: string,
  slug: string = "dataset"
) {
  try {
    const csvText = await fetchCsv(csvUrl);

    // Parse CSV → 2D array
    const rows = csvText
      .trim()
      .split("\n")
      .map((row) => row.split(","));

    const doc = new jsPDF({
      orientation: "landscape",  // 👈 this sets landscape
      unit: "mm",                // default is mm
      format: "a3",              // you can change to letter, legal, etc.
    });

    autoTable(doc, {
      head: [rows[0]], // first row as table header
      body: rows.slice(1), // remaining rows as body
    });

    doc.save(`${slug}.pdf`);
  } catch (err) {
    console.error("PDF Download Error:", err);
    alert("Failed to download PDF file.");
  }
}
