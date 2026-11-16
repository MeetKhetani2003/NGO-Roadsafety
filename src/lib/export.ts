/**
 * Client-side Spreadsheet Generation Engine
 * Creates compliant, formatted CSV & Excel-compatible workbooks for slot reports and volunteer rosters.
 * Triggers native browser download without requiring external server dependencies.
 */

export interface ExportRow {
  [key: string]: string | number | boolean | null | undefined;
}

export function downloadCSV(filename: string, rows: ExportRow[], headers?: Record<string, string>): void {
  if (!rows || rows.length === 0) return;

  const keys = Object.keys(rows[0]);
  const headerLabels = keys.map((k) => (headers && headers[k] ? headers[k] : k));

  const csvContent = [
    headerLabels.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(","),
    ...rows.map((row) =>
      keys
        .map((k) => {
          const val = row[k];
          if (val === null || val === undefined) return '""';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export function downloadXLSX(filename: string, sheetName: string, rows: ExportRow[], headers?: Record<string, string>): void {
  if (!rows || rows.length === 0) return;

  const keys = Object.keys(rows[0]);
  const headerLabels = keys.map((k) => (headers && headers[k] ? headers[k] : k));

  // Build Excel XML spreadsheet format (supported by all versions of Excel, LibreOffice, Google Sheets)
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Color="#0F172A"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0F172A"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F1E34" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataCenter">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="DataRight">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(sheetName)}">
  <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="22">
   <Row ss:StyleID="HeaderStyle">`;

  headerLabels.forEach((h) => {
    xml += `\n    <Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`;
  });
  xml += "\n   </Row>";

  rows.forEach((row) => {
    xml += "\n   <Row>";
    keys.forEach((k) => {
      const val = row[k];
      if (typeof val === "number") {
        xml += `\n    <Cell ss:StyleID="DataRight"><Data ss:Type="Number">${val}</Data></Cell>`;
      } else {
        xml += `\n    <Cell><Data ss:Type="String">${escapeXml(val ?? "")}</Data></Cell>`;
      }
    });
    xml += "\n   </Row>";
  });

  xml += `\n  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  triggerDownload(blob, filename.endsWith(".xls") ? filename : `${filename}.xls`);
}

export function exportSlotToExcel(
  slot: { title: string },
  attempts: {
    rank: number | null;
    studentName: string;
    schoolName: string;
    standard: string;
    score: number | null;
    total: number;
    secondsTaken: number;
  }[]
): void {
  const safeTitle = slot.title.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
  const fileName = `${safeTitle}-Results.xls`;
  const exportRows = attempts.map((a) => ({
    Rank: a.rank,
    Name: a.studentName,
    School: a.schoolName,
    Class: a.standard,
    Score: a.score,
    Total: a.total,
    Accuracy: `${Math.round(((a.score ?? 0) / (a.total || 30)) * 100)}%`,
    TimeTakenSeconds: a.secondsTaken,
  }));
  downloadXLSX(fileName, "Exam Rankings", exportRows);
}

function escapeXml(unsafe: unknown): string {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
