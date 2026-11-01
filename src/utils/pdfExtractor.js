import * as pdfjsLib from 'pdfjs-dist'

// Use Mozilla CDN worker for pdfjs in browser
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

/**
 * Extracts all plain text lines from an uploaded PDF file in the browser.
 * Runs 100% locally on the student's device.
 */
export async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
      fullText += pageText + '\n\n'
    }

    return fullText.trim()
  } catch (err) {
    console.error('Failed to extract text from PDF:', err)
    throw new Error('Could not read this PDF. Please make sure it is not password-protected.')
  }
}

