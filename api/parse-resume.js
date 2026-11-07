const GEMINI_API_URL =
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
      "roleType": "marketing" or "president" or "treasurer",
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
  "currency": "USD",
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

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, userApiKey } = req.body || {}

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'No resume text provided.' })
  }

  if (text.length > 50000) {
    return res.status(413).json({
      error: 'PAYLOAD_TOO_LARGE',
      message: 'Resume text exceeds maximum allowed length.',
    })
  }

  // Use environment variable from Vercel or user-provided key
  const apiKey = userApiKey || process.env.GEMINI_API_KEY

  if (!apiKey) {
    return res.status(400).json({
      error: 'NO_API_KEY',
      message:
        'A free Gemini API key is required. Add GEMINI_API_KEY in your Vercel Project Settings (Settings -> Environment Variables) or enter your key in the app.',
    })
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nResume Text:\n"""\n${text.slice(0, 15000)}\n"""`,
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

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      if (response.status === 429) {
        return res.status(429).json({
          error: 'RATE_LIMIT',
          message: 'The free AI limit was temporarily reached. Please wait a few seconds and try again.',
        })
      }
      return res.status(response.status).json({
        error: 'AI_ERROR',
        message: errData?.error?.message || 'Failed to process resume with Gemini API.',
      })
    }

    const data = await response.json()
    const contentText = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!contentText) {
      return res.status(500).json({
        error: 'EMPTY_RESPONSE',
        message: 'AI did not return parsed resume content.',
      })
    }

    const parsedJson = JSON.parse(contentText)
    return res.status(200).json({ success: true, data: parsedJson })
  } catch (err) {
    console.error('Serverless parse-resume error:', err)
    return res.status(500).json({
      error: 'SERVER_ERROR',
      message: err.message || 'Internal server error while parsing resume.',
    })
  }
}

