import { jsPDF } from "jspdf";
import { ComicStory, ExportResult } from "../types/comic";

/**
 * Loads an image from a URL or fallback placeholder and returns a base64 Data URL
 */
async function getImageDataUrl(url?: string): Promise<string> {
  if (!url) {
    return createComicPlaceholderCanvas("ComicCraft AI Panel");
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 600;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } else {
          resolve(createComicPlaceholderCanvas("Comic Panel"));
        }
      } catch (err) {
        console.warn("Canvas export fallback:", err);
        resolve(createComicPlaceholderCanvas("Comic Panel"));
      }
    };
    img.onerror = () => {
      resolve(createComicPlaceholderCanvas("Comic Panel"));
    };
    img.src = url;
  });
}

function createComicPlaceholderCanvas(title: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Comic gradient background
  const grad = ctx.createLinearGradient(0, 0, 600, 600);
  grad.addColorStop(0, "#1e293b");
  grad.addColorStop(1, "#0f172a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 600);

  // Halftone pattern
  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  for (let x = 10; x < 600; x += 20) {
    for (let y = 10; y < 600; y += 20) {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Border
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 12;
  ctx.strokeRect(10, 10, 580, 580);

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("COMICCRAFT AI", 300, 280);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "20px sans-serif";
  ctx.fillText(title, 300, 320);

  return canvas.toDataURL("image/jpeg", 0.9);
}

/**
 * Compiles a ComicStory into a PDF using layout binding principles
 * (Matching Scenario 3 exporters.py with FPDF-like structured layout)
 */
export async function generateComicPdf(
  comic: ComicStory,
  layoutType: string = "grid"
): Promise<ExportResult> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;

  const cleanTitle = comic.title
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 24);
  const filename = `ComicCraft_${cleanTitle}_${timestamp}.pdf`;

  // Standard A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;

  // Pre-load all panel images
  const loadedImages: string[] = [];
  for (const panel of comic.panels) {
    const dataUrl = await getImageDataUrl(panel.imageUrl);
    loadedImages.push(dataUrl);
  }

  // ----------------------------------------------------
  // PAGE 1: COVER PAGE
  // ----------------------------------------------------
  // Background
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Comic border frame
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.setLineWidth(2);
  doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2, "S");
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.rect(margin - 2, margin - 2, pageWidth - (margin - 2) * 2, pageHeight - (margin - 2) * 2, "S");

  // Top Comic Badge Banner
  doc.setFillColor(239, 68, 68); // red-500
  doc.rect(margin, margin, pageWidth - margin * 2, 14, "F");
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.rect(margin, margin, pageWidth - margin * 2, 14, "S");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("COMICCRAFT AI • COLLECTOR'S EDITION • ISSUE #1", pageWidth / 2, margin + 9, { align: "center" });

  // Main Comic Title Banner
  doc.setFillColor(253, 224, 71); // yellow-300
  doc.rect(margin, margin + 18, pageWidth - margin * 2, 28, "F");
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1.5);
  doc.rect(margin, margin + 18, pageWidth - margin * 2, 28, "S");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const titleLines = doc.splitTextToSize(comic.title.toUpperCase(), pageWidth - margin * 2 - 8);
  doc.text(titleLines, pageWidth / 2, margin + 28, { align: "center" });

  // Tone & Art Style Tagline
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 83, 9);
  doc.text(
    `TONE: ${comic.tone.toUpperCase()}  |  STYLE: ${comic.artStyle.toUpperCase()}  |  HERO: ${comic.characterName.toUpperCase()}`,
    pageWidth / 2,
    margin + 42,
    { align: "center" }
  );

  // Cover Feature Illustration (First panel image)
  const coverImgWidth = pageWidth - margin * 2;
  const coverImgHeight = 115;
  const coverImgY = margin + 50;

  if (loadedImages[0]) {
    doc.addImage(loadedImages[0], "JPEG", margin, coverImgY, coverImgWidth, coverImgHeight);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(2);
    doc.rect(margin, coverImgY, coverImgWidth, coverImgHeight, "S");
  }

  // Synopsis Box (Classic Comic Narration Style)
  const synopsisY = coverImgY + coverImgHeight + 6;
  const synopsisHeight = 44;
  doc.setFillColor(254, 240, 138); // yellow-200
  doc.rect(margin, synopsisY, pageWidth - margin * 2, synopsisHeight, "F");
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(1.5);
  doc.rect(margin, synopsisY, pageWidth - margin * 2, synopsisHeight, "S");

  doc.setTextColor(180, 83, 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("SPECIAL REPORT & SYNOPSIS:", margin + 4, synopsisY + 6);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const synLines = doc.splitTextToSize(comic.synopsis, pageWidth - margin * 2 - 8);
  doc.text(synLines, margin + 4, synopsisY + 13);

  // Author & Team Credits Footer
  const footerY = synopsisY + synopsisHeight + 8;
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, footerY, pageWidth - margin * 2, 22, "F");
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.8);
  doc.rect(margin, footerY, pageWidth - margin * 2, 22, "S");

  doc.setTextColor(248, 250, 252);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("CREATIVE ARCHITECTURE TEAM (ComicCraft AI):", margin + 4, footerY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    "Team Lead: Aravindhan • Members: Abishek Kumar, Rithika M, Nilin Jenilia",
    margin + 4,
    footerY + 12
  );
  doc.text(
    `Engine: Google Gemini 3.8 Flash + Stable Diffusion Pipeline • Exported on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`,
    margin + 4,
    footerY + 17
  );

  // ----------------------------------------------------
  // STORY PAGES: 2 PANELS PER PAGE FOR CRISP RESOLUTION
  // ----------------------------------------------------
  const panelsPerPage = 2;
  const totalPages = Math.ceil(comic.panels.length / panelsPerPage);

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    doc.addPage();

    // Page Background
    doc.setFillColor(248, 250, 252); // slate-50 crisp comic paper
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Header strip
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(comic.title.toUpperCase(), margin, 8);
    doc.text(
      `CHAPTER 1  •  PAGE ${pageIdx + 1} OF ${totalPages}`,
      pageWidth - margin,
      8,
      { align: "right" }
    );

    const startPanelIdx = pageIdx * panelsPerPage;
    const pagePanels = comic.panels.slice(startPanelIdx, startPanelIdx + panelsPerPage);

    const panelHeight = 126;
    const panelWidth = pageWidth - margin * 2;

    pagePanels.forEach((panel, i) => {
      const globalPanelIdx = startPanelIdx + i;
      const panelY = 16 + i * (panelHeight + 8);

      // Panel Outer Frame
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, panelY, panelWidth, panelHeight, "F");
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(1.8);
      doc.rect(margin, panelY, panelWidth, panelHeight, "S");

      // Panel Header Tag
      doc.setFillColor(245, 158, 11);
      doc.rect(margin + 2, panelY + 2, 28, 7, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text(`PANEL ${panel.panelNumber}`, margin + 4, panelY + 7);

      // Panel Title
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(panel.panelTitle, margin + 34, panelY + 7);

      // Panel Image Area
      const imgHeight = 72;
      const imgWidth = panelWidth - 4;
      const imgX = margin + 2;
      const imgY = panelY + 11;

      if (loadedImages[globalPanelIdx]) {
        doc.addImage(loadedImages[globalPanelIdx], "JPEG", imgX, imgY, imgWidth, imgHeight);
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(1);
        doc.rect(imgX, imgY, imgWidth, imgHeight, "S");
      }

      // Sound Effect graphic banner if present
      if (panel.soundEffect) {
        doc.setFillColor(239, 68, 68); // red badge
        doc.rect(imgX + imgWidth - 36, imgY + 4, 32, 9, "F");
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.8);
        doc.rect(imgX + imgWidth - 36, imgY + 4, 32, 9, "S");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(panel.soundEffect, imgX + imgWidth - 20, imgY + 10.5, { align: "center" });
      }

      // Narration Box (Top/Bottom Caption)
      const captionY = imgY + imgHeight + 2;
      const captionHeight = 16;
      doc.setFillColor(254, 240, 138); // Yellow caption box
      doc.rect(margin + 2, captionY, panelWidth - 4, captionHeight, "F");
      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.8);
      doc.rect(margin + 2, captionY, panelWidth - 4, captionHeight, "S");

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      const captionLines = doc.splitTextToSize(panel.caption, panelWidth - 10);
      doc.text(captionLines, margin + 5, captionY + 5.5);

      // Dialogue Speech Bubble(s)
      const dialogueY = captionY + captionHeight + 3;
      const dialogueHeight = panelHeight - (dialogueY - panelY) - 3;

      if (panel.dialogues && panel.dialogues.length > 0) {
        doc.setFillColor(255, 255, 255);
        doc.rect(margin + 2, dialogueY, panelWidth - 4, dialogueHeight, "F");
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(1);
        doc.roundedRect(margin + 2, dialogueY, panelWidth - 4, dialogueHeight, 2, 2, "S");

        let currY = dialogueY + 4.5;
        panel.dialogues.forEach((dlg) => {
          doc.setTextColor(180, 83, 9);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.text(`${dlg.speaker.toUpperCase()} (${dlg.type}):`, margin + 5, currY);

          doc.setTextColor(15, 23, 42);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          const dlgLines = doc.splitTextToSize(`"${dlg.text}"`, panelWidth - 12);
          doc.text(dlgLines, margin + 5, currY + 4);
          currY += 9;
        });
      }
    });

    // Page Footer
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      "ComicCraft AI • layout_builder.py & exporters.py (FPDF Engine) • Confidential & Creative Commons",
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );
  }

  // Generate output blob and trigger download
  const pdfBlob = doc.output("blob");
  const pdfBlobUrl = URL.createObjectURL(pdfBlob);

  // Trigger download link
  const link = document.createElement("a");
  link.href = pdfBlobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return {
    filename,
    timestamp,
    fileSizeBytes: pdfBlob.size,
    pageCount: totalPages + 1, // Cover page + story pages
    panelCount: comic.panels.length,
    layoutType,
    pdfBlobUrl,
  };
}
