// Universal sample student resume data used for template picker thumbnails
// and faded placeholder examples without touching the student's real input.
export const sampleResumeData = {
  documentType: 'resume',
  personalInfo: {
    fullName: 'Alex Carter',
    email: 'alex.carter@university.edu',
    phone: '(555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexcarter',
    portfolio: 'alexcarter.dev',
  },
  summary:
    'Detail-oriented Computer Science senior with hands-on experience in full-stack software development and student leadership. Passionate about building accessible, user-centered web applications.',
  education: [
    {
      school: 'State University',
      degree: 'B.S. in Computer Science',
      startDate: 'September 2022',
      endDate: 'May 2026',
      details: "Dean's List (GPA: 3.85/4.0), Academic Excellence Scholarship",
    },
  ],
  experience: [
    {
      company: 'Acme Technologies',
      title: 'Software Engineering Intern',
      startDate: 'June 2025',
      endDate: 'August 2025',
      bullets: [
        'Built responsive dashboard components in React and TypeScript used by 1,200+ daily active users.',
        'Reduced page load time by 28% by optimizing bundle imports and image assets.',
      ],
    },
  ],
  organizations: [
    {
      roleType: 'president',
      organization: 'Computer Science Student Society',
      title: 'Chapter President',
      startDate: 'September 2024',
      endDate: 'Present',
      // Numbers only — Step 3 generateBullets() turns these into action-verb bullet points
      metrics: {
        membersLed: 85,
        eventsOrganized: 6,
        partnershipsSecured: 4,
      },
    },
    {
      roleType: 'treasurer',
      organization: 'Undergraduate Student Government',
      title: 'Finance Officer / Treasurer',
      startDate: 'September 2023',
      endDate: 'May 2024',
      metrics: {
        budgetManaged: 15000,
        fundsRaised: 4500,
        costSavedPercent: 15,
      },
    },
  ],
  projects: [
    {
      name: 'StudySync',
      description:
        'A collaborative study group platform with real-time room scheduling and course matching.',
      techStack: 'React, Node.js, PostgreSQL, Tailwind CSS',
      link: 'github.com/alexcarter/studysync',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Tailwind CSS', 'Node.js', 'Git', 'SQL', 'Figma'],
  awards: ['1st Place, Annual University Hackathon 2025', "Dean's Honor Roll (2023–2025)"],
  certifications: ['AWS Certified Cloud Practitioner (2025)', 'Responsive Web Design — freeCodeCamp'],
  currency: 'USD',
  sections: [
    { id: 'summary', visible: true },
    { id: 'education', visible: true },
    { id: 'experience', visible: true },
    { id: 'organizations', visible: true },
    { id: 'projects', visible: true },
    { id: 'skills', visible: true },
    { id: 'awards', visible: true },
    { id: 'certifications', visible: true },
  ],
}
