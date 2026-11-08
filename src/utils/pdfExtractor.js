import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

/**
 * Extracts all plain text lines from an uploaded PDF file in the browser.
 * Lazy-loads pdfjs-dist only when the student actually imports a PDF.
 */
export async function extractTextFromPdf(file) {
  try {
    const pdfjsLib = await import('pdfjs-dist')
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      isEvalSupported: false,
    })

    // Guard against stuck PDF worker with a 12-second timeout
    const pdf = await Promise.race([
      loadingTask.promise,
      new Promise((_, reject) =>
        setTimeout(() => {
          loadingTask.destroy().catch(() => {})
          reject(new Error('PDF_READ_TIMEOUT'))
        }, 12000)
      ),
    ])

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
    if (err?.message === 'PDF_READ_TIMEOUT') {
      throw new Error('Reading the PDF timed out. Please try selecting the file again.')
    }
    throw new Error('Could not read this PDF. Please make sure it is not password-protected.')
  }
}
