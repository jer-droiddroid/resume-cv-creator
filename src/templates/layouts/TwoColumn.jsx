import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { getActiveSections } from '../../utils/sectionHelpers'
import { getContactItems, renderResumeSection } from '../sectionRenderer'

// Sections that fit naturally in the narrower right column
const NARROW_COLUMN_IDS = new Set(['education', 'skills', 'awards', 'certifications', 'ojt'])

const createStyles = (theme) =>
  StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      padding: theme.spacing.pagePadding,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize.body,
      color: theme.textColor,
      lineHeight: theme.spacing.lineHeight,
    },
    header: {
      marginBottom: theme.spacing.sectionGap + 4,
      borderBottomWidth: 1.5,
      borderBottomColor: theme.accentColor,
      paddingBottom: 10,
    },
    name: {
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.name,
      color: theme.accentColor,
      marginBottom: 8,
    },
    contactRow: {
      fontSize: theme.fontSize.small,
      color: theme.mutedColor,
      lineHeight: 1.4,
    },
    columns: {
      flexDirection: 'row',
      gap: 18,
    },
    mainCol: {
      flex: 6.5,
    },
    sideCol: {
      flex: 3.5,
    },
    pageNumber: {
      position: 'absolute',
      fontSize: theme.fontSize.small,
      bottom: 18,
      right: theme.spacing.pagePadding,
      color: theme.mutedColor,
    },
  })

/**
 * TwoColumn layout: Full-width header with a 65% / 35% split body.
 * Preserves the student's relative section order inside each column.
 */
export default function TwoColumn({ data, theme }) {
  const styles = createStyles(theme)
  const activeSections = getActiveSections(data)
  const { personalInfo = {}, documentType = 'resume' } = data || {}
  const contactItems = getContactItems(personalInfo)

  const mainSections = activeSections.filter((id) => !NARROW_COLUMN_IDS.has(id))
  const sideSections = activeSections.filter((id) => NARROW_COLUMN_IDS.has(id))

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          {contactItems.length > 0 && (
            <Text style={styles.contactRow}>{contactItems.join('  •  ')}</Text>
          )}
        </View>

        <View style={styles.columns}>
          <View style={styles.mainCol}>
            {mainSections.map((id) => renderResumeSection(id, data, theme))}
          </View>
          <View style={styles.sideCol}>
            {sideSections.map((id) => renderResumeSection(id, data, theme))}
          </View>
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

