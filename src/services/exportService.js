/**
 * Export Service
 * Handles PNG, PDF, and PPTX export of frame cards.
 */

import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import PptxGenJS from 'pptxgenjs';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Capture a DOM element as a PNG data URL.
 */
async function captureElement(element) {
  // Wait for fonts/images to settle
  await new Promise(resolve => setTimeout(resolve, 100));

  const filter = (node) => {
    // Exclude UI elements like delete buttons, add section buttons, and checkboxes
    if (node.classList && node.classList.contains('no-export')) {
      return false;
    }
    return true;
  };

  const dataUrl = await toPng(element, {
    quality: 1.0,
    pixelRatio: 2,
    filter: filter,
    style: {
      transform: 'scale(1)',
      margin: '0',
      boxShadow: 'none', // Remove shadow to prevent clipping in export
    },
  });
  return dataUrl;
}

/**
 * Convert data URL to Blob.
 */
function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Export a single frame as PNG.
 */
export async function exportFrameAsPng(frameElement, filename = 'frame.png') {
  const dataUrl = await captureElement(frameElement);
  const blob = dataURLtoBlob(dataUrl);
  saveAs(blob, filename);
}

/**
 * Export multiple frames as a ZIP of PNGs.
 */
export async function exportAllAsPngZip(frameElements, frameNames) {
  const zip = new JSZip();
  
  for (let i = 0; i < frameElements.length; i++) {
    const dataUrl = await captureElement(frameElements[i]);
    const blob = dataURLtoBlob(dataUrl);
    const name = frameNames?.[i] || `frame-${i + 1}.png`;
    zip.file(name, blob);
  }
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'frames-export.zip');
}

/**
 * Export frames as a PDF document.
 */
export async function exportAsPdf(frameElements, frameNames) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1280, 720],
  });
  
  for (let i = 0; i < frameElements.length; i++) {
    if (i > 0) pdf.addPage([1280, 720], 'landscape');
    
    const dataUrl = await captureElement(frameElements[i]);
    
    // Get image dimensions to fit within the PDF page
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = dataUrl;
    });
    
    const pageWidth = 1280;
    const pageHeight = 720;
    const imgRatio = img.width / img.height;
    const pageRatio = pageWidth / pageHeight;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (imgRatio > pageRatio) {
      drawWidth = pageWidth * 0.9;
      drawHeight = drawWidth / imgRatio;
    } else {
      drawHeight = pageHeight * 0.9;
      drawWidth = drawHeight * imgRatio;
    }
    
    drawX = (pageWidth - drawWidth) / 2;
    drawY = (pageHeight - drawHeight) / 2;
    
    pdf.setFillColor(15, 15, 20);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    pdf.addImage(dataUrl, 'PNG', drawX, drawY, drawWidth, drawHeight);
  }
  
  pdf.save('frames-presentation.pdf');
}

/**
 * Export frames as a PPTX presentation.
 */
export async function exportAsPptx(frameElements, frameNames) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Format Engine';
  pptx.title = 'AI Generated Frames';
  
  for (let i = 0; i < frameElements.length; i++) {
    const dataUrl = await captureElement(frameElements[i]);
    const slide = pptx.addSlide();
    
    slide.background = { color: '0f0f14' };
    
    slide.addImage({
      data: dataUrl,
      x: '5%',
      y: '5%',
      w: '90%',
      h: '90%',
      sizing: { type: 'contain' },
    });
  }
  
  await pptx.writeFile({ fileName: 'frames-presentation.pptx' });
}

/**
 * Format frames as Markdown and copy to clipboard (Great for Discord).
 */
export async function copyAsMarkdown(frames) {
  let md = '';
  
  frames.forEach((frame) => {
    md += `## ${frame.title}\n`;
    if (frame.subtitle) {
      md += `*${frame.subtitle}*\n\n`;
    } else {
      md += '\n';
    }
    
    frame.sections.forEach((section) => {
      if (section.heading) {
        md += `**${section.heading}**\n`;
      }
      md += `${section.content}\n\n`;
    });
    
    md += `---\n\n`;
  });
  
  // Clean up trailing dashes and whitespace
  md = md.replace(/---\n\n$/, '').trim();
  
  try {
    await navigator.clipboard.writeText(md);
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    throw new Error('Failed to copy. Please check browser permissions.');
  }
}
