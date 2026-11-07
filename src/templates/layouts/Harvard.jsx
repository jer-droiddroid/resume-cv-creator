import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { generateBullets } from '../../data/roleTemplates'
import { getActiveSections } from '../../utils/sectionHelpers'
import { formatDateRange, getContactItems } from '../sectionRenderer'

const createHarvardStyles = (theme) =>
  StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      padding: theme.spacing.pagePadding,
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize.body,
      color: theme.textColor,
      lineHeight: theme.spacing.lineHeight,
    },
    // Centered Harvard Header
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.sectionGap + 5,
    },
    name: {
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.name + 2,
      letterSpacing: 0.8,
      textAlign: 'center',
      marginBottom: 8,
    },
    contactLine: {
      fontSize: theme.fontSize.small,
      color: theme.mutedColor,
      textAlign: 'center',
      lineHeight: 1.4,
    },
    // Section header with crisp full-width divider line
    section: {
      marginBottom: theme.spacing.sectionGap,
    },
    sectionHeading: {
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.sectionHeading,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      borderBottomWidth: 0.75,
      borderBottomColor: '#000000',
      paddingBottom: 2,
      marginBottom: 5,
    },
    itemContainer: {
      marginBottom: theme.spacing.itemGap,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 6,
    },
    institutionName: {
      flex: 1,
      paddingRight: 8,
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.itemTitle,
    },
    subTitle: {
      fontFamily: theme.fontFamilyItalic,
      fontSize: theme.fontSize.body,
    },
    dateText: {
      flexShrink: 0,
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.small,
      textAlign: 'right',
    },
    bodyText: {
      flex: 1,
      fontSize: theme.fontSize.body,
    },
    detailsText: {
      fontSize: theme.fontSize.small,
      marginTop: 1,
    },
    bulletRow: {
      flexDirection: 'row',
      marginTop: 2,
      paddingLeft: 6,
    },
    bulletDot: {
      width: 10,
      fontSize: theme.fontSize.body,
    },
    bulletText: {
      flex: 1,
      fontSize: theme.fontSize.body,
    },
    skillsInline: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 3,
    },
    skillsLabel: {
      fontFamily: theme.fontFamilyBold,
      fontSize: theme.fontSize.body,
      marginRight: 4,
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
 * Harvard layout: Official Harvard College / OCS resume format.
 * - Centered name and contact line.
 * - Full-width black borderBottom rules under ALL CAPS section headers.
 * - Bold institution on left, bold date range on right.
 * - Italicized degree/title on second line.
 * - Disc bullet points with quantified results.
 */
export default function Harvard({ data, theme }) {
  const styles = createHarvardStyles(theme)
  const activeSections = getActiveSections(data)
  const { personalInfo = {}, currency = 'USD', documentType = 'resume' } = data || {}
  const contactItems = getContactItems(personalInfo)

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return (
          <View key="summary" style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={36}>
              Summary
            </Text>
            <Text style={styles.bodyText}>{data.summary}</Text>
          </View>
        )

      case 'education':
        return (
          <View key="education" style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={48}>
              Education
            </Text>
            {data.education
              .filter((edu) => edu.school || edu.degree)
              .map((edu, index) => (
                <View key={index} style={styles.itemContainer} wrap={false}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.institutionName}>{edu.school}</Text>
                    <Text style={styles.dateText}>
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </Text>
                  </View>
                  {edu.degree ? <Text style={styles.subTitle}>{edu.degree}</Text> : null}
                  {edu.details ? <Text style={styles.detailsText}>{edu.details}</Text> : null}
                </View>
              ))}
          </View>
        )

      case 'experience':
        return (
          <View key="experience" style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={48}>
              Experience
            </Text>
            {data.experience
              .filter((exp) => exp.company || exp.title)
              .map((exp, index) => (
                <View key={index} style={styles.itemContainer} wrap={false}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.institutionName}>{exp.company}</Text>
                    <Text style={styles.dateText}>
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </Text>
                  </View>
                  {exp.title ? <Text style={styles.subTitle}>{exp.title}</Text> : null}
                  {(exp.bullets || [])
                    .filter((b) => b && b.trim())
                    .map((bullet, bIndex) => (
                      <View key={bIndex} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                </View>
              ))}
          </View>
        )

      case 'organizations':
        return (
          <View key="organizations" style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={48}>
              Leadership &amp; Activities
            </Text>
            {data.organizations
              .filter((org) => org.organization || org.title)
              .map((org, index) => {
                const bullets = generateBullets(org, currency)
                return (
                  <View key={index} style={styles.itemContainer} wrap={false}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.institutionName}>{org.organization}</Text>
                      <Text style={styles.dateText}>
                        {formatDateRange(org.startDate, org.endDate)}
                      </Text>
                    </View>
                    {org.title ? <Text style={styles.subTitle}>{org.title}</Text> : null}
                    {bullets.map((bullet, bIndex) => (
                      <View key={bIndex} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )
              })}
          </View>
        )

      case 'projects':
        return (
          <View key="projects" style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={48}>
              Projects
            </Text>
            {data.projects
              .filter((proj) => proj.name || proj.description)
              .map((proj, index) => (
                <View key={index} style={styles.itemContainer} wrap={false}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.institutionName}>{proj.name}</Text>
                    {proj.link ? <Text style={styles.dateText}>{proj.link}</Text> : null}
                  </View>
                  {proj.techStack ? (
                    <Text style={styles.subTitle}>Technologies: {proj.techStack}</Text>
                  ) : null}
                  {proj.description ? (
                    <Text style={styles.bodyText}>{proj.description}</Text>
                  ) : null}
                </View>
              ))}
          </View>
        )

      case 'skills':
        return (
          <View key="skills" style={styles.section} wrap={false}>
            <Text style={styles.sectionHeading} minPresenceAhead={36}>
              Skills &amp; Interests
            </Text>
            <View style={styles.skillsInline}>
              <Text style={styles.skillsLabel}>Skills:</Text>
              <Text style={styles.bodyText}>
                {data.skills.filter((s) => s && s.trim()).join(', ')}
              </Text>
            </View>
          </View>
        )

      case 'awards':
        return (
          <View key="awards" style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={36}>
              Honors &amp; Awards
            </Text>
            {data.awards
              .filter((a) => a && a.trim())
              .map((award, index) => (
                <View key={index} style={styles.bulletRow} wrap={false}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{award}</Text>
                </View>
              ))}
          </View>
        )

      case 'certifications':
        return (
          <View key="certifications" style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={36}>
              Certifications
            </Text>
            {data.certifications
              .filter((c) => c && c.trim())
              .map((cert, index) => (
                <View key={index} style={styles.bulletRow} wrap={false}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{cert}</Text>
                </View>
              ))}
          </View>
        )

      default:
        return null
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Centered Harvard Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</Text>
          {contactItems.length > 0 && (
            <Text style={styles.contactLine}>{contactItems.join('  •  ')}</Text>
          )}
        </View>

        {/* Sections in student's chosen order */}
        {activeSections.map((sectionId) => renderSection(sectionId))}

        {/* Page numbering in CV mode */}
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

