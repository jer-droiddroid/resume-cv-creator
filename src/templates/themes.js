// Themes define the look & feel (colors, built-in PDF fonts, font sizes, spacing, heading style).
// Combining a layout with a theme creates a unique template in registry.js.
export const themes = {
  harvardClassic: {
    id: 'harvardClassic',
    name: 'Harvard Classic',
    accentColor: '#000000', // Pure black text and rules
    accentLight: '#f3f4f6',
    textColor: '#111827',
    mutedColor: '#262626',
    fontFamily: 'Times-Roman',
    fontFamilyBold: 'Times-Bold',
    fontFamilyItalic: 'Times-Italic',
    fontSize: {
      name: 18,
      sectionHeading: 10.5,
      itemTitle: 10,
      body: 9.5,
      small: 8.5,
    },
    spacing: {
      pagePadding: 36, // Standard 0.5 in margins
      sectionGap: 10,
      itemGap: 5.5,
      lineHeight: 1.28,
    },
    headingStyle: 'underline',
  },

  classicSlate: {
    id: 'classicSlate',
    name: 'Classic Slate',
    accentColor: '#1e293b', // Slate 800
    accentLight: '#f1f5f9', // Slate 100
    textColor: '#111827',
    mutedColor: '#4b5563',
    fontFamily: 'Helvetica',
    fontFamilyBold: 'Helvetica-Bold',
    fontFamilyItalic: 'Helvetica-Oblique',
    fontSize: {
      name: 20,
      sectionHeading: 11,
      itemTitle: 10.5,
      body: 9.5,
      small: 8.5,
    },
    spacing: {
      pagePadding: 36,
      sectionGap: 12,
      itemGap: 7,
      lineHeight: 1.35,
    },
    headingStyle: 'underline',
  },

  academicSerif: {
    id: 'academicSerif',
    name: 'Academic Serif',
    accentColor: '#111827', // Pure dark gray/black
    accentLight: '#f3f4f6',
    textColor: '#111827',
    mutedColor: '#374151',
    fontFamily: 'Times-Roman',
    fontFamilyBold: 'Times-Bold',
    fontFamilyItalic: 'Times-Italic',
    fontSize: {
      name: 22,
      sectionHeading: 11.5,
      itemTitle: 10.5,
      body: 10,
      small: 9,
    },
    spacing: {
      pagePadding: 38,
      sectionGap: 11,
      itemGap: 6,
      lineHeight: 1.3,
    },
    headingStyle: 'underline',
  },

  emeraldModern: {
    id: 'emeraldModern',
    name: 'Emerald Modern',
    accentColor: '#047857', // Emerald 700
    accentLight: '#ecfdf5', // Emerald 50
    textColor: '#1f2937',
    mutedColor: '#4b5563',
    fontFamily: 'Helvetica',
    fontFamilyBold: 'Helvetica-Bold',
    fontFamilyItalic: 'Helvetica-Oblique',
    fontSize: {
      name: 21,
      sectionHeading: 10.5,
      itemTitle: 10,
      body: 9.5,
      small: 8.5,
    },
    spacing: {
      pagePadding: 32,
      sectionGap: 12,
      itemGap: 7,
      lineHeight: 1.35,
    },
    headingStyle: 'accent-tint',
  },

  royalCrimson: {
    id: 'royalCrimson',
    name: 'Royal Crimson',
    accentColor: '#991b1b', // Red 800 (UP Maroon vibe)
    accentLight: '#fef2f2', // Red 50
    textColor: '#111827',
    mutedColor: '#4b5563',
    fontFamily: 'Times-Roman',
    fontFamilyBold: 'Times-Bold',
    fontFamilyItalic: 'Times-Italic',
    fontSize: {
      name: 21,
      sectionHeading: 11,
      itemTitle: 10.5,
      body: 9.5,
      small: 8.5,
    },
    spacing: {
      pagePadding: 34,
      sectionGap: 11,
      itemGap: 6,
      lineHeight: 1.35,
    },
    headingStyle: 'underline',
  },

  techMono: {
    id: 'techMono',
    name: 'Tech Mono',
    accentColor: '#2563eb', // Blue 600
    accentLight: '#eff6ff', // Blue 50
    textColor: '#0f172a',
    mutedColor: '#475569',
    fontFamily: 'Courier',
    fontFamilyBold: 'Courier-Bold',
    fontFamilyItalic: 'Courier-Oblique',
    fontSize: {
      name: 18,
      sectionHeading: 10.5,
      itemTitle: 9.5,
      body: 8.5,
      small: 8,
    },
    spacing: {
      pagePadding: 30,
      sectionGap: 10,
      itemGap: 6,
      lineHeight: 1.3,
    },
    headingStyle: 'minimal',
  },
}
