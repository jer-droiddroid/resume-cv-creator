import { extractTextFromPdf } from './pdfExtractor'

const GEMINI_DIRECT_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const SYSTEM_PROMPT = `You are an expert resume parsing engine.
Parse the following raw resume text and extract all information into a single clean JSON object matching this exact schema:

{
  "documentType": "resume",
  "personalInfo": {
    "fullName": "Full Name string",
    "email": "Email string",
    "phone": "Phone number string",
    "location": "City, State / Country string",
    "linkedin": "LinkedIn profile URL or handle string",
    "portfolio": "Portfolio/GitHub website string"
  },
  "summary": "2-3 sentence summary or profile string, or empty string",
  "education": [
    {
      "school": "Institution / University string",
      "degree": "Degree / Field of study string",
      "startDate": "Start Date string formatted as Month YYYY (e.g. August 2023)",
      "endDate": "End Date or Present or Expected graduation (e.g. June 2027)",
      "details": "Honors, GPA/GWA, or coursework string, or empty string"
    }
  ],
  "experience": [
    {
      "company": "Company or Organization string",
      "title": "Job or Internship Title string",
      "startDate": "Month YYYY string (e.g. June 2025)",
      "endDate": "Month YYYY or Present string",
      "bullets": ["Action verb accomplishment bullet string", "bullet 2..."]
    }
  ],
  "organizations": [
    {
      "roleType": "marketing",
      "organization": "Student Organization or Club name string",
      "title": "Role or Officer Title string",
      "startDate": "Month YYYY string",
      "endDate": "Month YYYY or Present string",
      "metrics": {}
    }
  ],
  "projects": [
    {
      "name": "Project Name string",
      "description": "Short project description string",
      "techStack": "Technologies used string",
      "link": "Project URL or GitHub repository string"
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "awards": ["Award 1", "Award 2"],
  "certifications": ["Certification 1", "Certification 2"],
  "currency": "PHP",
  "sections": [
    { "id": "summary", "visible": true },
    { "id": "education", "visible": true },
    { "id": "experience", "visible": true },
    { "id": "organizations", "visible": true },
    { "id": "projects", "visible": true },
    { "id": "skills", "visible": true },
    { "id": "awards", "visible": true },
    { "id": "certifications", "visible": true }
  ]
}

Rules:
1. Return ONLY the valid JSON object. Do not include markdown codeblocks or extra explanations.
2. Format all dates consistently as full month and year: "August 2023", "June 2025", or "Present".
3. Extract each bullet point cleanly, starting with a strong action verb.
4. If a field or section is not mentioned in the resume, leave strings empty ("") and arrays empty ([]).`

/**
 * Parses a PDF file into our structured resume format using Gemini AI.
 * 1. Extracts raw text in-browser using pdfjs-dist.
 * 2. Sends extracted text to /api/parse-resume (or directly to Gemini if user provided a key).
 */
export async function parsePdfResume(file, userApiKey = '') {
  // Step 1: Extract plain text from PDF in browser
  const rawText = await extractTextFromPdf(file)

  if (!rawText || rawText.trim().length < 20) {
    throw new Error('This PDF appears to be empty or an unreadable scanned image.')
  }

  // Step 2: Try Vercel Serverless Function first
  try {
    const res = await fetch('/api/parse-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: rawText, userApiKey }),
    })

    if (res.ok) {
      const result = await res.json()
      if (result.success && result.data) {
        return result.data
      }
    } else if (res.status === 429) {
      throw new Error('The free AI parsing limit was temporarily reached. Please wait a few seconds and try again.')
    } else {
      const errJson = await res.json().catch(() => ({}))
      // If error is missing API key and user provided no key, propagate message
      if (errJson?.error === 'NO_API_KEY' && !userApiKey) {
        throw new Error('NO_API_KEY')
      }
    }
  } catch (err) {
    if (err.message === 'NO_API_KEY' || err.message.includes('free AI parsing limit')) {
      throw err
    }
    // If /api/parse-resume 404ed (e.g. running on local Vite dev server without Vercel CLI)
    // and user has an API key, we fallback to direct call below
  }

  // Fallback: If user provided key or VITE_GEMINI_API_KEY is available
  const directKey = userApiKey || import.meta.env.VITE_GEMINI_API_KEY
  if (!directKey) {
    throw new Error('NO_API_KEY')
  }

  const directRes = await fetch(`${GEMINI_DIRECT_URL}?key=${directKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nResume Text:\n"""\n${rawText.slice(0, 15000)}\n"""`,
            },
          ],
        },
      ],
      generationConfig: {
        response_mime_type: 'application/json',
        temperature: 0.1,
      },
    }),
  })

  if (!directRes.ok) {
    if (directRes.status === 429) {
      throw new Error('The free AI parsing limit was temporarily reached. Please wait a few seconds and try again.')
    }
    const errData = await directRes.json().catch(() => ({}))
    throw new Error(errData?.error?.message || 'Failed to parse resume with Gemini AI.')
  }

  const aiData = await directRes.json()
  const contentText = aiData?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!contentText) {
    throw new Error('AI could not extract resume data from this document.')
  }

  return JSON.parse(contentText)
}
