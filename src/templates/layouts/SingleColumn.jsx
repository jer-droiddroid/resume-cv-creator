import PortfolioHighlight from '../PortfolioHighlight'
import { getPortfolioHighlight } from '../../data/ojtPresets'
import PhotoHeader from '../PhotoHeader'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { getActiveSections } from '../../utils/sectionHelpers'
import { getContactItems, renderResumeSection } from '../sectionRenderer'

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
    pageNumber: {
      position: 'absolute',
      fontSize: theme.fontSize.small,
      bottom: 18,
      right: theme.spacing.pagePadding,
      color: theme.mutedColor,
    },
  })

/**
 * SingleColumn layout: Clean, traditional top-to-bottom layout (great for ATS).
 */
export default function SingleColumn({ data, theme }) {
  const styles = createStyles(theme)
  const activeSections = getActiveSections(data)
  const { personalInfo = {}, documentType = 'resume' } = data || {}
  const contactItems = getContactItems(personalInfo, { hidePortfolio: Boolean(getPortfolioHighlight(data)) })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PhotoHeader photo={personalInfo.photo}>
          <View style={styles.header}>
            <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
            <PortfolioHighlight data={data} theme={theme} />
            {contactItems.length > 0 && (
              <Text style={styles.contactRow}>{contactItems.join('  •  ')}</Text>
            )}
          </View>
        </PhotoHeader>

        {activeSections.map((sectionId) => renderResumeSection(sectionId, data, theme))}

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
