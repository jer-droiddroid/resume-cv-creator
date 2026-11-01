// Ordered list of toggleable and reorderable resume sections
export const DEFAULT_SECTIONS = [
  { id: 'summary', label: 'Summary', visible: true },
  { id: 'education', label: 'Education', visible: true },
  { id: 'experience', label: 'Experience', visible: true },
  { id: 'organizations', label: 'Organizations', visible: true },
  { id: 'projects', label: 'Projects', visible: true },
  { id: 'skills', label: 'Skills', visible: true },
  { id: 'awards', label: 'Awards', visible: true },
  { id: 'certifications', label: 'Certifications', visible: true },
]

// Helper factories to create a blank item when the student clicks "Add" in the form
export const createEmptyEducation = () => ({
  school: '',
  degree: '',
  startDate: '',
  endDate: '',
  details: '',
})

export const createEmptyExperience = () => ({
  company: '',
  title: '',
  startDate: '',
  endDate: '',
  bullets: [''],
})

export const createEmptyOrganization = (roleType = 'marketing') => ({
  roleType,
  organization: '',
  title: '',
  startDate: '',
  endDate: '',
  // Metrics store numeric values only (e.g. { reach: 5000, campaigns: 4 })
  metrics: {},
})

export const createEmptyProject = () => ({
  name: '',
  description: '',
  techStack: '',
  link: '',
})

// Single source of truth for a blank student document.
// Switching templates only changes how this object is rendered, never the data itself.
export const defaultResumeData = {
  documentType: 'resume', // "resume" | "cv"
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
  },
  summary: '',
  education: [createEmptyEducation()],
  experience: [],
  organizations: [],
  projects: [],
  skills: [],
  awards: [],
  certifications: [],
  currency: 'USD',
  sections: DEFAULT_SECTIONS.map(({ id, visible }) => ({ id, visible })),
}

