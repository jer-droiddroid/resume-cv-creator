import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { getActiveSections } from '../../utils/sectionHelpers'
import { getContactItems, renderResumeSection } from '../sectionRenderer'

const SIDEBAR_SECTIONS = new Set(['education', 'skills', 'awards', 'certifications'])

const createStyles = (theme) =>
  StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      flexDirection: 'row',
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize.body,
      color: theme.textColor,
      lineHeight: theme.spacing.lineHeight,
    },
    sidebar: {
      width: '32%',
      backgroundColor: theme.accentLight || '#f1f5f9',
      padding: 24,
      borderRightWidth: 1.5,
      borderRightColor: theme.accentColor,
    },
    main: {
      width: '68%',
      padding: 28,
    },
    name: {
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.name - 2,
      color: theme.accentColor,
      marginBottom: 8,
    },
    contactBlock: {
      marginBottom: theme.spacing.sectionGap + 4,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.accentColor,
    },
    contactItem: {
      fontSize: theme.fontSize.small,
      color: theme.mutedColor,
      marginBottom: 3,
    },
    pageNumber: {
      position: 'absolute',
      fontSize: theme.fontSize.small,
      bottom: 16,
      right: 28,
      color: theme.mutedColor,
    },
  })

/**
 * SidebarLeft layout: Colored left sidebar for contact info, skills, and education,
 * paired with a spacious right column for experience, leadership, and projects.
 */
export default function SidebarLeft({ data, theme }) {
  const styles = createStyles(theme)
  const activeSections = getActiveSections(data)
  const { personalInfo = {}, documentType = 'resume' } = data || {}
  const contactItems = getContactItems(personalInfo)

  const sidebarSections = activeSections.filter((id) => SIDEBAR_SECTIONS.has(id))
  const mainSections = activeSections.filter((id) => !SIDEBAR_SECTIONS.has(id))

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          {contactItems.length > 0 && (
            <View style={styles.contactBlock}>
              {contactItems.map((item, idx) => (
                <Text key={idx} style={styles.contactItem}>
                  {item}
                </Text>
              ))}
            </View>
          )}
          {sidebarSections.map((id) =>
            renderResumeSection(id, data, theme, { invert: true })
          )}
        </View>

        <View style={styles.main}>
          {mainSections.map((id) => renderResumeSection(id, data, theme))}
        </View>

        {documentType === 'cv' && (
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            fixed
          />
        )}
      </Page>
    </Document>
  )
}

