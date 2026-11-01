import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { getActiveSections } from '../../utils/sectionHelpers'
import { getContactItems, renderResumeSection } from '../sectionRenderer'

// Derive a tighter version of any theme so more content fits on one page
const createCompactTheme = (theme) => ({
  ...theme,
  fontSize: {
    name: theme.fontSize.name - 3,
    sectionHeading: theme.fontSize.sectionHeading - 1,
    itemTitle: theme.fontSize.itemTitle - 1,
    body: theme.fontSize.body - 1,
    small: theme.fontSize.small - 0.5,
  },
  spacing: {
    pagePadding: 24,
    sectionGap: 7,
    itemGap: 4,
    lineHeight: 1.22,
  },
})

const createStyles = (compactTheme) =>
  StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      padding: compactTheme.spacing.pagePadding,
      fontFamily: compactTheme.fontFamily,
      fontSize: compactTheme.fontSize.body,
      color: compactTheme.textColor,
      lineHeight: compactTheme.spacing.lineHeight,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: compactTheme.spacing.sectionGap + 3,
      borderBottomWidth: 1.5,
      borderBottomColor: compactTheme.accentColor,
      paddingBottom: 7,
    },
    name: {
      fontFamily: compactTheme.fontFamilyBold,
      fontSize: compactTheme.fontSize.name,
      color: compactTheme.accentColor,
    },
    contactRight: {
      fontSize: compactTheme.fontSize.small,
      color: compactTheme.mutedColor,
      textAlign: 'right',
      maxWidth: '58%',
      lineHeight: 1.35,
    },
    pageNumber: {
      position: 'absolute',
      fontSize: compactTheme.fontSize.small,
      bottom: 12,
      right: compactTheme.spacing.pagePadding,
      color: compactTheme.mutedColor,
    },
  })

/**
 * Compact layout: High-density, narrow-margin layout designed for students with
 * lots of experience, organizations, and projects who want everything on 1 page.
 */
export default function Compact({ data, theme }) {
  const compactTheme = createCompactTheme(theme)
  const styles = createStyles(compactTheme)
  const activeSections = getActiveSections(data)
  const { personalInfo = {}, documentType = 'resume' } = data || {}
  const contactItems = getContactItems(personalInfo)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          {contactItems.length > 0 && (
            <Text style={styles.contactRight}>{contactItems.join(' • ')}</Text>
          )}
        </View>

        {activeSections.map((sectionId) =>
          renderResumeSection(sectionId, data, compactTheme)
        )}

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

