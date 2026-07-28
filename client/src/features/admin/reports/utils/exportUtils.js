import jsPDF from 'jspdf';

export const exportToPDF = (reportData, reportName) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFontSize(18);
  doc.text(reportName, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Summary
  if (reportData.summary) {
    doc.setFontSize(12);
    doc.text('Summary', 20, yPosition);
    yPosition += 7;

    doc.setFontSize(10);
    Object.entries(reportData.summary).forEach(([key, value]) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      doc.text(`${label}: ${typeof value === 'number' ? value.toLocaleString() : value}`, 25, yPosition);
      yPosition += 6;
    });
  }

  yPosition += 5;

  // Data Table
  if (reportData.data && Array.isArray(reportData.data)) {
    const columns = Object.keys(reportData.data[0] || {});
    const rows = reportData.data.map((item) =>
      columns.map((col) => {
        const value = item[col];
        return typeof value === 'number' ? value.toLocaleString() : value;
      })
    );

    // Simple table drawing
    const colWidth = (pageWidth - 40) / columns.length;
    const rowHeight = 7;

    // Header row
    doc.setFillColor(41, 128, 185);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    
    columns.forEach((col, i) => {
      const xPos = 20 + i * colWidth;
      doc.rect(xPos, yPosition, colWidth, rowHeight, 'F');
      doc.text(col, xPos + 2, yPosition + 5, { maxWidth: colWidth - 4 });
    });

    yPosition += rowHeight;

    // Data rows
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);

    rows.forEach((row) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      row.forEach((cell, colIdx) => {
        const xPos = 20 + colIdx * colWidth;
        doc.rect(xPos, yPosition, colWidth, rowHeight);
        doc.text(String(cell), xPos + 2, yPosition + 5, { maxWidth: colWidth - 4 });
      });

      yPosition += rowHeight;
    });
  }

  doc.save(`${reportName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

export const exportToExcel = (reportData, reportName) => {
  let csv = `${reportName}\n`;
  csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

  // Summary section
  if (reportData.summary) {
    csv += 'Summary\n';
    Object.entries(reportData.summary).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').trim();
      csv += `${label},${value}\n`;
    });
    csv += '\n';
  }

  // Data section
  if (reportData.data && Array.isArray(reportData.data)) {
    const columns = Object.keys(reportData.data[0] || {});
    csv += columns.join(',') + '\n';

    reportData.data.forEach((item) => {
      csv += columns.map((col) => {
        const value = item[col];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',') + '\n';
    });
  }

  // Create and download CSV file
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
  element.setAttribute('download', `${reportName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
