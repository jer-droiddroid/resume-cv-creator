/**
 * Extracts all plain text lines from an uploaded PDF file in the browser.
 * Imports pdf.worker.min.mjs directly so globalThis.pdfjsWorker runs in-memory
 * with zero external Worker network requests or CORS/MIME issues.
 */
export async function extractTextFromPdf(file) {
  try {
    await import('pdfjs-dist/build/pdf.worker.min.mjs')
    const pdfjsLib = await import('pdfjs-dist')

    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      isEvalSupported: false,
    })

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
