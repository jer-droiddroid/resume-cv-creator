// Fake student resume data used for template picker thumbnails
// and for testing layouts without touching the student's real input.
export const sampleResumeData = {
  documentType: 'resume',
  personalInfo: {
    fullName: 'Maria Clara Santos',
    email: 'maria.santos@university.edu.ph',
    phone: '+63 917 123 4567',
    location: 'Quezon City, Metro Manila',
    linkedin: 'linkedin.com/in/mariasantos',
    portfolio: 'mariasantos.dev',
  },
  summary:
    'Detail-oriented Computer Science senior with hands-on experience in full-stack web development and student leadership. Passionate about building accessible tools for students and local communities.',
  education: [
    {
      school: 'University of the Philippines Diliman',
      degree: 'BS Computer Science',
      startDate: 'August 2023',
      endDate: 'Present',
      details: "Dean's Lister (GWA: 1.35), DOST-SEI Merit Scholar",
    },
  ],
  experience: [
    {
      company: 'TechStart Manila',
      title: 'Frontend Developer Intern',
      startDate: 'June 2025',
      endDate: 'August 2025',
      bullets: [
        'Built responsive dashboard components in React and Tailwind CSS used by 1,200+ daily active users.',
        'Reduced page load time by 28% by optimizing bundle imports and image assets.',
      ],
    },
  ],
  organizations: [
    {
      roleType: 'president',
      organization: 'Association of Computing Machinery (Student Chapter)',
      title: 'Chapter President',
      startDate: 'September 2025',
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
      organization: 'College Student Council',
      title: 'Finance Officer / Treasurer',
      startDate: 'September 2024',
      endDate: 'June 2025',
      metrics: {
        budgetManaged: 150000,
        fundsRaised: 45000,
        costSavedPercent: 15,
      },
    },
  ],
  projects: [
    {
      name: 'Campus Study Buddy',
      description:
        'A peer-to-peer study group finder with real-time room availability and course matching.',
      techStack: 'React, Node.js, PostgreSQL, Tailwind CSS',
      link: 'github.com/mariasantos/study-buddy',
    },
  ],
  skills: ['JavaScript', 'React', 'Tailwind CSS', 'Node.js', 'Git', 'SQL', 'Figma'],
  awards: ['1st Place, Inter-University Hackathon 2025', 'Best Capstone Prototype Nominee'],
  certifications: ['AWS Certified Cloud Practitioner (2025)', 'Responsive Web Design — freeCodeCamp'],
  currency: 'PHP',
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

