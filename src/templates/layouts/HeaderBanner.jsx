import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { getActiveSections } from '../../utils/sectionHelpers'
import { getContactItems, renderResumeSection } from '../sectionRenderer'

const createStyles = (theme) =>
  StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize.body,
      color: theme.textColor,
      lineHeight: theme.spacing.lineHeight,
      paddingBottom: theme.spacing.pagePadding,
    },
    banner: {
      backgroundColor: theme.accentColor,
      paddingVertical: 22,
      paddingHorizontal: theme.spacing.pagePadding,
      marginBottom: theme.spacing.sectionGap + 2,
    },
    name: {
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.name + 2,
      color: '#ffffff',
      marginBottom: 5,
    },
    contactRow: {
      fontSize: theme.fontSize.small,
      color: '#e2e8f0',
    },
    body: {
      paddingHorizontal: theme.spacing.pagePadding,
    },
    pageNumber: {
      position: 'absolute',
      fontSize: theme.fontSize.small,
      bottom: 16,
      right: theme.spacing.pagePadding,
      color: theme.mutedColor,
    },
  })

/**
 * HeaderBanner layout: Bold full-bleed colored header banner with white typography,
 * followed by a clean single-column body in the student's exact section order.
 */
export default function HeaderBanner({ data, theme }) {
  const styles = createStyles(theme)
  const activeSections = getActiveSections(data)
  const { personalInfo = {}, documentType = 'resume' } = data || {}
  const contactItems = getContactItems(personalInfo)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.banner}>
          <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
          {contactItems.length > 0 && (
            <Text style={styles.contactRow}>{contactItems.join('  |  ')}</Text>
          )}
        </View>

        <View style={styles.body}>
          {activeSections.map((sectionId) => renderResumeSection(sectionId, data, theme))}
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

