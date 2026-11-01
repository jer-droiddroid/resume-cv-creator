import SingleColumn from './layouts/SingleColumn'
import TwoColumn from './layouts/TwoColumn'
import SidebarLeft from './layouts/SidebarLeft'
import HeaderBanner from './layouts/HeaderBanner'
import Compact from './layouts/Compact'
import Harvard from './layouts/Harvard'
import { themes } from './themes'

// Template categories for the picker filter
export const TEMPLATE_CATEGORIES = ['All', 'ATS-friendly', 'Modern', 'Creative']

// Template registry: layouts x themes = distinct templates with zero duplicated logic.
// Every entry has { id, name, category, layout, theme }
export const templates = [
  // ATS-friendly templates
  {
    id: 'reddit-ats',
    name: 'Reddit / Jake ATS',
    category: 'ATS-friendly',
    layout: Harvard,
    theme: themes.redditATS,
  },
  {
    id: 'harvard-classic',
    name: 'Harvard Classic',
    category: 'ATS-friendly',
    layout: Harvard,
    theme: themes.harvardClassic,
  },
  {
    id: 'single-classic-slate',
    name: 'Classic Slate',
    category: 'ATS-friendly',
    layout: SingleColumn,
    theme: themes.classicSlate,
  },
  {
    id: 'single-academic-serif',
    name: 'Academic Serif',
    category: 'ATS-friendly',
    layout: SingleColumn,
    theme: themes.academicSerif,
  },
  {
    id: 'compact-classic-slate',
    name: 'Dense Executive',
    category: 'ATS-friendly',
    layout: Compact,
    theme: themes.classicSlate,
  },
  {
    id: 'compact-academic-serif',
    name: 'Dense Scholar',
    category: 'ATS-friendly',
    layout: Compact,
    theme: themes.academicSerif,
  },
  {
    id: 'single-tech-mono',
    name: 'Developer Mono',
    category: 'ATS-friendly',
    layout: SingleColumn,
    theme: themes.techMono,
  },

  // Modern templates
  {
    id: 'twocol-emerald-modern',
    name: 'Emerald Split',
    category: 'Modern',
    layout: TwoColumn,
    theme: themes.emeraldModern,
  },
  {
    id: 'twocol-classic-slate',
    name: 'Slate Split',
    category: 'Modern',
    layout: TwoColumn,
    theme: themes.classicSlate,
  },
  {
    id: 'single-emerald-modern',
    name: 'Emerald Clean',
    category: 'Modern',
    layout: SingleColumn,
    theme: themes.emeraldModern,
  },
  {
    id: 'compact-tech-mono',
    name: 'Compact Hacker',
    category: 'Modern',
    layout: Compact,
    theme: themes.techMono,
  },

  // Creative templates
  {
    id: 'sidebar-emerald-modern',
    name: 'Emerald Sidebar',
    category: 'Creative',
    layout: SidebarLeft,
    theme: themes.emeraldModern,
  },
  {
    id: 'sidebar-royal-crimson',
    name: 'Maroon Sidebar',
    category: 'Creative',
    layout: SidebarLeft,
    theme: themes.royalCrimson,
  },
  {
    id: 'banner-royal-crimson',
    name: 'Crimson Banner',
    category: 'Creative',
    layout: HeaderBanner,
    theme: themes.royalCrimson,
  },
  {
    id: 'banner-classic-slate',
    name: 'Midnight Banner',
    category: 'Creative',
    layout: HeaderBanner,
    theme: themes.classicSlate,
  },
]

// Helper to look up a template by ID (falls back to the first template)
export function getTemplateById(id) {
  return templates.find((t) => t.id === id) || templates[0]
}
